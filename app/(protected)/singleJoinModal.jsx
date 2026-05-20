import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
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
import i18n from "../../src/localization/i18n";
import api from "../../utils/api";

const singleJoinModal = () => {
  const baseContent = i18n.t("protected.singleJoinModal");

  const { selectedServices, selectBarber, paymentSettingsData } =
    useLocalSearchParams();

  const parsedSelectedServices = JSON.parse(selectedServices);
  const parsedSelectBarber = JSON.parse(selectBarber);
  const paymentSettingsDataParse = JSON.parse(paymentSettingsData);

  const router = useRouter();
  const { colors } = useTheme();
  const { authenticatedUser } = useAuth();

  // console.log("Modal ", parsedSelectBarber, parsedSelectedServices)

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}m`;
  }

  const totalPrice = parsedSelectedServices?.reduce(
    (acc, service) => acc + service.servicePrice,
    0,
  );
  const totalTime = parsedSelectedServices?.reduce(
    (acc, service) => acc + service.serviceEWT || service.barberServiceEWT,
    0,
  );
  const totalServices = parsedSelectedServices?.length;

  const {
    newNotification,
    setNewNotification,
    setQueueJoinType,
    setJoinPopupType,
  } = useGlobal();
  const [singleJoinLoader, setSingleJoinLoader] = useState(false);

  // console.log(router)

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (singleJoinLoader) {
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
    }, [singleJoinLoader]),
  );

  const singleJoinPressed = async () => {
    try {
      const singleJoinData = {
        salonId: authenticatedUser?.salonId,
        name: authenticatedUser?.name,
        customerEmail: authenticatedUser?.email,
        singleJoinedQType: "Single-Join",
        methodUsed: "App",
        mobileCountryCode: authenticatedUser?.mobileCountryCode,
        mobileNumber: authenticatedUser?.mobileNumber.toString(),
        barberName: parsedSelectBarber?.name,
        barberId: parsedSelectBarber?.barberId,
        services: parsedSelectedServices,
      };

      setSingleJoinLoader(true);

      const { data } = await api.post(
        `/mobileRoutes/singleJoinQueue`,
        singleJoinData,
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

      setQueueJoinType({
        single: false,
        group: false,
      });

      setJoinPopupType({
        barberSelect: false,
        serviceSelect: false,
      });

      router.replace("/singleJoinSuccessPage");
    } catch (error) {
      setSingleJoinLoader(false);
      // Toast.error(error?.response?.data?.message)
      Alert.alert(
        baseContent.alertBox.alertOne.header,
        error?.response?.data?.message,
        [{ text: baseContent.alertBox.alertOne.ok }],
      );
      console.log("Error doing single join ", error);
    }
  };

  // stripe payment fetch

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);

  const totalServicePriceAmount = parsedSelectedServices.reduce(
    (sum, service) => sum + Number(service.servicePrice || 0),
    0,
  );

  const advancePaymentPercent = Number(
    paymentSettingsDataParse?.advancePaymentPercent || 0,
  );

  const advanceAmount = Math.round(
    (totalServicePriceAmount * advancePaymentPercent) / 100,
  );

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await api.post(
        "/mobileRoutes/singleJoinQueuePaymentApi",
        {
          totalAmount: advanceAmount, // backend must convert to smallest unit
          currency: authenticatedUser?.isoCurrencyCode,
          queueJoinData: {
            salonId: authenticatedUser?.salonId,
            name: authenticatedUser?.name,
            customerEmail: authenticatedUser?.email,
            singleJoinedQType: "Single-Join",
            methodUsed: "App",
            mobileCountryCode: authenticatedUser?.mobileCountryCode,
            mobileNumber: authenticatedUser?.mobileNumber?.toString(),
            barberName: parsedSelectBarber?.name,
            barberId: parsedSelectBarber?.barberId,
            services: parsedSelectedServices,
          },
        },
      );

      const data = response.data;

      const { paymentIntent, ephemeralKey, customer } = data;

      if (!paymentIntent || !ephemeralKey || !customer) {
        throw new Error(baseContent.errorStatesAndApi.invalidStripeError);
      }

      return { paymentIntent, ephemeralKey, customer };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        baseContent.errorStatesAndApi.paymentInitializationFailed;

      throw new Error(message);
    }
  };

  const openPaymentSheet = async () => {
    try {
      setLoading(true);

      // 1️⃣ Always fetch fresh Stripe params
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

      // 4️⃣ Post-payment success flow
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

      setQueueJoinType({
        single: false,
        group: false,
      });

      setJoinPopupType({
        barberSelect: false,
        serviceSelect: false,
      });

      router.replace("/singleJoinSuccessPage");
    } catch (err) {
      console.log("Stripe error:", err?.message);

      Alert.alert(
        baseContent.alertBox.alertTwo.header,
        err?.message || baseContent.alertBox.alertTwo.subHeader,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={() => !singleJoinLoader && router.back()}
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)", // Darker overlay for better focus
        justifyContent: "center",
        alignItems: "center",
        padding: scale(15),
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
          borderWidth: 1,
          borderColor: colors.queueBorder,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: verticalScale(10) },
          shadowOpacity: 0.15,
          shadowRadius: moderateScale(20),
          elevation: 10,
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
              backgroundColor: `${colors.accentColor}1A`,
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
          {/* Barber/Service Summary */}
          <View style={{ marginBottom: verticalScale(24) }}>
            <CustomSecondaryText
              style={{
                fontSize: moderateScale(12),
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: verticalScale(8),
                color: "#94a3b8",
              }}
            >
              {baseContent.selectedBarber}
            </CustomSecondaryText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <CustomText
                  style={{
                    fontFamily: "AirbnbCereal_W_XBd",
                    fontSize: moderateScale(18),
                  }}
                >
                  {parsedSelectBarber?.name}
                </CustomText>
                <CustomSecondaryText style={{ marginTop: verticalScale(2) }}>
                  {totalServices}{" "}
                  {totalServices === 1
                    ? baseContent.service
                    : baseContent.services}{" "}
                  • {formatMinutesToHrMin(totalTime)}
                </CustomSecondaryText>
              </View>

              {!paymentSettingsDataParse?.enabled && (
                <CustomText
                  style={{
                    fontFamily: "AirbnbCereal_W_XBd",
                    fontSize: moderateScale(18),
                  }}
                >
                  {authenticatedUser?.currency}
                  {totalPrice.toFixed(2)}
                </CustomText>
              )}
            </View>
          </View>

          {/* Payment Breakdown (Receipt Style) */}
          {paymentSettingsDataParse?.enabled && (
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
                {baseContent.paymentBreakdown}
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
                    {authenticatedUser?.currency} {totalPrice.toFixed(2)}
                  </CustomText>
                </View>

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
                      {paymentSettingsDataParse?.advancePaymentPercent}
                      %)
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
                  <CustomSecondaryText style={{ fontSize: moderateScale(14) }}>
                    {baseContent.payAtSalon}
                  </CustomSecondaryText>
                  <CustomText
                    style={{
                      fontFamily: "AirbnbCereal_W_Bd",
                      fontSize: moderateScale(14),
                      color: "#64748b",
                    }}
                  >
                    {authenticatedUser?.currency}{" "}
                    {(totalPrice - advanceAmount).toFixed(2)}
                  </CustomText>
                </View>
              </View>
            </View>
          )}
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
              onPress={singleJoinPressed}
              disabled={singleJoinLoader}
              style={{
                backgroundColor: singleJoinLoader
                  ? "#94a3b8"
                  : colors.accentColor,
                paddingVertical: verticalScale(18),
                borderRadius: moderateScale(16),
                alignItems: "center",
              }}
            >
              {singleJoinLoader ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <CustomText
                  style={{
                    color: "#fff",
                    fontFamily: "AirbnbCereal_W_Bd",
                    fontSize: moderateScale(16),
                  }}
                >
                  {baseContent.confirmBooking}
                </CustomText>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => !singleJoinLoader && router.back()}
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

export default singleJoinModal;

const styles = StyleSheet.create({
  modalContainer: {
    width: "85%",
    borderRadius: scale(8),
    borderWidth: scale(1),
    padding: scale(10),
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  titleText: {
    fontFamily: "AirbnbCereal_W_Bd",
  },
  confirmText: {
    marginTop: verticalScale(10),
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
});
