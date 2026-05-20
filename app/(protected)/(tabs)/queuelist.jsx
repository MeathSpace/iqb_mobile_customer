import { BASE_URL } from "@/utils/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePreventRemove, useTheme } from "@react-navigation/native";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { io } from "socket.io-client";
import { Toast } from "toastify-react-native";
import CustomTabView from "../../../components/CustomTabView";
import CustomText from "../../../components/CustomText";
import QlistItem from "../../../components/QlistItem";
import Skeleton from "../../../components/Skeleton";
import { NotificationIcon } from "../../../constants/icons";
import { useAuth } from "../../../context/AuthContext";
import { useGlobal } from "../../../context/GlobalContext";
import i18n from "../../../src/localization/i18n";

const QueueList = () => {
  const baseContent = i18n.t("protected.queuelist");

  const { authenticatedUser } = useAuth();
  const { homeDashboardData } = useGlobal();

  const [qlistData, setQlistData] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const fetchQlist = async () => {
    try {
      setQlistData((prev) => ({ ...prev, loading: true }));

      const { data } = await axios.get(
        `${BASE_URL}/mobileRoutes/getQlistBySalonId`,
        {
          params: {
            salonId: authenticatedUser?.salonId,
            customerEmail: authenticatedUser?.email,
          },
        },
      );

      if (!data?.isJoinedQueue) {
        setQlistData((prev) => ({
          ...prev,
          loading: false,
          data: data?.response,
          success: true,
          error: null,
          isJoinedQueue: data?.isJoinedQueue,
        }));
        return;
      }

      const multipleBarbers = data?.response?.filter(
        (qlistItem) => qlistItem.customerEmail === authenticatedUser?.email,
      );

      const multipleBarberIds = multipleBarbers.map((item) => item.barberId);

      const filteredQlistData = data?.response?.filter((qlistItem) => {
        if (multipleBarberIds.includes(qlistItem.barberId)) {
          return qlistItem;
        }
      });

      setQlistData((prev) => ({
        ...prev,
        loading: false,
        data: filteredQlistData,
        success: true,
        error: null,
        isJoinedQueue: data?.isJoinedQueue,
      }));
    } catch (error) {
      setQlistData((prev) => ({
        ...prev,
        loading: false,
        data: null,
        success: false,
        error: error,
      }));
      console.log("Error fetching queue list ", error);
    }
  };

  const [showHideQueBtn, setShowHideQueBtn] = useState({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const fetchShowHideQueueButton = async () => {
    try {
      setShowHideQueBtn((prev) => ({ ...prev, loading: true }));

      const { data } = await axios.post(
        `${BASE_URL}/customer/showHideJoinQueueButton`,
        {
          customerEmail: authenticatedUser?.email,
        },
      );

      setShowHideQueBtn((prev) => ({
        ...prev,
        loading: false,
        data: data?.response,
        success: true,
        error: null,
      }));
    } catch (error) {
      setShowHideQueBtn((prev) => ({
        ...prev,
        loading: false,
        data: null,
        success: false,
        error: error,
      }));
      console.log("Error fetching queue button status ", error);
    }
  };

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


  // Create socket ref
  const socketRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      // Create socket connection ONLY if not already connected
      if (!socketRef.current) {
        socketRef.current = io("https://iqb-final.onrender.com", {
          transports: ["websocket"],
        });
      }

      const socket = socketRef.current;

      // Initial API calls
      fetchQlist();
      fetSalonFeatureData();
      fetchShowHideQueueButton();

      // Join socket rooms
      socket.emit("joinSalon", authenticatedUser?.salonId);

      socket.emit("customerJoinQueueButton", {
        salonId: authenticatedUser?.salonId,
        customerEmail: authenticatedUser?.email,
      });

      // Queue button toggle listener
      const handleQueueButtonToggle = (showhideQueueBtnDta) => {
        setShowHideQueBtn((prev) => ({
          ...prev,
          loading: false,
          data: showhideQueueBtnDta?.response,
          success: true,
          error: null,
        }));
      };

      // Queue update listener
      const handleQueueUpdated = (queueData) => {
        const multipleBarbers = queueData?.filter(
          (qlistItem) => qlistItem.customerEmail === authenticatedUser?.email,
        );

        // Customer not in queue anymore
        // Show full queue list
        if (multipleBarbers.length === 0) {
          setQlistData((prev) => ({
            ...prev,
            loading: false,
            data: queueData,
            success: true,
            error: null,
            isJoinedQueue: false,
          }));

          return;
        }

        // Customer still in queue
        // Show only related barber queues
        const multipleBarberIds = multipleBarbers.map((item) => item.barberId);

        const filteredQlistData = queueData?.filter((qlistItem) =>
          multipleBarberIds.includes(qlistItem.barberId),
        );

        setQlistData((prev) => ({
          ...prev,
          loading: false,
          data: filteredQlistData,
          success: true,
          error: null,
          isJoinedQueue: true,
        }));
      };

      // Register listeners
      socket.on("queueButtonToggle", handleQueueButtonToggle);
      socket.on("queueUpdated", handleQueueUpdated);

      // Cleanup
      return () => {
        socket.off("queueButtonToggle", handleQueueButtonToggle);
        socket.off("queueUpdated", handleQueueUpdated);

        // Disconnect socket when screen unfocuses
        socket.disconnect();
        socketRef.current = null;
      };
    }, [authenticatedUser]),
  );

  const { colors } = useTheme();

  const router = useRouter();

  // console.log("Queue List Data ", qlistData?.data)

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchQlist();
      setRefreshing(false);
    }, 2000);
  };

  const { newNotification, setNewNotification } = useGlobal();

  usePreventRemove(
    true, // This boolean determines if removal should be prevented
    ({ data }) => {},
  );

  return (
    <CustomTabView
      style={{
        justifyContent: "space-between",
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
        </Pressable>
      </View>

      <View
        style={{
          flex: 1,
          paddingBottom: Platform.OS === "ios" ? verticalScale(60) : 0,
        }}
      >
        {showHideQueBtn?.loading ? (
          <Skeleton
            height={verticalScale(50)}
            borderRadius={scale(12)}
            style={{
              marginBottom: verticalScale(15),
            }}
          />
        ) : !showHideQueBtn?.data?.isJoinedQueue &&
          qlistData?.data?.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(10),
            }}
          >
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
              style={[
                styles.queueButton,
                { backgroundColor: colors.accentColor },
              ]}
              activeOpacity={0.85}
            >
              <CustomText style={styles.queueButtonText}>
                {baseContent.joinQueue}
              </CustomText>
            </TouchableOpacity>
          </View>
        ) : null}

        {qlistData?.loading ? (
          <View
            style={[
              styles.queueListContainer,
              {
                borderColor: colors.queueBorder,
                backgroundColor: colors.cardColor,
              },
            ]}
          >
            <View
              style={[
                styles.queueListheader,
                { borderBottomColor: colors.queueBorder },
              ]}
            >
              <CustomText
                style={[
                  styles.queueListheaderText,
                  { color: colors.secondaryText, width: "37%" },
                ]}
              >
                {authenticatedUser?.salonType === "Barber Shop"
                  ? baseContent.barber
                  : baseContent.stylist}
              </CustomText>
              <CustomText
                style={[
                  styles.queueListheaderText,
                  {
                    color: colors.secondaryText,
                    width: "33%",
                    textAlign: "center",
                  },
                ]}
              >
                {baseContent.customer}
              </CustomText>
              <CustomText
                style={[
                  styles.queueListheaderText,
                  {
                    color: colors.secondaryText,
                    width: "28%",
                    textAlign: "right",
                  },
                ]}
              >
                {baseContent.posWait}
              </CustomText>
            </View>
            <FlatList
              data={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
              contentContainerStyle={{ padding: scale(5) }}
              renderItem={({ item, index }) => (
                <Skeleton
                  width="100%"
                  height={verticalScale(60)}
                  style={{
                    marginBottom: verticalScale(5),
                  }}
                />
              )}
            />
          </View>
        ) : qlistData?.data?.length > 0 ? (
          <View
            style={[
              styles.queueListContainer,
              {
                borderColor: colors.queueBorder,
                backgroundColor: colors.cardColor,
              },
            ]}
          >
            <View
              style={[
                styles.queueListheader,
                {
                  borderBottomColor: colors.queueBorder,
                },
              ]}
            >
              <CustomText
                style={[
                  styles.queueListheaderText,
                  { color: colors.secondaryText, width: "37%" },
                ]}
              >
                {authenticatedUser?.salonType === "Barber Shop"
                  ? baseContent.barber
                  : baseContent.stylist}
              </CustomText>
              <CustomText
                style={[
                  styles.queueListheaderText,
                  {
                    color: colors.secondaryText,
                    width: "33%",
                    textAlign: "center",
                  },
                ]}
              >
                {baseContent.customer}
              </CustomText>
              <CustomText
                style={[
                  styles.queueListheaderText,
                  {
                    color: colors.secondaryText,
                    width: "28%",
                    textAlign: "right",
                  },
                ]}
              >
                {baseContent.posWait}
              </CustomText>
            </View>
            <FlatList
              data={qlistData?.data}
              renderItem={({ item, index }) => (
                <QlistItem
                  item={item}
                  index={index}
                  qlistLength={qlistData?.data}
                  setQlistData={setQlistData}
                  setShowHideQueBtn={setShowHideQueBtn}
                />
              )}
              keyExtractor={(item) => item._id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["black"]}
                  progressBackgroundColor={"#fff"}
                />
              }
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={[
                styles.noQueueContainer,
                {
                  borderColor: colors.queueBorder,
                  backgroundColor: colors.cardColor,
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
                  name={"users"}
                  size={moderateScale(32)}
                  color={colors.accentColor}
                />
              </View>

              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_XBd",
                  fontSize: scale(18),
                  textAlign: "center",
                }}
              >
                {baseContent.empty.heading}
              </CustomText>

              <CustomText
                style={{
                  textAlign: "center",
                  marginBottom: verticalScale(10),
                }}
              >
                {baseContent.empty.subHeading}
              </CustomText>

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
                style={[
                  styles.queueButton,
                  {
                    backgroundColor: `${colors.accentColor}`,
                  },
                ]}
                activeOpacity={0.85}
              >
                <CustomText style={styles.queueButtonText}>
                  {baseContent.empty.joinQueue}
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </CustomTabView>
  );
};

export default QueueList;

const styles = StyleSheet.create({
  queueButton: {
    width: "100%",
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    marginBottom: verticalScale(15),
    alignItems: "center",
    justifyContent: "center",
  },
  queueButtonText: {
    color: "#fff",
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: verticalScale(40),
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

  queueListContainer: {
    flex: Platform.OS === "ios" ? 0.93 : 0.98,
    borderWidth: scale(1),
    borderRadius: scale(12),
  },

  queueListheader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: verticalScale(40),
    paddingHorizontal: scale(12),
    borderBottomWidth: scale(1),
    gap: scale(2),
  },
  queueListheaderText: {
    fontFamily: "AirbnbCereal_W_Bd",
    fontSize: scale(14),
  },

  noQueueContainer: {
    width: "100%",
    borderWidth: scale(1),
    borderRadius: scale(12),
    // flex: 0.90,
    padding: scale(30),
    gap: verticalScale(10),
  },

  iconContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(80),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "auto",
  },
});
