import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import CustomText from "../../components/CustomText";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { useTheme } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { CheckIcon } from "../../constants/icons";
import CustomSecondaryText from "../../components/CustomSecondaryText";
import { Toast } from "toastify-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobal } from "../../context/GlobalContext";
import axios from "axios";
import { BASE_URL } from "@/utils/api";
import { useStripe } from "@stripe/stripe-react-native";

const singleJoinModal = () => {
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
    0
  );
  const totalTime = parsedSelectedServices?.reduce(
    (acc, service) => acc + service.serviceEWT || service.barberServiceEWT,
    0
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
        onBackPress
      );

      return () => subscription.remove();
    }, [singleJoinLoader])
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

      const { data } = await axios.post(
        `${BASE_URL}/mobileRoutes/singleJoinQueue`,
        singleJoinData
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
      Alert.alert("Notice", error?.response?.data?.message, [{ text: "OK" }]);
      console.log("Error doing single join ", error);
    }
  };

  // stripe payment fetch

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);

  const totalServicePriceAmount = parsedSelectedServices.reduce(
    (sum, service) => sum + Number(service.servicePrice || 0),
    0
  );

  const advancePaymentPercent = Number(
    paymentSettingsDataParse?.advancePaymentPercent || 0
  );

  const advanceAmount = Math.round(
    (totalServicePriceAmount * advancePaymentPercent) / 100
  );

  // const fetchPaymentSheetParams = async () => {
  //   const response = await fetch(
  //     `${BASE_URL}/mobileRoutes/singleJoinQueuePaymentApi`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         //stripe forces minimum amount to be 50 less than that will cause payment failed error
  //         totalAmount: advanceAmount,
  //         currency: authenticatedUser?.isoCurrencyCode,
  //         queueJoinData: {
  //           salonId: authenticatedUser?.salonId,
  //           name: authenticatedUser?.name,
  //           customerEmail: authenticatedUser?.email,
  //           singleJoinedQType: "Single-Join",
  //           methodUsed: "App",
  //           mobileCountryCode: authenticatedUser?.mobileCountryCode,
  //           mobileNumber: authenticatedUser?.mobileNumber.toString(),
  //           barberName: parsedSelectBarber?.name,
  //           barberId: parsedSelectBarber?.barberId,
  //           services: parsedSelectedServices,
  //         },
  //       }),
  //     }
  //   );

  //   if (!response.ok) {
  //     throw new Error("Failed to fetch payment params");
  //   }

  //   const data = await response.json();
  //   const { paymentIntent, ephemeralKey, customer } = data;

  //   if (!paymentIntent || !ephemeralKey || !customer) {
  //     throw new Error("Invalid Stripe response");
  //   }

  //   return { paymentIntent, ephemeralKey, customer };
  // };

  // const openPaymentSheet = async () => {
  //   try {
  //     setLoading(true);

  //     // 1️⃣ Fetch fresh Stripe params (NEW PaymentIntent every time)
  //     const { paymentIntent, ephemeralKey, customer } =
  //       await fetchPaymentSheetParams();

  //     // 2️⃣ Initialize Payment Sheet
  //     const initResult = await initPaymentSheet({
  //       merchantDisplayName: authenticatedUser?.salonName || "IQBook",
  //       customerId: customer,
  //       customerEphemeralKeySecret: ephemeralKey,
  //       paymentIntentClientSecret: paymentIntent,
  //       allowsDelayedPaymentMethods: true,
  //       defaultBillingDetails: {
  //         name: authenticatedUser?.name,
  //         email: authenticatedUser?.email,
  //         phone:
  //           authenticatedUser?.mobileCountryCode &&
  //           authenticatedUser?.mobileNumber
  //             ? `+${authenticatedUser.mobileCountryCode}${authenticatedUser.mobileNumber}`
  //             : undefined,
  //       },
  //       returnURL: "iqbmobilecustomer://stripe-redirect",
  //     });

  //     if (initResult.error) {
  //       throw initResult.error;
  //     }

  //     // 3️⃣ Present Payment Sheet
  //     const presentResult = await presentPaymentSheet();

  //     if (presentResult.error) {
  //       Alert.alert(
  //         presentResult.error.code || "Payment error",
  //         presentResult.error.message
  //       );
  //       return;
  //     }

  //     await AsyncStorage.setItem(
  //       "newNotification",
  //       JSON.stringify({
  //         email: authenticatedUser?.email,
  //         value: true,
  //       })
  //     );

  //     setNewNotification({
  //       email: authenticatedUser?.email,
  //       value: true,
  //     });

  //     setQueueJoinType({
  //       single: false,
  //       group: false,
  //     });

  //     setJoinPopupType({
  //       barberSelect: false,
  //       serviceSelect: false,
  //     });

  //     router.replace("/singleJoinSuccessPage");

  //     //   router.replace({
  //     //     pathname: "/appointmentSuccessPage",
  //     //     params: {
  //     //       booked: true,
  //     //       edit: false,
  //     //     },
  //     //   });
  //   } catch (err) {
  //     console.log("Stripe error:", err);
  //     Alert.alert(
  //       "Payment failed",
  //       err && err.message ? err.message : "Something went wrong"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(
      `${BASE_URL}/mobileRoutes/singleJoinQueuePaymentApi`,
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
        }),
      }
    );

    const data = await response.json();

    // ✅ Do NOT mask backend error message
    if (!response.ok) {
      throw new Error(data?.message || "Payment initialization failed");
    }

    const { paymentIntent, ephemeralKey, customer } = data;

    if (!paymentIntent || !ephemeralKey || !customer) {
      throw new Error("Invalid Stripe response");
    }

    return { paymentIntent, ephemeralKey, customer };
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
        })
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

      Alert.alert("Payment failed", err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <Pressable
    //   onPress={() => {
    //     if (!singleJoinLoader) {
    //       router.back();
    //     }
    //   }}
    //   style={{
    //     flex: 1,
    //     backgroundColor: "rgba(0,0,0,0.5)",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   <Pressable
    //     onPress={() => {}}
    //     style={[
    //       styles.modalContainer,
    //       {
    //         backgroundColor: colors.cardColor,
    //         borderColor: colors.queueBorder,
    //       },
    //     ]}
    //   >
    //     <View style={styles.iconContainer}>
    //       <CheckIcon
    //         style={{
    //           backgroundColor: colors.tabBackground,
    //           padding: scale(3),
    //           borderRadius: scale(50),
    //         }}
    //         size={scale(16)}
    //         color={colors.text}
    //       />
    //       <CustomText style={styles.titleText}>Please Confirm</CustomText>
    //     </View>

    //     <View style={{ gap: verticalScale(5) }}>
    //       <CustomSecondaryText style={styles.confirmText}>
    //         Are you sure you want to proceed?
    //       </CustomSecondaryText>

    //       {/* Group barber name and pricing together in a styled container */}
    //       <View
    //         style={{
    //           marginTop: verticalScale(5),
    //           backgroundColor: colors.tabBackground, // Optional: subtle background to group
    //           padding: scale(8),
    //           borderRadius: scale(6),
    //           gap: verticalScale(4),
    //         }}
    //       >
    //         <CustomText
    //           style={{
    //             fontFamily: "AirbnbCereal_W_XBd",
    //             fontSize: scale(14),
    //           }}
    //         >
    //           {parsedSelectBarber?.name}
    //         </CustomText>

    //         <View
    //           style={{
    //             flexDirection: "row",
    //             alignItems: "center",
    //             gap: scale(6),
    //           }}
    //         >
    //           <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
    //             {authenticatedUser?.currency} {totalPrice.toFixed(2)}
    //           </CustomText>
    //           <CustomSecondaryText>
    //             ( {totalServices} {totalServices === 1 ? "service" : "services"}{" "}
    //             | {formatMinutesToHrMin(totalTime)} )
    //           </CustomSecondaryText>
    //         </View>
    //       </View>

    //       {paymentSettingsDataParse?.enabled ? (
    //         <View
    //           style={{
    //             marginVertical: verticalScale(10),
    //             backgroundColor: colors.background,
    //             borderRadius: scale(8),
    //             borderWidth: scale(1),
    //             borderColor: "#2563eb",
    //             padding: scale(12),
    //             gap: verticalScale(8),
    //           }}
    //         >
    //           <CustomText
    //             style={{
    //               fontFamily: "AirbnbCereal_W_Bd",
    //               fontSize: scale(14),
    //               color: "#2563eb",
    //             }}
    //           >
    //             Payment Summary
    //           </CustomText>

    //           {/* Pay Now */}
    //           <View
    //             style={{
    //               flexDirection: "row",
    //               justifyContent: "space-between",
    //               alignItems: "center",
    //             }}
    //           >
    //             {/* Left */}
    //             <View style={{ flex: 1, paddingRight: scale(8) }}>
    //               <CustomText
    //                 style={{
    //                   fontFamily: "AirbnbCereal_W_Bd",
    //                   fontSize: scale(14),
    //                 }}
    //               >
    //                 Pay Now
    //               </CustomText>
    //               <CustomSecondaryText numberOfLines={2}>
    //                 Advance payment to confirm booking
    //               </CustomSecondaryText>
    //             </View>

    //             {/* Right */}
    //             <CustomText
    //               numberOfLines={1}
    //               adjustsFontSizeToFit
    //               style={{
    //                 fontFamily: "AirbnbCereal_W_XBd",
    //                 fontSize: scale(14),
    //                 color: "#2563eb",
    //                 flexShrink: 1,
    //                 textAlign: "right",
    //                 maxWidth: "45%",
    //               }}
    //             >
    //               {authenticatedUser?.currency} {advanceAmount.toFixed(2)}
    //             </CustomText>
    //           </View>

    //           {/* Divider */}
    //           {paymentSettingsDataParse?.enabled && (
    //             <View
    //               style={{
    //                 height: 1,
    //                 backgroundColor: colors.cardBorder,
    //               }}
    //             />
    //           )}

    //           {/* Breakdown */}
    //           {paymentSettingsDataParse?.enabled && (
    //             <>
    //               <View
    //                 style={{
    //                   flexDirection: "row",
    //                   justifyContent: "space-between",
    //                 }}
    //               >
    //                 <CustomSecondaryText>
    //                   Advance ({paymentSettingsDataParse?.advancePaymentPercent}
    //                   %)
    //                 </CustomSecondaryText>
    //                 <CustomSecondaryText>
    //                   {authenticatedUser?.currency} {advanceAmount.toFixed(2)}
    //                 </CustomSecondaryText>
    //               </View>

    //               <View
    //                 style={{
    //                   flexDirection: "row",
    //                   justifyContent: "space-between",
    //                 }}
    //               >
    //                 <CustomSecondaryText>
    //                   Total service amount
    //                 </CustomSecondaryText>
    //                 <CustomSecondaryText>
    //                   {authenticatedUser?.currency} {totalPrice.toFixed(2)}
    //                 </CustomSecondaryText>
    //               </View>

    //               <View
    //                 style={{
    //                   flexDirection: "row",
    //                   justifyContent: "space-between",
    //                 }}
    //               >
    //                 <CustomSecondaryText>Pay at salon</CustomSecondaryText>
    //                 <CustomSecondaryText>
    //                   {authenticatedUser?.currency}{" "}
    //                   {(totalPrice - advanceAmount).toFixed(2)}
    //                 </CustomSecondaryText>
    //               </View>
    //             </>
    //           )}
    //         </View>
    //       ) : null}
    //     </View>

    //     <View style={styles.buttonRow}>
    //       <TouchableOpacity
    //         onPress={() => {
    //           if (!singleJoinLoader) {
    //             router.back();
    //           }
    //         }}
    //         style={[
    //           styles.button,
    //           {
    //             // backgroundColor: '#ef4444'
    //           },
    //         ]}
    //       >
    //         <CustomText style={{ fontFamily: "AirbnbCereal_W_Bd" }}>
    //           No
    //         </CustomText>
    //       </TouchableOpacity>
    //       {paymentSettingsDataParse?.enabled ? (
    //         <TouchableOpacity
    //           onPress={openPaymentSheet}
    //           disabled={loading}
    //           style={[
    //             styles.button,
    //             {
    //               backgroundColor: loading ? "#9ca3af" : "#2563eb",
    //               opacity: loading ? 0.7 : 1,
    //             },
    //           ]}
    //         >
    //           {loading ? (
    //             <ActivityIndicator color="#fff" />
    //           ) : (
    //             <CustomText
    //               style={{
    //                 color: "#fff",
    //                 fontFamily: "AirbnbCereal_W_Bd",
    //               }}
    //             >
    //               Checkout
    //             </CustomText>
    //           )}
    //         </TouchableOpacity>
    //       ) : (
    //         <TouchableOpacity
    //           // onPress={}
    //           disabled={singleJoinLoader}
    //           onPress={singleJoinPressed}
    //           style={[
    //             styles.button,
    //             {
    //               backgroundColor: "#14b8a6",
    //             },
    //           ]}
    //         >
    //           {singleJoinLoader ? (
    //             <ActivityIndicator color={"#fff"} />
    //           ) : (
    //             <CustomText
    //               style={{ color: "#fff", fontFamily: "AirbnbCereal_W_Bd" }}
    //             >
    //               Yes
    //             </CustomText>
    //           )}
    //         </TouchableOpacity>
    //       )}
    //     </View>
    //   </Pressable>
    // </Pressable>

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
              backgroundColor: "#2563eb10",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: verticalScale(16),
            }}
          >
            <CheckIcon size={moderateScale(28)} color="#2563eb" />
          </View>

          <CustomText
            style={{
              fontFamily: "AirbnbCereal_W_XBd",
              fontSize: moderateScale(22),
              textAlign: "center",
            }}
          >
            Confirm Selection
          </CustomText>

          <CustomSecondaryText
            style={{
              textAlign: "center",
              marginTop: verticalScale(6),
              fontSize: moderateScale(14),
              color: "#64748b",
            }}
          >
            Are you sure you want to proceed?
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
              Selected Barber
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
                  {totalServices} {totalServices === 1 ? "service" : "services"}{" "}
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
                Payment Breakdown
              </CustomText>

              <View style={{ gap: verticalScale(10) }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <CustomSecondaryText style={{ fontSize: moderateScale(14) }}>
                    Total Amount
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
                        color: "#2563eb",
                      }}
                    >
                      Pay Now
                    </CustomText>
                    <CustomSecondaryText
                      style={{ fontSize: moderateScale(12) }}
                    >
                      Deposit ({paymentSettingsDataParse?.advancePaymentPercent}
                      %)
                    </CustomSecondaryText>
                  </View>
                  <CustomText
                    style={{
                      fontFamily: "AirbnbCereal_W_XBd",
                      color: "#2563eb",
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
                    Pay at Salon
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
                backgroundColor: loading ? "#94a3b8" : "#2563eb",
                paddingVertical: verticalScale(18),
                borderRadius: moderateScale(16),
                alignItems: "center",
                shadowColor: "#2563eb",
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
                  Proceed to Payment
                </CustomText>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={singleJoinPressed}
              disabled={singleJoinLoader}
              style={{
                backgroundColor: singleJoinLoader ? "#94a3b8" : "#14b8a6",
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
                  Confirm Booking
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
              Go Back
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
