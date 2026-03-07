import { BASE_URL } from "@/utils/api";
import { usePreventRemove, useTheme } from "@react-navigation/native";
import axios from "axios";
import { Checkbox } from "expo-checkbox";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Toast } from "toastify-react-native";
import CustomText from "../../components/CustomText";
import Skeleton from "../../components/Skeleton";
import { ArrowLeftIcon, LeftIcon, RightIcon } from "../../constants/icons";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalContext";

const editAppointmentCalender = () => {
  const { appointmentPopupType, setAppointmentPopupType } = useGlobal();

  const params = useLocalSearchParams();
  const selectedEditAppointmentData = params?.selectedAppointment
    ? JSON.parse(params?.selectedAppointment)
    : {};

  // console.log(selectedEditAppointmentData?.bookDateObject)

  const { authenticatedUser } = useAuth();

  const [salonServices, setSalonServices] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const [salonBarber, setSalonBarber] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const [maxAppointmentDays, setMaxAppointmentDays] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const [engageTimeslotsData, setEngageTimeslotsData] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const [selectedCalenderDate, setSelectedCalenderDate] = useState(
    selectedEditAppointmentData?.bookDateObject?.fullDate,
  );
  const [selectedCalenderDay, setSelectedCalenderDay] = useState(
    selectedEditAppointmentData?.bookDateObject,
  );
  const [appointmentNote, setAppointmentNote] = useState(
    selectedEditAppointmentData?.appointmentNotes,
  );
  const [selectedEngageTimeSlot, setSelectedEngageTimeSlot] = useState(
    selectedEditAppointmentData?.startTimeWithoutMeridian,
  );
  const [disableDates, setDisbaleDates] = useState([]);
  const [disableSalonDates, setDisableSalonDates] = useState([]);
  const [disableAppointmentDates, setDisableAppointmentDates] = useState([]);
  const [disableLoader, setDisableLoader] = useState(false);

  useEffect(() => {
    if (selectedCalenderDate) {
      const fetchBarberTimeSlots = async () => {
        try {
          setEngageTimeslotsData((prev) => ({ ...prev, loading: true }));

          const { data } = await axios.post(
            `${BASE_URL}/mobileRoutes/getEngageBarberTimeSlots`,
            {
              salonId: authenticatedUser?.salonId,
              barberId: selectedEditAppointmentData?.barberId,
              date: selectedCalenderDate,
            },
          );

          setEngageTimeslotsData((prev) => ({
            ...prev,
            loading: false,
            data: data?.response,
            success: true,
            error: null,
          }));
        } catch (error) {
          setEngageTimeslotsData((prev) => ({
            ...prev,
            loading: false,
            data: null,
            success: false,
            error: error,
          }));
          console.log("Error fetching timeslots ", error?.response?.data);
        }
      };

      fetchBarberTimeSlots();
    }
  }, [selectedCalenderDate]);

  useEffect(() => {
    const fetchMaxAppointmentDays = async () => {
      try {
        setMaxAppointmentDays((prev) => ({ ...prev, loading: true }));

        const { data } = await axios.post(
          `${BASE_URL}/mobileRoutes/getMaxAppointmentDays`,
          {
            salonId: authenticatedUser?.salonId,
          },
        );

        setMaxAppointmentDays((prev) => ({
          ...prev,
          loading: false,
          data: data?.response,
          success: true,
          error: null,
        }));
      } catch (error) {
        console.log(
          "Error fetching maximum appointment dates ",
          error?.response,
        );
      }
    };

    const fetchFullyBookedDates = async () => {
      try {
        setDisableLoader(true);

        const { data } = await axios.post(
          `${BASE_URL}/mobileRoutes/getFullyBookedDatesBySalonIdBarberId`,
          {
            salonId: authenticatedUser?.salonId,
            barberId: selectedEditAppointmentData?.barberId,
          },
        );

        setDisbaleDates((prev) => [...prev, ...data.response]);
        setDisableLoader(false);
      } catch (error) {
        console.log(
          "Error fetching fully booked dates ",
          error?.response?.data,
        );
        setDisableLoader(false);
      }
    };

    const fetchBarberDisableAppointmentDates = async () => {
      try {
        setDisableLoader(true);
        const { data } = await axios.post(
          `${BASE_URL}/mobileRoutes/getBarberDisabledAppointmentDates`,
          {
            salonId: authenticatedUser?.salonId,
            barberId: selectedEditAppointmentData?.barberId,
          },
        );

        setDisbaleDates((prev) => [...prev, ...data.response]);
        setDisableSalonDates(data?.salonOffDaysResponse);
        setDisableAppointmentDates(data?.barberOffDaysResponse);
        setDisableLoader(false);
      } catch (error) {
        console.log(
          "Error fetching barber disable appointment dates ",
          error?.response?.data,
        );
        setDisableLoader(false);
      }
    };

    fetchFullyBookedDates();
    fetchBarberDisableAppointmentDates();
    fetchMaxAppointmentDays();
  }, []);

  const [activeSection, setActiveSection] = useState("calendar");
  const [scrolling, setScrolling] = useState(false);

  const router = useRouter();
  const { colors } = useTheme();

  // Calender
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [dates, setDates] = useState([]);

  useEffect(() => {
    generateDatesForMonth(
      currentMonth,
      maxAppointmentDays?.data?.appointmentAdvanceDays,
    );
  }, [currentMonth, maxAppointmentDays?.data?.appointmentAdvanceDays]);

  const generateDatesForMonth = (monthMoment, rangeDays) => {
    const today = moment().startOf("day");
    const maxAllowedDate = today.clone().add(rangeDays, "days");

    let tempDates = [];

    // Loop from start of currentMonth to end of currentMonth
    const startOfMonth = monthMoment.clone().startOf("month");
    const endOfMonth = monthMoment.clone().endOf("month");

    // But cap it at maxAllowedDate
    const loopStart = moment.max(today.clone().add("day"), startOfMonth);
    const loopEnd = moment.min(endOfMonth, maxAllowedDate);

    for (
      let day = loopStart.clone();
      day.isSameOrBefore(loopEnd);
      day.add(1, "day")
    ) {
      tempDates.push({
        dayName: day.format("ddd"),
        date: day.format("DD"),
        month: day.format("MMM"),
        year: day.format("YYYY"),
        fullDate: day.format("YYYY-MM-DD"),
        slots: Math.floor(Math.random() * 10),
        bgcolor: getRandomColor(),
      });
    }

    setDates(tempDates);
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const goToPrevMonth = () => {
    setCurrentMonth((prev) => prev.clone().subtract(1, "month"));
  };

  const RANGE_DAYS = maxAppointmentDays?.data?.appointmentAdvanceDays;
  const maxAllowedDate = moment().startOf("day").add(RANGE_DAYS, "days");

  const isNextDisabled = currentMonth
    .clone()
    .add(1, "month")
    .startOf("month")
    .isAfter(maxAllowedDate);

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const nextMonth = prev.clone().add(1, "month");

      // If first day of next month is after maxAllowedDate, block it
      if (nextMonth.startOf("month").isAfter(maxAllowedDate)) {
        return prev; // no change
      }

      return nextMonth;
    });
  };

  const paddingAnim = useRef(new Animated.Value(scale(15))).current;
  const flexAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(paddingAnim, {
      toValue: scrolling ? scale(0) : scale(15),
      duration: 300,
      useNativeDriver: false, // Padding cannot use native driver
    }).start();

    Animated.timing(flexAnim, {
      toValue: scrolling ? 1 : 0,
      duration: scrolling ? 300 : 0,
      useNativeDriver: false, // layout props like flex can't use native driver
    }).start();
  }, [scrolling]);

  const continueHandler = () => {
    router.push({
      pathname: "/editAppointmentCalenderModal",
      params: {
        selectedCustomerBookAppointmentServices: JSON.stringify(
          selectedEditAppointmentData?.services,
        ),
        selectedCustomerBookAppointmentBarber: JSON.stringify({
          name: selectedEditAppointmentData?.barbername,
          barberId: selectedEditAppointmentData?.barberId,
        }),
        selectedBookCalenderTimeslot: JSON.stringify(selectedEngageTimeSlot),
        selectedBookCalenderDate: JSON.stringify(selectedCalenderDate),
        selectedBookAppointmentNote: JSON.stringify(appointmentNote),
        appointmentId: selectedEditAppointmentData?._id,
        editAppointment: true,
        isDateNotPresent: selectedEditAppointmentData?.appointmentDate,
        isTimeSlotNotPresent: selectedEditAppointmentData?.startTime,
      },
    });
  };

  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);
  const [userToggled, setUserToggled] = useState(false);

  useEffect(() => {
    if (
      selectedEditAppointmentData?.barberId &&
      selectedCalenderDay?.fullDate
    ) {
      const fetchGetCustomerToNotifyAppointmentAvailability = async () => {
        try {
          const payload = {
            customerEmail: authenticatedUser?.email,
            barberId: selectedEditAppointmentData?.barberId,
            appointmentDate: selectedCalenderDay?.fullDate,
          };

          const { data } = await axios.post(
            `${BASE_URL}/customer/getCustomerToNotifyAppointmentAvailability`,
            payload,
          );

          if (data?.response?.timeSlotsUpdate?.length > 0) {
            setIsNotifyCheck(data?.response?.timeSlotsUpdate[0]?.checkValue);
          } else {
            setIsNotifyCheck(false);
          }
        } catch (error) {
          console.log("Error in forget password ", error?.data?.message);
        } finally {
          setHasLoadedInitially(true);
        }
      };

      fetchGetCustomerToNotifyAppointmentAvailability();
    }
  }, [selectedEditAppointmentData?.barberId, selectedCalenderDay?.fullDate]);

  const [isNotifyCheck, setIsNotifyCheck] = useState(false);

  const saveCustomerToNotifyAppointmentAvailability = async () => {
    try {
      const payload = {
        salonId: authenticatedUser.salonId,
        customerEmail: authenticatedUser.email,
        appointmentDate: selectedCalenderDate,
        barberId: selectedEditAppointmentData.barberId,
        checkValue: isNotifyCheck,
      };

      const { data } = await axios.post(
        `${BASE_URL}/customer/saveCustomerToNotifyAppointmentAvailability`,
        payload,
      );

      Toast.success(data?.message);
    } catch (error) {
      Toast.error(error?.response?.data?.message);
      console.log("Error in forget password ", error);
    } finally {
      setUserToggled(false);
    }
  };

  const deleteCustomerToNotifyAppointmentAvailability = async () => {
    try {
      const payload = {
        customerEmail: authenticatedUser.email,
        appointmentDate: selectedCalenderDate,
        barberId: selectedEditAppointmentData.barberId,
      };

      const { data } = await axios.post(
        `${BASE_URL}/customer/deleteCustomerToNotifyAppointmentAvailability`,
        payload,
      );

      Toast.success(data?.message);
    } catch (error) {
      Toast.error(error?.response?.data?.message);
      console.log("Error in forget password ", error);
    } finally {
      setUserToggled(false);
    }
  };

  useEffect(() => {
    const updateNotifyCustomer = async () => {
      if (
        userToggled &&
        hasLoadedInitially &&
        engageTimeslotsData?.data?.some((item) => item.disabled === true)
      ) {
        if (isNotifyCheck) {
          await saveCustomerToNotifyAppointmentAvailability();
        } else {
          await deleteCustomerToNotifyAppointmentAvailability();
        }
      }
    };

    updateNotifyCustomer();
  }, [isNotifyCheck, userToggled]);

  const hasUnsavedChanges = true;

  usePreventRemove(hasUnsavedChanges, ({ data }) => {
    Alert.alert(
      "Confirm",
      "If you go back now, your edit appointment progress will be lost. Are you sure you want to exit?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => null,
        },
        {
          text: "OK",
          onPress: async () => {
            router.push("/appointment");
          },
        },
      ],
    );
  });

  const [step, setStep] = useState(1);

  return (
    <Animated.View style={[styles.container]}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1, gap: verticalScale(10) }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(10),
              paddingHorizontal: scale(16),
            }}
          >
            <Pressable onPress={() => router.replace("/appointment")}>
              <ArrowLeftIcon color={colors.text} size={scale(16)} />
            </Pressable>
            <CustomText
              style={{
                flex: 1,
                fontFamily: "AirbnbCereal_W_XBd",
                fontSize: scale(18),
              }}
            >
              Edit Appointment
            </CustomText>
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                borderColor: colors.queueBorder,
                borderWidth: scale(1),
                backgroundColor: colors.cardColor,
              },
            ]}
          >
            <View style={[styles.row, { alignItems: "flex-start" }]}>
              <CustomText
                style={[
                  styles.label,
                  {
                    color: colors.accentColor,
                  },
                ]}
              >
                Services
              </CustomText>

              <CustomText
                style={[
                  styles.value,
                  { flex: 1, textAlign: "right", marginLeft: scale(10) },
                ]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {selectedEditAppointmentData?.services &&
                selectedEditAppointmentData?.services?.length > 0
                  ? selectedEditAppointmentData?.services?.length > 3
                    ? `${selectedEditAppointmentData?.services
                        .slice(0, 3)
                        .map((s) => s?.serviceName)
                        .join(
                          ", ",
                        )} + ${selectedEditAppointmentData?.services?.length - 3} more`
                    : selectedEditAppointmentData?.services
                        .map((s) => s?.serviceName)
                        .join(", ")
                  : "-"}
              </CustomText>
            </View>

            {/* Divider */}
            <View
              style={[
                styles.divider,
                {
                  backgroundColor: colors.queueBorder,
                },
              ]}
            />

            {/* Barber */}
            <View style={styles.row}>
              <CustomText
                style={[
                  styles.label,
                  {
                    color: colors.accentColor,
                  },
                ]}
              >
                {authenticatedUser?.salonType === "Barber Shop"
                  ? "Barber"
                  : "Stylist"}
              </CustomText>
              <CustomText style={styles.value}>
                {selectedEditAppointmentData?.barbername || "-"}
              </CustomText>
            </View>

            {/* Divider */}
            <View
              style={[
                styles.divider,
                {
                  backgroundColor: colors.queueBorder,
                },
              ]}
            />

            {/* Date & Time */}
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <View>
                <CustomText
                  style={[
                    styles.label,
                    {
                      color: colors.accentColor,
                    },
                  ]}
                >
                  Date
                </CustomText>
                <CustomText
                  style={[
                    styles.value,
                    {
                      textAlign: "center",
                    },
                  ]}
                >
                  {selectedCalenderDate || "-"}
                </CustomText>
              </View>

              <View>
                <CustomText
                  style={[
                    styles.label,
                    {
                      color: colors.accentColor,
                    },
                  ]}
                >
                  Time
                </CustomText>
                <CustomText
                  style={[
                    styles.value,
                    {
                      textAlign: "center",
                    },
                  ]}
                >
                  {selectedEngageTimeSlot || "-"}
                </CustomText>
              </View>
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              gap: verticalScale(15),
              paddingHorizontal: scale(10),
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {activeSection === "calendar" && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      paddingVertical: verticalScale(4),
                      alignSelf: "flex-start",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: scale(0.6),
                    }}
                  >
                    <CustomText
                      style={{
                        fontSize: scale(17),
                      }}
                    >
                      {currentMonth.format("MMMM YYYY")}
                    </CustomText>
                  </View>

                  <View style={styles.navButtons}>
                    <Pressable
                      onPress={
                        currentMonth.isSame(moment(), "month")
                          ? null
                          : goToPrevMonth
                      }
                      style={[
                        styles.navButton,
                        currentMonth.isSame(moment(), "month") && {
                          opacity: 0.3,
                        }, // visually indicate disabled
                      ]}
                    >
                      <LeftIcon color={colors.accentColor} size={scale(16)} />
                    </Pressable>

                    <Pressable
                      disabled={isNextDisabled}
                      onPress={goToNextMonth}
                      style={[
                        styles.navButton,
                        isNextDisabled && { opacity: 0.3 },
                      ]}
                    >
                      <RightIcon color={colors.accentColor} size={scale(16)} />
                    </Pressable>
                  </View>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.weekContainer}
                >
                  {dates.map((day, index) => (
                    <Pressable
                      // disabled={disableLoader || disableDates?.includes(day?.fullDate)}
                      disabled={disableLoader}
                      onPress={() => {
                        if (selectedCalenderDate === day?.fullDate) {
                          setSelectedCalenderDate(null);
                          setSelectedCalenderDay(null);
                          setSelectedEngageTimeSlot("");
                        } else {
                          setSelectedCalenderDate(day?.fullDate);
                          setSelectedCalenderDay(day);
                        }
                      }}
                      key={day.fullDate}
                      style={[
                        styles.dayBox,
                        {
                          backgroundColor: disableSalonDates?.includes(
                            day?.fullDate,
                          )
                            ? colors.appointmentDisableBg
                            : disableAppointmentDates?.includes(day?.fullDate)
                              ? colors.appointmentDisableBg
                              : disableDates?.includes(day?.fullDate)
                                ? colors.appointmentDisableBg
                                : `${colors.accentColor}1A`,

                          borderColor:
                            selectedCalenderDate === day?.fullDate
                              ? colors.accentColor
                              : null,
                          borderWidth:
                            selectedCalenderDate === day?.fullDate
                              ? scale(1)
                              : null,
                        },
                      ]}
                    >
                      <CustomText
                        style={{
                          fontSize: scale(15),
                          color:
                            disableDates?.includes(day?.fullDate) && "#000",
                        }}
                      >
                        {day.dayName}
                      </CustomText>
                      <CustomText
                        style={{
                          fontSize: scale(16),
                          color: disableSalonDates?.includes(day?.fullDate)
                            ? colors.text
                            : disableAppointmentDates?.includes(day?.fullDate)
                              ? colors.text
                              : disableDates?.includes(day?.fullDate)
                                ? colors.text
                                : colors.accentColor,
                          // color: disableDates?.includes(day?.fullDate) ? "#000" : 'colors.accentColor',
                        }}
                      >
                        {day.date}
                      </CustomText>
                    </Pressable>
                  ))}
                </ScrollView>

                {!disableSalonDates?.includes(selectedCalenderDay?.fullDate) &&
                  !disableAppointmentDates?.includes(
                    selectedCalenderDay?.fullDate,
                  ) &&
                  engageTimeslotsData?.data?.some(
                    (item) => item.disabled === true,
                  ) && (
                    <View
                      style={{
                        height: verticalScale(40),
                        flexDirection: "row",
                        alignItems: "center",
                        gap: scale(10),
                      }}
                    >
                      <Checkbox
                        value={isNotifyCheck}
                        // onValueChange={setIsNotifyCheck}
                        onValueChange={(val) => {
                          setIsNotifyCheck(val);
                          setUserToggled(true); // ✅ Mark as manual user action
                        }}
                        color={isNotifyCheck ? colors.accentColor : undefined}
                        style={{
                          height: scale(16),
                          width: scale(16),
                          borderRadius: scale(3),
                        }}
                      />
                      <CustomText style={{ fontSize: scale(14) }}>
                        Notify me when there is a cancellation
                      </CustomText>
                    </View>
                  )}

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: scale(10),
                  }}
                >
                  {!selectedCalenderDate ? (
                    <View
                      style={{
                        width: "100%",
                        minHeight: verticalScale(300),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CustomText>Please select date</CustomText>
                    </View>
                  ) : engageTimeslotsData?.loading ? (
                    <>
                      <Skeleton
                        width={"31%"}
                        height={verticalScale(40)}
                        style={{
                          borderRadius: scale(8),
                        }}
                      />
                      <Skeleton
                        width={"31%"}
                        height={verticalScale(40)}
                        style={{
                          borderRadius: scale(8),
                        }}
                      />
                      <Skeleton
                        width={"31%"}
                        height={verticalScale(40)}
                        style={{
                          borderRadius: scale(8),
                        }}
                      />
                      <Skeleton
                        width={"31%"}
                        height={verticalScale(40)}
                        style={{
                          borderRadius: scale(8),
                        }}
                      />
                      <Skeleton
                        width={"31%"}
                        height={verticalScale(40)}
                        style={{
                          borderRadius: scale(8),
                        }}
                      />
                      <Skeleton
                        width={"31%"}
                        height={verticalScale(40)}
                        style={{
                          borderRadius: scale(8),
                        }}
                      />
                      <Skeleton
                        width={"31%"}
                        height={verticalScale(40)}
                        style={{
                          borderRadius: scale(8),
                        }}
                      />
                      <Skeleton
                        width={"31%"}
                        height={verticalScale(40)}
                        style={{
                          borderRadius: scale(8),
                        }}
                      />
                      <Skeleton
                        width={"31%"}
                        height={verticalScale(40)}
                        style={{
                          borderRadius: scale(8),
                        }}
                      />
                    </>
                  ) : disableSalonDates?.includes(
                      selectedCalenderDay?.fullDate,
                    ) ? (
                    <View
                      style={{
                        width: "100%",
                        minHeight: verticalScale(300),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CustomText>The salon is closed on this day.</CustomText>
                    </View>
                  ) : disableAppointmentDates?.includes(
                      selectedCalenderDay?.fullDate,
                    ) ? (
                    <View
                      style={{
                        width: "100%",
                        minHeight: verticalScale(300),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CustomText style={{ textAlign: "center" }}>
                        The selected stylist/barber is unavailable on this day.
                      </CustomText>
                    </View>
                  ) : (
                    engageTimeslotsData?.data
                      ?.filter((item) => !item?.disabled) // ✅ Only include items that are not disabled
                      ?.map((item, index) => {
                        return (
                          <Pressable
                            onPress={() => {
                              setSelectedEngageTimeSlot(item?.timeInterval);
                            }}
                            key={index}
                            style={{
                              backgroundColor: `${colors.accentColor}1A`,
                              alignSelf: "flex-start",
                              width: "31%",
                              height: verticalScale(40),
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: scale(6),
                              borderWidth:
                                selectedEngageTimeSlot === item?.timeInterval
                                  ? scale(1)
                                  : scale(0),
                              borderColor:
                                selectedEngageTimeSlot === item?.timeInterval
                                  ? colors.accentColor
                                  : null,
                            }}
                          >
                            <CustomText
                              style={{
                                color: colors.accentColor,
                                fontSize: scale(16),
                              }}
                            >
                              {item?.timeInterval}
                            </CustomText>
                          </Pressable>
                        );
                      })
                  )}
                </View>
              </>
            )}

            {activeSection === "appointmentnote" && (
              <>
                <TextInput
                  style={{
                    flexGrow: 1,
                    width: "98%",
                    minHeight: verticalScale(150),
                    padding: scale(16),
                    borderRadius: scale(4),
                    textAlignVertical: "top",
                    backgroundColor: `${colors.accentColor}1A`,
                    color: colors.text,
                    fontSize: moderateScale(16),
                  }}
                  multiline
                  placeholderTextColor={"gray"}
                  placeholder="Enter your appointment note"
                  value={appointmentNote}
                  onChangeText={(text) => setAppointmentNote(text)}
                />
                {/* <Pressable
                  onPress={() => {
                    if (addIconPressCount === 1) {
                      setScrolling(false);
                      setActiveSection("");
                      setAddIconPressCount(0);
                    }
                  }}
                  style={styles.searchButton}
                >
                  <CustomText style={{ color: "#fff" }}>Done</CustomText>
                </Pressable> */}
              </>
            )}
          </ScrollView>

          {/* ================= FOOTER ================= */}
          <View style={styles.footer}>
            <CustomText>Step {step} of 2</CustomText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(10),
              }}
            >
              {activeSection === "calendar" ? (
                <View />
              ) : (
                <Pressable
                  style={{
                    padding: scale(12),
                    backgroundColor: colors.accentColor,
                    borderRadius: scale(50),
                  }}
                  onPress={() => {
                    if (activeSection === "appointmentnote") {
                      setStep(1);
                      setActiveSection("calendar");
                    }
                  }}
                >
                  {/* <LeftIcon size={scale(12)} color="#fff" /> */}
                  <CustomText
                    style={{
                      color: "#fff",
                    }}
                  >
                    Prev
                  </CustomText>
                </Pressable>
              )}

              <Pressable
                style={{
                  padding: scale(12),
                  backgroundColor: colors.accentColor,
                  borderRadius: scale(50),
                }}
                onPress={() => {
                  if (activeSection === "calendar") {
                    setStep(2);
                    setActiveSection("appointmentnote");
                  }

                  if (activeSection === "appointmentnote") {
                    if (!selectedCalenderDate) {
                      Toast.error("Please select a date");
                      return;
                    }

                    if (!selectedEngageTimeSlot) {
                      Toast.error("Please select a timeslot");
                      return;
                    }
                    continueHandler();
                  }
                }}
              >
                {activeSection === "appointmentnote" ? (
                  <CustomText style={{ color: "#fff" }}>Finish</CustomText>
                ) : (
                  <CustomText
                    style={{
                      color: "#fff",
                    }}
                  >
                    Next
                  </CustomText>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Animated.View>
  );
};

export default editAppointmentCalender;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxOpenWrapper: {
    borderRadius: scale(20),
    height: verticalScale(300),
    padding: scale(25),
  },
  boxCloseWrapper: {
    minHeight: verticalScale(60),
    borderRadius: scale(15),
    padding: scale(25),
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(10),
  },
  clearAll: {
    textDecorationLine: "underline",
  },
  searchButton: {
    height: verticalScale(40),
    borderRadius: scale(10),
    
    paddingHorizontal: scale(25),
    justifyContent: "center",
    alignItems: "center",
  },

  serviceItem: {
    width: "100%",
    height: verticalScale(124),
    paddingVertical: verticalScale(8),
    backgroundColor: "#fff",
  },

  barberItem: {
    width: "100%",
    height: verticalScale(145),
    borderRadius: scale(8),
    paddingVertical: verticalScale(8),
    backgroundColor: "#fff",
  },

  navButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(10),
  },
  navButton: {
    backgroundColor: "#00B0901A",
    width: scale(30),
    height: scale(30),
    borderRadius: scale(25),
    justifyContent: "center",
    alignItems: "center",
  },

  weekContainer: {
    gap: scale(10),
  },
  dayBox: {
    width: scale(60),
    height: verticalScale(70),
    backgroundColor: "#00B0901A",
    borderRadius: scale(4),
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(5),
  },

  queueButton: {
    width: "40%",
     // bg-teal-500
    paddingVertical: verticalScale(12), // py-4
    borderRadius: scale(8), // rounded-xl
    alignItems: "center",
    justifyContent: "center",
  },
  queueButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },

  summaryCard: {
    padding: scale(14),
    borderRadius: scale(14),
    marginHorizontal: scale(10),
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: scale(11),
  },

  value: {
    fontSize: scale(11),
    fontFamily: "AirbnbCereal_W_Bd",
  },

  divider: {
    height: 1,
    marginVertical: scale(8),
  },
});
