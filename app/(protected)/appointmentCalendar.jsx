// import { BASE_URL } from "@/utils/api";
// import { usePreventRemove, useTheme } from "@react-navigation/native";
// import axios from "axios";
// import { Checkbox } from "expo-checkbox";
// import { Image } from "expo-image";
// import { useFocusEffect, useRouter } from "expo-router";
// import moment from "moment";
// import { useCallback, useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   View,
// } from "react-native";
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";
// import { moderateScale, scale, verticalScale } from "react-native-size-matters";
// import { Toast } from "toastify-react-native";
// import CustomText from "../../components/CustomText";
// import Skeleton from "../../components/Skeleton";
// import { ArrowLeftIcon, LeftIcon, RightIcon } from "../../constants/icons";
// import { useAuth } from "../../context/AuthContext";
// import { useGlobal } from "../../context/GlobalContext";

// const appointmentCalendar = () => {
//   const { appointmentPopupType, setAppointmentPopupType } = useGlobal();

//   // console.log(appointmentPopupType?.selectServices);

//   const [paymentSettingsLoading, setPaymentSettingsLoading] = useState(false);
//   const [paymentSettingsData, setPaymentSettingsData] = useState(null);

//   useFocusEffect(
//     useCallback(() => {
//       const getSalonPaymentSettings = async () => {
//         try {
//           setPaymentSettingsLoading(true);
//           const { data } = await axios.get(
//             `${BASE_URL}/mobileRoutes/getPaymentSettings?salonId=${authenticatedUser?.salonId}`,
//           );
//           setPaymentSettingsData(data?.response?.[1]);
//         } catch (error) {
//           console.log("Error fetching salon settings ", error);
//         } finally {
//           setPaymentSettingsLoading(false);
//         }
//       };

//       getSalonPaymentSettings();
//     }, []),
//   );

//   // console.log("paymentSettingsData ,", paymentSettingsData);

//   const { authenticatedUser, setAuthenticatedUser } = useAuth();

//   const [salonServices, setSalonServices] = useState({
//     data: null,
//     loading: false,
//     error: null,
//     success: false,
//   });

//   const [salonBarber, setSalonBarber] = useState({
//     data: null,
//     loading: false,
//     error: null,
//     success: false,
//   });

//   const [maxAppointmentDays, setMaxAppointmentDays] = useState({
//     data: null,
//     loading: false,
//     error: null,
//     success: false,
//   });

//   // console.log("maxAppointmentDays ", maxAppointmentDays?.data?.appointmentAdvanceDays)

//   const [selectCustomerServices, setSelectedCustomerServices] = useState([]);
//   const [selectedCustomerBarber, setSelectedCustomerBarber] = useState(null);
//   const [continueService, setContinueService] = useState(false);

//   useEffect(() => {
//     if (appointmentPopupType?.selectServices) {
//       const fetchSalonServices = async () => {
//         try {
//           setSalonServices((prev) => ({ ...prev, loading: true }));

//           const { data } = await axios.get(
//             `${BASE_URL}/mobileRoutes/getAllSalonServices`,
//             {
//               params: {
//                 salonId: authenticatedUser?.salonId,
//               },
//             },
//           );

//           setSalonServices((prev) => ({
//             ...prev,
//             loading: false,
//             data: data?.response?.map((item) => {
//               return { ...item, selected: false };
//             }),
//             success: true,
//             error: null,
//           }));
//         } catch (error) {
//           setSalonServices((prev) => ({
//             ...prev,
//             loading: false,
//             data: null,
//             success: false,
//             error: error,
//           }));
//           console.log("Error fetching salon Info ", error);
//         }
//       };

//       fetchSalonServices();
//     }
//   }, [authenticatedUser, appointmentPopupType?.selectServices]);

//   useEffect(() => {
//     if (
//       appointmentPopupType?.selectServices &&
//       selectCustomerServices.length > 0 &&
//       continueService
//     ) {
//       const fetchBarbersByMultipleServiceId = async () => {
//         try {
//           setSalonBarber((prev) => ({ ...prev, loading: true }));

//           const { data } = await axios.post(
//             `${BASE_URL}/mobileRoutes/bookAppointmentBarbers`,
//             {
//               salonId: authenticatedUser.salonId,
//               serviceIds: selectCustomerServices.map((item) => item.serviceId),
//             },
//           );

//           setSalonBarber((prev) => ({
//             ...prev,
//             loading: false,
//             data: data?.response,
//             success: true,
//             error: null,
//           }));
//         } catch (error) {
//           setSalonBarber((prev) => ({
//             ...prev,
//             loading: false,
//             data: null,
//             success: false,
//             error: error,
//           }));
//           console.log(
//             "Error fetching barbers by multiple service Id",
//             error?.response?.data,
//           );
//         }
//       };

//       fetchBarbersByMultipleServiceId();
//     }
//   }, [
//     authenticatedUser,
//     selectCustomerServices,
//     continueService,
//     appointmentPopupType?.selectServices,
//   ]);

//   useEffect(() => {
//     if (appointmentPopupType?.selectBarber) {
//       const fetchAppointmentBarbers = async () => {
//         try {
//           setSalonBarber((prev) => ({ ...prev, loading: true }));

//           const { data } = await axios.post(
//             `${BASE_URL}/mobileRoutes/getAppointmentBarbers`,
//             {
//               salonId: authenticatedUser.salonId,
//             },
//           );

//           setSalonBarber((prev) => ({
//             ...prev,
//             loading: false,
//             data: data?.response,
//             success: true,
//             error: null,
//           }));
//         } catch (error) {
//           setSalonBarber((prev) => ({
//             ...prev,
//             loading: false,
//             data: null,
//             success: false,
//             error: error,
//           }));
//           console.log(
//             "Error fetching barbers by salon Id",
//             error?.response?.data,
//           );
//         }
//       };

//       fetchAppointmentBarbers();
//     }
//   }, [appointmentPopupType?.selectBarber]);

//   // console.log("Customer Barber ", selectedCustomerBarber)

//   useEffect(() => {
//     if (
//       appointmentPopupType?.selectBarber &&
//       continueService &&
//       selectedCustomerBarber
//     ) {
//       const fetchServiceByBarberId = async () => {
//         try {
//           setSalonServices((prev) => ({ ...prev, loading: true }));

//           const { data } = await axios.post(
//             `${BASE_URL}/mobileRoutes/getServicesByBarberId`,
//             {
//               salonId: authenticatedUser?.salonId,
//               barberId: selectedCustomerBarber?.barberId,
//             },
//           );

//           setSalonServices((prev) => ({
//             ...prev,
//             loading: false,
//             data: data?.response?.map((item) => {
//               return { ...item, selected: false };
//             }),
//             success: true,
//             error: null,
//           }));
//         } catch (error) {
//           setSalonServices((prev) => ({
//             ...prev,
//             loading: false,
//             data: null,
//             success: false,
//             error: error,
//           }));
//           console.log("Error fetching salon Info ", error);
//         }
//       };

//       fetchServiceByBarberId();
//     }
//   }, [
//     appointmentPopupType?.selectBarber,
//     selectedCustomerBarber,
//     continueService,
//     authenticatedUser?.salonId,
//   ]);

//   const addServiceHandler = (service) => {
//     setContinueService(false);
//     const updatedSalonServices = salonServices?.data?.map((item) => {
//       return item?.serviceId === service?.serviceId
//         ? { ...service, selected: true }
//         : item;
//     });

//     setSalonServices({
//       data: updatedSalonServices,
//       loading: false,
//       error: null,
//       success: false,
//     });

//     setSelectedCustomerServices([...selectCustomerServices, service]);
//   };

//   // console.log(selectCustomerServices);

//   const removeServiceHandler = (service) => {
//     setContinueService(false);
//     const updatedSalonServices = salonServices?.data?.map((item) => {
//       return item?.serviceId === service?.serviceId
//         ? { ...service, selected: false }
//         : item;
//     });

//     setSalonServices({
//       data: updatedSalonServices,
//       loading: false,
//       error: null,
//       success: false,
//     });

//     setSelectedCustomerServices((prev) => {
//       const filteredArray = prev.filter((item) => {
//         return item?.serviceId !== service?.serviceId;
//       });

//       return filteredArray;
//     });
//   };

//   const [engageTimeslotsData, setEngageTimeslotsData] = useState({
//     data: null,
//     loading: false,
//     error: null,
//     success: false,
//   });

//   const [selectedCalenderDate, setSelectedCalenderDate] = useState("");
//   const [selectedCalenderDay, setSelectedCalenderDay] = useState("");
//   const [appointmentNote, setAppointmentNote] = useState("");
//   const [selectedEngageTimeSlot, setSelectedEngageTimeSlot] = useState("");
//   const [disableDates, setDisbaleDates] = useState([]);
//   const [disableSalonDates, setDisableSalonDates] = useState([]);
//   const [disableAppointmentDates, setDisableAppointmentDates] = useState([]);
//   const [disableLoader, setDisableLoader] = useState(false);

//   useEffect(() => {
//     if (selectedCalenderDate && selectedCustomerBarber) {
//       const fetchBarberTimeSlots = async () => {
//         try {
//           setEngageTimeslotsData((prev) => ({ ...prev, loading: true }));

//           const { data } = await axios.post(
//             `${BASE_URL}/mobileRoutes/getEngageBarberTimeSlots`,
//             {
//               salonId: selectedCustomerBarber?.salonId,
//               barberId: selectedCustomerBarber?.barberId,
//               date: selectedCalenderDate,
//             },
//           );

//           setEngageTimeslotsData((prev) => ({
//             ...prev,
//             loading: false,
//             data: data?.response,
//             success: true,
//             error: null,
//           }));
//         } catch (error) {
//           setEngageTimeslotsData((prev) => ({
//             ...prev,
//             loading: false,
//             data: null,
//             success: false,
//             error: error,
//           }));
//           console.log("Error fetching timeslots ", error?.response?.data);
//         }
//       };

//       fetchBarberTimeSlots();
//     }
//   }, [selectedCalenderDate, selectedCustomerBarber]);

//   useEffect(() => {
//     if (selectedCustomerBarber) {
//       const fetchMaxAppointmentDays = async () => {
//         try {
//           setMaxAppointmentDays((prev) => ({ ...prev, loading: true }));

//           const { data } = await axios.post(
//             `${BASE_URL}/mobileRoutes/getMaxAppointmentDays`,
//             {
//               salonId: selectedCustomerBarber?.salonId,
//             },
//           );

//           setMaxAppointmentDays((prev) => ({
//             ...prev,
//             loading: false,
//             data: data?.response,
//             success: true,
//             error: null,
//           }));

//           // console.log("Get fully booked dates ", data)
//         } catch (error) {
//           console.log(
//             "Error fetching maximum appointment dates ",
//             error?.response,
//           );
//         }
//       };

//       const fetchFullyBookedDates = async () => {
//         try {
//           setDisableLoader(true);

//           const { data } = await axios.post(
//             `${BASE_URL}/mobileRoutes/getFullyBookedDatesBySalonIdBarberId`,
//             {
//               salonId: selectedCustomerBarber?.salonId,
//               barberId: selectedCustomerBarber?.barberId,
//             },
//           );

//           setDisbaleDates((prev) => [...prev, ...data.response]);
//           setDisableLoader(false);

//           // console.log("Get fully booked dates ", data)
//         } catch (error) {
//           console.log(
//             "Error fetching fully booked dates ",
//             error?.response?.data,
//           );
//           setDisableLoader(false);
//         }
//       };

//       const fetchBarberDisableAppointmentDates = async () => {
//         try {
//           setDisableLoader(true);
//           const { data } = await axios.post(
//             `${BASE_URL}/mobileRoutes/getBarberDisabledAppointmentDates`,
//             {
//               salonId: selectedCustomerBarber?.salonId,
//               barberId: selectedCustomerBarber?.barberId,
//             },
//           );

//           setDisbaleDates((prev) => [...prev, ...data.response]);
//           setDisableSalonDates(data?.salonOffDaysResponse);
//           setDisableAppointmentDates(data?.barberOffDaysResponse);
//           setDisableLoader(false);

//           // console.log("Get barber disable appointment dates ", data)
//         } catch (error) {
//           console.log(
//             "Error fetching barber disable appointment dates ",
//             error?.response?.data,
//           );
//           setDisableLoader(false);
//         }
//       };

//       fetchFullyBookedDates();
//       fetchBarberDisableAppointmentDates();
//       fetchMaxAppointmentDays();
//     }
//   }, [selectedCustomerBarber]);

//   useEffect(() => {
//     if (appointmentPopupType?.selectServices) {
//       setActiveSection("servicesFirst");
//     } else {
//       setActiveSection("barberFirst");
//     }
//   }, [appointmentPopupType]);

//   const [activeSection, setActiveSection] = useState("");
//   const [scrolling, setScrolling] = useState(false);
//   const [addIconPressCount, setAddIconPressCount] = useState(0);

//   // servicesFirst
//   // barberSecond
//   // calendar
//   // appointmentnote

//   // barberFirst
//   // servicesSecond

//   const handleScrollStart = (section) => {
//     setActiveSection(section);
//     setScrolling(true);
//     setAddIconPressCount(1);
//   };

//   const router = useRouter();
//   const { colors } = useTheme();

//   // Calender
//   const [currentMonth, setCurrentMonth] = useState(moment());
//   const [dates, setDates] = useState([]);

//   useEffect(() => {
//     if (selectedCustomerBarber) {
//       generateDatesForMonth(
//         currentMonth,
//         maxAppointmentDays?.data?.appointmentAdvanceDays,
//       );
//     }
//   }, [
//     currentMonth,
//     maxAppointmentDays?.data?.appointmentAdvanceDays,
//     selectedCustomerBarber,
//     appointmentPopupType?.selectServices,
//   ]);

//   const generateDatesForMonth = (monthMoment, rangeDays) => {
//     const today = moment().startOf("day");
//     const maxAllowedDate = today.clone().add(rangeDays, "days");

