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

  console.log(" paymentSettingsDataParse sdvwevewv ", paymentSettingsDataParse);

  // console.log("selectedCustomerBookAppointmentBarberParse ", selectedCustomerBookAppointmentBarberParse)

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

  // paymentSettingsDataParse?.advancePaymentPercent

  // const totalServicePriceAmount =
  //   selectedCustomerBookAppointmentServicesParse.reduce(
  //     (sum, service) => sum + Number(service.servicePrice || 0),
  //     0
  //   );

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

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(
      "https://iqb-final.onrender.com/api/mobileRoutes/paymentApi",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //stripe forces minimum amount to be 50 less than that will cause payment failed error
          totalAmount: Math.round(advanceAmount * 100),
          salonId: authenticatedUser.salonId,
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

      router.replace({
        pathname: "/appointmentSuccessPage",
        params: {
          booked: true,
          edit: false,
        },
      });
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

  // const bookAppointmentPressed = async () => {
  //   console.log("Book Appointment");
  // };

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
    <Pressable
      onPress={() => {
        if (!bookAppointmentLoader) {
          router.back();
        }
      }}
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
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

        <View style={{ gap: verticalScale(5) }}>
          <CustomSecondaryText style={styles.confirmText}>
            Are you sure you want to proceed?
          </CustomSecondaryText>

          <View
            style={{
              marginTop: verticalScale(5),
              backgroundColor: colors.tabBackground, // Optional: subtle background to group
              padding: scale(8),
              borderRadius: scale(6),
              gap: verticalScale(4),
            }}
          >
            <CustomText
              style={{
                fontFamily: "AirbnbCereal_W_XBd",
                fontSize: scale(14),
              }}
            >
              {selectedCustomerBookAppointmentBarberParse?.name}
            </CustomText>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(6),
              }}
            >
              <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
                {authenticatedUser?.currency} {totalPrice.toFixed(2)}
              </CustomText>
              <CustomSecondaryText>
                ( {totalServices} {totalServices === 1 ? "service" : "services"}{" "}
                | {formatMinutesToHrMin(totalTime)} )
              </CustomSecondaryText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(6),
              }}
            >
              <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
                Timeslot
              </CustomText>
              <CustomSecondaryText>
                {selectedBookCalenderTimeslotParse}
              </CustomSecondaryText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(6),
              }}
            >
              <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
                Date
              </CustomText>
              <CustomSecondaryText>
                {ddmmformatDate(selectedBookCalenderDateParse)}
              </CustomSecondaryText>
            </View>

            {selectedBookAppointmentNoteParse && (
              <View style={{ gap: scale(6) }}>
                <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
                  Note
                </CustomText>
                <CustomSecondaryText>
                  {selectedBookAppointmentNoteParse}
                </CustomSecondaryText>
              </View>
            )}

            <View
              style={{
                width: "100%",
                backgroundColor: colors.background,
                borderWidth: scale(1),
                borderColor: colors.cardBorder,
                borderRadius: scale(5),
                padding: scale(10),
                marginTop: verticalScale(5),
              }}
            >
              <CustomText style={{ fontSize: moderateScale(14) }}>
                <CustomText
                  style={{
                    fontFamily: "AirbnbCereal_W_Bd",
                    color: "#e11d48",
                    fontSize: moderateScale(14),
                  }}
                >
                  Reminder:{" "}
                </CustomText>
                edits or cancellations made less than 24 hours before your
                appointment will be subject to a 50% fee.
              </CustomText>
              <View
                style={{
                  height: verticalScale(5),
                }}
              />
              <CustomText
                style={{
                  fontSize: moderateScale(14),
                }}
              >
                Kindly reach 5 minutes early for a seamless service.
              </CustomText>
            </View>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => {
              if (!bookAppointmentLoader) {
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
              disabled={bookAppointmentLoader}
              onPress={bookAppointmentPressed}
              style={[
                styles.button,
                {
                  backgroundColor: "#14b8a6",
                },
              ]}
            >
              {bookAppointmentLoader ? (
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
