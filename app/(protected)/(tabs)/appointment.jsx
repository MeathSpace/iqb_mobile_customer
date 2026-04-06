import { BASE_URL } from "@/utils/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePreventRemove, useTheme } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import moment from "moment/moment";
import { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { io } from "socket.io-client";
import { Toast } from "toastify-react-native";
import CustomSecondaryText from "../../../components/CustomSecondaryText";
import CustomTabView from "../../../components/CustomTabView";
import CustomText from "../../../components/CustomText";
import Skeleton from "../../../components/Skeleton";
import { NotificationIcon } from "../../../constants/icons";
import { useAuth } from "../../../context/AuthContext";
import { useGlobal } from "../../../context/GlobalContext";
import i18n from "../../../src/localization/i18n";
import { ddmmformatDate } from "../../../utils/ddmmformatDate";

const appointment = () => {
  const baseContent = i18n.t("protected.appointment");

  const customPageData = ["header", "list"];

  const [selectedTab, setSelectedTab] = useState("All");

  const [tabs, setTabs] = useState(["All", "Upcoming", "Served", "Cancelled"]);

  const router = useRouter();
  const {
    setJoinModes,
    joinModes,
    applyAppointmentFilter,
    setApplyAppointmentFilter,
    newNotification,
    setNewNotification,
    appointmentListData,
    setAppointmentListData,
    setAppointmentPopupType,
  } = useGlobal();

  const { authenticatedUser } = useAuth();

  // const [appointmentListData, setAppointmentListData] = useState({
  //   data: null,
  //   loading: false,
  //   error: null,
  //   success: false
  // })

  const socket = io("https://iqb-final.onrender.com", {
    transports: ["websocket"],
  });

  const [getSalonFeature, setGetSalonFeature] = useState({
    salonFeature: null,
    loading: false,
    error: null,
    success: false,
  });

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

  useFocusEffect(
    useCallback(() => {
      fetSalonFeatureData();

      if (applyAppointmentFilter.open) {
        // socket.emit("joinSalon", authenticatedUser?.salonId);

        socket.emit("customerAppointmentList", {
          salonId: authenticatedUser?.salonId,
          customerEmail: authenticatedUser?.email,
        });

        socket.on("appointmentsUpdated", (appointmentData) => {
          setAppointmentListData((prev) => ({
            ...prev,
            loading: false,
            data: appointmentData,
            success: true,
            error: null,
          }));
        });

        const fetchAppointmentList = async () => {
          try {
            setAppointmentListData((prev) => ({ ...prev, loading: true }));

            const { data } = await axios.post(
              `${BASE_URL}/mobileRoutes/getAllCustomerAppointments`,
              {
                salonId: authenticatedUser?.salonId,
                customerEmail: authenticatedUser?.email,
                status: applyAppointmentFilter.selectedTab,
              },
            );

            setAppointmentListData((prev) => ({
              ...prev,
              loading: false,
              data: data?.response,
              success: true,
              error: null,
            }));
          } catch (error) {
            setAppointmentListData((prev) => ({
              ...prev,
              loading: false,
              data: null,
              success: false,
              error: error,
            }));
            console.log("Error fetching appointment list ", error);
          }
        };

        fetchAppointmentList();
      }
    }, [authenticatedUser, applyAppointmentFilter]),
  );

  const { colors } = useTheme();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setApplyAppointmentFilter({
        selectedTab: "all",
        open: true,
      });
      setRefreshing(false);
    }, 2000);
  };

  const upcomingAppointments =
    appointmentListData?.data?.filter((item) => item.status === "upcoming") ||
    [];
  const pastAppointments =
    appointmentListData?.data?.filter((item) => item.status !== "upcoming") ||
    [];

  const hasUpcoming = upcomingAppointments.length > 0;
  const hasPast = pastAppointments.length > 0;

  const sections = [];
  if (hasUpcoming) {
    sections.push({ title: "Upcoming", data: upcomingAppointments });
  }
  if (hasPast) {
    sections.push({ title: "Past", data: pastAppointments });
  }

  // console.log(newNotification.value)

  usePreventRemove(
    true, // This boolean determines if removal should be prevented
    ({ data }) => {},
  );

  function formatMinutesToHrMin(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
    if (hours > 0) return `${hours}hr`;
    return `${mins}m`;
  }

  return (
    <CustomTabView
      style={{
        paddingVertical: verticalScale(0),
        paddingTop: verticalScale(0),
        backgroundColor: colors.background,
      }}
    >
      <View style={styles.header}>
        <CustomText
          style={{ fontSize: scale(18), fontFamily: "AirbnbCereal_W_XBd" }}
        >
          {baseContent.header}
        </CustomText>

        {/* Right section - Notification bell */}
        <Pressable
          style={styles.bellWrapper}
          activeOpacity={0.7}
          onPress={async () => {
            if (newNotification.value) {
              await AsyncStorage.setItem(
                "newNotification",
                JSON.stringify({
                  email: authenticatedUser?.email,
                  value: false,
                }),
              );
              setNewNotification({
                email: "",
                value: false,
              });
            }

            router.push("/notification");
          }}
        >
          <NotificationIcon
            size={moderateScale(24)}
            color={colors.notificationBellColor}
          />
          {/* {
            newNotification.value && (
              <View style={styles.badge} />
            )
          } */}
        </Pressable>
      </View>

      <>
        {appointmentListData?.loading ? (
          [0, 1, 2, 3, 4, 5].map((_, index) => (
            <Skeleton
              key={index}
              height={verticalScale(80)}
              borderRadius={scale(12)}
              style={{ marginVertical: verticalScale(5) }}
            />
          ))
        ) : !hasUpcoming && !hasPast ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: Platform.OS === "ios" ? verticalScale(60) : 0,
            }}
          >
            <View
              style={[
                styles.upcomingCard,
                {
                  backgroundColor: colors.cardColor,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${colors.accentColor}1A` },
                ]}
              >
                <Feather
                  name={"calendar"}
                  size={moderateScale(32)}
                  color={colors.accentColor}
                />
              </View>
              <CustomText style={styles.cardTitle}>
                {baseContent.noAppointment.header}
              </CustomText>
              <CustomSecondaryText
                style={[
                  styles.cardSubtitle,
                  { marginBottom: verticalScale(10) },
                ]}
              >
                {baseContent.noAppointment.subHeader}
              </CustomSecondaryText>
              <TouchableOpacity
                onPress={() => {
                  if (!getSalonFeature?.salonFeature?.isAppointments) {
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
                  styles.bookButton,
                  { backgroundColor: colors.accentColor },
                ]}
                activeOpacity={0.85}
              >
                <CustomText style={styles.bookButtonText}>
                  {baseContent.noAppointment.buttonText}
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {!hasUpcoming && hasPast && (
              <View
                style={[
                  styles.upcomingCard,
                  {
                    backgroundColor: colors.cardColor,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${colors.accentColor}1A` },
                  ]}
                >
                  <Feather
                    name={"calendar"}
                    size={moderateScale(32)}
                    color={colors.accentColor}
                  />
                </View>
                <CustomText style={styles.cardTitle}>
                  {baseContent.noAppointment.header}
                </CustomText>
                <CustomSecondaryText
                  style={[
                    styles.cardSubtitle,
                    { marginBottom: verticalScale(10) },
                  ]}
                >
                  {baseContent.noAppointment.subHeader}
                </CustomSecondaryText>
                <TouchableOpacity
                  onPress={() => {
                    if (!getSalonFeature?.salonFeature?.isAppointments) {
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
                    styles.bookButton,
                    { backgroundColor: colors.accentColor },
                  ]}
                  activeOpacity={0.85}
                >
                  <CustomText style={styles.bookButtonText}>
                    {baseContent.noAppointment.buttonText}
                  </CustomText>
                </TouchableOpacity>
              </View>
            )}
            <SectionList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["black"]}
                  progressBackgroundColor={"#fff"}
                />
              }
              sections={sections}
              keyExtractor={(item, index) => `${item._id}_${index}`}
              renderSectionHeader={({ section: { title } }) => (
                <>
                  {title === "Upcoming" ? (
                    <TouchableOpacity
                      onPress={() => {
                        if (!getSalonFeature?.salonFeature?.isAppointments) {
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
                      }}
                      style={[
                        styles.bookButton,
                        {
                          backgroundColor: colors.accentColor,
                          marginBottom: verticalScale(15),
                        },
                      ]}
                      activeOpacity={0.85}
                    >
                      <CustomText style={styles.bookButtonText}>
                        {baseContent.noAppointment.buttonText}
                      </CustomText>
                    </TouchableOpacity>
                  ) : null}

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <CustomText style={styles.Listheader}>
                      {title === "Upcoming" ? baseContent.upcoming : baseContent.past}
                    </CustomText>
                    {title === "Past" && (
                      <View
                        style={{
                          marginLeft: scale(8),
                          width: scale(24),
                          height: scale(24),
                          borderRadius: scale(12),
                          backgroundColor: colors.cardColor,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CustomText style={{ fontSize: scale(14) }}>
                          {pastAppointments.length}
                        </CustomText>
                      </View>
                    )}
                  </View>
                </>
              )}
              renderItem={({ item, section }) => (
                <Pressable
                  onPress={() => {
                    if (item.status === "upcoming") {
                      setAppointmentPopupType({
                        selectServices: item?.selectServices,
                        selectBarber: item?.selectBarber,
                      });

                      router.push({
                        pathname: "/appointmentPop",
                        params: {
                          selectedAppointment: JSON.stringify(item),
                        },
                      });
                    } else {
                      Alert.alert(
                        "Warning",
                        `This appointment is already ${item.status}`,
                        [{ text: "OK", onPress: () => {} }],
                        { cancelable: true },
                      );
                    }
                  }}
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.cardColor,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: item?.barberProfile?.[0]?.url }}
                    style={[
                      styles.image,
                      {
                        borderWidth: scale(1),
                        borderColor: colors.queueBorder,
                      },
                    ]}
                  />
                  <View style={styles.info}>
                    <CustomText
                      style={[
                        styles.title,
                        { fontFamily: "AirbnbCereal_W_XBd" },
                      ]}
                      numberOfLines={1}
                    >
                      {item.barbername}
                    </CustomText>

                    <CustomSecondaryText style={styles.datetime}>
                      {`${moment(item?.appointmentDate).format(
                        "dddd",
                      )}  |  ${ddmmformatDate(
                        item?.appointmentDate?.split("T")[0],
                      )}  |  ${item?.timeSlots?.split("-")[0]}`}
                    </CustomSecondaryText>

                    <CustomSecondaryText style={[styles.meta, {}]}>
                      {authenticatedUser?.currency}{" "}
                      {item?.services?.reduce(
                        (sum, service) => sum + (service?.servicePrice || 0),
                        0,
                      )}{" "}
                      • {item?.services.length}{" "}
                      {item?.services.length > 1 ? baseContent.services : baseContent.service}
                    </CustomSecondaryText>

                    <View style={styles.footer}>
                      {section.title !== "Upcoming" && (
                        <CustomText
                          style={{
                            fontSize: scale(14),
                            // backgroundColor:
                            //   item.status === "served"
                            //     ? "rgba(34, 197, 94, 0.1)"
                            //     : "rgba(239, 68, 68, 0.1)",
                            // color:
                            //   item.status === "served" ? "#14b8a6" : "#ef4444",
                            backgroundColor: `${colors.accentColor}1A`,
                            color: colors.accentColor,
                            paddingHorizontal: scale(10),
                            paddingVertical: verticalScale(3),
                            borderRadius: scale(15),
                          }}
                        >
                          {item.status}
                        </CustomText>
                      )}

                      {section.title !== "Upcoming" && (
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
                          }}
                          style={[
                            styles.rebookButton,
                            {
                              // backgroundColor: `${colors.accentColor}1A`
                              backgroundColor: colors.background,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.rebookText,
                              {
                                color: colors.text,
                              },
                            ]}
                          >
                            {baseContent.bookAgain}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </Pressable>
              )}
              contentContainerStyle={{
                paddingBottom:
                  Platform.OS === "ios" ? verticalScale(70) : verticalScale(20),
                gap: verticalScale(15),
              }}
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled={false}
            />
          </>
        )}
      </>
    </CustomTabView>
  );
};