//     let tempDates = [];

//     // Loop from start of currentMonth to end of currentMonth
//     const startOfMonth = monthMoment.clone().startOf("month");
//     const endOfMonth = monthMoment.clone().endOf("month");

//     // But cap it at maxAllowedDate
//     const loopStart = moment.max(today.clone().add("day"), startOfMonth);
//     const loopEnd = moment.min(endOfMonth, maxAllowedDate);

//     for (
//       let day = loopStart.clone();
//       day.isSameOrBefore(loopEnd);
//       day.add(1, "day")
//     ) {
//       tempDates.push({
//         dayName: day.format("ddd"),
//         date: day.format("DD"),
//         month: day.format("MMM"),
//         year: day.format("YYYY"),
//         fullDate: day.format("YYYY-MM-DD"),
//         slots: Math.floor(Math.random() * 10),
//         bgcolor: getRandomColor(),
//       });
//     }

//     setDates(tempDates);
//   };

//   const getRandomColor = () => {
//     const letters = "0123456789ABCDEF";
//     let color = "#";
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   };

//   const goToPrevMonth = () => {
//     setCurrentMonth((prev) => prev.clone().subtract(1, "month"));
//   };

//   const RANGE_DAYS = maxAppointmentDays?.data?.appointmentAdvanceDays;
//   const maxAllowedDate = moment().startOf("day").add(RANGE_DAYS, "days");

//   const isNextDisabled = currentMonth
//     .clone()
//     .add(1, "month")
//     .startOf("month")
//     .isAfter(maxAllowedDate);

//   const goToNextMonth = () => {
//     setCurrentMonth((prev) => {
//       const nextMonth = prev.clone().add(1, "month");

//       // If first day of next month is after maxAllowedDate, block it
//       if (nextMonth.startOf("month").isAfter(maxAllowedDate)) {
//         return prev; // no change
//       }

//       return nextMonth;
//     });
//   };

//   const paddingAnim = useRef(new Animated.Value(scale(15))).current;
//   const flexAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.timing(paddingAnim, {
//       toValue: scrolling ? scale(0) : scale(15),
//       duration: 300,
//       useNativeDriver: false, // Padding cannot use native driver
//     }).start();

//     Animated.timing(flexAnim, {
//       toValue: scrolling ? 1 : 0,
//       duration: scrolling ? 300 : 0,
//       useNativeDriver: false, // layout props like flex can't use native driver
//     }).start();
//   }, [scrolling]);

//   const continueHandler = () => {
//     if (selectCustomerServices.length === 0) {
//       Toast.error("Please select a service");
//       return;
//     } else if (!selectedCustomerBarber) {
//       Toast.error("Please select a stylist");
//       return;
//     } else if (!selectedEngageTimeSlot) {
//       Toast.error("Please select a timeslot");
//       return;
//     } else if (!selectedCalenderDate) {
//       Toast.error("Please select a date");
//       return;
//     }

//     router.push({
//       pathname: "/appointmentCalenderModal",
//       params: {
//         selectedCustomerBookAppointmentServices: JSON.stringify(
//           selectCustomerServices,
//         ),
//         selectedCustomerBookAppointmentBarber: JSON.stringify(
//           selectedCustomerBarber,
//         ),
//         selectedBookCalenderTimeslot: JSON.stringify(selectedEngageTimeSlot),
//         selectedBookCalenderDate: JSON.stringify(selectedCalenderDate),
//         selectedBookAppointmentNote: JSON.stringify(appointmentNote),
//         bookAppointment: true,
//         paymentSettingsData: JSON.stringify(paymentSettingsData),
//       },
//     });
//   };

//   function formatMinutesToHrMin(totalMinutes) {
//     const hours = Math.floor(totalMinutes / 60);
//     const mins = totalMinutes % 60;

//     if (hours > 0 && mins > 0) return `${hours}hr ${mins}min`;
//     if (hours > 0) return `${hours}hr`;
//     return `${mins}min`;
//   }

//   const [hasLoadedInitially, setHasLoadedInitially] = useState(false);
//   const [userToggled, setUserToggled] = useState(false);

//   useEffect(() => {
//     if (selectedCustomerBarber?.barberId && selectedCalenderDay?.fullDate) {
//       const fetchGetCustomerToNotifyAppointmentAvailability = async () => {
//         try {
//           const payload = {
//             customerEmail: authenticatedUser?.email,
//             barberId: selectedCustomerBarber?.barberId,
//             appointmentDate: selectedCalenderDay?.fullDate,
//           };

//           const { data } = await axios.post(
//             `${BASE_URL}/customer/getCustomerToNotifyAppointmentAvailability`,
//             payload,
//           );

//           if (data?.response?.timeSlotsUpdate?.length > 0) {
//             setIsNotifyCheck(data?.response?.timeSlotsUpdate[0]?.checkValue);
//           } else {
//             setIsNotifyCheck(false);
//           }
//         } catch (error) {
//           console.log("Error in forget password ", error?.data?.message);
//         } finally {
//           setHasLoadedInitially(true);
//         }
//       };

//       fetchGetCustomerToNotifyAppointmentAvailability();
//     }
//   }, [selectedCustomerBarber?.barberId, selectedCalenderDay?.fullDate]);

//   const [isNotifyCheck, setIsNotifyCheck] = useState(false);

//   const saveCustomerToNotifyAppointmentAvailability = async () => {
//     try {
//       const payload = {
//         salonId: authenticatedUser.salonId,
//         customerEmail: authenticatedUser.email,
//         appointmentDate: selectedCalenderDate,
//         barberId: selectedCustomerBarber.barberId,
//         checkValue: isNotifyCheck,
//       };

//       const { data } = await axios.post(
//         `${BASE_URL}/customer/saveCustomerToNotifyAppointmentAvailability`,
//         payload,
//       );

//       Toast.success(data?.message);
//     } catch (error) {
//       Toast.error(error?.response?.data?.message);
//       console.log("Error in forget password ", error);
//     } finally {
//       setUserToggled(false);
//     }
//   };

//   const deleteCustomerToNotifyAppointmentAvailability = async () => {
//     try {
//       const payload = {
//         customerEmail: authenticatedUser.email,
//         appointmentDate: selectedCalenderDate,
//         barberId: selectedCustomerBarber.barberId,
//       };

//       const { data } = await axios.post(
//         `${BASE_URL}/customer/deleteCustomerToNotifyAppointmentAvailability`,
//         payload,
//       );

//       Toast.success(data?.message);
//     } catch (error) {
//       Toast.error(error?.response?.data?.message);
//       console.log("Error in forget password ", error);
//     } finally {
//       setUserToggled(false);
//     }
//   };

//   useEffect(() => {
//     const updateNotifyCustomer = async () => {
//       if (
//         userToggled &&
//         hasLoadedInitially &&
//         engageTimeslotsData?.data?.some((item) => item.disabled === true)
//       ) {
//         if (isNotifyCheck) {
//           await saveCustomerToNotifyAppointmentAvailability();
//         } else {
//           await deleteCustomerToNotifyAppointmentAvailability();
//         }
//       }
//     };

//     updateNotifyCustomer();
//   }, [isNotifyCheck, userToggled]);

//   const hasUnsavedChanges = true;

//   usePreventRemove(hasUnsavedChanges, ({ data }) => {
//     // The action is still passed, but we're choosing not to dispatch it,
//     // effectively making "going back" impossible through these means.
//     // Alert.alert(
//     //   "Confirm",
//     //   "If you go back now, your booking appointment progress will be lost. Are you sure you want to exit?",
//     //   [
//     //     {
//     //       text: "Cancel",
//     //       style: "cancel",
//     //       onPress: () => null,
//     //     },
//     //     {
//     //       text: "OK",
//     //       onPress: async () => {
//     //         setAppointmentPopupType({
//     //           selectServices: false,
//     //           selectBarber: false,
//     //         });
//     //         router.push("/appointment");
//     //       },
//     //     },
//     //   ],
//     // );

//     setAppointmentPopupType({
//       selectServices: false,
//       selectBarber: false,
//     });
//     router.push("/appointment");
//   });

//   const renderSection = (key, title) => {
//     const isActive = activeSection === key;

//     if (scrolling && !isActive) return null;

//     return isActive ? (
//       <Animated.View
//         style={[
//           styles.boxOpenWrapper,
//           {
//             flex: flexAnim,
//             backgroundColor: colors.cardColor,
//             borderWidth: scale(1),
//             borderColor: colors.queueBorder,
//           },
//         ]}
//       >
//         <ScrollView
//           style={{ flex: 1 }}
//           contentContainerStyle={{
//             gap: verticalScale(15),
//             paddingBottom: scale(30),
//           }}
//           onTouchStart={() => handleScrollStart(key)}
//           showsVerticalScrollIndicator={false}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             {activeSection !== "servicesFirst" && (
//               <Pressable
//                 // onPress={() => {
//                 //   if (appointmentPopupType?.selectServices) {
//                 //     setSelectedCustomerServices([]);
//                 //     const updatedSalonServices = salonServices?.data?.map(
//                 //       (item) => {
//                 //         return { ...item, selected: false };
//                 //       },
//                 //     );
//                 //     setSalonServices({
//                 //       data: updatedSalonServices,
//                 //       loading: false,
//                 //       error: null,
//                 //       success: false,
//                 //     });
//                 //     setSalonBarber({
//                 //       data: null,
//                 //       loading: false,
//                 //       error: null,
//                 //       success: false,
//                 //     });
//                 //   } else {
//                 //     setSelectedCustomerServices([]);
//                 //     setSalonServices({
//                 //       data: null,
//                 //       loading: false,
//                 //       error: null,
//                 //       success: false,
//                 //     });
//                 //     setSelectedCustomerBarber(null);
//                 //   }

//                 //   setDisbaleDates([]);
//                 //   setDates([]);
//                 //   setEngageTimeslotsData({
//                 //     data: null,
//                 //     loading: false,
//                 //     error: null,
//                 //     success: false,
//                 //   });
//                 //   setSelectedCustomerBarber(null);
//                 //   setSelectedCalenderDate("");
//                 //   setScrolling(false);
//                 //   setActiveSection("");
//                 //   setAddIconPressCount(0);
//                 //   setAppointmentNote("");
//                 //   setSelectedEngageTimeSlot("");
//                 // }}
//                 // style={{
//                 //   flexDirection: "row",
//                 //   alignItems: "center",
//                 //   gap: scale(5),
//                 // }}
//                 onPress={() => {
//                   if (appointmentPopupType?.selectServices) {
//                     if (activeSection === "appointmentnote") {
//                       setActiveSection("calendar");
//                       return;
//                     }
//                     if (activeSection === "calendar") {
//                       setActiveSection("barberSecond");
//                       return;
//                     }
//                     if (activeSection === "barberSecond") {
//                       setActiveSection("servicesFirst");
//                       return;
//                     }
//                   }
//                 }}
//               >
//                 <ArrowLeftIcon color={colors.text} />
//                 <CustomText
//                   style={{
//                     fontSize: scale(16),
//                     fontFamily: "AirbnbCereal_W_Blk",
//                   }}
//                 >
//                   {title}
//                 </CustomText>
//               </Pressable>
//             )}
//           </View>

//           {activeSection === "servicesFirst" &&
//             (salonServices?.loading
//               ? [0, 1, 2, 3, 4, 5].map((_, index) => {
//                   return (
//                     <Skeleton
//                       key={index}
//                       height={verticalScale(150)}
//                       borderRadius={scale(10)}
//                     />
//                   );
//                 })
//               : salonServices?.data?.map((item, index) => {
//                   return (
//                     <Pressable
//                       key={item?.serviceId}
//                       style={{
//                         borderRadius: scale(12),
//                         backgroundColor: colors.background,
//                         padding: scale(14),
//                         gap: verticalScale(12),
//                         borderWidth: 1,
//                         borderColor: colors.cardBorder,
//                       }}
//                     >
//                       <View
//                         style={{
//                           flexDirection: "row",
//                           justifyContent: "space-between",
//                           alignItems: "flex-start",
//                         }}
//                       >
//                         {/* LEFT SIDE */}
//                         <View
//                           style={{
//                             flexDirection: "row",
//                             alignItems: "flex-start",
//                             gap: scale(12),
//                             width: "75%",
//                           }}
//                         >
//                           <View
//                             style={{ gap: verticalScale(8), flexShrink: 1 }}
//                           >
//                             {/* SERVICE NAME */}
//                             <CustomText
//                               style={{
//                                 fontSize: moderateScale(15),
//                                 fontFamily: "AirbnbCereal_W_Bd",
//                                 // color: "#0F172A",
//                               }}
//                             >
//                               {item?.serviceName}
//                             </CustomText>

//                             {/* CATEGORY BADGE */}
//                             <Pressable
//                               style={{
//                                 paddingHorizontal: scale(10),
//                                 paddingVertical: verticalScale(3),
//                                 backgroundColor: "#CCF2E8",
//                                 borderRadius: scale(6),
//                                 alignSelf: "flex-start",
//                               }}
//                             >
//                               <CustomText
//                                 style={{
//                                   fontSize: moderateScale(11),
//                                   fontFamily: "AirbnbCereal_W_Md",
//                                   color: "#0D9488",
//                                 }}
//                               >
//                                 {item?.serviceCategoryName}
//                               </CustomText>
//                             </Pressable>

//                             {/* PRICE */}
//                             <CustomText
//                               style={{
//                                 fontFamily: "AirbnbCereal_W_Blk",
//                                 fontSize: scale(20),
//                                 color: "#0D9488",
//                                 marginTop: verticalScale(4),
//                               }}
//                             >
//                               {authenticatedUser?.currency} {item?.servicePrice}
//                             </CustomText>
//                           </View>
//                         </View>

