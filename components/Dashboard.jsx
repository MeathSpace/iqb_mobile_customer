import { BASE_URL } from "@/utils/api";
import { usePreventRemove, useTheme } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { RightIcon } from "../constants/icons";
import { useAuth } from "../context/AuthContext";
import { useGlobal } from "../context/GlobalContext";
import AdvertiseCard from "./AdvertiseCard";
import BarberCard from "./BarberCard";
import CustomTabView from "./CustomTabView";
import CustomText from "./CustomText";
import Skeleton from "./Skeleton";

import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { io } from "socket.io-client";

import Card from "./Card";
import Header from "./Header";
import SalonHint from "./SalonHint";
import StatusCard from "./StatusCard";

const { width, height } = Dimensions.get("window");

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

  useFocusEffect(
    useCallback(() => {
      const fetch_new_version = async () => {
        try {
          const { data } = await axios.get(
            `${BASE_URL}/version/getMobileVersion`,
          );
          const recentAppVersion = Constants.expoConfig.version;

          const newVersionAvailable = data?.response?.mobileVersion;

          if (recentAppVersion !== newVersionAvailable) {
            setLatestVersion(newVersionAvailable);
          } else {
            setLatestVersion("");
          }
        } catch (err) {
          console.log("Version fetch error", err);
        }
      };

      fetch_new_version();

      // cleanup (optional)
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
      label: "System",
      value: homeDashboardData?.dashboardData?.salonInfo
        ?.mobileBookingAvailability
        ? "Online"
        : "Offline",
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
      label: "Next In",
      value: homeDashboardData?.dashboardData?.leastQueueCount + 1,
      icon: "user-check",
      bgColor: "rgba(168, 85, 247, 0.1)", // purple-500/10
      iconColor: "#a855f7",
    },
    {
      label: "On Duty",
      value: homeDashboardData?.dashboardData?.barberOnDuty,
      icon: "scissors",
      bgColor: "rgba(56, 189, 248, 0.1)", // sky-500/10
      iconColor: "#38bdf8",
    },
    {
      label: "In Queue",
      value: homeDashboardData?.dashboardData?.totalQueueCount || 0,
      icon: "users",
      bgColor: "rgba(13, 148, 136, 0.1)", // teal-500/10
      iconColor: "#14b8a6",
    },
  ];

  const services = [
    {
      id: "1",
      title: "Haircut & Style",
      image:
        "https://images.unsplash.com/photo-1599351431202-184b39349549?q=80&w=2574&auto=format&fit=crop",
      fallback: "https://placehold.co/160x200/E5E7EB/1F2937?text=Haircut",
    },
    {
      id: "2",
      title: "Beard Trim",
      image:
        "https://images.unsplash.com/photo-1600948836842-8453549544b3?q=80&w=2574&auto=format&fit=crop",
      fallback: "https://placehold.co/160x200/E5E7EB/1F2937?text=Beard",
    },
    {
      id: "3",
      title: "Massage",
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2670&auto=format&fit=crop",
      fallback: "https://placehold.co/160x200/E5E7EB/1F2937?text=Massage",
    },
    {
      id: "4",
      title: "Spa Treatment",
      image:
        "https://images.unsplash.com/photo-1544161515-cfd826dbaa0b?q=80&w=2574&auto=format&fit=crop",
      fallback: "https://placehold.co/160x200/E5E7EB/1F2937?text=Spa",
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
        backgroundColor: colors.background, // Ensure solid background color
      }}
    >
      <FlatList
        data={pageData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: scale(15), // Increased for luxury "breathability"
          paddingTop: verticalScale(10),
          paddingBottom:
            Platform.OS === "ios" ? verticalScale(160) : verticalScale(120),
          gap: verticalScale(20), // Consistent large gap between sections
        }}
        renderItem={({ item }) => {
          switch (item.title) {
            case "header":
              return <Header />;

            case "hero":
              return (
                <Card
                  customerLivetData={customerLivetData}
                  cancelQueueLoading={cancelQueueLoading}
                  setCancelQueueLoading={setCancelQueueLoading}
                />
              );

            case "hint":
              return (
                <SalonHint
                  latestVersion={latestVersion}
                  lengthMore={lengthMore}
                  salonInfo={salonInfo}
                  textShown={textShown}
                  toggleNumberOfLines={toggleNumberOfLines}
                  onTextLayout={onTextLayout}
                />
              );

            case "status":
              return (
                <View>
                  <CustomText
                    style={{
                      fontFamily: "AirbnbCereal_W_XBd",
                      fontSize: moderateScale(18),
                      marginBottom: verticalScale(18),
                    }}
                  >
                    Live Queue Status
                  </CustomText>

                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      rowGap: verticalScale(14),
                    }}
                  >
                    {homeDashboardData?.loading
                      ? [1, 2, 3, 4].map((_, index) => (
                          <Skeleton
                            key={index}
                            width={(width - scale(46)) / 2}
                            height={verticalScale(85)}
                            borderRadius={moderateScale(24)}
                          />
                        ))
                      : statusData.map((item, index) => (
                          <StatusCard
                            key={index}
                            item={item}
                            index={index}
                            width={width}
                            height={height}
                          />
                        ))}
                  </View>
                </View>
              );

            case "barber": {
              const barberCount =
                homeDashboardData?.dashboardData?.barberOnDuty;
              if (!barberCount) return null;

              return (
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: verticalScale(18),
                    }}
                  >
                    <CustomText
                      style={{
                        fontFamily: "AirbnbCereal_W_XBd",
                        fontSize: moderateScale(18),
                      }}
                    >
                      {authenticatedUser?.salonType === "Barber Shop"
                        ? "Barbers"
                        : "Stylists"}{" "}
                      On Duty
                    </CustomText>

                    <View
                      style={{
                        backgroundColor: "#f1f5f9", // Light grey minimal badge
                        paddingHorizontal: scale(10),
                        paddingVertical: verticalScale(4),
                        borderRadius: scale(8),
                        borderWidth: 1,
                        borderColor: "#e2e8f0",
                      }}
                    >
                      <CustomText
                        style={{
                          fontFamily: "AirbnbCereal_W_Bd",
                          color: "#64748b",
                          fontSize: moderateScale(12),
                        }}
                      >
                        {barberCount} Online
                      </CustomText>
                    </View>
                  </View>

                  {homeDashboardData?.loading ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Skeleton
                        height={verticalScale(180)}
                        width={(width - scale(46)) / 2}
                        borderRadius={moderateScale(24)}
                      />
                      <Skeleton
                        height={verticalScale(180)}
                        width={(width - scale(46)) / 2}
                        borderRadius={moderateScale(24)}
                      />
                    </View>
                  ) : (
                    <FlatList
                      key={2}
                      scrollEnabled={false} // Important inside parent FlatList
                      columnWrapperStyle={{ justifyContent: "space-between" }}
                      ItemSeparatorComponent={() => (
                        <View style={{ height: scale(14) }} />
                      )}
                      data={homeDashboardData?.dashboardData?.barbers.slice(
                        0,
                        sliceBarber,
                      )}
                      renderItem={({ item }) => <BarberCard item={item} />}
                      keyExtractor={(item) => item.barberId}
                      numColumns={2}
                    />
                  )}

                  {sliceBarber <
                    homeDashboardData?.dashboardData?.barbers?.length && (
                    <Pressable
                      onPress={() =>
                        setSliceBarber(
                          homeDashboardData?.dashboardData?.barbers?.length,
                        )
                      }
                      style={{
                        height: verticalScale(50),
                        backgroundColor: "#14b8a6",
                        borderRadius: moderateScale(16),
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: verticalScale(20),
                        flexDirection: "row",
                        gap: scale(12),
                        elevation: 4,
                        shadowColor: "#14b8a6",
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {homeDashboardData?.dashboardData?.barbers
                          ?.slice(0, 3)
                          .map((item, index) => (
                            <Image
                              key={index}
                              style={{
                                height: scale(26),
                                width: scale(26),
                                borderRadius: scale(13),
                                borderWidth: 2,
                                borderColor: "#fff",
                                marginLeft: index === 0 ? 0 : -scale(8),
                              }}
                              source={{ uri: item?.profile?.[0]?.url }}
                            />
                          ))}
                      </View>
                      <CustomText
                        style={{
                          color: "#fff",
                          fontFamily: "AirbnbCereal_W_XBd",
                          fontSize: moderateScale(14),
                        }}
                      >
                        See all{" "}
                        {authenticatedUser?.salonType === "Barber Shop"
                          ? "barbers"
                          : "stylists"}
                      </CustomText>
                      <RightIcon size={scale(16)} color={"#fff"} />
                    </Pressable>
                  )}
                </View>
              );
            }
          }
        }}
        keyExtractor={(item) => item.title}
      />

      {/* FIXED PREMIUM FLOATING ADVERTISEMENT */}
      <View
        style={{
          position: "absolute",
          bottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(0),
          left: scale(16),
          right: scale(16),
          height: verticalScale(80),
          backgroundColor: colors.modalBgColor,
          // borderRadius: moderateScale(20),
          padding: scale(2),
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.queueBorder,
        }}
      >
        {homeAdvertisementData?.loading ? (
          <Skeleton
            width="100%"
            height="100%"
            borderRadius={moderateScale(18)}
          />
        ) : (
          <FlatList
            ref={flatlistRef}
            data={homeAdvertisementData?.advertisementData}
            renderItem={({ item }) => <AdvertiseCard item={item} />}
            keyExtractor={(item) => item._id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    </CustomTabView>
  );
};

export default Dashboard;

const ServiceCard = ({ title, image, fallback }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <TouchableOpacity style={styles.serviceCard} activeOpacity={0.8}>
      <Image
        source={{ uri: imgError ? fallback : image }}
        onError={() => setImgError(true)}
        style={styles.image}
      />
      <CustomText style={styles.serviceCardTitle}>{title}</CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    marginTop: verticalScale(24),
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(12), // or use marginRight on first button if gap isn't supported
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
    color: "#0d9488", // teal-600
    fontWeight: "bold",
    fontSize: scale(14),
    fontFamily: "AirbnbCereal_W_XBd",
  },
  bookAhead: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.25)", // white/25
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

  // Card Csss
  card: {
    borderRadius: scale(16),
    padding: scale(24),
    // marginBottom: verticalScale(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
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

  // Status Card

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
    // backgroundColor: '#fff',
    // backgroundColor: "#1F2937",
    width: "47%",
    padding: scale(16),
    borderRadius: scale(12),
    marginBottom: verticalScale(15),
    flexDirection: "row",
    alignItems: "center",
    gap: scale(0),
    borderWidth: scale(1),
    // borderColor: '#e5e7eb', // border-gray-200
  },
  iconContainer: {
    padding: scale(12),
    borderRadius: scale(12),
    marginRight: scale(12),
  },
  label: {
    // fontSize: scale(14),
    // color: '#6b7280', // text-gray-500
  },
  value: {
    fontSize: scale(24),
    fontFamily: "AirbnbCereal_W_XBd",
  },

  hintCard: {
    borderWidth: 1,
    borderRadius: scale(12),
    padding: scale(16),
    // marginBottom: verticalScale(24),
    flexDirection: "row",
    // alignItems: 'center',
    gap: scale(12),
  },

  hintIconWrapper: {
    // backgroundColor: '#f3f4f6',  // bg-gray-100
    // padding: scale(12),
    borderRadius: scale(12),
    width: scale(40),
    height: scale(40),
    justifyContent: "center",
    alignItems: "center",
  },

  hintTextWrapper: {
    width: "80%",
  },

  hintTitle: {
    fontFamily: "AirbnbCereal_W_XBd",
    // color: '#1f2937',            // text-gray-800
    // fontSize: scale(16),
    marginBottom: verticalScale(2),
  },

  hintDescription: {
    // fontSize: scale(13),
    // color: '#4b5563',            // text-gray-600
  },

  // Service Category Card

  container: {
    // marginBottom: verticalScale(32),
  },
  sectionTitle: {
    fontSize: scale(20),
    fontWeight: "600",
    // color: '#1f2937', // text-gray-800
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
    height: verticalScale(192), // equivalent to h-48
    borderRadius: scale(16),
    marginBottom: verticalScale(8),
    backgroundColor: "#e5e7eb",
  },
  serviceCardTitle: {
    textAlign: "center",
    fontWeight: "600",
    // color: '#374151', // text-gray-700
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
