import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomText from "../../components/CustomText";
import { useAuth } from "../../context/AuthContext";
import { Toast } from "toastify-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "@/utils/api";
import { useGlobal } from "../../context/GlobalContext";
import { CheckIcon } from "../../constants/icons";
import { useStripe } from "@stripe/stripe-react-native";
import CustomSecondaryText from "../../components/CustomSecondaryText";

const GroupJoinModal = () => {
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
        onBackPress
      );

      return () => subscription.remove();
    }, [groupJoinLoader])
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
        groupJoinData
      );

      await AsyncStorage.setItem(
        "newNotification",
        JSON.stringify({
          email: authenticatedUser?.email,
          value: true,
        })
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
      Alert.alert("Notice", error?.response?.data?.message, [{ text: "OK" }]);
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
        0
      );
      return total + memberTotal;
    },
    0
  );

  const advancePaymentPercent = Number(
    paymentSettingsDataParse?.advancePaymentPercent || 0
  );

  const advanceAmount = Math.round(
    (totalServicePriceAmount * advancePaymentPercent) / 100
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
          //stripe forces minimum amount to be 50 less than that will cause payment failed error
          totalAmount: advanceAmount,
          currency: authenticatedUser?.isoCurrencyCode,
          queueJoinData: {
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
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch payment params");
    }

    const data = await response.json();
    const { paymentIntent, ephemeralKey, customer } = data;

    if (!paymentIntent || !ephemeralKey || !customer) {
      throw new Error("Invalid Stripe response");
    }

    return { paymentIntent, ephemeralKey, customer };
  };

  const openPaymentSheet = async () => {
    try {
      setLoading(true);

      // 1️⃣ Fetch fresh Stripe params (NEW PaymentIntent every time)
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      // 2️⃣ Initialize Payment Sheet
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

      if (initResult.error) {
        throw initResult.error;
      }

      // 3️⃣ Present Payment Sheet
      const presentResult = await presentPaymentSheet();

      if (presentResult.error) {
        Alert.alert(
          presentResult.error.code || "Payment error",
          presentResult.error.message
        );
        return;
      }

      await AsyncStorage.setItem(
        "newNotification",
        JSON.stringify({
          email: authenticatedUser?.email,
          value: true,
        })
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
      console.log("Stripe error:", err);
      Alert.alert(
        "Payment failed",
        err && err.message ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      style={{
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={() => {
        if (!groupJoinLoader) {
          router.back();
        }
      }}
    >
      <Pressable
        onPress={() => {}}
        style={[
          styles.modalContainer,
          {
            backgroundColor: colors.cardColor,
            borderColor: colors.queueBorder,
          },
        ]}
      >
        {/* <CustomText style={{
                    fontFamily: "AirbnbCereal_W_XBd",
                    fontSize: scale(18),
                    textAlign: "center"
                }}>Confirm Group Booking</CustomText> */}
        <View style={styles.iconContainer}>
          <CheckIcon
            style={{
              backgroundColor: colors.tabBackground,
              padding: scale(3),
              borderRadius: scale(50),
            }}
            size={scale(16)}
            color={colors.text}
          />
          <CustomText style={styles.titleText}>Please Confirm</CustomText>
        </View>

        <View
          style={{
            borderRadius: scale(10),
            backgroundColor: colors.tabBackground,
            padding: scale(10),
            gap: verticalScale(10),
          }}
        >
          <View style={styles.cardContent}>
            <CustomText>Members</CustomText>
            <CustomText>{groupJoinMembersParse?.length}</CustomText>
          </View>

          <View style={styles.cardContent}>
            <CustomText>Total Services</CustomText>
            <CustomText>{totalServicesLength}</CustomText>
          </View>

          <View style={styles.cardContent}>
            <CustomText>Est. Time</CustomText>
            <CustomText>{formatMinutesToHrMin(totalServiceEwt)}</CustomText>
          </View>

          {paymentSettingsDataParse?.enabled ? (
            <View
              style={{
                marginBottom: verticalScale(10),
                backgroundColor: colors.background,
                borderRadius: scale(8),
                borderWidth: scale(1),
                borderColor: "#2563eb",
                padding: scale(12),
                gap: verticalScale(8),
              }}
            >
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_Bd",
                  fontSize: scale(14),
                  color: "#2563eb",
                }}
              >
                Payment Summary
              </CustomText>

              {/* Pay Now */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Left */}
                <View style={{ flex: 1, paddingRight: scale(8) }}>
                  <CustomText
                    style={{
                      fontFamily: "AirbnbCereal_W_Bd",
                      fontSize: scale(14),
                    }}
                  >
                    Pay Now
                  </CustomText>
                  <CustomSecondaryText numberOfLines={2}>
                    Advance payment to confirm booking
                  </CustomSecondaryText>
                </View>

                {/* Right */}
                <CustomText
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontFamily: "AirbnbCereal_W_XBd",
                    fontSize: scale(14),
                    color: "#2563eb",
                    flexShrink: 1,
                    textAlign: "right",
                    maxWidth: "45%",
                  }}
                >
                  {authenticatedUser?.currency} {advanceAmount.toFixed(2)}
                </CustomText>
              </View>

              {/* Divider */}
              {paymentSettingsDataParse?.enabled && (
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.cardBorder,
                  }}
                />
              )}

              {/* Breakdown */}
              {paymentSettingsDataParse?.enabled && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <CustomSecondaryText>
                      Advance ({paymentSettingsDataParse?.advancePaymentPercent}
                      %)
                    </CustomSecondaryText>
                    <CustomSecondaryText>
                      {authenticatedUser?.currency} {advanceAmount.toFixed(2)}
                    </CustomSecondaryText>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <CustomSecondaryText>
                      Total service amount
                    </CustomSecondaryText>
                    <CustomSecondaryText>
                      {authenticatedUser?.currency}{" "}
                      {totalServicePriceAmount.toFixed(2)}
                    </CustomSecondaryText>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <CustomSecondaryText>Pay at salon</CustomSecondaryText>
                    <CustomSecondaryText>
                      {authenticatedUser?.currency}{" "}
                      {(totalServicePriceAmount - advanceAmount).toFixed(2)}
                    </CustomSecondaryText>
                  </View>
                </>
              )}
            </View>
          ) : (
            <>
              <View
                style={{
                  height: verticalScale(1),
                  backgroundColor: colors.secondaryText,
                }}
              />
              <View style={styles.cardContent}>
                <CustomText
                  style={{
                    fontFamily: "AirbnbCereal_W_XBd",
                    fontSize: scale(18),
                  }}
                >
                  Total Price
                </CustomText>
                <CustomText
                  style={{
                    fontFamily: "AirbnbCereal_W_XBd",
                    fontSize: scale(18),
                  }}
                >
                  {" "}
                  {authenticatedUser?.currency} {totalServicePriceAmount}
                </CustomText>
              </View>
            </>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => {
              if (!groupJoinLoader) {
                router.back();
              }
            }}
            style={[
              styles.button,
              {
                // backgroundColor: '#ef4444'
              },
            ]}
          >
            <CustomText style={{ fontFamily: "AirbnbCereal_W_Bd" }}>
              No
            </CustomText>
          </TouchableOpacity>

          {paymentSettingsDataParse?.enabled ? (
            <TouchableOpacity
              onPress={openPaymentSheet}
              disabled={loading}
              style={[
                styles.button,
                {
                  backgroundColor: loading ? "#9ca3af" : "#2563eb",
                  opacity: loading ? 0.7 : 1,
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <CustomText
                  style={{
                    color: "#fff",
                    fontFamily: "AirbnbCereal_W_Bd",
                  }}
                >
                  Checkout
                </CustomText>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              // onPress={() => router.replace("/groupJoinSuccessPage")}
              disabled={groupJoinLoader}
              onPress={groupJoinPressed}
              style={[
                styles.button,
                {
                  backgroundColor: "#14b8a6",
                },
              ]}
            >
              {groupJoinLoader ? (
                <ActivityIndicator color={"#fff"} />
              ) : (
                <CustomText
                  style={{ color: "#fff", fontFamily: "AirbnbCereal_W_Bd" }}
                >
                  Yes
                </CustomText>
              )}
            </TouchableOpacity>
          )}
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