//                         {/* RIGHT SIDE BUTTON */}
//                         {item?.selected ? (
//                           <Pressable
//                             onPress={() => removeServiceHandler(item)}
//                             style={{
//                               height: verticalScale(28),
//                               paddingHorizontal: scale(8),
//                               backgroundColor: "#DC2626",
//                               borderRadius: scale(6),
//                               justifyContent: "center",
//                               alignItems: "center",
//                             }}
//                           >
//                             <CustomText
//                               style={{ fontSize: scale(12), color: "#fff" }}
//                             >
//                               Remove
//                             </CustomText>
//                           </Pressable>
//                         ) : (
//                           <Pressable
//                             onPress={() => addServiceHandler(item)}
//                             style={{
//                               height: verticalScale(28),
//                               paddingHorizontal: scale(12),
//                               backgroundColor: "#000",
//                               borderRadius: scale(6),
//                               justifyContent: "center",
//                               alignItems: "center",
//                             }}
//                           >
//                             <CustomText
//                               style={{ fontSize: scale(12), color: "#fff" }}
//                             >
//                               Add
//                             </CustomText>
//                           </Pressable>
//                         )}
//                       </View>
//                     </Pressable>
//                   );
//                 }))}

//           {activeSection === "barberSecond" &&
//             (salonBarber?.loading ? (
//               [0, 1, 2, 3, 4, 5].map((_, index) => {
//                 return (
//                   <Skeleton
//                     key={index}
//                     height={verticalScale(60)}
//                     borderRadius={scale(10)}
//                   />
//                 );
//               })
//             ) : salonBarber?.data?.length > 0 ? (
//               salonBarber?.data?.map((item, index) => {
//                 return (
//                   <Pressable
//                     key={item?.barberId}
//                     style={{
//                       flexDirection: "row",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       backgroundColor: "#00B0901A",
//                       borderRadius: scale(10),
//                       padding: scale(10),
//                     }}
//                     onPress={() => {
//                       setSelectedCustomerBarber(item);
//                       setScrolling(false);
//                       setActiveSection("calendar");
//                       setAddIconPressCount(0);
//                       setSelectedCalenderDate("");
//                       setDisbaleDates([]);
//                     }}
//                   >
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         gap: scale(10),
//                       }}
//                     >
//                       <Image
//                         style={{
//                           height: scale(50),
//                           width: scale(50),
//                           borderRadius: scale(40),
//                         }}
//                         source={{ uri: item?.profile?.[0]?.url }}
//                         contentFit="cover"
//                         transition={300}
//                       />

//                       <View>
//                         <CustomText
//                           style={{
//                             fontSize: scale(14),
//                           }}
//                         >
//                           {item?.name}
//                         </CustomText>
//                       </View>
//                     </View>
//                   </Pressable>
//                 );
//               })
//             ) : (
//               <View
//                 style={{
//                   paddingTop: verticalScale(20),
//                 }}
//               >
//                 <CustomText>
//                   No{" "}
//                   {authenticatedUser?.salonType === "Barber Shop"
//                     ? "barbers"
//                     : "stylists"}{" "}
//                   available
//                 </CustomText>
//               </View>
//             ))}

//           {activeSection === "barberFirst" &&
//             (salonBarber?.loading ? (
//               [0, 1, 2, 3, 4, 5].map((_, index) => {
//                 return (
//                   <Skeleton
//                     key={index}
//                     height={verticalScale(60)}
//                     borderRadius={scale(10)}
//                   />
//                 );
//               })
//             ) : salonBarber?.data?.length > 0 ? (
//               salonBarber?.data?.map((item, index) => {
//                 return (
//                   <Pressable
//                     key={item?.barberId}
//                     style={{
//                       flexDirection: "row",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                       backgroundColor: "#00B0901A",
//                       borderRadius: scale(10),
//                       padding: scale(10),
//                     }}
//                     onPress={() => {
//                       setSelectedCustomerBarber(item);
//                       setSelectedCustomerServices([]);
//                       setScrolling(false);
//                       setActiveSection("servicesSecond");
//                       setAddIconPressCount(0);
//                       setSelectedCalenderDate("");
//                       setDisbaleDates([]);
//                       setContinueService(true);
//                     }}
//                   >
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         gap: scale(10),
//                       }}
//                     >
//                       <Image
//                         style={{
//                           height: scale(50),
//                           width: scale(50),
//                           borderRadius: scale(40),
//                         }}
//                         source={{ uri: item?.profile?.[0]?.url }}
//                         contentFit="cover"
//                         transition={300}
//                       />

//                       <View>
//                         <CustomText
//                           style={{
//                             fontSize: scale(14),
//                           }}
//                         >
//                           {item?.name}
//                         </CustomText>
//                       </View>
//                     </View>
//                   </Pressable>
//                 );
//               })
//             ) : (
//               <View
//                 style={{
//                   paddingTop: verticalScale(20),
//                 }}
//               >
//                 <CustomText>
//                   No{" "}
//                   {authenticatedUser?.salonType === "Barber Shop"
//                     ? "barbers"
//                     : "stylists"}{" "}
//                   available
//                 </CustomText>
//               </View>
//             ))}

//           {activeSection === "servicesSecond" &&
//             (salonServices?.loading ? (
//               [0, 1, 2, 3, 4, 5].map((_, index) => {
//                 return (
//                   <Skeleton
//                     key={index}
//                     height={verticalScale(150)}
//                     borderRadius={scale(10)}
//                   />
//                 );
//               })
//             ) : salonServices?.data?.length > 0 ? (
//               salonServices?.data?.map((item, index) => {
//                 return (
//                   <Pressable
//                     key={item?.serviceId}
//                     style={{
//                       borderRadius: scale(12),
//                       backgroundColor: colors.background,
//                       padding: scale(14),
//                       gap: verticalScale(12),
//                       borderWidth: 1,
//                       borderColor: colors.cardBorder,
//                     }}
//                   >
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         justifyContent: "space-between",
//                         alignItems: "flex-start",
//                       }}
//                     >
//                       {/* LEFT SIDE */}
//                       <View
//                         style={{
//                           flexDirection: "row",
//                           alignItems: "flex-start",
//                           gap: scale(12),
//                           width: "75%",
//                         }}
//                       >
//                         <View style={{ gap: verticalScale(8), flexShrink: 1 }}>
//                           {/* SERVICE NAME */}
//                           <CustomText
//                             style={{
//                               fontSize: moderateScale(15),
//                               fontFamily: "AirbnbCereal_W_Bd",
//                               // color: "#0F172A",
//                             }}
//                           >
//                             {item?.serviceName}
//                           </CustomText>

//                           {/* CATEGORY BADGE */}
//                           <Pressable
//                             style={{
//                               paddingHorizontal: scale(10),
//                               paddingVertical: verticalScale(3),
//                               backgroundColor: "#CCF2E8",
//                               borderRadius: scale(6),
//                               alignSelf: "flex-start",
//                             }}
//                           >
//                             <CustomText
//                               style={{
//                                 fontSize: moderateScale(11),
//                                 fontFamily: "AirbnbCereal_W_Md",
//                                 color: "#0D9488",
//                               }}
//                             >
//                               {item?.serviceCategoryName}
//                             </CustomText>
//                           </Pressable>

//                           {/* PRICE */}
//                           <CustomText
//                             style={{
//                               fontFamily: "AirbnbCereal_W_Blk",
//                               fontSize: scale(20),
//                               color: "#0D9488",
//                               marginTop: verticalScale(4),
//                             }}
//                           >
//                             {authenticatedUser?.currency} {item?.servicePrice}
//                           </CustomText>
//                         </View>
//                       </View>

//                       {/* RIGHT SIDE BUTTON */}
//                       {item?.selected ? (
//                         <Pressable
//                           onPress={() => removeServiceHandler(item)}
//                           style={{
//                             height: verticalScale(28),
//                             paddingHorizontal: scale(8),
//                             backgroundColor: "#DC2626",
//                             borderRadius: scale(6),
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <CustomText
//                             style={{ fontSize: scale(12), color: "#fff" }}
//                           >
//                             Remove
//                           </CustomText>
//                         </Pressable>
//                       ) : (
//                         <Pressable
//                           onPress={() => addServiceHandler(item)}
//                           style={{
//                             height: verticalScale(28),
//                             paddingHorizontal: scale(12),
//                             backgroundColor: "#000",
//                             borderRadius: scale(6),
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <CustomText
//                             style={{ fontSize: scale(12), color: "#fff" }}
//                           >
//                             Add
//                           </CustomText>
//                         </Pressable>
//                       )}
//                     </View>
//                   </Pressable>
//                 );
//               })
//             ) : (
//               <View
//                 style={{
//                   paddingTop: verticalScale(20),
//                 }}
//               >
//                 <CustomText>No services available</CustomText>
//               </View>
//             ))}

//           {activeSection === "calendar" && (
//             <>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <View
//                   style={{
//                     paddingVertical: verticalScale(4),
//                     alignSelf: "flex-start",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     borderRadius: scale(0.6),
//                   }}
//                 >
//                   <CustomText
//                     style={{
//                       fontSize: scale(17),
//                     }}
//                   >
//                     {currentMonth.format("MMMM YYYY")}
//                   </CustomText>
//                 </View>

//                 <View style={styles.navButtons}>
//                   <Pressable
//                     onPress={
//                       currentMonth.isSame(moment(), "month")
//                         ? null
//                         : goToPrevMonth
//                     }
//                     style={[
//                       styles.navButton,
//                       currentMonth.isSame(moment(), "month") && {
//                         opacity: 0.3,
//                       }, // visually indicate disabled
//                     ]}
//                   >
//                     <LeftIcon color={"#14b8a6"} size={scale(16)} />
//                   </Pressable>
//                   <Pressable
//                     disabled={isNextDisabled}
//                     onPress={goToNextMonth}
//                     style={[
//                       styles.navButton,
//                       isNextDisabled && { opacity: 0.3 },
//                     ]}
//                   >
//                     <RightIcon color={"#14b8a6"} size={scale(16)} />
//                   </Pressable>
//                 </View>
//               </View>

//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.weekContainer}
//               >
//                 {dates.map((day, index) => (
//                   <Pressable
//                     // disabled={disableLoader || disableDates?.includes(day?.fullDate)}
//                     disabled={disableLoader}
//                     onPress={() => {
//                       setSelectedCalenderDate(day?.fullDate);
//                       setSelectedCalenderDay(day);
//                     }}
//                     key={day.fullDate}
//                     style={[
//                       styles.dayBox,
//                       {
//                         // backgroundColor: disableDates?.includes(day?.fullDate) && "#e5e5e5",
//                         backgroundColor: disableSalonDates?.includes(
//                           day?.fullDate,
//                         )
//                           ? colors.appointmentDisableBg
//                           : disableAppointmentDates?.includes(day?.fullDate)
//                             ? colors.appointmentDisableBg
//                             : disableDates?.includes(day?.fullDate)
//                               ? colors.appointmentDisableBg
//                               : "#00B0901A",

//                         borderColor:
//                           selectedCalenderDate === day?.fullDate
//                             ? "#0BA3AD"
//                             : null,
//                         borderWidth:
//                           selectedCalenderDate === day?.fullDate
//                             ? scale(1)
//                             : null,
//                       },
//                     ]}
//                   >
//                     <CustomText
//                       style={{
//                         fontSize: scale(15),
//                         color:
//                           disableDates?.includes(day?.fullDate) && colors.text,
//                       }}
//                     >
//                       {day.dayName}
//                     </CustomText>
//                     <CustomText
//                       style={{
//                         fontSize: scale(16),
//                         color: disableSalonDates?.includes(day?.fullDate)
//                           ? colors.text
//                           : disableAppointmentDates?.includes(day?.fullDate)
//                             ? colors.text
//                             : disableDates?.includes(day?.fullDate)
//                               ? colors.text
//                               : "#14b8a6",
//                       }}
//                     >
//                       {day.date}
//                     </CustomText>
//                   </Pressable>
//                 ))}
//               </ScrollView>

//               {!disableSalonDates?.includes(selectedCalenderDay?.fullDate) &&
//                 !disableAppointmentDates?.includes(
//                   selectedCalenderDay?.fullDate,
//                 ) &&
//                 engageTimeslotsData?.data?.some(
//                   (item) => item.disabled === true,
//                 ) && (
//                   <View
//                     style={{
//                       height: verticalScale(40),
//                       flexDirection: "row",
//                       alignItems: "center",
//                       gap: scale(10),
//                     }}
//                   >
//                     <Checkbox
//                       value={isNotifyCheck}
//                       // onValueChange={setIsNotifyCheck}
//                       onValueChange={(val) => {
//                         setIsNotifyCheck(val);
//                         setUserToggled(true); // ✅ Mark as manual user action
//                       }}
//                       color={isNotifyCheck ? "#00B090" : undefined}
//                       style={{
//                         height: scale(16),
//                         width: scale(16),
//                         borderRadius: scale(3),
//                       }}
//                     />
//                     <CustomText style={{ fontSize: scale(14) }}>
//                       Notify me when there is a cancellation
//                     </CustomText>
//                   </View>
//                 )}

