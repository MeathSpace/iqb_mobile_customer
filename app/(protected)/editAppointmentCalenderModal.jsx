import { BASE_URL } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import * as Calendar from "expo-calendar";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
import i18n from "../../src/localization/i18n";

const editAppointmentCalenderModal = () => {
  const baseContent = i18n.t("protected.editAppointmentCalenderModal");

  const [salonAddress, setSalonAddress] = useState("");

  const getSalonLocationAddress = async () => {
    try {
      const address = await AsyncStorage.getItem("salonLocationAddress");
      return address; // can be null if not found
    } catch (error) {
      console.log("Error fetching salon address:", error);
      return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchAddress = async () => {
        const address = await getSalonLocationAddress();
        if (address) {
          setSalonAddress(address);
        }
      };

      fetchAddress();
    }, []),
  );

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

  const selectedcalenderEventIdParse = params?.calenderEventId || "";

  const { newNotification, setNewNotification, appointmentPopupType } =
    useGlobal();
  const [editAppointmentLoader, setEditAppointmentLoader] = useState(false);

  const getTotalDuration = (services) => {
    return services
      .filter((item) => item.selected)
      .reduce((total, item) => {
        return total + (item.barberServiceEWT || item.serviceEWT || 0);
      }, 0);
  };

  const updateCalendarEvent = async (
    selectedBookCalenderDateParse,
    selectedBookCalenderTimeslotParse,
    selectedBookAppointmentNoteParse,
    appointmentId,
    calenderEventId,
  ) => {
    try {
      // ✅ 1. Request Permission
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          baseContent.alertBox.alertOne.header,
          baseContent.alertBox.alertOne.subHeader,
        );
        return;
      }

      // ✅ 2. Get Calendars
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT,
      );

      let targetCalendar =
        calendars.find(
          (cal) => cal.source?.type === "com.google" && cal.allowsModifications,
        ) || calendars.find((cal) => cal.allowsModifications);

      if (!targetCalendar) {
        throw new Error(baseContent.errorStatesAndApi.googleCalenderNotFound);
      }

      // ✅ 4. Parse Date & Time safely
      const [year, month, day] = selectedBookCalenderDateParse
        .split("-")
        .map(Number);

      const [hours, minutes] = selectedBookCalenderTimeslotParse
        .split(":")
        .map(Number);

      const startDate = new Date(year, month - 1, day, hours, minutes);

      const duration = 30;
      const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

      // ✅ 5. Event Config
      const eventConfig = {
        title: `Book Appointment (Updated) - ${selectedCustomerBookAppointmentBarberParse?.name}`,
        startDate,
        endDate,
        notes: selectedBookAppointmentNoteParse
          ? selectedBookAppointmentNoteParse
          : "Booked appointment updated via app",
        location: salonAddress,
      };

      const testId = calenderEventId;

      const existingEvent = await Calendar.getEventAsync(testId);

      if (existingEvent) {
        await Calendar.updateEventAsync(testId, eventConfig);

        Alert.alert(
          baseContent.alertBox.alertTwo.header,
          baseContent.alertBox.alertTwo.subHeader,
        );

        router.replace({
          pathname: "/appointmentSuccessPage",
          params: {
            booked: false,
            edit: true,
          },
        });
      } else {
        Alert.alert(
          baseContent.alertBox.alertThree.header,
          baseContent.alertBox.alertThree.subHeader,
        );
      }
    } catch (error) {
      console.error("❌ Calendar Error:", error);
      Alert.alert(baseContent.alertBox.alertFour.header, error.message);
    }
  };

  const editAppointmentPressed = async () => {
    const appData = {
      salonId: authenticatedUser?.salonId,
      appointmentId: params?.appointmentId,
      barberId: selectedCustomerBookAppointmentBarberParse?.barberId,
      serviceId: selectedCustomerBookAppointmentServicesParse.map(
        (item) => item.serviceId,
      ),
      appointmentDate: selectedBookCalenderDateParse,
      appointmentNotes: selectedBookAppointmentNoteParse,
      startTime: selectedBookCalenderTimeslotParse,
    };

    try {
      setEditAppointmentLoader(true);

      const { data } = await axios.put(
        `${BASE_URL}/mobileRoutes/editAppointments`,
        appData,
      );

      Toast.success(data?.message);
      setEditAppointmentLoader(false);

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

      updateCalendarEvent(
        selectedBookCalenderDateParse,
        selectedBookCalenderTimeslotParse,
        selectedBookAppointmentNoteParse,
        data?.response?._id,
        String(selectedcalenderEventIdParse),
      );
    } catch (error) {
      setEditAppointmentLoader(false);
      Alert.alert(
        baseContent.alertBox.alertFive.header,
        error?.response?.data?.message,
        [{ text: baseContent.alertBox.alertFive.ok }],
      );
      console.log(
        "Error doing edit appointment ",
        error?.response?.data?.message,
      );
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

  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (appointmentPopupType?.selectServices) {
      setTotalTime(
        selectedCustomerBookAppointmentServicesParse.reduce(
          (sum, item) => sum + (Number(item.serviceEWT) * item.count || 0),
          0,
        ),
      );
    } else {
      setTotalTime(
        selectedCustomerBookAppointmentServicesParse.reduce(
          (sum, item) =>
            sum + (Number(item.barberServiceEWT) * item.count || 0),
          0,
        ),
      );
    }
  }, []);

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
              {baseContent.serviceProvider}
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
                  {totalServices}{" "}
                  {totalServices === 1
                    ? baseContent.service
                    : baseContent.services}{" "}
                  • {formatMinutesToHrMin(totalTime)}
                </CustomSecondaryText>
              </View>

              {!true && (
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
                {baseContent.date}
              </CustomSecondaryText>
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_Bd",
                  fontSize: moderateScale(15),
                }}
              >
                {/* {selectedBookCalenderDateParse
                  ? ddmmformatDate(selectedBookCalenderDateParse)
                  : ddmmformatDate(params?.isDateNotPresent?.split("T")?.[0])} */}
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
                {baseContent.time}
              </CustomSecondaryText>
              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_Bd",
                  fontSize: moderateScale(15),
                }}
              >
                {/* {selectedBookCalenderTimeslotParse
                  ? selectedBookCalenderTimeslotParse
                  : params?.isTimeSlotNotPresent?.split(" ")?.[0]} */}
                {selectedBookCalenderTimeslotParse}
              </CustomText>
            </View>
          </View>

          {/* Payment Receipt Style */}
          {false && (
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
                        color: colors.accentColor,
                      }}
                    >
                      Pay Now
                    </CustomText>
                    <CustomSecondaryText
                      style={{ fontSize: moderateScale(12) }}
                    >
                      Deposit (23 %)
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
                {baseContent.yourNote}
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
                {baseContent.cancellationPolicy.header}
              </CustomText>
            </View>
            <CustomText
              style={{
                fontSize: moderateScale(12),
                color: "#000",
                lineHeight: verticalScale(18),
              }}
            >
              {baseContent.cancellationPolicy.subHeader}
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
          {false ? (
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
                  Proceed to Payment
                </CustomText>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={editAppointmentPressed}
              disabled={editAppointmentLoader}
              style={{
                backgroundColor: editAppointmentLoader
                  ? "#94a3b8"
                  : colors.accentColor,
                paddingVertical: verticalScale(18),
                borderRadius: moderateScale(16),
                alignItems: "center",
              }}
            >
              {editAppointmentLoader ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <CustomText
                  style={{
                    color: "#fff",
                    fontFamily: "AirbnbCereal_W_Bd",
                    fontSize: moderateScale(16),
                  }}
                >
                  {baseContent.saveBooking}
                </CustomText>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => !editAppointmentLoader && router.back()}
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
      </View>
    </View>
  );
};

export default editAppointmentCalenderModal;

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
