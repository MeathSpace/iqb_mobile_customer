import { BASE_URL } from "@/utils/api";
import { usePreventRemove, useTheme } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { CalendarIcon, RightIcon, UploadIcon } from "../constants/icons";
import { useAuth } from "../context/AuthContext";
import { useGlobal } from "../context/GlobalContext";
import AdvertiseCard from "./AdvertiseCard";
import BarberCard from "./BarberCard";
import CustomSecondaryText from "./CustomSecondaryText";
import CustomTabView from "./CustomTabView";
import CustomText from "./CustomText";
import Skeleton from "./Skeleton";

import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { io } from "socket.io-client";

import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Toast } from "toastify-react-native";
import Header from "./Header";
import i18n from "../src/localization/i18n";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function handleRegistrationError(errorMessage) {
  // alert(errorMessage);
  // throw new Error(errorMessage);
  console.log("Notification Error Message ", errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!",
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      // console.log("From Dashboard Screen ",pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

const Dashboard = () => {
  const [latestVersion, setLatestVersion] = useState("");

  // console.log("IOS", Constants?.expoConfig?.ios?.buildNumber);
  // console.log("Android", Constants?.expoConfig?.android?.versionCode);

  // Platform.OS

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetch_new_version = async () => {
  //       try {
  //         const { data } = await axios.get(
  //           `${BASE_URL}/version/getMobileVersion`,
  //         );
  //         const recentAppVersion = Constants.expoConfig.version;

  //         const newVersionAvailable = data?.response?.mobileVersion;

  //         if (recentAppVersion !== newVersionAvailable) {
  //           setLatestVersion(newVersionAvailable);
  //         } else {
  //           setLatestVersion("");
  //         }
  //       } catch (err) {
  //         console.log("Version fetch error", err);
  //       }
  //     };

  //     fetch_new_version();

  //     // cleanup (optional)
  //     return () => {};
  //   }, []),
  // );

  const baseContent = i18n.t("protected.dashboard")

  const [apiVersionData, setApiVersionData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetch_new_version = async () => {
        try {
          const { data } = await axios.post(
            `${BASE_URL}/version/getMobileVersion`,
            {
              platformType: Platform.OS,
            },
          );

          if (Platform.OS === "ios") {
            let buildNumber = Number(data?.response?.buildNumber);
            let prevBuildNumber = Number(
              Constants?.expoConfig?.ios?.buildNumber,
            );

            if (buildNumber !== prevBuildNumber) {
              setApiVersionData(data?.response);
            } else {
              setApiVersionData(null);
            }
          } else {
            let versionCode = Number(data?.response?.versionCode);
            let prevVersionCode = Number(
              Constants?.expoConfig?.android?.versionCode,
            );

            if (versionCode !== prevVersionCode) {
              setApiVersionData(data?.response);
            } else {
              setApiVersionData(null);
            }
          }
        } catch (err) {
          console.log("Version fetch error", err);
        }
      };

      fetch_new_version();

      return () => {};
    }, []),
  );

  const { homeDashboardData, setHomeDashboardData } = useGlobal();
  const { authenticatedUser } = useAuth();

  // console.log("Authenticated user", authenticatedUser)

  const [sliceBarber, setSliceBarber] = useState(4);

  const [homeAdvertisementData, setHomeAdvertisementData] = useState({
    advertisementData: null,
    loading: false,
    error: null,
    success: false,
  });

  const [serviceCategoryData, setServiceCategoryData] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const [customerLivetData, setCustomerLiveData] = useState({
    liveQueueData: null,
    loading: false,
    error: null,
    success: false,
  });

  const [getSalonFeature, setGetSalonFeature] = useState({
    salonFeature: null,
    loading: false,
    error: null,
    success: false,
  });

  useFocusEffect(
    useCallback(() => {
      if (authenticatedUser) {
        const fetchDashboardData = async () => {
          try {
            setHomeDashboardData((prev) => ({ ...prev, loading: true }));

            const { data } = await axios.post(
              `${BASE_URL}/customer/customerDashboard`,
              {
                salonId: authenticatedUser?.salonId,
                customerEmail: authenticatedUser?.email,
              },
            );

            setHomeDashboardData((prev) => ({
              ...prev,
              loading: false,
              dashboardData: data?.response,
              success: true,
              error: null,
            }));
          } catch (error) {
            setHomeDashboardData((prev) => ({
              ...prev,
              loading: false,
              dashboardData: null,
              success: false,
              error: error,
            }));
            console.error(
              "Error fetching dashboard data: ",
              error?.response?.data,
            );
          }
        };

        const fetchAdvertisementData = async () => {
          try {
            setHomeAdvertisementData((prev) => ({ ...prev, loading: true }));

            const { data } = await axios.post(
              `${BASE_URL}/mobileRoutes/getAllAdvertisements`,
              {
                salonId: authenticatedUser?.salonId,
              },
            );

            setHomeAdvertisementData((prev) => ({
              ...prev,
              loading: false,
              advertisementData: data?.response,
              success: true,
              error: null,
            }));
          } catch (error) {
            setHomeAdvertisementData((prev) => ({
              ...prev,
              loading: false,
              advertisementData: null,
              success: false,
              error: error,
            }));
            console.error("Error fetching advertisement data: ", error);
          }
        };

        const fetchServiceCategoryData = async () => {
          try {
            setServiceCategoryData((prev) => ({ ...prev, loading: true }));

            const { data } = await axios.get(
              `${BASE_URL}/mobileRoutes/getAllServiceCategories`,
            );

            setServiceCategoryData((prev) => ({
              ...prev,
              loading: false,
              data: data?.response,
              success: true,
              error: null,
            }));
          } catch (error) {
            setServiceCategoryData((prev) => ({
              ...prev,
              loading: false,
              data: null,
              success: false,
              error: error,
            }));
            console.error("Error fetching service category data: ", error);
          }
        };

        const fetchCustomerLiveQueueData = async () => {
          try {
            setCustomerLiveData((prev) => ({ ...prev, loading: true }));

            const { data } = await axios.post(
              `${BASE_URL}/customer/customerLiveQueue`,
              {
                salonId: authenticatedUser?.salonId,
                customerEmail: authenticatedUser?.email,
              },
            );

            setCustomerLiveData((prev) => ({
              ...prev,
              loading: false,
              liveQueueData: data?.response,
              success: true,
              error: null,
            }));
          } catch (error) {
            setCustomerLiveData((prev) => ({
              ...prev,
              loading: false,
              liveQueueData: null,
              success: false,
              error: error,
            }));
            console.error("Error fetching customer live queue data: ", error);
          }
        };

        const fetSalonFeatureData = async () => {
          try {
            setGetSalonFeature((prev) => ({ ...prev, loading: true }));

            const { data } = await axios.post(
              `${BASE_URL}/mobileRoutes/getSalonFeatures`,
              {
                salonId: authenticatedUser?.salonId,
              },
            );

            setGetSalonFeature((prev) => ({
              ...prev,
              loading: false,
              salonFeature: data?.response,
              success: true,
              error: null,
            }));
          } catch (error) {
            setGetSalonFeature((prev) => ({
              ...prev,
              loading: false,
              salonFeature: null,
              success: false,
              error: error,
            }));
            console.error("Error fetching salon feature data: ", error);
          }
        };

        fetchCustomerLiveQueueData();
        fetchDashboardData();
        fetchAdvertisementData();
        fetchServiceCategoryData();
        fetSalonFeatureData();
      }

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [authenticatedUser]),
  );

  const socket = io("https://iqb-final.onrender.com", {
    transports: ["websocket"],
  });

  useFocusEffect(
    useCallback(() => {
      socket.emit("joinSalon", authenticatedUser.salonId);

      socket.on("liveSalonData", (salonDashboardData) => {
        setHomeDashboardData((prev) => ({
          ...prev,
          loading: false,
          dashboardData: salonDashboardData?.response,
          success: true,
          error: null,
        }));
      });

      socket.emit("customerforLiveData", {
        salonId: authenticatedUser?.salonId,
        customerEmail: authenticatedUser?.email,
      });

      socket.on("customerLiveQueueUpdate", (customerLiveData) => {
        // console.log("Customer Live Queue Socket Data ", customerLiveData?.response)
        setCustomerLiveData((prev) => ({
          ...prev,
          loading: false,
          liveQueueData: customerLiveData?.response,
          success: true,
          error: null,
        }));
      });
    }, [authenticatedUser]),
  );

  const { colors } = useTheme();

  const pageData = [
    {
      title: "header",
    },
    {
      title: "advertise",
    },
    {
      title: "hero",
    },

    {
      title: "hint",
    },

    {
      title: "status",
    },
    // {
    //     title: "advertise",
    // },

    {
      title: "barber",
    },
    {
      title: "services",
    },
  ];

  // Notification Code

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(undefined);

  useFocusEffect(
    useCallback(() => {
      registerForPushNotificationsAsync()
        .then((token) => setExpoPushToken(token ?? ""))
        .catch((error) => setExpoPushToken(`${error}`));

      const notificationListener =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      const responseListener =
        Notifications.addNotificationResponseReceivedListener((response) => {
          // console.log(response);
        });

      return () => {
        notificationListener.remove();
        responseListener.remove();
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (expoPushToken) {
        const saveExpoPushToken = async () => {
          try {
            const { data } = await axios.post(
              `${BASE_URL}/mobileRoutes/pushDevices`,
              {
                salonId: authenticatedUser?.salonId,
                name: authenticatedUser?.name,
                email: authenticatedUser?.email,
                deviceToken: expoPushToken,
                deviceType: "android",
              },
            );

            // console.log("Saved Notifcation Data ", data)
          } catch (error) {
            // console.log("Error saving token ", error)
          }
        };

        saveExpoPushToken();
      }
    }, [expoPushToken, authenticatedUser]),
  );

  const { setJoinModes, joinModes } = useGlobal();

  const hasUnsavedChanges = true;

  usePreventRemove(
    hasUnsavedChanges, // This boolean determines if removal should be prevented
    ({ data }) => {
      // The action is still passed, but we're choosing not to dispatch it,
      // effectively making "going back" impossible through these means.
      // Alert.alert(
      //     'Cannot Go Back',
      //     'You cannot go back during the signup flow. Please complete the current step.',
      //     [{ text: 'OK', onPress: () => null }] // Only an 'OK' button
      // );
    },
  );

  const statusData = [
    {
      label: baseContent.status.system,
      value: homeDashboardData?.dashboardData?.salonInfo
        ?.mobileBookingAvailability
        ? baseContent.status.online
        : baseContent.status.offline,
      icon: "power",
      bgColor: homeDashboardData?.dashboardData?.salonInfo
        ?.mobileBookingAvailability
        ? "rgba(34, 197, 94, 0.1)" // ✅ green-500/10
        : "rgba(239, 68, 68, 0.1)", // ❌ red-500/10
      iconColor: homeDashboardData?.dashboardData?.salonInfo
        ?.mobileBookingAvailability
        ? "#22c55e" // green-500
        : "#ef4444", // red-500
      valueColor: homeDashboardData?.dashboardData?.salonInfo
        ?.mobileBookingAvailability
        ? "#22c55e"
        : "#ef4444",
      fontSize: scale(18),
    },

    {
      label: baseContent.status.nextIn,
      value: homeDashboardData?.dashboardData?.leastQueueCount + 1,
      icon: "user-check",
      // bgColor: "rgba(168, 85, 247, 0.1)", // purple-500/10
      // iconColor: "#a855f7",

      bgColor: `${colors.accentColor}1A`, // purple-500/10
      iconColor: colors.accentColor,
    },
    {
      label: baseContent.status.onDuty,
      value: homeDashboardData?.dashboardData?.barberOnDuty,
      icon: "scissors",
      // bgColor: "rgba(56, 189, 248, 0.1)", // sky-500/10
      // iconColor: "#38bdf8",

      bgColor: `${colors.accentColor}1A`, // purple-500/10
      iconColor: colors.accentColor,
    },
    {
      label: baseContent.status.inQueue,
      value: homeDashboardData?.dashboardData?.totalQueueCount || 0,
      icon: "users",
      bgColor: `${colors.accentColor}1A`, // teal-500/10
      iconColor: colors.accentColor,
    },
  ];

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}m`;
  }

  // console.log(customerLivetData?.liveQueueData?.isJoinedData?.[0])

  const [cancelQueueLoading, setCancelQueueLoading] = useState(false);

  const flatlistRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollInterval = 4000;

  // Auto-scroll effect
  useEffect(() => {
    if (!homeAdvertisementData?.advertisementData?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex =
          (prevIndex + 1) % homeAdvertisementData.advertisementData.length;
        flatlistRef.current?.scrollToIndex({
          animated: true,
          index: nextIndex,
        });
        return nextIndex;
      });
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [homeAdvertisementData?.advertisementData?.length]);

  const [showMore, setShowMore] = useState(false);

  // const salonInfo = homeDashboardData?.dashboardData?.salonInfo?.salonInfo || "";
  const salonInfoRaw =
    homeDashboardData?.dashboardData?.salonInfo?.salonInfo || "";
  // ✨ Normalize multiple consecutive newlines (or spaces) into a single newline
  // This regex replaces two or more consecutive whitespace characters (including \n)
  // with a single \n. Adjust based on exact data format needs.
  const salonInfo = salonInfoRaw.replace(/\s{2,}/g, "\n").trim();

  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 5); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  }, []);

  return (
    <CustomTabView
      style={{
        paddingTop: verticalScale(0),
        // paddingBottom:
        //   Platform.OS === "ios" ? verticalScale(70) : verticalScale(50),
      }}
    >
      <FlatList
        data={pageData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: verticalScale(15),
        }}
        renderItem={({ item }) => {
          switch (item.title) {
            case "header": {
              return <Header />;
            }
            case "hero": {
              return (
                <>
                  {customerLivetData?.loading ? (
                    <Skeleton
                      borderRadius={scale(20)}
                      height={verticalScale(90)}
                    />
                  ) : customerLivetData?.liveQueueData?.isJoinedData?.length >
                    0 ? (
                    <LinearGradient
                      // colors={[colors.accentColor, "#0d9488"]}
                      colors={[colors.linearColor1, colors.linearColor2]}
                      style={styles.card}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.topRow}>
                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: scale(10),
                            }}
                          >
                            <CustomText
                              style={[styles.title, {}]}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {
                                customerLivetData?.liveQueueData
                                  ?.isJoinedData?.[0]?.name
                              }
                            </CustomText>
                          </View>

                          <CustomText style={styles.subtitle}>
                            {
                              customerLivetData?.liveQueueData
                                ?.isJoinedData?.[0]?.barberName
                            }
                          </CustomText>
                        </View>
                        <View>
                          <CustomText
                            style={[
                              styles.title,
                              {
                                marginLeft: "auto",
                              },
                            ]}
                          >
                            {customerLivetData?.liveQueueData?.isJoinedData?.[0]
                              ?.qPosition === 1
                              ? "Next"
                              : `#${customerLivetData?.liveQueueData?.isJoinedData?.[0]?.qPosition}`}
                          </CustomText>
                          <CustomText style={styles.subtitle}>
                            ~
                            {formatMinutesToHrMin(
                              customerLivetData?.liveQueueData
                                ?.isJoinedData?.[0]?.customerEWT,
                            )}
                          </CustomText>
                        </View>
                      </View>

                      <View style={styles.btnContainer}>
                        <TouchableOpacity
                          disabled={cancelQueueLoading}
                          onPress={async () => {
                            Alert.alert(
                              "Cancel Queue",
                              "Are you sure you want to cancel this queue?",
                              [
                                {
                                  text: "No",
                                  style: "cancel",
                                },
                                {
                                  text: "Yes",
                                  onPress: async () => {
                                    try {
                                      const cancelQueueData = {
                                        salonId: authenticatedUser?.salonId,
                                        barberId:
                                          customerLivetData?.liveQueueData
                                            ?.isJoinedData?.[0]?.barberId,
                                        customerEmail:
                                          customerLivetData?.liveQueueData
                                            ?.isJoinedData?.[0]?.customerEmail,
                                        _id: customerLivetData?.liveQueueData
                                          ?.isJoinedData?.[0]?._id,
                                      };

                                      setCancelQueueLoading(true);

                                      const { data } = await axios.post(
                                        `${BASE_URL}/mobileRoutes/cancelQueueByCustomer`,
                                        cancelQueueData,
                                      );

                                      setCustomerLiveData((prev) => ({
                                        ...prev,
                                        loading: true,
                                      }));

                                      const { data: livedata } =
                                        await axios.post(
                                          `${BASE_URL}/customer/customerLiveQueue`,
                                          {
                                            salonId: authenticatedUser?.salonId,
                                            customerEmail:
                                              authenticatedUser?.email,
                                          },
                                        );

                                      setCustomerLiveData((prev) => ({
                                        ...prev,
                                        loading: false,
                                        liveQueueData: livedata?.response,
                                        success: true,
                                        error: null,
                                      }));
                                    } catch (error) {
                                      console.log("Error from live queue data");
                                    } finally {
                                      setCancelQueueLoading(false);
                                    }
                                  },
                                },
                              ],
                            );
                          }}
                          style={[styles.joinQueue]}
                          activeOpacity={0.85}
                        >
                          {cancelQueueLoading ? (
                            <ActivityIndicator size="small" color="#000" />
                          ) : (
                            <CustomText style={styles.joinQueueText}>
                              {baseContent.card.cancel}
                            </CustomText>
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            if (!authenticatedUser?.isAppointments) {
                              return Toast.error(
                                "Appointment feature is not available at this salon",
                              );
                            }

                            setJoinModes((prev) => ({
                              ...prev,
                              appointment: true,
                              appointmentType: "Book",
                            }));

                            router.push("/appointmentpopup");
                            // router.push("/appointmentCalendar");
                          }}
                          style={[
                            styles.bookAhead,
                            {
                              borderWidth: scale(1),
                              borderColor: "#fff",
                            },
                          ]}
                          activeOpacity={0.85}
                        >
                          <CustomText style={styles.bookAheadText}>
                            {baseContent.card.book}
                          </CustomText>
                        </TouchableOpacity>
                      </View>

                      {/* +4 more text inside the card */}
                    </LinearGradient>
                  ) : (
                    <LinearGradient
                      // colors={[colors.accentColor, "#0d9488"]}
                      colors={[colors.linearColor1, colors.linearColor2]}
                      style={styles.card}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={styles.topRow}>
                        <View>
                          {/* <CustomText style={styles.title}>
                            Your Visit, Your Way
                          </CustomText> */}
                          <CustomText style={styles.subtitle}>
                            {baseContent.card.title}
                          </CustomText>
                        </View>
                        <CalendarIcon color="white" style={styles.icon} />
                      </View>

                      <View style={styles.btnContainer}>
                        <TouchableOpacity
                          onPress={() => {
                            if (!getSalonFeature?.salonFeature?.isQueuing) {
                              return Toast.error(
                                "Queueing feature is not available at this salon",
                              );
                            }

                            if (
                              !homeDashboardData?.dashboardData?.salonInfo
                                ?.mobileBookingAvailability
                            ) {
                              return Toast.error("Mobile queueing is off");
                            }

                            router.push("/joinpopup");
                          }}
                          style={[styles.joinQueue]}
                          activeOpacity={0.85}
                        >
                          <CustomText style={styles.joinQueueText}>
                            {baseContent.card.joinQueue}
                          </CustomText>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            if (
                              !getSalonFeature?.salonFeature?.isAppointments
                            ) {
                              return Toast.error(
                                "Appointment feature is not available at this salon",
                              );
                            }

                            setJoinModes((prev) => ({
                              ...prev,
                              appointment: true,
                              appointmentType: "Book",
                            }));

                            router.push("/appointmentpopup");
                            // router.push("/appointmentCalendar");
                          }}
                          style={[
                            styles.bookAhead,
                            {
                              borderWidth: scale(1),
                              borderColor: "#fff",
                            },
                          ]}
                          activeOpacity={0.85}
                        >
                          <CustomText style={styles.bookAheadText}>
                            {baseContent.card.book}
                          </CustomText>
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  )}
                </>
              );
            }

            case "advertise": {
              return (
                <>
                  <View
                    style={
                      {
                        // position: "absolute",
                        // bottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(0),
                        // left: 0,
                        // right: 0,
                        // height: verticalScale(90),
                      }
                    }
                  >
                    {homeAdvertisementData?.loading ? (
                      <FlatList
                        style={{
                          overflow: "visible",
                        }}
                        contentContainerStyle={{
                          gap: scale(10),
                        }}
                        data={[0, 1, 2, 3]}
                        renderItem={({ item }) => (
                          <View>
                            <Skeleton
                              width={scale(350)}
                              height={verticalScale(70)}
                              borderRadius={scale(0)}
                            />
                          </View>
                        )}
                        keyExtractor={(item) => item.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                      />
                    ) : homeAdvertisementData?.advertisementData?.length > 0 ? (
                      // Advertisement FlatList
                      <FlatList
                        style={{
                          overflow: "visible",
                        }}
                        contentContainerStyle={{
                          gap: scale(10),
                        }}
                        data={homeAdvertisementData?.advertisementData}
                        renderItem={({ item }) => <AdvertiseCard item={item} />}
                        keyExtractor={(item) => item._id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        // decelerationRate="fast"
                        snapToInterval={scale(400)}
                        pagingEnabled={true}
                        onMomentumScrollEnd={(event) => {
                          const offsetX = event.nativeEvent.contentOffset.x;
                          const index = Math.round(offsetX / scale(400));
                          setCurrentIndex(index);
                        }}
                        initialNumToRender={3}
                        maxToRenderPerBatch={3}
                        ref={flatlistRef}
                      />
                    ) : (
                      // Fallback Dummy Image
                      <View
                        style={{
                          width: "100%",
                          height: verticalScale(70),
                          backgroundColor: "#d3d3d3",
                        }}
                      >
                        <Image
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: scale(0),
                            borderWidth: scale(1),
                            borderColor: "#d3d3d3",
                          }}
                          source={require("@/assets/images/dummygallery.jpg")}
                          contentFit="cover"
                          transition={300}
                        />
                      </View>
                    )}
                  </View>
                </>
              );
            }

            case "status": {
              return homeDashboardData?.loading ? (
                <View>
                  <CustomText style={styles.heading}>
                    {baseContent.status.label}
                  </CustomText>
                  <View style={styles.grid}>
                    {statusData.map((item, index) => (
                      <Skeleton
                        key={index}
                        width={"48%"}
                        height={verticalScale(75)}
                        style={{
                          width: "48%",
                          borderRadius: scale(12),
                          marginBottom: verticalScale(16),
                        }}
                      />
                    ))}
                  </View>
                </View>
              ) : (
                <View>
                  <CustomText style={styles.heading}>
                    {baseContent.status.label}
                  </CustomText>
                  <View style={styles.grid}>
                    {statusData.map((item, index) => (
                      <View
                        key={index}
                        style={[
                          styles.statusCard,
                          {
                            backgroundColor: colors.cardColor,
                            // borderColor: colors.queueBorder,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.iconContainer,
                            { backgroundColor: item.bgColor },
                          ]}
                        >
                          <Feather
                            name={item.icon}
                            size={24}
                            color={item.iconColor}
                          />
                        </View>
                        <View>
                          <CustomText
                            style={[
                              styles.label,
                              {
                                // color: colors.secondaryText
                              },
                            ]}
                          >
                            {item.label}
                          </CustomText>
                          <CustomText
                            style={[
                              styles.value,
                              item.valueColor && { color: item.valueColor },
                              item.fontSize && { fontSize: item.fontSize },
                            ]}
                          >
                            {item.value}
                          </CustomText>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              );
            }

            case "hint": {
              return (
                <>
                  {((apiVersionData?.platform === "ios" &&
                    apiVersionData?.buildNumber) ||
                    (apiVersionData?.platform === "android" &&
                      apiVersionData?.versionCode)) && (
                    <View
                      style={[
                        styles.hintCard,
                        {
                          backgroundColor: colors.cardColor,
                          // borderColor: colors.queueBorder,
                          marginBottom: verticalScale(15),
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        },
                      ]}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: scale(10),
                        }}
                      >
                        <View
                          style={[
                            styles.hintIconWrapper,
                            {
                              // backgroundColor: colors.background,
                              backgroundColor: "#000",
                              // borderColor: colors.cardBorder,
                              // borderWidth: scale(1),
                            },
                          ]}
                        >
                          <UploadIcon
                            // color={colors.text}
                            color="#fff"
                          />
                        </View>
                        <View>
                          <CustomText style={[styles.hintTitle, {}]}>
                            {baseContent.hint.label}
                          </CustomText>
                          <CustomSecondaryText>
                            {baseContent.hint.latest} {apiVersionData?.version}
                          </CustomSecondaryText>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          // if (Platform.OS === "ios") {
                          //   console.log("Go to ios");
                          // } else {
                          //   Linking.openURL(
                          //     "https://play.google.com/store/apps/details?id=com.iqbook.iqb"
                          //   );
                          // }

                          if (Platform.OS === "ios") {
                            const iosUrl = `https://apps.apple.com/in/app/iqbook/id6742742449`;

                            Linking.openURL(iosUrl).catch((err) => {
                              console.error(
                                "Could not open iOS App Store link:",
                                err,
                              );
                            });
                          } else {
                            const androidUrl =
                              "https://play.google.com/store/apps/details?id=com.iqbook.iqb";

                            Linking.openURL(androidUrl).catch((err) => {
                              console.error(
                                "Could not open Android Play Store link:",
                                err,
                              );
                            });
                          }
                        }}
                        style={{
                          paddingHorizontal: scale(10),
                          paddingVertical: verticalScale(6),
                          // backgroundColor: colors.accentColor,
                          backgroundColor: colors.accentColor,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: scale(5),
                        }}
                      >
                        <CustomText
                          style={{
                            color: "#fff",
                            fontSize: moderateScale(12),
                          }}
                        >
                          {baseContent.hint.update}
                        </CustomText>
                      </TouchableOpacity>
                    </View>
                  )}
                  <View
                    style={[
                      styles.hintCard,
                      {
                        backgroundColor: colors.cardColor,
                        borderColor: colors.queueBorder,
                      },
                    ]}
                  >
                    {/* <View
                      style={[
                        styles.hintIconWrapper,
                        {
                          // backgroundColor: colors.background,
                          // borderColor: colors.cardBorder,
                          // borderWidth: scale(1),

                          backgroundColor: "#000"
                        },
                      ]}
                    >
                      <SalonIcon 
                      // color={colors.text} 
                      color="#fff"
                      />
                    </View> */}

                    <View style={styles.hintTextWrapper}>
                      <CustomText 
                      style={[styles.hintTitle, {
                        color: colors.accentColor
                      }]}>
                        {baseContent.hint.label}
                      </CustomText>

                      <CustomSecondaryText
                        onTextLayout={onTextLayout}
                        numberOfLines={textShown ? undefined : 5}
                        style={{ lineHeight: 21 }}
                      >
                        {salonInfo}
                      </CustomSecondaryText>

                      {lengthMore ? (
                        <CustomText
                          onPress={toggleNumberOfLines}
                          style={{
                            lineHeight: verticalScale(21),
                            marginTop: verticalScale(5),
                            // color: colors.primary,
                            color: "#FB8C00",
                            fontSize: scale(14),
                          }}
                        >
                          {textShown ? `${baseContent.hint.readLess}...` : `${baseContent.hint.readMore}...`}
                        </CustomText>
                      ) : null}
                    </View>
                  </View>
                </>
              );
            }

            case "barber": {
              return homeDashboardData?.dashboardData?.barberOnDuty ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      // marginBottom: verticalScale(10)
                    }}
                  >
                    <CustomText style={styles.heading}>
                      {authenticatedUser?.salonType === "Barber Shop"
                        ? baseContent.barber.barbers
                        : baseContent.barber.stylists}{" "}
                      {baseContent.barber.onDuty}
                      {/* <CustomText style={[styles.heading, { color: Colors.modeColor.colorCode }]}>{homeDashboardData?.dashboardData?.barberOnDuty}</CustomText> */}
                    </CustomText>

                    <View
                      style={{
                        marginLeft: scale(8),
                        width: scale(24),
                        height: scale(24),
                        borderRadius: scale(12),
                        backgroundColor: colors.cardColor,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: verticalScale(10),
                      }}
                    >
                      <CustomText
                        style={{
                          fontSize: scale(14),
                          fontFamily: "AirbnbCereal_W_Bd",
                        }}
                      >
                        {homeDashboardData?.dashboardData?.barberOnDuty}
                      </CustomText>
                    </View>
                  </View>

                  {homeDashboardData?.loading ? (
                    <FlatList
                      key={2}
                      style={{
                        overflow: "visible",
                      }}
                      columnWrapperStyle={{
                        columnGap: scale(10),
                      }}
                      data={[0, 1, 2, 3]}
                      renderItem={({ item }) => (
                        <Skeleton
                          height={verticalScale(160)}
                          width={scale(160)}
                          borderRadius={scale(10)}
                          style={{
                            marginBottom: verticalScale(15),
                          }}
                        />
                      )}
                      keyExtractor={(item) => item}
                      bounces={false}
                      numColumns={2}
                    />
                  ) : homeDashboardData?.dashboardData?.barbers?.length ? (
                    <FlatList
                      key={2}
                      style={{
                        overflow: "visible",
                      }}
                      columnWrapperStyle={{
                        columnGap: scale(10),
                      }}
                      ItemSeparatorComponent={() => (
                        <View style={{ height: scale(10) }} />
                      )}
                      data={homeDashboardData?.dashboardData?.barbers.slice(
                        0,
                        sliceBarber,
                      )}
                      renderItem={({ item }) => <BarberCard item={item} />}
                      keyExtractor={(item) => item.barberId}
                      bounces={false}
                      numColumns={2}
                    />
                  ) : (
                    <View
                      style={{
                        height: verticalScale(100),
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: verticalScale(40),
                      }}
                    >
                      <CustomText>
                        {baseContent.barber.no}{" "}
                        {authenticatedUser?.salonType === "Barber Shop"
                          ? baseContent.barber.barbers
                          : baseContent.barber.stylists}{" "}
                        {baseContent.barber.available}
                      </CustomText>
                    </View>
                  )}

                  {sliceBarber <
                    homeDashboardData?.dashboardData?.barbers?.length && (
                    <Pressable
                      onPress={() => {
                        setSliceBarber(
                          homeDashboardData?.dashboardData?.barbers?.length,
                        );
                      }}
                      style={{
                        height: verticalScale(35),
                        // backgroundColor: "#00B0901A",
                        // backgroundColor: colors.accentColor,
                        backgroundColor: colors.accentColor,
                        borderRadius: scale(4),
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: verticalScale(15),
                        marginBottom: verticalScale(20)
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: scale(10),
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          {homeDashboardData?.dashboardData?.barbers
                            ?.slice(0, 3)
                            .map((item, index) => {
                              return (
                                <View
                                  key={index}
                                  style={{
                                    height: scale(25),
                                    width: scale(25),
                                    borderRadius: scale(20),
                                    marginLeft: -scale(1 * 5),
                                  }}
                                >
                                  <Image
                                    style={{
                                      height: "100%",
                                      width: "100%",
                                      borderRadius: scale(20),
                                    }}
                                    source={{ uri: item?.profile?.[0]?.url }}
                                    contentFit="cover"
                                    transition={300}
                                  />
                                </View>
                              );
                            })}
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: scale(5),
                          }}
                        >
                          <CustomText style={{ color: "#fff" }}>
                            {baseContent.barber.seeAll}{" "}
                            {authenticatedUser?.salonType === "Barber Shop"
                              ? baseContent.barber.barbers
                              : baseContent.barber.stylists}
                          </CustomText>
                          <RightIcon size={scale(14)} color={"#fff"} />
                        </View>
                      </View>
                    </Pressable>
                  )}
                </>
              ) : null;
            }
          }
        }}
        keyExtractor={(item) => item.title}
        ListFooterComponent={
          <View
            style={{ height: Platform.OS === "ios" ? verticalScale(60) : 0 }}
          />
        }
      />
    </CustomTabView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  btnContainer: {
    marginTop: verticalScale(24),
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(12),
  },
  joinQueue: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: verticalScale(12),
    borderRadius: scale(12),
    alignItems: "center",
    transform: [{ scale: 1 }],
  },
  joinQueueText: {
    // color: "#0d9488",
    color: "#000",
    fontWeight: "bold",
    fontSize: scale(14),
    fontFamily: "AirbnbCereal_W_XBd",
  },
  bookAhead: {
    flex: 1,
    // backgroundColor: "rgba(255,255,255,0.25)",
    backgroundColor: "#212121",
    paddingVertical: verticalScale(12),
    borderRadius: scale(12),
    alignItems: "center",
    transform: [{ scale: 1 }],
  },
  bookAheadText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: scale(14),
    fontFamily: "AirbnbCereal_W_XBd",
  },

  cardImage: {
    height: scale(80),
    width: scale(80),
    borderRadius: scale(8),
    marginBottom: verticalScale(5),
  },

  card: {
    borderRadius: scale(16),
    padding: scale(24),
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: scale(20),
    fontFamily: "AirbnbCereal_W_XBd",
    color: "#fff",
  },
  subtitle: {
    fontSize: scale(14),
    color: "#fff",
    opacity: 0.9,
    marginTop: verticalScale(4),
    maxWidth: "90%",
  },
  icon: {
    opacity: 0.5,
  },
  button: {
    marginTop: verticalScale(24),
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: verticalScale(12),
    borderRadius: scale(12),
    alignItems: "center",
    transform: [{ scale: 1 }],
  },
  buttonText: {
    color: "#0d9488",
    fontWeight: "bold",
    fontSize: scale(16),
  },

  heading: {
    fontSize: scale(18),
    fontFamily: "AirbnbCereal_W_XBd",
    marginBottom: verticalScale(10),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statusCard: {
    width: "47%",
    padding: scale(16),
    borderRadius: scale(12),
    marginBottom: verticalScale(15),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(0),
    // borderWidth: scale(1),
  },
  iconContainer: {
    padding: scale(12),
    borderRadius: scale(12),
    marginRight: scale(12),
  },

  value: {
    fontSize: scale(24),
    fontFamily: "AirbnbCereal_W_XBd",
  },

  hintCard: {
    // borderWidth: 1,
    borderRadius: scale(12),
    padding: scale(16),
    flexDirection: "row",
    gap: scale(12),
  },

  hintIconWrapper: {
    borderRadius: scale(12),
    width: scale(40),
    height: scale(40),
    justifyContent: "center",
    alignItems: "center",
  },

  hintTextWrapper: {
    // width: "80%",
    width: "100%",
  },

  hintTitle: {
    fontFamily: "AirbnbCereal_W_XBd",
    marginBottom: verticalScale(2),
  },

  sectionTitle: {
    fontSize: scale(20),
    fontWeight: "600",
    marginBottom: verticalScale(16),
  },
  scrollContainer: {
    paddingBottom: verticalScale(8),
  },
  serviceCard: {
    width: scale(160),
    marginRight: scale(16),
  },
  image: {
    width: "100%",
    height: verticalScale(192),
    borderRadius: scale(16),
    marginBottom: verticalScale(8),
    backgroundColor: "#e5e7eb",
  },
  serviceCardTitle: {
    textAlign: "center",
    fontWeight: "600",
  },

  moreWrapper: {
    alignSelf: "flex-end",
    backgroundColor: "#0f766e",
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(4),
    borderRadius: scale(8),
  },
  moreText: {
    color: "#fff",
    fontSize: moderateScale(12),
    fontFamily: "AirbnbCereal_W_Bd",
  },
});