export default appointment;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: verticalScale(40)
  },

  bellWrapper: {
    padding: scale(8),
    borderRadius: scale(999),
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: scale(6),
    right: scale(6),
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: "#2dd4bf", // bg-teal-400
  },

  Listheader: {
    fontSize: moderateScale(18),
    fontFamily: "AirbnbCereal_W_XBd",
  },

  upcomingCard: {
    borderRadius: scale(12),
    padding: scale(20),
    alignItems: "center",
    borderWidth: scale(1),
    gap: verticalScale(10),
    marginBottom: verticalScale(10),
  },

  iconContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(80),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "auto",
  },
  cardTitle: {
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(18),
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: scale(16),
    textAlign: "center",
  },
  bookButton: {
    // bg-teal-500
    paddingVertical: verticalScale(16), // py-4
    borderRadius: scale(12), // rounded-xl
    paddingHorizontal: scale(60),
  },
  bookButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
    textAlign: "center",
  },

  card: {
    flexDirection: "row",
    borderRadius: scale(12),
    padding: scale(12),
    borderWidth: scale(1),
  },
  image: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(12),
    marginRight: scale(12),
  },
  info: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    // fontSize: scale(16),
    // fontWeight: "600",
  },
  datetime: {
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(8),
  },
  meta: {
    fontSize: moderateScale(12.5),
  },
  rebookButton: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
    borderRadius: scale(6),
  },
  rebookText: {
    fontSize: scale(12),
    fontWeight: "500",
  },
});