//               <View
//                 style={{
//                   flex: 1,
//                   flexDirection: "row",
//                   flexWrap: "wrap",
//                   gap: scale(10),
//                 }}
//               >
//                 {!selectedCustomerBarber ? (
//                   <View
//                     style={{
//                       width: "100%",
//                       minHeight: verticalScale(300),
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <CustomText>Please select barber/stylist</CustomText>
//                   </View>
//                 ) : !selectedCalenderDate ? (
//                   <View
//                     style={{
//                       width: "100%",
//                       minHeight: verticalScale(300),
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <CustomText>Please select date</CustomText>
//                   </View>
//                 ) : engageTimeslotsData?.loading ? (
//                   <>
//                     <Skeleton
//                       width={scrolling ? "31%" : "48%"}
//                       height={verticalScale(40)}
//                       style={{
//                         borderRadius: scale(8),
//                       }}
//                     />
//                     <Skeleton
//                       width={scrolling ? "31%" : "48%"}
//                       height={verticalScale(40)}
//                       style={{
//                         borderRadius: scale(8),
//                       }}
//                     />
//                     <Skeleton
//                       width={scrolling ? "31%" : "48%"}
//                       height={verticalScale(40)}
//                       style={{
//                         borderRadius: scale(8),
//                       }}
//                     />
//                     <Skeleton
//                       width={scrolling ? "31%" : "48%"}
//                       height={verticalScale(40)}
//                       style={{
//                         borderRadius: scale(8),
//                       }}
//                     />
//                     <Skeleton
//                       width={scrolling ? "31%" : "48%"}
//                       height={verticalScale(40)}
//                       style={{
//                         borderRadius: scale(8),
//                       }}
//                     />
//                     <Skeleton
//                       width={scrolling ? "31%" : "48%"}
//                       height={verticalScale(40)}
//                       style={{
//                         borderRadius: scale(8),
//                       }}
//                     />
//                     <Skeleton
//                       width={scrolling ? "31%" : "48%"}
//                       height={verticalScale(40)}
//                       style={{
//                         borderRadius: scale(8),
//                       }}
//                     />
//                     <Skeleton
//                       width={scrolling ? "31%" : "48%"}
//                       height={verticalScale(40)}
//                       style={{
//                         borderRadius: scale(8),
//                       }}
//                     />
//                     <Skeleton
//                       width={scrolling ? "31%" : "48%"}
//                       height={verticalScale(40)}
//                       style={{
//                         borderRadius: scale(8),
//                       }}
//                     />
//                   </>
//                 ) : disableSalonDates?.includes(
//                     selectedCalenderDay?.fullDate,
//                   ) ? (
//                   <View
//                     style={{
//                       width: "100%",
//                       minHeight: verticalScale(300),
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <CustomText>The salon is closed on this day.</CustomText>
//                   </View>
//                 ) : disableAppointmentDates?.includes(
//                     selectedCalenderDay?.fullDate,
//                   ) ? (
//                   <View
//                     style={{
//                       width: "100%",
//                       minHeight: verticalScale(300),
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <CustomText style={{ textAlign: "center" }}>
//                       The selected stylist/barber is unavailable on this day.
//                     </CustomText>
//                   </View>
//                 ) : (
//                   engageTimeslotsData?.data
//                     ?.filter((item) => !item?.disabled) // ✅ Only include items that are not disabled
//                     ?.map((item, index) => {
//                       return (
//                         <Pressable
//                           onPress={() => {
//                             if (addIconPressCount === 1) {
//                               setScrolling(false);
//                               setActiveSection("appointmentnote");
//                               setAddIconPressCount(0);
//                               setSelectedEngageTimeSlot(item?.timeInterval);
//                             }
//                           }}
//                           key={index}
//                           style={{
//                             backgroundColor: "#00B0901A",
//                             alignSelf: "flex-start",
//                             width: scrolling ? "31%" : "48%",
//                             height: verticalScale(40),
//                             justifyContent: "center",
//                             alignItems: "center",
//                             borderRadius: scale(6),
//                           }}
//                         >
//                           <CustomText
//                             style={{
//                               color: "#14b8a6",
//                               fontSize: scale(16),
//                             }}
//                           >
//                             {item?.timeInterval}
//                           </CustomText>
//                         </Pressable>
//                       );
//                     })
//                 )}
//               </View>
//             </>
//           )}

//           {activeSection === "appointmentnote" && (
//             <>
//               <TextInput
//                 style={{
//                   flexGrow: 1,
//                   width: "98%",
//                   minHeight: verticalScale(150),
//                   padding: scale(16),
//                   borderRadius: scale(8),
//                   textAlignVertical: "top",
//                   backgroundColor: "#00B0901A",
//                   color: colors.text,
//                   fontSize: moderateScale(16),
//                 }}
//                 multiline
//                 placeholderTextColor={"gray"}
//                 placeholder="Enter your appointment note"
//                 value={appointmentNote}
//                 onChangeText={(text) => setAppointmentNote(text)}
//               />
//               <Pressable
//                 onPress={() => {
//                   if (addIconPressCount === 1) {
//                     // setScrolling(false);
//                     // setActiveSection("");
//                     // setAddIconPressCount(0);
//                   }
//                 }}
//                 style={styles.searchButton}
//               >
//                 <CustomText style={{ color: "#fff" }}>Done</CustomText>
//               </Pressable>
//             </>
//           )}
//         </ScrollView>

//         {scrolling &&
//           (activeSection === "servicesFirst" ||
//             activeSection === "servicesSecond") &&
//           selectCustomerServices.length > 0 && (
//             <View
//               style={{
//                 width: "100%",
//                 borderTopColor: "#D2D2D2",
//                 borderTopWidth: scale(0.5),
//                 flexDirection: "row",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 paddingVertical: verticalScale(10),
//                 marginBottom: -verticalScale(15),
//               }}
//             >
//               <Pressable
//                 // onPress={() => {
//                 // setScrolling(false);
//                 // if (activeSection === "servicesFirst") {
//                 //   setContinueService(true);
//                 //   setActiveSection("barberSecond");
//                 // } else {
//                 //   setContinueService(false);
//                 //   setActiveSection("calendar");
//                 // }

//                 //   setAddIconPressCount(0);
//                 // }}
//                 onPress={() => {
//                   setScrolling(false);
//                   if (activeSection === "servicesFirst") {
//                     setContinueService(true);
//                     setActiveSection("barberSecond");
//                   } else {
//                     setContinueService(false);
//                     setActiveSection("calendar");
//                   }
//                 }}
//                 style={{
//                   height: verticalScale(40),
//                   flex: 1,
//                   backgroundColor: "#14b8a6",
//                   borderRadius: scale(6),
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <CustomText
//                   style={{
//                     color: "#fff",
//                     fontSize: scale(16),
//                   }}
//                 >
//                   Continue
//                 </CustomText>
//               </Pressable>
//             </View>
//           )}
//       </Animated.View>
//     ) : (
//       <>
//         {title === "Choose Services" ? (
//           <Pressable
//             style={[
//               styles.boxCloseWrapper,
//               {
//                 backgroundColor: colors.cardColor,
//                 borderWidth: scale(1),
//                 borderColor: colors.queueBorder,
//                 flexDirection: "row",
//                 justifyContent: "flex-start",
//               },
//             ]}
//             onPress={() => {
//               setActiveSection(key);
//             }}
//           >
//             {selectCustomerServices?.length > 0 ? (
//               <CustomText
//                 numberOfLines={1}
//                 ellipsizeMode="tail"
//                 style={{ flexShrink: 1 }}
//               >
//                 Services: {selectCustomerServices?.[0]?.serviceName}
//                 {selectCustomerServices?.length > 1
//                   ? ` + ${selectCustomerServices.length - 1} more`
//                   : ""}
//               </CustomText>
//             ) : (
//               <CustomText>{title}</CustomText>
//             )}
//           </Pressable>
//         ) : title ===
//           `Choose ${
//             authenticatedUser?.salonType === "Barber Shop"
//               ? "Barber"
//               : "Stylist"
//           }` ? (
//           <Pressable
//             style={[
//               styles.boxCloseWrapper,
//               {
//                 backgroundColor: colors.cardColor,
//                 borderWidth: scale(1),
//                 borderColor: colors.queueBorder,
//               },
//             ]}
//             onPress={() => setActiveSection(key)}
//           >
//             {selectedCustomerBarber?.name ? (
//               <CustomText>Barber: {selectedCustomerBarber?.name}</CustomText>
//             ) : (
//               <CustomText>{title}</CustomText>
//             )}
//           </Pressable>
//         ) : title === "Choose Date" ? (
//           <Pressable
//             style={[
//               styles.boxCloseWrapper,
//               {
//                 backgroundColor: colors.cardColor,
//                 borderWidth: scale(1),
//                 borderColor: colors.queueBorder,
//               },
//             ]}
//             onPress={() => {
//               setActiveSection(key);
//             }}
//           >
//             {selectedEngageTimeSlot ? (
//               <CustomText>
//                 Date: {selectedEngageTimeSlot} · {selectedCalenderDay?.dayName},{" "}
//                 {selectedCalenderDay?.date} {selectedCalenderDay?.month}{" "}
//                 {selectedCalenderDay?.year}
//               </CustomText>
//             ) : (
//               <CustomText>{title}</CustomText>
//             )}
//           </Pressable>
//         ) : (
//           <Pressable
//             style={[
//               styles.boxCloseWrapper,
//               {
//                 backgroundColor: colors.cardColor,
//                 borderWidth: scale(1),
//                 borderColor: colors.queueBorder,
//               },
//             ]}
//             onPress={() => setActiveSection(key)}
//           >
//             <CustomText>
//               {title} {"(Optional)"}
//             </CustomText>
//           </Pressable>
//         )}
//       </>
//     );
//   };

//   const insets = useSafeAreaInsets();

//   return (
//     <Animated.View
//       style={[
//         styles.container,
//         {
//           paddingHorizontal: paddingAnim,
//         },
//       ]}
//     >
//       <SafeAreaView style={{ flex: 1 }}>
//         <KeyboardAvoidingView
//           style={{ flex: 1 }}
//           behavior={Platform.OS === "ios" ? "padding" : undefined}
//         >
//           {/* Header */}
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               height: verticalScale(40),
//               gap: scale(10),
//             }}
//           >
//             <Pressable onPress={() => router.replace("/appointment")}>
//               <ArrowLeftIcon color={colors.text} />
//             </Pressable>
//             <CustomText
//               style={{
//                 flex: 1,
//                 fontFamily: "AirbnbCereal_W_XBd",
//                 fontSize: scale(20),
//               }}
//             >
//               Book Appointment
//             </CustomText>
//           </View>

//           <View style={{ flex: 1, gap: verticalScale(15) }}>
//             {activeSection === "servicesFirst" &&
//               renderSection("servicesFirst", "Choose Services")}

//             {activeSection === "barberSecond" &&
//               renderSection(
//                 "barberSecond",
//                 `Choose ${
//                   authenticatedUser?.salonType === "Barber Shop"
//                     ? "Barber"
//                     : "Stylist"
//                 }`,
//                 [
//                   { id: 1 },
//                   { id: 2 },
//                   { id: 3 },
//                   { id: 4 },
//                   { id: 5 },
//                   { id: 6 },
//                   { id: 7 },
//                   { id: 8 },
//                   { id: 9 },
//                 ],
//               )}

//             {activeSection === "calendar" &&
//               renderSection("calendar", "Choose Date", "")}

//             {activeSection === "appointmentnote" &&
//               renderSection("appointmentnote", "Appointment Note", "")}

//             {/* {appointmentPopupType?.selectServices ? (
//               <>
//                 {renderSection("servicesFirst", "Choose Services", [
//                   { id: 1 },
//                   { id: 2 },
//                   { id: 3 },
//                   { id: 4 },
//                   { id: 5 },
//                   { id: 6 },
//                   { id: 7 },
//                   { id: 8 },
//                   { id: 9 },
//                 ])}
//                 {renderSection(
//                   "barberSecond",
//                   `Choose ${
//                     authenticatedUser?.salonType === "Barber Shop"
//                       ? "Barber"
//                       : "Stylist"
//                   }`,
//                   [
//                     { id: 1 },
//                     { id: 2 },
//                     { id: 3 },
//                     { id: 4 },
//                     { id: 5 },
//                     { id: 6 },
//                     { id: 7 },
//                     { id: 8 },
//                     { id: 9 },
//                   ],
//                 )}
//               </>
//             ) : (
//               <>
//                 {renderSection(
//                   "barberFirst",
//                   `Choose ${
//                     authenticatedUser?.salonType === "Barber Shop"
//                       ? "Barber"
//                       : "Stylist"
//                   }`,
//                   [
//                     { id: 1 },
//                     { id: 2 },
//                     { id: 3 },
//                     { id: 4 },
//                     { id: 5 },
//                     { id: 6 },
//                     { id: 7 },
//                     { id: 8 },
//                     { id: 9 },
//                   ],
//                 )}
//                 {renderSection("servicesSecond", "Choose Services", [
//                   { id: 1 },
//                   { id: 2 },
//                   { id: 3 },
//                   { id: 4 },
//                   { id: 5 },
//                   { id: 6 },
//                   { id: 7 },
//                   { id: 8 },
//                   { id: 9 },
//                 ])}
//               </>
//             )}

//             {renderSection("calendar", "Choose Date", "")}
//             {renderSection("appointmentnote", "Appointment Note", "")} */}
//           </View>

//           {!scrolling && (
//             <View style={styles.footer}>
//               <View />
//               <Pressable
//                 onPress={continueHandler}
//                 disabled={paymentSettingsLoading}
//                 style={styles.searchButton}
//               >
//                 <CustomText style={{ color: "#fff" }}>Confirm</CustomText>
//               </Pressable>
//             </View>
//           )}
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </Animated.View>
//   );
// };

