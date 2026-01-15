import { BASE_URL } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Toast } from "toastify-react-native";
import CustomSecondaryText from "../../components/CustomSecondaryText";
import CustomText from "../../components/CustomText";
import { CheckIcon } from "../../constants/icons";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalContext";
import { ddmmformatDate } from "../../utils/ddmmformatDate";
import { useStripe } from "@stripe/stripe-react-native";

const appointmentCalenderModal = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { authenticatedUser } = useAuth();

  const params = useLocalSearchParams();

  const selectedCustomerBookAppointmentBarberParse =
    params?.selectedCustomerBookAppointmentBarber
      ? JSON.parse(params?.selectedCustomerBookAppointmentBarber)
      : {};
  const selectedCustomerBookAppointmentServicesParse =
    params?.selectedCustomerBookAppointmentServices
      ? JSON.parse(params?.selectedCustomerBookAppointmentServices)
      : [];
  const selectedBookCalenderTimeslotParse = params?.selectedBookCalenderTimeslot
    ? JSON.parse(params?.selectedBookCalenderTimeslot)
    : "";
  const selectedBookCalenderDateParse = params?.selectedBookCalenderDate
    ? JSON.parse(params?.selectedBookCalenderDate)
    : "";
  const selectedBookAppointmentNoteParse = params?.selectedBookAppointmentNote
    ? JSON.parse(params?.selectedBookAppointmentNote)
    : "";

  const paymentSettingsDataParse = params?.paymentSettingsData
    ? JSON.parse(params?.paymentSettingsData)
    : "";

  const [bookAppointmentLoader, setBookAppointmentLoader] = useState(false);
  const { newNotification, setNewNotification } = useGlobal();

  const bookAppointmentPressed = async () => {
    const appData = {
      salonId: authenticatedUser?.salonId,
      barberId: selectedCustomerBookAppointmentBarberParse?.barberId,
      serviceId: selectedCustomerBookAppointmentServicesParse.map(
        (item) => item.serviceId
      ),
      appointmentDate: selectedBookCalenderDateParse,
      appointmentNotes: selectedBookAppointmentNoteParse,
      startTime: selectedBookCalenderTimeslotParse,
      customerEmail: authenticatedUser?.email,
      customerName: authenticatedUser?.name,
      customerType: "Walk-In",
      methodUsed: "App",
    };

    try {
      setBookAppointmentLoader(true);

      const { data } = await axios.post(
        `${BASE_URL}/mobileRoutes/createAppointment`,
        appData
      );

      Toast.success(data?.message);
      setBookAppointmentLoader(false);

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

      // router.dismissTo("/appointment")

      router.replace({
        pathname: "/appointmentSuccessPage",
        params: {
          booked: true,
          edit: false,
        },
      });
    } catch (error) {
      setBookAppointmentLoader(false);
      Alert.alert("Notice", error?.response?.data?.message, [{ text: "OK" }]);
      console.log("Error doing book appointment ", error);
    }
  };

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);

  const totalServicePriceAmount =
    selectedCustomerBookAppointmentServicesParse.reduce(
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
  //   const response = await fetch(`${BASE_URL}/mobileRoutes/paymentApi`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       //stripe forces minimum amount to be 50 less than that will cause payment failed error
  //       totalAmount: advanceAmount,
  //       salonId: authenticatedUser.salonId,
  //       currency: authenticatedUser?.isoCurrencyCode,
  //       joinPaymentType: "appointment",
  //       customerEmail: authenticatedUser?.email,
  //       bookAppointmentData: {
  //         salonId: authenticatedUser?.salonId,
  //         barberId: selectedCustomerBookAppointmentBarberParse?.barberId,
  //         serviceId: selectedCustomerBookAppointmentServicesParse.map(
  //           (item) => item.serviceId
  //         ),
  //         appointmentDate: selectedBookCalenderDateParse,
  //         appointmentNotes: selectedBookAppointmentNoteParse,
  //         startTime: selectedBookCalenderTimeslotParse,
  //         customerEmail: authenticatedUser?.email,
  //         customerName: authenticatedUser?.name,
  //         customerType: "Walk-In",
  //         methodUsed: "App",
  //       },
  //     }),
  //   });

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

  //     router.replace({
  //       pathname: "/appointmentSuccessPage",
  //       params: {
  //         booked: true,
  //         edit: false,
  //       },
  //     });
  //   } catch (err) {
  //     console.log("Stripe error:", err?.message);
  //     // Alert.alert(
  //     //   "Payment failed",
  //     //   err && err.message ? err.message : "Something went wrong"
  //     // );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${BASE_URL}/mobileRoutes/paymentApi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        totalAmount: advanceAmount, // backend must convert to smallest unit
        salonId: authenticatedUser?.salonId,
        currency: authenticatedUser?.isoCurrencyCode,
        joinPaymentType: "appointment",
        customerEmail: authenticatedUser?.email,
        bookAppointmentData: {
          salonId: authenticatedUser?.salonId,
          barberId: selectedCustomerBookAppointmentBarberParse?.barberId,
          serviceId: selectedCustomerBookAppointmentServicesParse.map(
            (item) => item.serviceId
          ),
          appointmentDate: selectedBookCalenderDateParse,
          appointmentNotes: selectedBookAppointmentNoteParse,
          startTime: selectedBookCalenderTimeslotParse,
          customerEmail: authenticatedUser?.email,
          customerName: authenticatedUser?.name,
          customerType: "Walk-In",
          methodUsed: "App",
        },
      }),
    });

    const data = await response.json();

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

      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

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

      const presentResult = await presentPaymentSheet();

      if (presentResult?.error) {
        throw new Error(presentResult.error.message);
      }

      router.replace({
        pathname: "/appointmentSuccessPage",
        params: {
          booked: true,
          edit: false,
        },
      });
    } catch (err) {
      console.log("Stripe error:", err?.message);

      Alert.alert("Payment failed", err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}m`;
  }

  const totalPrice = selectedCustomerBookAppointmentServicesParse?.reduce(
    (acc, service) => acc + service.servicePrice,
    0
  );
  // const totalTime = selectedCustomerBookAppointmentServicesParse?.reduce((acc, service) => acc + service.serviceEWT, 0);
  const totalTime =
    selectedCustomerBookAppointmentBarberParse?.totalBarberServiceEWT;
  const totalServices = selectedCustomerBookAppointmentServicesParse?.length;

  return (
    // <View
    //   // onPress={() => {
    //   //   if (!bookAppointmentLoader) {
    //   //     router.back();
    //   //   }
    //   // }}
    //   style={{
    //     flex: 1,
    //     backgroundColor: "rgba(0,0,0,0.5)",
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   {/* Stop backdrop click */}
    //   <View
    //     // onPress={() => {}}
    //     style={[
    //       styles.modalContainer,
    //       {
    //         backgroundColor: colors.cardColor,
    //         borderColor: colors.queueBorder,
    //         maxHeight: "85%", // 👈 important for scroll
    //         width: "90%",
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

    //     <CustomSecondaryText style={styles.confirmText}>
    //       Are you sure you want to proceed?
    //     </CustomSecondaryText>

    //     <ScrollView
    //       showsVerticalScrollIndicator={false}
    //       keyboardShouldPersistTaps="handled"
    //       contentContainerStyle={{
    //         paddingBottom: verticalScale(16),
    //       }}
    //     >
    //       {/* ===== CONTENT START ===== */}

    //       <View style={{ gap: verticalScale(5) }}>
    //         <View
    //           style={{
    //             marginTop: verticalScale(5),
    //             backgroundColor: colors.tabBackground, // Optional: subtle background to group
    //             padding: scale(8),
    //             borderRadius: scale(6),
    //             gap: verticalScale(4),
    //           }}
    //         >
    //           <CustomText
    //             style={{
    //               fontFamily: "AirbnbCereal_W_XBd",
    //               fontSize: scale(14),
    //             }}
    //           >
    //             {selectedCustomerBookAppointmentBarberParse?.name}
    //           </CustomText>

    //           <View
    //             style={{
    //               flexDirection: "row",
    //               alignItems: "center",
    //               gap: scale(6),
    //             }}
    //           >
    //             {!paymentSettingsDataParse?.enabled ? (
    //               <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
    //                 {authenticatedUser?.currency} {totalPrice.toFixed(2)}
    //               </CustomText>
    //             ) : null}
    //             <CustomSecondaryText>
    //               ( {totalServices}{" "}
    //               {totalServices === 1 ? "service" : "services"} |{" "}
    //               {formatMinutesToHrMin(totalTime)} )
    //             </CustomSecondaryText>
    //           </View>

    //           <View
    //             style={{
    //               flexDirection: "row",
    //               alignItems: "center",
    //               gap: scale(6),
    //             }}
    //           >
    //             <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
    //               Timeslot
    //             </CustomText>
    //             <CustomSecondaryText>
    //               {selectedBookCalenderTimeslotParse}
    //             </CustomSecondaryText>
    //           </View>

    //           <View
    //             style={{
    //               flexDirection: "row",
    //               alignItems: "center",
    //               gap: scale(6),
    //             }}
    //           >
    //             <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
    //               Date
    //             </CustomText>
    //             <CustomSecondaryText>
    //               {ddmmformatDate(selectedBookCalenderDateParse)}
    //             </CustomSecondaryText>
    //           </View>

    //           {paymentSettingsDataParse?.enabled ? (
    //             <View
    //               style={{
    //                 marginVertical: verticalScale(10),
    //                 backgroundColor: colors.background,
    //                 borderRadius: scale(8),
    //                 borderWidth: scale(1),
    //                 borderColor: "#2563eb",
    //                 padding: scale(12),
    //                 gap: verticalScale(8),
    //               }}
    //             >
    //               <CustomText
    //                 style={{
    //                   fontFamily: "AirbnbCereal_W_Bd",
    //                   fontSize: scale(14),
    //                   color: "#2563eb",
    //                 }}
    //               >
    //                 Payment Summary
    //               </CustomText>

    //               {/* Pay Now */}
    //               <View
    //                 style={{
    //                   flexDirection: "row",
    //                   justifyContent: "space-between",
    //                   alignItems: "center",
    //                 }}
    //               >
    //                 {/* Left */}
    //                 <View style={{ flex: 1, paddingRight: scale(8) }}>
    //                   <CustomText
    //                     style={{
    //                       fontFamily: "AirbnbCereal_W_Bd",
    //                       fontSize: scale(14),
    //                     }}
    //                   >
    //                     Pay Now
    //                   </CustomText>
    //                   <CustomSecondaryText numberOfLines={2}>
    //                     Advance payment to confirm booking
    //                   </CustomSecondaryText>
    //                 </View>

    //                 {/* Right */}
    //                 <CustomText
    //                   numberOfLines={1}
    //                   adjustsFontSizeToFit
    //                   style={{
    //                     fontFamily: "AirbnbCereal_W_XBd",
    //                     fontSize: scale(14),
    //                     color: "#2563eb",
    //                     flexShrink: 1,
    //                     textAlign: "right",
    //                     maxWidth: "45%",
    //                   }}
    //                 >
    //                   {authenticatedUser?.currency} {advanceAmount.toFixed(2)}
    //                 </CustomText>
    //               </View>

    //               {/* Divider */}
    //               {paymentSettingsDataParse?.enabled && (
    //                 <View
    //                   style={{
    //                     height: 1,
    //                     backgroundColor: colors.cardBorder,
    //                   }}
    //                 />
    //               )}

    //               {/* Breakdown */}
    //               {paymentSettingsDataParse?.enabled && (
    //                 <>
    //                   <View
    //                     style={{
    //                       flexDirection: "row",
    //                       justifyContent: "space-between",
    //                     }}
    //                   >
    //                     <CustomSecondaryText>
    //                       Advance (
    //                       {paymentSettingsDataParse?.advancePaymentPercent}%)
    //                     </CustomSecondaryText>
    //                     <CustomSecondaryText>
    //                       {authenticatedUser?.currency}{" "}
    //                       {advanceAmount.toFixed(2)}
    //                     </CustomSecondaryText>
    //                   </View>

    //                   <View
    //                     style={{
    //                       flexDirection: "row",
    //                       justifyContent: "space-between",
    //                     }}
    //                   >
    //                     <CustomSecondaryText>
    //                       Total service amount
    //                     </CustomSecondaryText>
    //                     <CustomSecondaryText>
    //                       {authenticatedUser?.currency} {totalPrice.toFixed(2)}
    //                     </CustomSecondaryText>
    //                   </View>

    //                   <View
    //                     style={{
    //                       flexDirection: "row",
    //                       justifyContent: "space-between",
    //                     }}
    //                   >
    //                     <CustomSecondaryText>Pay at salon</CustomSecondaryText>
    //                     <CustomSecondaryText>
    //                       {authenticatedUser?.currency}{" "}
    //                       {(totalPrice - advanceAmount).toFixed(2)}
    //                     </CustomSecondaryText>
    //                   </View>
    //                 </>
    //               )}
    //             </View>
    //           ) : null}

    //           {selectedBookAppointmentNoteParse && (
    //             <View style={{ gap: scale(6) }}>
    //               <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
    //                 Note
    //               </CustomText>
    //               <CustomSecondaryText>
    //                 {selectedBookAppointmentNoteParse}
    //               </CustomSecondaryText>
    //             </View>
    //           )}

    //           <View
    //             style={{
    //               width: "100%",
    //               backgroundColor: colors.background,
    //               borderWidth: scale(1),
    //               borderColor: colors.cardBorder,
    //               borderRadius: scale(5),
    //               padding: scale(10),
    //               marginTop: verticalScale(5),
    //             }}
    //           >
    //             <CustomText style={{ fontSize: moderateScale(14) }}>
    //               <CustomText
    //                 style={{
    //                   fontFamily: "AirbnbCereal_W_Bd",
    //                   color: "#e11d48",
    //                   fontSize: moderateScale(14),
    //                 }}
    //               >
    //                 Reminder:{" "}
    //               </CustomText>
    //               edits or cancellations made less than 24 hours before your
    //               appointment will be subject to a 50% fee.
    //             </CustomText>
    //             <View
    //               style={{
    //                 height: verticalScale(5),
    //               }}
    //             />
    //             <CustomText
    //               style={{
    //                 fontSize: moderateScale(14),
    //               }}
    //             >
    //               Kindly reach 5 minutes early for a seamless service.
    //             </CustomText>
    //           </View>
    //         </View>
    //       </View>

    //       {/* ===== CONTENT END ===== */}
    //     </ScrollView>

    //     {/* 🔒 Buttons fixed at bottom */}
    //     <View style={styles.buttonRow}>
    //       <TouchableOpacity
    //         onPress={() => {
    //           if (!bookAppointmentLoader) {
    //             router.back();
    //           }
    //         }}
    //         style={styles.button}
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
    //               style={{ color: "#fff", fontFamily: "AirbnbCereal_W_Bd" }}
    //             >
    //               Checkout
    //             </CustomText>
    //           )}
    //         </TouchableOpacity>
    //       ) : (
    //         <TouchableOpacity
    //           disabled={bookAppointmentLoader}
    //           onPress={bookAppointmentPressed}
    //           style={[styles.button, { backgroundColor: "#14b8a6" }]}
    //         >
    //           {bookAppointmentLoader ? (
    //             <ActivityIndicator color="#fff" />
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
    //   </View>
    // </View>

    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: scale(15),
      }}
    >
      {/* Main Card */}
      <View
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
              height: scale(64), // Using scale for icon containers to keep them square
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
            Confirm Appointment
          </CustomText>

          <CustomSecondaryText
            style={{
              textAlign: "center",
              marginTop: verticalScale(6),
              fontSize: moderateScale(14),
              color: "#64748b",
            }}
          >
            Please review your booking details
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
          {/* Professional Summary */}
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
              Service Provider
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
                  {selectedCustomerBookAppointmentBarberParse?.name}
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

          {/* Date & Time Grid */}
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
                borderRightWidth: 1,
                borderColor: colors.queueBorder,
                paddingRight: scale(10),
              }}
            >
              <CustomSecondaryText
                style={{
                  fontSize: moderateScale(11),
                  textTransform: "uppercase",
                  marginBottom: verticalScale(4),
                }}
              >
                Date
              </CustomSecondaryText>
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_Bd",
                  fontSize: moderateScale(15),
                }}
              >
                {ddmmformatDate(selectedBookCalenderDateParse)}
              </CustomText>
            </View>

            <View style={{ flex: 1, paddingLeft: scale(20) }}>
              <CustomSecondaryText
                style={{
                  fontSize: moderateScale(11),
                  textTransform: "uppercase",
                  marginBottom: verticalScale(4),
                }}
              >
                Time
              </CustomSecondaryText>
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_Bd",
                  fontSize: moderateScale(15),
                }}
              >
                {selectedBookCalenderTimeslotParse}
              </CustomText>
            </View>
          </View>

          {/* Payment Receipt Style */}
          {paymentSettingsDataParse?.enabled && (
            <View
              style={{
                padding: scale(20),
                borderRadius: moderateScale(20),
                backgroundColor: colors.modalSectionColor,
                borderWidth: 1,
                borderColor: colors.queueBorder,
                marginBottom: verticalScale(24),
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
                    Remaining Balance
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

          {/* Note */}
          {selectedBookAppointmentNoteParse && (
            <View style={{ marginBottom: verticalScale(24) }}>
              <CustomSecondaryText
                style={{
                  fontSize: moderateScale(12),
                  textTransform: "uppercase",
                  marginBottom: verticalScale(8),
                }}
              >
                Your Note
              </CustomSecondaryText>
              <View
                style={{
                  padding: scale(16),
                  borderRadius: moderateScale(16),
                  backgroundColor: colors.tabBackground,
                }}
              >
                <CustomText
                  style={{
                    fontSize: moderateScale(14),
                    fontStyle: "italic",
                  }}
                >
                  "{selectedBookAppointmentNoteParse}"
                </CustomText>
              </View>
            </View>
          )}

          {/* Policy Box */}
          <View
            style={{
              padding: scale(16),
              borderRadius: moderateScale(16),
              backgroundColor: "#fff1f2",
              borderWidth: 1,
              borderColor: "#ffe4e6",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: verticalScale(4),
                gap: scale(6),
              }}
            >
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_Bd",
                  color: "#e11d48",
                  fontSize: moderateScale(13),
                }}
              >
                Cancellation Policy
              </CustomText>
            </View>
            <CustomText
              style={{
                fontSize: moderateScale(12),
                color: "#9f1239",
                lineHeight: verticalScale(18),
              }}
            >
              Cancellations within 24 hours incur a 50% fee. Please arrive 5
              minutes early.
            </CustomText>
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
              onPress={bookAppointmentPressed}
              disabled={bookAppointmentLoader}
              style={{
                backgroundColor: bookAppointmentLoader ? "#94a3b8" : "#0d9488",
                paddingVertical: verticalScale(18),
                borderRadius: moderateScale(16),
                alignItems: "center",
              }}
            >
              {bookAppointmentLoader ? (
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
            onPress={() => !bookAppointmentLoader && router.back()}
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
      </View>
    </View>
  );
};

export default appointmentCalenderModal;

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
    marginVertical: verticalScale(5),
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

const Row = ({ label, value }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <CustomSecondaryText>{label}</CustomSecondaryText>
    <CustomSecondaryText>{value}</CustomSecondaryText>
  </View>
);
