import { BASE_URL } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomSecondaryText from "../../components/CustomSecondaryText";
import CustomText from "../../components/CustomText";
import { CheckIcon } from "../../constants/icons";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalContext";
import i18n from "../../src/localization/i18n"

const GroupJoinModal = () => {

  const baseContent = i18n.t("protected.groupJoinModal")

  const {
    groupJoinMembers,
    totalServicePrice,
    totalServiceEwt,
    totalServicesLength,
    paymentSettingsData,
  } = useLocalSearchParams();
  const groupJoinMembersParse = JSON.parse(groupJoinMembers);
  const paymentSettingsDataParse = JSON.parse(paymentSettingsData);
  const { authenticatedUser } = useAuth();

  const {
    setGroupJoinMembers,
    setMemberName,
    setSelectedMemberServices,
    setSelectedMemberBarber,
  } = useGlobal();

  const router = useRouter();
  const { colors } = useTheme();

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}m`;
  }

  const [groupJoinLoader, setGroupJoinLoader] = useState(false);
  const { newNotification, setNewNotification } = useGlobal();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (groupJoinLoader) {
          // Prevent back during loading
          return true; // <-- prevents default back behavior
        }
        return false; // allow default back
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, [groupJoinLoader]),
  );

  const groupJoinPressed = async () => {
    try {
      const groupJoinData = {
        salonId: authenticatedUser?.salonId,
        groupInfo: groupJoinMembersParse.map((item) => {
          return {
            barberId: item.selectedMemberBarber.barberId,
            barberName: item.selectedMemberBarber.name,
            customerEmail: authenticatedUser?.email,
            joinedQType: "Group-Join",
            methodUsed: "App",
            mobileCountryCode: authenticatedUser?.mobileCountryCode,
            mobileNumber: authenticatedUser?.mobileNumber,
            name: item?.memberName,
            services: item.selectedServices,
          };
        }),
      };

      setGroupJoinLoader(true);

      const { data } = await axios.post(
        `${BASE_URL}/mobileRoutes/groupJoinQueue`,
        groupJoinData,
      );

      await AsyncStorage.setItem(
        "newNotification",
        JSON.stringify({
          email: authenticatedUser?.email,
          value: true,
        }),
      );

      setNewNotification({
        email: authenticatedUser?.email,
        value: true,
      });

      setGroupJoinMembers([]);
      setMemberName(authenticatedUser?.name);
      setSelectedMemberServices([]);
      setSelectedMemberBarber({});

      router.replace("/groupJoinSuccessPage");
    } catch (error) {
      setGroupJoinLoader(false);
      // Toast.error(error?.response?.data?.message)
      Alert.alert(baseContent.alertBox.alertOne.header, error?.response?.data?.message, [{ text: baseContent.alertBox.alertOne.ok }]);
      console.log("Error doing group join ", error);
    }
  };

  // stripe payment fetch

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);

  const totalServicePriceAmount = groupJoinMembersParse.reduce(
    (total, member) => {
      const memberTotal = member.selectedServices.reduce(
        (sum, service) => sum + Number(service.servicePrice || 0),
        0,
      );
      return total + memberTotal;
    },
    0,
  );

  const advancePaymentPercent = Number(
    paymentSettingsDataParse?.advancePaymentPercent || 0,
  );

  const advanceAmount = Math.round(
    (totalServicePriceAmount * advancePaymentPercent) / 100,
  );

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(
      `${BASE_URL}/mobileRoutes/groupJoinQueuePaymentApi`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalAmount: advanceAmount, // backend must convert to smallest unit
          currency: authenticatedUser?.isoCurrencyCode,
          queueJoinData: {
            salonId: authenticatedUser?.salonId,
            groupInfo: groupJoinMembersParse.map((item) => ({
              barberId: item.selectedMemberBarber?.barberId,
              barberName: item.selectedMemberBarber?.name,
              customerEmail: authenticatedUser?.email,
              joinedQType: "Group-Join",
              methodUsed: "App",
              mobileCountryCode: authenticatedUser?.mobileCountryCode,
              mobileNumber: authenticatedUser?.mobileNumber,
              name: item?.memberName,
              services: item?.selectedServices,
            })),
          },
        }),
      },
    );

    const data = await response.json();

    // ✅ Do NOT mask backend error
    if (!response.ok) {
      throw new Error(data?.message || baseContent.errorStatesAndApi.paymentInitializationFailed );
    }

    const { paymentIntent, ephemeralKey, customer } = data;

    if (!paymentIntent || !ephemeralKey || !customer) {
      throw new Error(baseContent.errorStatesAndApi.invalidStripeError);
    }

    return { paymentIntent, ephemeralKey, customer };
  };

  const openPaymentSheet = async () => {
    try {
      setLoading(true);

      // 1️⃣ Always create a fresh PaymentIntent
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      // 2️⃣ Initialize Stripe Payment Sheet
      const initResult = await initPaymentSheet({
        merchantDisplayName: authenticatedUser?.salonName || "IQBook",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: authenticatedUser?.name,
          email: authenticatedUser?.email,
          phone:
            authenticatedUser?.mobileCountryCode &&
            authenticatedUser?.mobileNumber
              ? `+${authenticatedUser.mobileCountryCode}${authenticatedUser.mobileNumber}`
              : undefined,
        },
        returnURL: "iqbmobilecustomer://stripe-redirect",
      });

      if (initResult?.error) {
        throw new Error(initResult.error.message);
      }

      // 3️⃣ Present Payment Sheet
      const presentResult = await presentPaymentSheet();

      if (presentResult?.error) {
        throw new Error(presentResult.error.message);
      }

      // 4️⃣ Post-payment success cleanup
      await AsyncStorage.setItem(
        "newNotification",
        JSON.stringify({
          email: authenticatedUser?.email,
          value: true,
        }),
      );

      setNewNotification({
        email: authenticatedUser?.email,
        value: true,
      });

      setGroupJoinMembers([]);
      setMemberName(authenticatedUser?.name);
      setSelectedMemberServices([]);
      setSelectedMemberBarber({});

      router.replace("/groupJoinSuccessPage");
    } catch (err) {
      console.log("Stripe error:", err?.message);

      Alert.alert(baseContent.alertBox.alertTwo.header, err?.message || baseContent.alertBox.alertTwo.subHeader);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      style={{
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: scale(15),
      }}
      onPress={() => {
        if (!groupJoinLoader) {
          router.back();
        }
      }}
    >
      <Pressable
        onPress={() => {}}
        style={{
          width: "100%",
          maxHeight: "90%",
          backgroundColor: colors.modalBgColor,
          borderRadius: moderateScale(28),
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: verticalScale(10) },
          shadowOpacity: 0.15,
          shadowRadius: moderateScale(20),
          elevation: 10,
          borderWidth: 1,
          borderColor: colors.queueBorder,
        }}
      >
        {/* ===== HEADER ===== */}
        <View
          style={{
            paddingTop: verticalScale(22),
            paddingBottom: verticalScale(20),
            paddingHorizontal: scale(24),
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: scale(64),
              height: scale(64),
              borderRadius: moderateScale(32),
              backgroundColor: `${colors.accentColor}1A`, // Teal tint to match group join theme
              justifyContent: "center",
              alignItems: "center",
              marginBottom: verticalScale(16),
            }}
          >
            <CheckIcon size={moderateScale(28)} color={colors.accentColor} />
          </View>

          <CustomText
            style={{
              fontFamily: "AirbnbCereal_W_XBd",
              fontSize: moderateScale(22),
              textAlign: "center",
            }}
          >
            {baseContent.header}
          </CustomText>

          <CustomSecondaryText
            style={{
              textAlign: "center",
              marginTop: verticalScale(6),
              fontSize: moderateScale(14),
              color: "#64748b",
            }}
          >
            {baseContent.subHeader}
          </CustomSecondaryText>
        </View>

        {/* ===== CONTENT ===== */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: scale(24),
            paddingBottom: verticalScale(24),
          }}
        >
          {/* Group Stats Grid */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.modalSectionColor,
              borderRadius: moderateScale(20),
              padding: scale(16),
              marginBottom: verticalScale(24),
              borderWidth: 1,
              borderColor: colors.queueBorder,
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                borderRightWidth: 1,
                borderColor: colors.queueBorder,
              }}
            >
              <CustomSecondaryText
                style={{
                  fontSize: moderateScale(10),
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {baseContent.members}
              </CustomSecondaryText>
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_Bd",
                  fontSize: moderateScale(16),
                }}
              >
                {groupJoinMembersParse?.length}
              </CustomText>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                borderRightWidth: 1,
                borderColor: colors.queueBorder,
              }}
            >
              <CustomSecondaryText
                style={{
                  fontSize: moderateScale(10),
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {baseContent.services}
              </CustomSecondaryText>
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_Bd",
                  fontSize: moderateScale(16),
                }}
              >
                {totalServicesLength}
              </CustomText>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <CustomSecondaryText
                style={{
                  fontSize: moderateScale(10),
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {baseContent.time}
              </CustomSecondaryText>
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_Bd",
                  fontSize: moderateScale(16),
                }}
              >
                {formatMinutesToHrMin(totalServiceEwt)}
              </CustomText>
            </View>
          </View>

          {/* Payment Breakdown */}
          <View
            style={{
              padding: scale(20),
              borderRadius: moderateScale(20),
              backgroundColor: colors.modalSectionColor,
              borderWidth: 1,
              borderColor: colors.queueBorder,
              marginBottom: verticalScale(16),
            }}
          >
            <CustomText
              style={{
                fontFamily: "AirbnbCereal_W_Bd",
                fontSize: moderateScale(14),
                marginBottom: verticalScale(16),
              }}
            >
              {paymentSettingsDataParse?.enabled
                ? baseContent.paymentBreakdown
                : baseContent.pricingSummary}
            </CustomText>

            <View style={{ gap: verticalScale(10) }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <CustomSecondaryText style={{ fontSize: moderateScale(14) }}>
                  {baseContent.totalAmount}
                </CustomSecondaryText>
                <CustomText
                  style={{
                    fontFamily: "AirbnbCereal_W_Bd",
                    fontSize: moderateScale(14),
                  }}
                >
                  {authenticatedUser?.currency}{" "}
                  {totalServicePriceAmount.toFixed(2)}
                </CustomText>
              </View>

              {paymentSettingsDataParse?.enabled && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: verticalScale(12),
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      borderColor: colors.queueBorder,
                      marginVertical: verticalScale(4),
                    }}
                  >
                    <View>
                      <CustomText
                        style={{
                          fontFamily: "AirbnbCereal_W_Bd",
                          color: colors.accentColor,
                        }}
                      >
                        {baseContent.payNow}
                      </CustomText>
                      <CustomSecondaryText
                        style={{ fontSize: moderateScale(12) }}
                      >
                        {baseContent.deposit} (
                        {paymentSettingsDataParse?.advancePaymentPercent}%)
                      </CustomSecondaryText>
                    </View>
                    <CustomText
                      style={{
                        fontFamily: "AirbnbCereal_W_XBd",
                        color: colors.accentColor,
                        fontSize: moderateScale(18),
                      }}
                    >
                      {authenticatedUser?.currency} {advanceAmount.toFixed(2)}
                    </CustomText>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <CustomSecondaryText
                      style={{ fontSize: moderateScale(14) }}
                    >
                      {baseContent.remainingBalance}
                    </CustomSecondaryText>
                    <CustomText
                      style={{
                        fontFamily: "AirbnbCereal_W_Bd",
                        fontSize: moderateScale(14),
                        color: "#64748b",
                      }}
                    >
                      {authenticatedUser?.currency}{" "}
                      {(totalServicePriceAmount - advanceAmount).toFixed(2)}
                    </CustomText>
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>

        {/* ===== FOOTER ===== */}
        <View
          style={{
            padding: scale(24),
            paddingBottom: scale(10),
            borderTopWidth: 1,
            borderColor: colors.queueBorder,
          }}
        >
          {paymentSettingsDataParse?.enabled ? (
            <TouchableOpacity
              onPress={openPaymentSheet}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#94a3b8" : colors.accentColor,
                paddingVertical: verticalScale(18),
                borderRadius: moderateScale(16),
                alignItems: "center",
                shadowColor: colors.accentColor,
                shadowOffset: { width: 0, height: verticalScale(4) },
                shadowOpacity: 0.2,
                shadowRadius: moderateScale(8),
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <CustomText
                  style={{
                    color: "#fff",
                    fontFamily: "AirbnbCereal_W_Bd",
                    fontSize: moderateScale(16),
                  }}
                >
                  {baseContent.proceedToPayment}
                </CustomText>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={groupJoinPressed}
              disabled={groupJoinLoader}
              style={{
                backgroundColor: groupJoinLoader
                  ? "#94a3b8"
                  : colors.accentColor,
                paddingVertical: verticalScale(18),
                borderRadius: moderateScale(16),
                alignItems: "center",
              }}
            >
              {groupJoinLoader ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <CustomText
                  style={{
                    color: "#fff",
                    fontFamily: "AirbnbCereal_W_Bd",
                    fontSize: moderateScale(16),
                  }}
                >
                  {baseContent.confirmGroupBooking}
                </CustomText>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => !groupJoinLoader && router.back()}
            style={{
              marginTop: verticalScale(12),
              paddingVertical: verticalScale(8),
              alignItems: "center",
            }}
          >
            <CustomText
              style={{
                fontFamily: "AirbnbCereal_W_Bd",
                color: "#64748b",
                fontSize: moderateScale(15),
              }}
            >
              {baseContent.goBack}
            </CustomText>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Pressable>
  );
};

export default GroupJoinModal;

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  titleText: {
    fontFamily: "AirbnbCereal_W_Bd",
  },
  modalContainer: {
    width: "85%",
    borderRadius: scale(8),
    borderWidth: scale(1),
    padding: scale(10),
    gap: verticalScale(15),
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: scale(10),
    marginTop: verticalScale(10),
  },
  button: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: scale(6),
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
