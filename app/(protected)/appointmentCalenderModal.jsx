import { BASE_URL } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

const appointmentCalenderModal = () => {
  const {
    appointmentPopupType,
    setAppointmentPopupType,
    newNotification,
    setNewNotification,
  } = useGlobal();

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

  const selectedCalenderDayParse = params?.selectedCalenderDay
    ? JSON.parse(params?.selectedCalenderDay)
    : "";

  const [bookAppointmentLoader, setBookAppointmentLoader] = useState(false);

  const bookAppointmentPressed = async () => {
    const appData = {
      salonId: authenticatedUser?.salonId,
      barberId: selectedCustomerBookAppointmentBarberParse?.barberId,
      serviceId: selectedCustomerBookAppointmentServicesParse.map(
        (item) => item.serviceId,
      ),
      appointmentDate: selectedBookCalenderDateParse,
      appointmentNotes: selectedBookAppointmentNoteParse,
      startTime: selectedBookCalenderTimeslotParse,
      customerEmail: authenticatedUser?.email,
      customerName: authenticatedUser?.name,
      customerType: "Walk-In",
      methodUsed: "App",
      selectServices: appointmentPopupType?.selectServices,
      selectBarber: appointmentPopupType?.selectBarber,
      bookDateObject: selectedCalenderDayParse
    };

    try {
      setBookAppointmentLoader(true);

      const { data } = await axios.post(
        `${BASE_URL}/mobileRoutes/createAppointment`,
        appData,
      );

      Toast.success(data?.message);
      setBookAppointmentLoader(false);

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
      0,
    );

  const advancePaymentPercent = Number(
    paymentSettingsDataParse?.advancePaymentPercent || 0,
  );

  const advanceAmount = (totalServicePriceAmount * advancePaymentPercent) / 100;

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
            (item) => item.serviceId,
          ),
          appointmentDate: selectedBookCalenderDateParse,
          appointmentNotes: selectedBookAppointmentNoteParse,
          startTime: selectedBookCalenderTimeslotParse,
          customerEmail: authenticatedUser?.email,
          customerName: authenticatedUser?.name,
          customerType: "Walk-In",
          methodUsed: "App",
          selectServices: appointmentPopupType?.selectServices,
          selectBarber: appointmentPopupType?.selectBarber,
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
    0,
  );

  // const totalTime = selectedCustomerBookAppointmentServicesParse?.reduce((acc, service) => acc + service.serviceEWT, 0);

  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (appointmentPopupType?.selectServices) {
      setTotalTime(
        selectedCustomerBookAppointmentBarberParse?.totalBarberServiceEWT,
      );
    } else {
      setTotalTime(
        selectedCustomerBookAppointmentServicesParse.reduce(
          (sum, item) => sum + (Number(item.barberServiceEWT) || 0),
          0,
        ),
      );
    }
  }, []);

  // const totalTime =
  //   selectedCustomerBookAppointmentBarberParse?.totalBarberServiceEWT;
  const totalServices = selectedCustomerBookAppointmentServicesParse?.length;

  return (
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
            borderBottomColor: colors.queueBorder,
            borderBottomWidth: scale(1),
          }}
        >
          <View
            style={{
              width: scale(64),
              height: scale(64), // Using scale for icon containers to keep them square
              borderRadius: moderateScale(32),
              backgroundColor: "#14b8a610",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: verticalScale(16),
            }}
          >
            <CheckIcon size={moderateScale(28)} color="#14b8a6" />
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
            paddingTop: verticalScale(20),
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
                        color: "#14b8a6",
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
                      color: "#14b8a6",
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
                backgroundColor: loading ? "#94a3b8" : "#14b8a6",
                paddingVertical: verticalScale(18),
                borderRadius: moderateScale(16),
                alignItems: "center",
                shadowColor: "#14b8a6",
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
                backgroundColor: bookAppointmentLoader ? "#94a3b8" : "#14b8a6",
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