// export default appointmentCalendar;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   boxOpenWrapper: {
//     borderRadius: scale(20),
//     height: verticalScale(300),
//     padding: scale(20),
//   },
//   boxCloseWrapper: {
//     minHeight: verticalScale(60),
//     borderRadius: scale(15),
//     padding: scale(25),
//     justifyContent: "center",
//   },
//   footer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   clearAll: {
//     textDecorationLine: "underline",
//   },
//   searchButton: {
//     height: verticalScale(40),
//     borderRadius: scale(10),
//     backgroundColor: "#14b8a6",
//     paddingHorizontal: scale(25),
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   serviceItem: {
//     width: "100%",
//     height: verticalScale(124),
//     paddingVertical: verticalScale(8),
//     backgroundColor: "#fff",
//   },

//   barberItem: {
//     width: "100%",
//     height: verticalScale(145),
//     borderRadius: scale(8),
//     paddingVertical: verticalScale(8),
//     backgroundColor: "#fff",
//   },

//   navButtons: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: scale(10),
//   },
//   navButton: {
//     backgroundColor: "#00B0901A",
//     width: scale(30),
//     height: scale(30),
//     borderRadius: scale(25),
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   weekContainer: {
//     gap: scale(10),
//   },
//   dayBox: {
//     width: scale(60),
//     height: verticalScale(70),
//     backgroundColor: "#00B0901A",
//     borderRadius: scale(4),
//     alignItems: "center",
//     justifyContent: "center",
//     gap: verticalScale(5),
//   },

//   queueButton: {
//     width: "40%",
//     backgroundColor: "#14b8a6", // bg-teal-500
//     paddingVertical: verticalScale(12), // py-4
//     borderRadius: scale(8), // rounded-xl
//     marginBottom: verticalScale(15), // mb-6
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   queueButtonText: {
//     color: "#fff", // text-white
//     fontFamily: "AirbnbCereal_W_XBd",
//     fontSize: scale(16),
//   },
// });

import { BASE_URL } from "@/utils/api";
import { usePreventRemove, useTheme } from "@react-navigation/native";
import axios from "axios";
import { Checkbox } from "expo-checkbox";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Toast } from "toastify-react-native";
import CustomText from "../../components/CustomText";
import Skeleton from "../../components/Skeleton";
import { ArrowLeftIcon, LeftIcon, RightIcon } from "../../constants/icons";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalContext";

const appointmentCalendar = () => {
  const { appointmentPopupType, setAppointmentPopupType } = useGlobal();

  // console.log(appointmentPopupType?.selectServices);

  const [paymentSettingsLoading, setPaymentSettingsLoading] = useState(false);
  const [paymentSettingsData, setPaymentSettingsData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const getSalonPaymentSettings = async () => {
        try {
          setPaymentSettingsLoading(true);
          const { data } = await axios.get(
            `${BASE_URL}/mobileRoutes/getPaymentSettings?salonId=${authenticatedUser?.salonId}`,
          );
          setPaymentSettingsData(data?.response?.[1]);
        } catch (error) {
          console.log("Error fetching salon settings ", error);
        } finally {
          setPaymentSettingsLoading(false);
        }
      };

      getSalonPaymentSettings();
    }, []),
  );

  // console.log("paymentSettingsData ,", paymentSettingsData);

  const { authenticatedUser, setAuthenticatedUser } = useAuth();

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

  // console.log("maxAppointmentDays ", maxAppointmentDays?.data?.appointmentAdvanceDays)

  const [selectCustomerServices, setSelectedCustomerServices] = useState([]);
  const [selectedCustomerBarber, setSelectedCustomerBarber] = useState(null);
  const [continueService, setContinueService] = useState(false);

  useEffect(() => {
    if (appointmentPopupType?.selectServices) {
      const fetchSalonServices = async () => {
        try {
          setSalonServices((prev) => ({ ...prev, loading: true }));

          const { data } = await axios.get(
            `${BASE_URL}/mobileRoutes/getAllSalonServices`,
            {
              params: {
                salonId: authenticatedUser?.salonId,
              },
            },
          );

          setSalonServices((prev) => ({
            ...prev,
            loading: false,
            data: data?.response?.map((item) => {
              return { ...item, selected: false };
            }),
            success: true,
            error: null,
          }));
        } catch (error) {
          setSalonServices((prev) => ({
            ...prev,
            loading: false,
            data: null,
            success: false,
            error: error,
          }));
          console.log("Error fetching salon Info ", error);
        }
      };

      fetchSalonServices();
    }
  }, [authenticatedUser, appointmentPopupType?.selectServices]);

  useEffect(() => {
    if (
      appointmentPopupType?.selectServices &&
      selectCustomerServices.length > 0
      // && continueService
    ) {
      const fetchBarbersByMultipleServiceId = async () => {
        try {
          setSalonBarber((prev) => ({ ...prev, loading: true }));

          const { data } = await axios.post(
            `${BASE_URL}/mobileRoutes/bookAppointmentBarbers`,
            {
              salonId: authenticatedUser.salonId,
              serviceIds: selectCustomerServices.map((item) => item.serviceId),
            },
          );

          setSalonBarber((prev) => ({
            ...prev,
            loading: false,
            data: data?.response,
            success: true,
            error: null,
          }));
        } catch (error) {
          setSalonBarber((prev) => ({
            ...prev,
            loading: false,
            data: null,
            success: false,
            error: error,
          }));
          console.log(
            "Error fetching barbers by multiple service Id",
            error?.response?.data,
          );
        }
      };

      fetchBarbersByMultipleServiceId();
    }
  }, [
    authenticatedUser,
    selectCustomerServices?.length,
    // continueService,
    appointmentPopupType?.selectServices,
  ]);

  // Second Flow

  useEffect(() => {
    if (appointmentPopupType?.selectBarber) {
      const fetchAppointmentBarbers = async () => {
        try {
          setSalonBarber((prev) => ({ ...prev, loading: true }));

          const { data } = await axios.post(
            `${BASE_URL}/mobileRoutes/getAppointmentBarbers`,
            {
              salonId: authenticatedUser.salonId,
            },
          );

          setSalonBarber((prev) => ({
            ...prev,
            loading: false,
            data: data?.response,
            success: true,
            error: null,
          }));
        } catch (error) {
          setSalonBarber((prev) => ({
            ...prev,
            loading: false,
            data: null,
            success: false,
            error: error,
          }));
          console.log(
            "Error fetching barbers by salon Id",
            error?.response?.data,
          );
        }
      };

      fetchAppointmentBarbers();
    }
  }, [appointmentPopupType?.selectBarber]);

  // console.log("Customer Barber ", selectedCustomerBarber)

  useEffect(() => {
    if (
      appointmentPopupType?.selectBarber &&
      // continueService &&
      selectedCustomerBarber
    ) {
      const fetchServiceByBarberId = async () => {
        try {
          setSalonServices((prev) => ({ ...prev, loading: true }));

          const { data } = await axios.post(
            `${BASE_URL}/mobileRoutes/getServicesByBarberId`,
            {
              salonId: authenticatedUser?.salonId,
              barberId: selectedCustomerBarber?.barberId,
            },
          );

          setSalonServices((prev) => ({
            ...prev,
            loading: false,
            data: data?.response?.map((item) => {
              return { ...item, selected: false };
            }),
            success: true,
            error: null,
          }));
        } catch (error) {
          setSalonServices((prev) => ({
            ...prev,
            loading: false,
            data: null,
            success: false,
            error: error,
          }));
          console.log("Error fetching salon Info ", error);
        }
      };

      fetchServiceByBarberId();
    }
  }, [
    appointmentPopupType?.selectBarber,
    selectedCustomerBarber,
    // continueService,
    authenticatedUser?.salonId,
  ]);

  const addServiceHandler = (service) => {
    setContinueService(false);
    const updatedSalonServices = salonServices?.data?.map((item) => {
      return item?.serviceId === service?.serviceId
        ? { ...service, selected: true }
        : item;
    });

    setSalonServices({
      data: updatedSalonServices,
      loading: false,
      error: null,
      success: false,
    });

    setSelectedCustomerServices([...selectCustomerServices, service]);
  };

  // console.log(selectCustomerServices);

  const removeServiceHandler = (service) => {
    setContinueService(false);
    const updatedSalonServices = salonServices?.data?.map((item) => {
      return item?.serviceId === service?.serviceId
        ? { ...service, selected: false }
        : item;
    });

    setSalonServices({
      data: updatedSalonServices,
      loading: false,
      error: null,
      success: false,
    });

    setSelectedCustomerServices((prev) => {
      const filteredArray = prev.filter((item) => {
        return item?.serviceId !== service?.serviceId;
      });

      return filteredArray;
    });
  };

  const [engageTimeslotsData, setEngageTimeslotsData] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const [selectedCalenderDate, setSelectedCalenderDate] = useState("");
  const [selectedCalenderDay, setSelectedCalenderDay] = useState("");
  const [appointmentNote, setAppointmentNote] = useState("");
  const [selectedEngageTimeSlot, setSelectedEngageTimeSlot] = useState("");
  const [disableDates, setDisbaleDates] = useState([]);
  const [disableSalonDates, setDisableSalonDates] = useState([]);
  const [disableAppointmentDates, setDisableAppointmentDates] = useState([]);
  const [disableLoader, setDisableLoader] = useState(false);

  useEffect(() => {
    if (selectedCalenderDate && selectedCustomerBarber) {
      const fetchBarberTimeSlots = async () => {
        try {
          setEngageTimeslotsData((prev) => ({ ...prev, loading: true }));

          const { data } = await axios.post(
            `${BASE_URL}/mobileRoutes/getEngageBarberTimeSlots`,
            {
              salonId: selectedCustomerBarber?.salonId,
              barberId: selectedCustomerBarber?.barberId,
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
  }, [selectedCalenderDate, selectedCustomerBarber]);

  useEffect(() => {
    if (selectedCustomerBarber) {
      const fetchMaxAppointmentDays = async () => {
        try {
          setMaxAppointmentDays((prev) => ({ ...prev, loading: true }));

          const { data } = await axios.post(
            `${BASE_URL}/mobileRoutes/getMaxAppointmentDays`,
            {
              salonId: selectedCustomerBarber?.salonId,
            },
          );

          setMaxAppointmentDays((prev) => ({
            ...prev,
            loading: false,
            data: data?.response,
            success: true,
            error: null,
          }));

          // console.log("Get fully booked dates ", data)
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
              salonId: selectedCustomerBarber?.salonId,
              barberId: selectedCustomerBarber?.barberId,
            },
          );

          setDisbaleDates((prev) => [...prev, ...data.response]);
          setDisableLoader(false);

          // console.log("Get fully booked dates ", data)
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
              salonId: selectedCustomerBarber?.salonId,
              barberId: selectedCustomerBarber?.barberId,
            },
          );

          setDisbaleDates((prev) => [...prev, ...data.response]);
          setDisableSalonDates(data?.salonOffDaysResponse);
          setDisableAppointmentDates(data?.barberOffDaysResponse);
          setDisableLoader(false);

          // console.log("Get barber disable appointment dates ", data)
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
    }
  }, [selectedCustomerBarber]);

  useEffect(() => {
    if (appointmentPopupType?.selectServices) {
      setActiveSection("servicesFirst");
    } else {
      setActiveSection("barberFirst");
    }
  }, [appointmentPopupType]);

  const [activeSection, setActiveSection] = useState("");
  const [scrolling, setScrolling] = useState(false);
  const [addIconPressCount, setAddIconPressCount] = useState(0);

  // servicesFirst
  // barberSecond
  // calendar
  // appointmentnote

  // barberFirst
  // servicesSecond

  const handleScrollStart = (section) => {
    setActiveSection(section);
    setScrolling(true);
    setAddIconPressCount(1);
  };

  const router = useRouter();
  const { colors } = useTheme();

  // Calender
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [dates, setDates] = useState([]);

  useEffect(() => {
    if (selectedCustomerBarber) {
      generateDatesForMonth(
        currentMonth,
        maxAppointmentDays?.data?.appointmentAdvanceDays,
      );
    }
  }, [
    currentMonth,
    maxAppointmentDays?.data?.appointmentAdvanceDays,
    selectedCustomerBarber,
    appointmentPopupType?.selectServices,
  ]);

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
    if (selectCustomerServices.length === 0) {
      Toast.error("Please select a service");
      return;
    } else if (!selectedCustomerBarber) {
      Toast.error("Please select a stylist");
      return;
    } else if (!selectedEngageTimeSlot) {
      Toast.error("Please select a timeslot");
      return;
    } else if (!selectedCalenderDate) {
      Toast.error("Please select a date");
      return;
    }

    router.push({
      pathname: "/appointmentCalenderModal",
      params: {
        selectedCustomerBookAppointmentServices: JSON.stringify(
          selectCustomerServices,
        ),
        selectedCustomerBookAppointmentBarber: JSON.stringify(
          selectedCustomerBarber,
        ),
        selectedBookCalenderTimeslot: JSON.stringify(selectedEngageTimeSlot),
        selectedBookCalenderDate: JSON.stringify(selectedCalenderDate),
        selectedBookAppointmentNote: JSON.stringify(appointmentNote),
        bookAppointment: true,
        paymentSettingsData: JSON.stringify(paymentSettingsData),
      },
    });
  };

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) return `${hours}hr ${mins}min`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}min`;
  }

  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);
  const [userToggled, setUserToggled] = useState(false);

  useEffect(() => {
    if (selectedCustomerBarber?.barberId && selectedCalenderDay?.fullDate) {
      const fetchGetCustomerToNotifyAppointmentAvailability = async () => {
        try {
          const payload = {
            customerEmail: authenticatedUser?.email,
            barberId: selectedCustomerBarber?.barberId,
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
  }, [selectedCustomerBarber?.barberId, selectedCalenderDay?.fullDate]);

  const [isNotifyCheck, setIsNotifyCheck] = useState(false);

  const saveCustomerToNotifyAppointmentAvailability = async () => {
    try {
      const payload = {
        salonId: authenticatedUser.salonId,
        customerEmail: authenticatedUser.email,
        appointmentDate: selectedCalenderDate,
        barberId: selectedCustomerBarber.barberId,
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
        barberId: selectedCustomerBarber.barberId,
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
    // The action is still passed, but we're choosing not to dispatch it,
    // effectively making "going back" impossible through these means.
    Alert.alert(
      "Confirm",
      "If you go back now, your booking appointment progress will be lost. Are you sure you want to exit?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => null,
        },
        {
          text: "OK",
          onPress: async () => {
            setAppointmentPopupType({
              selectServices: false,
              selectBarber: false,
            });
            router.push("/appointment");
          },
        },
      ],
    );

    // setAppointmentPopupType({
    //   selectServices: false,
    //   selectBarber: false,
    // });
    // router.push("/appointment");
  });

  const [step, setStep] = useState(1);

  const renderSection = (key, title) => {
    const isActive = activeSection === key;

    if (scrolling && !isActive) return null;

    return isActive ? (
      <Animated.View
        style={[
          styles.boxOpenWrapper,
          {
            flex: flexAnim,
            backgroundColor: colors.cardColor,
            borderWidth: scale(1),
            borderColor: colors.queueBorder,
          },
        ]}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            gap: verticalScale(15),
            paddingBottom: scale(30),
          }}
          onTouchStart={() => handleScrollStart(key)}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {activeSection !== "servicesFirst" && (
              <Pressable
                // onPress={() => {
                //   if (appointmentPopupType?.selectServices) {
                //     setSelectedCustomerServices([]);
                //     const updatedSalonServices = salonServices?.data?.map(
                //       (item) => {
                //         return { ...item, selected: false };
                //       },
                //     );
                //     setSalonServices({
                //       data: updatedSalonServices,
                //       loading: false,
                //       error: null,
                //       success: false,
                //     });
                //     setSalonBarber({
                //       data: null,
                //       loading: false,
                //       error: null,
                //       success: false,
                //     });
                //   } else {
                //     setSelectedCustomerServices([]);
                //     setSalonServices({
                //       data: null,
                //       loading: false,
                //       error: null,
                //       success: false,
                //     });
                //     setSelectedCustomerBarber(null);
                //   }

                //   setDisbaleDates([]);
                //   setDates([]);
                //   setEngageTimeslotsData({
                //     data: null,
                //     loading: false,
                //     error: null,
                //     success: false,
                //   });
                //   setSelectedCustomerBarber(null);
                //   setSelectedCalenderDate("");
                //   setScrolling(false);
                //   setActiveSection("");
                //   setAddIconPressCount(0);
                //   setAppointmentNote("");
                //   setSelectedEngageTimeSlot("");
                // }}
                // style={{
                //   flexDirection: "row",
                //   alignItems: "center",
                //   gap: scale(5),
                // }}
                onPress={() => {
                  if (appointmentPopupType?.selectServices) {
                    if (activeSection === "appointmentnote") {
                      setActiveSection("calendar");
                      return;
                    }
                    if (activeSection === "calendar") {
                      setActiveSection("barberSecond");
                      return;
                    }
                    if (activeSection === "barberSecond") {
                      setActiveSection("servicesFirst");
                      return;
                    }
                  }
                }}
              >
                <ArrowLeftIcon color={colors.text} />
                <CustomText
                  style={{
                    fontSize: scale(16),
                    fontFamily: "AirbnbCereal_W_Blk",
                  }}
                >
                  {title}
                </CustomText>
              </Pressable>
            )}
          </View>

          {activeSection === "servicesFirst" &&
            (salonServices?.loading
              ? [0, 1, 2, 3, 4, 5].map((_, index) => {
                  return (
                    <Skeleton
                      key={index}
                      height={verticalScale(150)}
                      borderRadius={scale(10)}
                    />
                  );
                })
              : salonServices?.data?.map((item, index) => {
                  return (
                    <Pressable
                      key={item?.serviceId}
                      style={{
                        borderRadius: scale(12),
                        backgroundColor: colors.background,
                        padding: scale(14),
                        gap: verticalScale(12),
                        borderWidth: 1,
                        borderColor: colors.cardBorder,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        {/* LEFT SIDE */}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            gap: scale(12),
                            width: "75%",
                          }}
                        >
                          <View
                            style={{ gap: verticalScale(8), flexShrink: 1 }}
                          >
                            {/* SERVICE NAME */}
                            <CustomText
                              style={{
                                fontSize: moderateScale(15),
                                fontFamily: "AirbnbCereal_W_Bd",
                                // color: "#0F172A",
                              }}
                            >
                              {item?.serviceName}
                            </CustomText>

                            {/* CATEGORY BADGE */}
                            <Pressable
                              style={{
                                paddingHorizontal: scale(10),
                                paddingVertical: verticalScale(3),
                                backgroundColor: "#CCF2E8",
                                borderRadius: scale(6),
                                alignSelf: "flex-start",
                              }}
                            >
                              <CustomText
                                style={{
                                  fontSize: moderateScale(11),
                                  fontFamily: "AirbnbCereal_W_Md",
                                  color: "#0D9488",
                                }}
                              >
                                {item?.serviceCategoryName}
                              </CustomText>
                            </Pressable>

                            {/* PRICE */}
                            <CustomText
                              style={{
                                fontFamily: "AirbnbCereal_W_Blk",
                                fontSize: scale(20),
                                color: "#0D9488",
                                marginTop: verticalScale(4),
                              }}
                            >
                              {authenticatedUser?.currency} {item?.servicePrice}
                            </CustomText>
                          </View>
                        </View>

                        {/* RIGHT SIDE BUTTON */}
                        {item?.selected ? (
                          <Pressable
                            onPress={() => removeServiceHandler(item)}
                            style={{
                              height: verticalScale(28),
                              paddingHorizontal: scale(8),
                              backgroundColor: "#DC2626",
                              borderRadius: scale(6),
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <CustomText
                              style={{ fontSize: scale(12), color: "#fff" }}
                            >
                              Remove
                            </CustomText>
                          </Pressable>
                        ) : (
                          <Pressable
                            onPress={() => addServiceHandler(item)}
                            style={{
                              height: verticalScale(28),
                              paddingHorizontal: scale(12),
                              backgroundColor: "#000",
                              borderRadius: scale(6),
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <CustomText
                              style={{ fontSize: scale(12), color: "#fff" }}
                            >
                              Add
                            </CustomText>
                          </Pressable>
                        )}
                      </View>
                    </Pressable>
                  );
                }))}

          {activeSection === "barberSecond" &&
            (salonBarber?.loading ? (
              [0, 1, 2, 3, 4, 5].map((_, index) => {
                return (
                  <Skeleton
                    key={index}
                    height={verticalScale(60)}
                    borderRadius={scale(10)}
                  />
                );
              })
            ) : salonBarber?.data?.length > 0 ? (
              salonBarber?.data?.map((item, index) => {
                return (
                  <Pressable
                    key={item?.barberId}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#00B0901A",
                      borderRadius: scale(10),
                      padding: scale(10),
                    }}
                    onPress={() => {
                      setSelectedCustomerBarber(item);
                      setScrolling(false);
                      setActiveSection("calendar");
                      setAddIconPressCount(0);
                      setSelectedCalenderDate("");
                      setDisbaleDates([]);
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: scale(10),
                      }}
                    >
                      <Image
                        style={{
                          height: scale(50),
                          width: scale(50),
                          borderRadius: scale(40),
                        }}
                        source={{ uri: item?.profile?.[0]?.url }}
                        contentFit="cover"
                        transition={300}
                      />

                      <View>
                        <CustomText
                          style={{
                            fontSize: scale(14),
                          }}
                        >
                          {item?.name}
                        </CustomText>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <View
                style={{
                  paddingTop: verticalScale(20),
                }}
              >
                <CustomText>
                  No{" "}
                  {authenticatedUser?.salonType === "Barber Shop"
                    ? "barbers"
                    : "stylists"}{" "}
                  available
                </CustomText>
              </View>
            ))}

          {activeSection === "barberFirst" &&
            (salonBarber?.loading ? (
              [0, 1, 2, 3, 4, 5].map((_, index) => {
                return (
                  <Skeleton
                    key={index}
                    height={verticalScale(60)}
                    borderRadius={scale(10)}
                  />
                );
              })
            ) : salonBarber?.data?.length > 0 ? (
              salonBarber?.data?.map((item, index) => {
                return (
                  <Pressable
                    key={item?.barberId}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#00B0901A",
                      borderRadius: scale(10),
                      padding: scale(10),
                    }}
                    onPress={() => {
                      setSelectedCustomerBarber(item);
                      setSelectedCustomerServices([]);
                      setScrolling(false);
                      setActiveSection("servicesSecond");
                      setAddIconPressCount(0);
                      setSelectedCalenderDate("");
                      setDisbaleDates([]);
                      setContinueService(true);
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: scale(10),
                      }}
                    >
                      <Image
                        style={{
                          height: scale(50),
                          width: scale(50),
                          borderRadius: scale(40),
                        }}
                        source={{ uri: item?.profile?.[0]?.url }}
                        contentFit="cover"
                        transition={300}
                      />

                      <View>
                        <CustomText
                          style={{
                            fontSize: scale(14),
                          }}
                        >
                          {item?.name}
                        </CustomText>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <View
                style={{
                  paddingTop: verticalScale(20),
                }}
              >
                <CustomText>
                  No{" "}
                  {authenticatedUser?.salonType === "Barber Shop"
                    ? "barbers"
                    : "stylists"}{" "}
                  available
                </CustomText>
              </View>
            ))}

          {activeSection === "servicesSecond" &&
            (salonServices?.loading ? (
              [0, 1, 2, 3, 4, 5].map((_, index) => {
                return (
                  <Skeleton
                    key={index}
                    height={verticalScale(150)}
                    borderRadius={scale(10)}
                  />
                );
              })
            ) : salonServices?.data?.length > 0 ? (
              salonServices?.data?.map((item, index) => {
                return (
                  <Pressable
                    key={item?.serviceId}
                    style={{
                      borderRadius: scale(12),
                      backgroundColor: colors.background,
                      padding: scale(14),
                      gap: verticalScale(12),
                      borderWidth: 1,
                      borderColor: colors.cardBorder,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      {/* LEFT SIDE */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-start",
                          gap: scale(12),
                          width: "75%",
                        }}
                      >
                        <View style={{ gap: verticalScale(8), flexShrink: 1 }}>
                          {/* SERVICE NAME */}
                          <CustomText
                            style={{
                              fontSize: moderateScale(15),
                              fontFamily: "AirbnbCereal_W_Bd",
                              // color: "#0F172A",
                            }}
                          >
                            {item?.serviceName}
                          </CustomText>

                          {/* CATEGORY BADGE */}
                          <Pressable
                            style={{
                              paddingHorizontal: scale(10),
                              paddingVertical: verticalScale(3),
                              backgroundColor: "#CCF2E8",
                              borderRadius: scale(6),
                              alignSelf: "flex-start",
                            }}
                          >
                            <CustomText
                              style={{
                                fontSize: moderateScale(11),
                                fontFamily: "AirbnbCereal_W_Md",
                                color: "#0D9488",
                              }}
                            >
                              {item?.serviceCategoryName}
                            </CustomText>
                          </Pressable>

                          {/* PRICE */}
                          <CustomText
                            style={{
                              fontFamily: "AirbnbCereal_W_Blk",
                              fontSize: scale(20),
                              color: "#0D9488",
                              marginTop: verticalScale(4),
                            }}
                          >
                            {authenticatedUser?.currency} {item?.servicePrice}
                          </CustomText>
                        </View>
                      </View>

                      {/* RIGHT SIDE BUTTON */}
                      {item?.selected ? (
                        <Pressable
                          onPress={() => removeServiceHandler(item)}
                          style={{
                            height: verticalScale(28),
                            paddingHorizontal: scale(8),
                            backgroundColor: "#DC2626",
                            borderRadius: scale(6),
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CustomText
                            style={{ fontSize: scale(12), color: "#fff" }}
                          >
                            Remove
                          </CustomText>
                        </Pressable>
                      ) : (
                        <Pressable
                          onPress={() => addServiceHandler(item)}
                          style={{
                            height: verticalScale(28),
                            paddingHorizontal: scale(12),
                            backgroundColor: "#000",
                            borderRadius: scale(6),
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CustomText
                            style={{ fontSize: scale(12), color: "#fff" }}
                          >
                            Add
                          </CustomText>
                        </Pressable>
                      )}
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <View
                style={{
                  paddingTop: verticalScale(20),
                }}
              >
                <CustomText>No services available</CustomText>
              </View>
            ))}

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
                    <LeftIcon color={"#14b8a6"} size={scale(16)} />
                  </Pressable>
                  <Pressable
                    disabled={isNextDisabled}
                    onPress={goToNextMonth}
                    style={[
                      styles.navButton,
                      isNextDisabled && { opacity: 0.3 },
                    ]}
                  >
                    <RightIcon color={"#14b8a6"} size={scale(16)} />
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
                      setSelectedCalenderDate(day?.fullDate);
                      setSelectedCalenderDay(day);
                    }}
                    key={day.fullDate}
                    style={[
                      styles.dayBox,
                      {
                        // backgroundColor: disableDates?.includes(day?.fullDate) && "#e5e5e5",
                        backgroundColor: disableSalonDates?.includes(
                          day?.fullDate,
                        )
                          ? colors.appointmentDisableBg
                          : disableAppointmentDates?.includes(day?.fullDate)
                            ? colors.appointmentDisableBg
                            : disableDates?.includes(day?.fullDate)
                              ? colors.appointmentDisableBg
                              : "#00B0901A",

                        borderColor:
                          selectedCalenderDate === day?.fullDate
                            ? "#0BA3AD"
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
                          disableDates?.includes(day?.fullDate) && colors.text,
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
                              : "#14b8a6",
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
                      color={isNotifyCheck ? "#00B090" : undefined}
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
                {!selectedCustomerBarber ? (
                  <View
                    style={{
                      width: "100%",
                      minHeight: verticalScale(300),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CustomText>Please select barber/stylist</CustomText>
                  </View>
                ) : !selectedCalenderDate ? (
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
                      width={scrolling ? "31%" : "48%"}
                      height={verticalScale(40)}
                      style={{
                        borderRadius: scale(8),
                      }}
                    />
                    <Skeleton
                      width={scrolling ? "31%" : "48%"}
                      height={verticalScale(40)}
                      style={{
                        borderRadius: scale(8),
                      }}
                    />
                    <Skeleton
                      width={scrolling ? "31%" : "48%"}
                      height={verticalScale(40)}
                      style={{
                        borderRadius: scale(8),
                      }}
                    />
                    <Skeleton
                      width={scrolling ? "31%" : "48%"}
                      height={verticalScale(40)}
                      style={{
                        borderRadius: scale(8),
                      }}
                    />
                    <Skeleton
                      width={scrolling ? "31%" : "48%"}
                      height={verticalScale(40)}
                      style={{
                        borderRadius: scale(8),
                      }}
                    />
                    <Skeleton
                      width={scrolling ? "31%" : "48%"}
                      height={verticalScale(40)}
                      style={{
                        borderRadius: scale(8),
                      }}
                    />
                    <Skeleton
                      width={scrolling ? "31%" : "48%"}
                      height={verticalScale(40)}
                      style={{
                        borderRadius: scale(8),
                      }}
                    />
                    <Skeleton
                      width={scrolling ? "31%" : "48%"}
                      height={verticalScale(40)}
                      style={{
                        borderRadius: scale(8),
                      }}
                    />
                    <Skeleton
                      width={scrolling ? "31%" : "48%"}
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
                            if (addIconPressCount === 1) {
                              setScrolling(false);
                              setActiveSection("appointmentnote");
                              setAddIconPressCount(0);
                              setSelectedEngageTimeSlot(item?.timeInterval);
                            }
                          }}
                          key={index}
                          style={{
                            backgroundColor: "#00B0901A",
                            alignSelf: "flex-start",
                            width: scrolling ? "31%" : "48%",
                            height: verticalScale(40),
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: scale(6),
                          }}
                        >
                          <CustomText
                            style={{
                              color: "#14b8a6",
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
                  borderRadius: scale(8),
                  textAlignVertical: "top",
                  backgroundColor: "#00B0901A",
                  color: colors.text,
                  fontSize: moderateScale(16),
                }}
                multiline
                placeholderTextColor={"gray"}
                placeholder="Enter your appointment note"
                value={appointmentNote}
                onChangeText={(text) => setAppointmentNote(text)}
              />
              <Pressable
                onPress={() => {
                  if (addIconPressCount === 1) {
                    // setScrolling(false);
                    // setActiveSection("");
                    // setAddIconPressCount(0);
                  }
                }}
                style={styles.searchButton}
              >
                <CustomText style={{ color: "#fff" }}>Done</CustomText>
              </Pressable>
            </>
          )}
        </ScrollView>

        {scrolling &&
          (activeSection === "servicesFirst" ||
            activeSection === "servicesSecond") &&
          selectCustomerServices.length > 0 && (
            <View
              style={{
                width: "100%",
                borderTopColor: "#D2D2D2",
                borderTopWidth: scale(0.5),
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: verticalScale(10),
                marginBottom: -verticalScale(15),
              }}
            >
              <Pressable
                // onPress={() => {
                // setScrolling(false);
                // if (activeSection === "servicesFirst") {
                //   setContinueService(true);
                //   setActiveSection("barberSecond");
                // } else {
                //   setContinueService(false);
                //   setActiveSection("calendar");
                // }

                //   setAddIconPressCount(0);
                // }}
                onPress={() => {
                  setScrolling(false);
                  if (activeSection === "servicesFirst") {
                    setContinueService(true);
                    setActiveSection("barberSecond");
                  } else {
                    setContinueService(false);
                    setActiveSection("calendar");
                  }
                }}
                style={{
                  height: verticalScale(40),
                  flex: 1,
                  backgroundColor: "#14b8a6",
                  borderRadius: scale(6),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CustomText
                  style={{
                    color: "#fff",
                    fontSize: scale(16),
                  }}
                >
                  Continue
                </CustomText>
              </Pressable>
            </View>
          )}
      </Animated.View>
    ) : (
      <>
        {title === "Choose Services" ? (
          <Pressable
            style={[
              styles.boxCloseWrapper,
              {
                backgroundColor: colors.cardColor,
                borderWidth: scale(1),
                borderColor: colors.queueBorder,
                flexDirection: "row",
                justifyContent: "flex-start",
              },
            ]}
            onPress={() => {
              setActiveSection(key);
            }}
          >
            {selectCustomerServices?.length > 0 ? (
              <CustomText
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ flexShrink: 1 }}
              >
                Services: {selectCustomerServices?.[0]?.serviceName}
                {selectCustomerServices?.length > 1
                  ? ` + ${selectCustomerServices.length - 1} more`
                  : ""}
              </CustomText>
            ) : (
              <CustomText>{title}</CustomText>
            )}
          </Pressable>
        ) : title ===
          `Choose ${
            authenticatedUser?.salonType === "Barber Shop"
              ? "Barber"
              : "Stylist"
          }` ? (
          <Pressable
            style={[
              styles.boxCloseWrapper,
              {
                backgroundColor: colors.cardColor,
                borderWidth: scale(1),
                borderColor: colors.queueBorder,
              },
            ]}
            onPress={() => setActiveSection(key)}
          >
            {selectedCustomerBarber?.name ? (
              <CustomText>Barber: {selectedCustomerBarber?.name}</CustomText>
            ) : (
              <CustomText>{title}</CustomText>
            )}
          </Pressable>
        ) : title === "Choose Date" ? (
          <Pressable
            style={[
              styles.boxCloseWrapper,
              {
                backgroundColor: colors.cardColor,
                borderWidth: scale(1),
                borderColor: colors.queueBorder,
              },
            ]}
            onPress={() => {
              setActiveSection(key);
            }}
          >
            {selectedEngageTimeSlot ? (
              <CustomText>
                Date: {selectedEngageTimeSlot} · {selectedCalenderDay?.dayName},{" "}
                {selectedCalenderDay?.date} {selectedCalenderDay?.month}{" "}
                {selectedCalenderDay?.year}
              </CustomText>
            ) : (
              <CustomText>{title}</CustomText>
            )}
          </Pressable>
        ) : (
          <Pressable
            style={[
              styles.boxCloseWrapper,
              {
                backgroundColor: colors.cardColor,
                borderWidth: scale(1),
                borderColor: colors.queueBorder,
              },
            ]}
            onPress={() => setActiveSection(key)}
          >
            <CustomText>
              {title} {"(Optional)"}
            </CustomText>
          </Pressable>
        )}
      </>
    );
  };

  const insets = useSafeAreaInsets();

  return (
    // <Animated.View
    //   style={[
    //     styles.container,
    //     {
    //       // paddingHorizontal: paddingAnim,
    //     },
    //   ]}
    // >
    //   <SafeAreaView style={{ flex: 1 }}>
    //     <KeyboardAvoidingView
    //       style={{ flex: 1 }}
    //       behavior={Platform.OS === "ios" ? "padding" : undefined}
    //     >
    //       {/* Header */}
    //       <View
    //         style={{
    //           flexDirection: "row",
    //           alignItems: "center",
    //           height: verticalScale(40),
    //           gap: scale(10),
    //         }}
    //       >
    //         <Pressable onPress={() => router.replace("/appointment")}>
    //           <ArrowLeftIcon color={colors.text} />
    //         </Pressable>
    //         <CustomText
    //           style={{
    //             flex: 1,
    //             fontFamily: "AirbnbCereal_W_XBd",
    //             fontSize: scale(20),
    //           }}
    //         >
    //           Book Appointment
    //         </CustomText>
    //       </View>

    //       {/* <View style={{ flex: 1, gap: verticalScale(15) }}>
    //         {activeSection === "servicesFirst" &&
    //           renderSection("servicesFirst", "Choose Services")}

    //         {activeSection === "barberSecond" &&
    //           renderSection(
    //             "barberSecond",
    //             `Choose ${
    //               authenticatedUser?.salonType === "Barber Shop"
    //                 ? "Barber"
    //                 : "Stylist"
    //             }`,
    //             [
    //               { id: 1 },
    //               { id: 2 },
    //               { id: 3 },
    //               { id: 4 },
    //               { id: 5 },
    //               { id: 6 },
    //               { id: 7 },
    //               { id: 8 },
    //               { id: 9 },
    //             ],
    //           )}

    //         {activeSection === "calendar" &&
    //           renderSection("calendar", "Choose Date", "")}

    //         {activeSection === "appointmentnote" &&
    //           renderSection("appointmentnote", "Appointment Note", "")}
    //       </View> */}

    //       {/* {!scrolling && (
    //         <View style={styles.footer}>
    //           <View />
    //           <Pressable
    //             onPress={continueHandler}
    //             disabled={paymentSettingsLoading}
    //             style={styles.searchButton}
    //           >
    //             <CustomText style={{ color: "#fff" }}>Confirm</CustomText>
    //           </Pressable>
    //         </View>
    //       )} */}

    //       {/* main content */}
    //       <View style={{ flex: 1, gap: verticalScale(15) }}>

    //       </View>

    //       {/* Footer */}
    //       <View style={styles.footer}>
    //         <View />
    //         <Pressable
    //           // onPress={continueHandler}
    //           // disabled={paymentSettingsLoading}
    //           style={styles.searchButton}
    //         >
    //           <CustomText style={{ color: "#fff" }}>Confirm</CustomText>
    //         </Pressable>
    //       </View>
    //     </KeyboardAvoidingView>
    //   </SafeAreaView>
    // </Animated.View>

    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, gap: verticalScale(10) }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ================= HEADER ================= */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(10),
          }}
        >
          <Pressable onPress={() => router.replace("/appointment")}>
            <ArrowLeftIcon color={colors.text} />
          </Pressable>

          <CustomText
            style={{
              flex: 1,
              fontFamily: "AirbnbCereal_W_XBd",
              fontSize: scale(20),
            }}
          >
            Book Appointment
          </CustomText>
        </View>

        {/* ============ MAIN CONTENT (SCROLLABLE) ============ */}
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
          {/* Services */}
          <View style={styles.row}>
            <CustomText
              style={[
                styles.label,
                {
                  color: colors.secondaryText,
                },
              ]}
            >
              Services
            </CustomText>
            <CustomText style={styles.value}>
              {selectCustomerServices?.map((s) => s?.serviceName).join(", ") ||
                "-"}
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
                  color: colors.secondaryText,
                },
              ]}
            >
              Barber
            </CustomText>
            <CustomText style={styles.value}>
              {selectedCustomerBarber?.name || "-"}
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
                    color: colors.secondaryText,
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
                    color: colors.secondaryText,
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
            // paddingVertical: verticalScale(15),
            gap: verticalScale(15),
            paddingHorizontal: scale(10),
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Your main content goes here */}
          {appointmentPopupType?.selectServices ? (
            <>
              {activeSection === "servicesFirst" &&
                (salonServices?.loading
                  ? [0, 1, 2, 3, 4, 5].map((_, index) => {
                      return (
                        <Skeleton
                          key={index}
                          height={verticalScale(150)}
                          borderRadius={scale(10)}
                        />
                      );
                    })
                  : salonServices?.data?.map((item, index) => {
                      return (
                        <Pressable
                          key={item?.serviceId}
                          style={{
                            borderRadius: scale(12),
                            backgroundColor: colors.cardColor,
                            padding: scale(14),
                            gap: verticalScale(12),
                            borderWidth: 1,
                            borderColor: colors.cardBorder,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            {/* LEFT SIDE */}
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                gap: scale(12),
                                width: "75%",
                              }}
                            >
                              <View
                                style={{ gap: verticalScale(8), flexShrink: 1 }}
                              >
                                {/* SERVICE NAME */}
                                <CustomText
                                  style={{
                                    fontSize: moderateScale(15),
                                    fontFamily: "AirbnbCereal_W_Bd",
                                    // color: "#0F172A",
                                  }}
                                >
                                  {item?.serviceName}
                                </CustomText>

                                {/* CATEGORY BADGE */}
                                <Pressable
                                  style={{
                                    paddingHorizontal: scale(10),
                                    paddingVertical: verticalScale(3),
                                    backgroundColor: "#CCF2E8",
                                    borderRadius: scale(6),
                                    alignSelf: "flex-start",
                                  }}
                                >
                                  <CustomText
                                    style={{
                                      fontSize: moderateScale(11),
                                      fontFamily: "AirbnbCereal_W_Md",
                                      color: "#0D9488",
                                    }}
                                  >
                                    {item?.serviceCategoryName}
                                  </CustomText>
                                </Pressable>

                                {/* PRICE */}
                                <CustomText
                                  style={{
                                    fontFamily: "AirbnbCereal_W_Blk",
                                    fontSize: scale(20),
                                    color: "#0D9488",
                                    marginTop: verticalScale(4),
                                  }}
                                >
                                  {authenticatedUser?.currency}{" "}
                                  {item?.servicePrice}
                                </CustomText>
                              </View>
                            </View>

                            {/* RIGHT SIDE BUTTON */}
                            {item?.selected ? (
                              <Pressable
                                onPress={() => removeServiceHandler(item)}
                                style={{
                                  height: verticalScale(28),
                                  paddingHorizontal: scale(8),
                                  backgroundColor: "#DC2626",
                                  borderRadius: scale(6),
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <CustomText
                                  style={{ fontSize: scale(12), color: "#fff" }}
                                >
                                  Remove
                                </CustomText>
                              </Pressable>
                            ) : (
                              <Pressable
                                onPress={() => addServiceHandler(item)}
                                style={{
                                  height: verticalScale(28),
                                  paddingHorizontal: scale(12),
                                  backgroundColor: "#000",
                                  borderRadius: scale(6),
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <CustomText
                                  style={{ fontSize: scale(12), color: "#fff" }}
                                >
                                  Add
                                </CustomText>
                              </Pressable>
                            )}
                          </View>
                        </Pressable>
                      );
                    }))}

              {activeSection === "barberSecond" &&
                (salonBarber?.loading ? (
                  [0, 1, 2, 3, 4, 5].map((_, index) => {
                    return (
                      <Skeleton
                        key={index}
                        height={verticalScale(60)}
                        borderRadius={scale(10)}
                      />
                    );
                  })
                ) : salonBarber?.data?.length > 0 ? (
                  salonBarber?.data?.map((item, index) => {
                    return (
                      <Pressable
                        key={item?.barberId}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "#00B0901A",
                          borderRadius: scale(10),
                          padding: scale(10),
                          borderWidth:
                            item?.barberId === selectedCustomerBarber?.barberId
                              ? scale(1)
                              : scale(0),
                          borderColor:
                            item?.barberId === selectedCustomerBarber?.barberId
                              ? "#0BA3AD"
                              : null,
                        }}
                        onPress={() => {
                          setSelectedCustomerBarber(item);
                          // setScrolling(false);
                          // setActiveSection("calendar");
                          // setAddIconPressCount(0);
                          setSelectedCalenderDate("");
                          setDisbaleDates([]);
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: scale(10),
                          }}
                        >
                          <Image
                            style={{
                              height: scale(50),
                              width: scale(50),
                              borderRadius: scale(40),
                            }}
                            source={{ uri: item?.profile?.[0]?.url }}
                            contentFit="cover"
                            transition={300}
                          />

                          <View>
                            <CustomText
                              style={{
                                fontSize: scale(14),
                              }}
                            >
                              {item?.name}
                            </CustomText>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })
                ) : (
                  <View
                    style={{
                      paddingTop: verticalScale(20),
                    }}
                  >
                    <CustomText>
                      No{" "}
                      {authenticatedUser?.salonType === "Barber Shop"
                        ? "barbers"
                        : "stylists"}{" "}
                      available
                    </CustomText>
                  </View>
                ))}
            </>
          ) : (
            <>
              {activeSection === "barberFirst" &&
                (salonBarber?.loading ? (
                  [0, 1, 2, 3, 4, 5].map((_, index) => {
                    return (
                      <Skeleton
                        key={index}
                        height={verticalScale(60)}
                        borderRadius={scale(10)}
                      />
                    );
                  })
                ) : salonBarber?.data?.length > 0 ? (
                  salonBarber?.data?.map((item, index) => {
                    return (
                      <Pressable
                        key={item?.barberId}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "#00B0901A",
                          borderRadius: scale(10),
                          padding: scale(10),
                          borderWidth:
                            item?.barberId === selectedCustomerBarber?.barberId
                              ? scale(1)
                              : scale(0),
                          borderColor:
                            item?.barberId === selectedCustomerBarber?.barberId
                              ? "#0BA3AD"
                              : null,
                        }}
                        onPress={() => {
                          setSelectedCustomerBarber(item);
                          // setSelectedCustomerServices([]);
                          // setScrolling(false);
                          // setActiveSection("servicesSecond");
                          // setAddIconPressCount(0);
                          // setSelectedCalenderDate("");
                          // setDisbaleDates([]);
                          // setContinueService(true);
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: scale(10),
                          }}
                        >
                          <Image
                            style={{
                              height: scale(50),
                              width: scale(50),
                              borderRadius: scale(40),
                            }}
                            source={{ uri: item?.profile?.[0]?.url }}
                            contentFit="cover"
                            transition={300}
                          />

                          <View>
                            <CustomText
                              style={{
                                fontSize: scale(14),
                              }}
                            >
                              {item?.name}
                            </CustomText>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })
                ) : (
                  <View
                    style={{
                      paddingTop: verticalScale(20),
                    }}
                  >
                    <CustomText>
                      No{" "}
                      {authenticatedUser?.salonType === "Barber Shop"
                        ? "barbers"
                        : "stylists"}{" "}
                      available
                    </CustomText>
                  </View>
                ))}

              {activeSection === "servicesSecond" &&
                (salonServices?.loading ? (
                  [0, 1, 2, 3, 4, 5].map((_, index) => {
                    return (
                      <Skeleton
                        key={index}
                        height={verticalScale(150)}
                        borderRadius={scale(10)}
                      />
                    );
                  })
                ) : salonServices?.data?.length > 0 ? (
                  salonServices?.data?.map((item, index) => {
                    return (
                      <Pressable
                        key={item?.serviceId}
                        style={{
                          borderRadius: scale(12),
                          backgroundColor: colors.background,
                          padding: scale(14),
                          gap: verticalScale(12),
                          borderWidth: 1,
                          borderColor: colors.cardBorder,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          {/* LEFT SIDE */}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "flex-start",
                              gap: scale(12),
                              width: "75%",
                            }}
                          >
                            <View
                              style={{ gap: verticalScale(8), flexShrink: 1 }}
                            >
                              {/* SERVICE NAME */}
                              <CustomText
                                style={{
                                  fontSize: moderateScale(15),
                                  fontFamily: "AirbnbCereal_W_Bd",
                                  // color: "#0F172A",
                                }}
                              >
                                {item?.serviceName}
                              </CustomText>

                              {/* CATEGORY BADGE */}
                              <Pressable
                                style={{
                                  paddingHorizontal: scale(10),
                                  paddingVertical: verticalScale(3),
                                  backgroundColor: "#CCF2E8",
                                  borderRadius: scale(6),
                                  alignSelf: "flex-start",
                                }}
                              >
                                <CustomText
                                  style={{
                                    fontSize: moderateScale(11),
                                    fontFamily: "AirbnbCereal_W_Md",
                                    color: "#0D9488",
                                  }}
                                >
                                  {item?.serviceCategoryName}
                                </CustomText>
                              </Pressable>

                              {/* PRICE */}
                              <CustomText
                                style={{
                                  fontFamily: "AirbnbCereal_W_Blk",
                                  fontSize: scale(20),
                                  color: "#0D9488",
                                  marginTop: verticalScale(4),
                                }}
                              >
                                {authenticatedUser?.currency}{" "}
                                {item?.servicePrice}
                              </CustomText>
                            </View>
                          </View>

                          {/* RIGHT SIDE BUTTON */}
                          {item?.selected ? (
                            <Pressable
                              onPress={() => removeServiceHandler(item)}
                              style={{
                                height: verticalScale(28),
                                paddingHorizontal: scale(8),
                                backgroundColor: "#DC2626",
                                borderRadius: scale(6),
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <CustomText
                                style={{ fontSize: scale(12), color: "#fff" }}
                              >
                                Remove
                              </CustomText>
                            </Pressable>
                          ) : (
                            <Pressable
                              onPress={() => addServiceHandler(item)}
                              style={{
                                height: verticalScale(28),
                                paddingHorizontal: scale(12),
                                backgroundColor: "#000",
                                borderRadius: scale(6),
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <CustomText
                                style={{ fontSize: scale(12), color: "#fff" }}
                              >
                                Add
                              </CustomText>
                            </Pressable>
                          )}
                        </View>
                      </Pressable>
                    );
                  })
                ) : (
                  <View
                    style={{
                      paddingTop: verticalScale(20),
                    }}
                  >
                    <CustomText>No services available</CustomText>
                  </View>
                ))}
            </>
          )}

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
                    <LeftIcon color={"#14b8a6"} size={scale(16)} />
                  </Pressable>
                  <Pressable
                    disabled={isNextDisabled}
                    onPress={goToNextMonth}
                    style={[
                      styles.navButton,
                      isNextDisabled && { opacity: 0.3 },
                    ]}
                  >
                    <RightIcon color={"#14b8a6"} size={scale(16)} />
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
                      setSelectedCalenderDate(day?.fullDate);
                      setSelectedCalenderDay(day);
                    }}
                    key={day.fullDate}
                    style={[
                      styles.dayBox,
                      {
                        // backgroundColor: disableDates?.includes(day?.fullDate) && "#e5e5e5",
                        backgroundColor: disableSalonDates?.includes(
                          day?.fullDate,
                        )
                          ? colors.appointmentDisableBg
                          : disableAppointmentDates?.includes(day?.fullDate)
                            ? colors.appointmentDisableBg
                            : disableDates?.includes(day?.fullDate)
                              ? colors.appointmentDisableBg
                              : "#00B0901A",

                        borderColor:
                          selectedCalenderDate === day?.fullDate
                            ? "#0BA3AD"
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
                        // color:
                        //   disableDates?.includes(day?.fullDate) && colors.text,
                        color: colors.text
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
                              : "#14b8a6",
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
                      color={isNotifyCheck ? "#00B090" : undefined}
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
                {!selectedCustomerBarber ? (
                  <View
                    style={{
                      width: "100%",
                      minHeight: verticalScale(300),
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CustomText>Please select barber/stylist</CustomText>
                  </View>
                ) : !selectedCalenderDate ? (
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
                            // if (addIconPressCount === 1) {
                            //   // setScrolling(false);
                            //   // setActiveSection("appointmentnote");
                            //   // setAddIconPressCount(0);
                            //   // setSelectedEngageTimeSlot(item?.timeInterval);
                            // }
                            setSelectedEngageTimeSlot(item?.timeInterval);
                          }}
                          key={index}
                          style={{
                            backgroundColor: "#00B0901A",
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
                                ? "#0BA3AD"
                                : null,
                          }}
                        >
                          <CustomText
                            style={{
                              color: "#14b8a6",
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
                  // flexGrow: 1,
                  width: "98%",
                  height: "100%",
                  minHeight: verticalScale(250),
                  padding: scale(16),
                  borderRadius: scale(8),
                  textAlignVertical: "top",
                  backgroundColor: "#00B0901A",
                  color: colors.text,
                  fontSize: moderateScale(16),
                }}
                multiline
                placeholderTextColor={"gray"}
                placeholder="Enter your appointment note"
                value={appointmentNote}
                onChangeText={(text) => setAppointmentNote(text)}
              />
            </>
          )}
        </ScrollView>

        {/* ================= FOOTER ================= */}
        <View style={styles.footer}>
          <CustomText>Step {step} of 4</CustomText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(10),
            }}
          >
            {activeSection === "servicesFirst" ||
            activeSection === "barberFirst" ? (
              <View />
            ) : (
              <Pressable
                style={{
                  padding: scale(10),
                  backgroundColor: "#14b8a6",
                  borderRadius: scale(50),
                }}
                onPress={() => {
                  if (appointmentPopupType?.selectServices) {
                    if (activeSection === "barberSecond") {
                      setStep(1);
                      setActiveSection("servicesFirst");
                      setSelectedCustomerBarber(null);
                    }

                    if (activeSection === "calendar") {
                      setStep(2);
                      setActiveSection("barberSecond");
                      setSelectedCalenderDate("");
                      setSelectedCalenderDay("");
                      setSelectedEngageTimeSlot("");
                    }
                  } else {
                    if (activeSection === "servicesSecond") {
                      setStep(1);
                      setActiveSection("barberFirst");
                      setSelectedCustomerServices([]);
                    }

                    if (activeSection === "calendar") {
                      setStep(2);
                      setActiveSection("servicesSecond");
                      setSelectedCalenderDate("");
                      setSelectedCalenderDay("");
                      setSelectedEngageTimeSlot("");
                    }
                  }

                  if (activeSection === "appointmentnote") {
                    setStep(3);
                    setActiveSection("calendar");
                  }
                }}
              >
                <LeftIcon size={scale(12)} color="#fff" />
              </Pressable>
            )}

            <Pressable
              style={{
                padding: scale(10),
                backgroundColor: "#14b8a6",
                borderRadius: scale(50),
              }}
              onPress={() => {
                if (appointmentPopupType?.selectServices) {
                  if (activeSection === "servicesFirst") {
                    if (selectCustomerServices.length === 0) {
                      Toast.error("Please select a service");
                      return;
                    }
                    setStep(2);
                    setActiveSection("barberSecond");
                  }

                  if (activeSection === "barberSecond") {
                    if (!selectedCustomerBarber) {
                      Toast.error("Please select a barber");
                      return;
                    }

                    setStep(3);
                    setActiveSection("calendar");
                  }
                } else {
                  if (activeSection === "barberFirst") {
                    if (!selectedCustomerBarber) {
                      Toast.error("Please select a barber");
                      return;
                    }

                    setStep(2);
                    setActiveSection("servicesSecond");
                  }

                  if (activeSection === "servicesSecond") {
                    if (selectCustomerServices.length === 0) {
                      Toast.error("Please select a service");
                      return;
                    }

                    setStep(3);
                    setActiveSection("calendar");
                  }
                }

                if (activeSection === "calendar") {
                  if (!selectedCalenderDay && !selectedCalenderDate) {
                    Toast.error("Please select a date");
                    return;
                  }

                  if (!selectedEngageTimeSlot) {
                    Toast.error("Please select a timeslot");
                    return;
                  }

                  setStep(4);
                  setActiveSection("appointmentnote");
                }

                if (activeSection === "appointmentnote") {
                  continueHandler();
                }
              }}
              disabled={paymentSettingsLoading}
            >
              {activeSection === "appointmentnote" ? (
                <CustomText style={{ color: "#fff" }}>Finish</CustomText>
              ) : (
                <RightIcon size={scale(12)} color="#fff" />
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default appointmentCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxOpenWrapper: {
    borderRadius: scale(20),
    height: verticalScale(300),
    padding: scale(20),
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
    backgroundColor: "#14b8a6",
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
    backgroundColor: "#14b8a6", // bg-teal-500
    paddingVertical: verticalScale(12), // py-4
    borderRadius: scale(8), // rounded-xl
    marginBottom: verticalScale(15), // mb-6
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
    // marginTop: scale(10),
    // shadowColor: "#000",
    // shadowOpacity: 0.08,
    // shadowRadius: 8,
    // shadowOffset: { width: 0, height: 4 },
    // elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontSize: scale(11),
    // color: "#6b7280", // soft gray
  },

  value: {
    fontSize: scale(11),
    fontFamily: "AirbnbCereal_W_Bd"
    // fontWeight: "600",
    // color: "#111827",
    // marginTop: scale(2),
    // maxWidth: "70%",
    // textAlign: "right",
  },

  divider: {
    height: 1,
    // backgroundColor: "#f3f4f6",
    marginVertical: scale(8),
  },
});
