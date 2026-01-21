import { BASE_URL } from "@/utils/api";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePreventRemove, useTheme } from "@react-navigation/native";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
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
import CustomSecondaryText from "../../../components/CustomSecondaryText";
import CustomTabView from "../../../components/CustomTabView";
import CustomText from "../../../components/CustomText";
import QlistItem from "../../../components/QlistItem";
import Skeleton from "../../../components/Skeleton";
import { NotificationIcon } from "../../../constants/icons";
import { useAuth } from "../../../context/AuthContext";
import { useGlobal } from "../../../context/GlobalContext";

const QueueList = () => {
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
      // console.log(data)

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
      fetchQlist();
      fetSalonFeatureData();

      fetchShowHideQueueButton();

      socket.emit("joinSalon", authenticatedUser?.salonId); // this is for queue list

      socket.emit("customerJoinQueueButton", {
        salonId: authenticatedUser?.salonId,
        customerEmail: authenticatedUser?.email,
      }); // this is for show/hide joinqueue button

      socket.on("queueButtonToggle", (showhideQueueBtnDta) => {
        // console.log("showhideBtn ", showhideQueueBtnDta)
        setShowHideQueBtn((prev) => ({
          ...prev,
          loading: false,
          data: showhideQueueBtnDta?.response,
          success: true,
          error: null,
        }));
      });

      socket.on("queueUpdated", (queueData) => {
        const multipleBarbers = queueData?.filter(
          (qlistItem) => qlistItem.customerEmail === authenticatedUser?.email,
        );

        const multipleBarberIds = multipleBarbers.map((item) => item.barberId);

        const filteredQlistData = queueData?.filter((qlistItem) => {
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
        }));
      });
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
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      {/* ===== HEADER ===== */}
      <View
        style={{
          paddingHorizontal: scale(10),
          paddingBottom: verticalScale(10),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <CustomText
            style={{
              fontFamily: "AirbnbCereal_W_XBd",
              fontSize: moderateScale(22),
            }}
          >
            Live Queue
          </CustomText>
          <CustomSecondaryText
            style={{
              fontSize: moderateScale(13),
              marginTop: verticalScale(4),
              color: "#64748b",
            }}
          >
            See who's waiting in real time
          </CustomSecondaryText>
        </View>

        <Pressable
          style={{
            width: scale(44),
            height: scale(44),
            borderRadius: moderateScale(22),
            backgroundColor: colors.cardColor,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.queueBorder,
          }}
          onPress={async () => {
            if (newNotification.value) {
              await AsyncStorage.setItem(
                "newNotification",
                JSON.stringify({
                  email: authenticatedUser?.email,
                  value: false,
                }),
              );
              setNewNotification({ email: "", value: false });
            }
            router.push("/notification");
          }}
        >
          <NotificationIcon
            size={moderateScale(22)}
            color={colors.notificationBellColor}
          />
        </Pressable>
      </View>

      {/* ===== BODY ===== */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: scale(10),
          paddingBottom: Platform.OS === "ios" ? verticalScale(60) : 0,
        }}
      >
        {/* ===== JOIN QUEUE CTA ===== */}
        {!showHideQueBtn?.loading &&
          !showHideQueBtn?.data?.isJoinedQueue &&
          qlistData?.data?.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                if (!getSalonFeature?.salonFeature?.isQueuing)
                  return Toast.error("Queueing feature is not available");
                if (
                  !homeDashboardData?.dashboardData?.salonInfo
                    ?.mobileBookingAvailability
                )
                  return Toast.error("Mobile queueing is off");
                router.push("/joinpopup");
              }}
              style={{
                backgroundColor: "#14b8a6",
                paddingVertical: verticalScale(16),
                borderRadius: moderateScale(16),
                alignItems: "center",
                marginBottom: verticalScale(16),
                shadowColor: "#14b8a6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
              }}
            >
              <CustomText
                style={{
                  color: "#fff",
                  fontFamily: "AirbnbCereal_W_Bd",
                  fontSize: moderateScale(16),
                }}
              >
                Join Queue
              </CustomText>
            </TouchableOpacity>
          )}

        {/* ===== QUEUE CARD ===== */}
        {qlistData?.loading ? (
          <View
            style={{
              backgroundColor: colors.cardColor,
              borderRadius: moderateScale(24),
              padding: scale(16),
              borderWidth: 1,
              borderColor: colors.queueBorder,
            }}
          >
            {[...Array(6)].map((_, i) => (
              <Skeleton
                key={i}
                height={verticalScale(56)}
                borderRadius={scale(14)}
                style={{ marginBottom: verticalScale(10) }}
              />
            ))}
          </View>
        ) : qlistData?.data?.length > 0 ? (
          <View
            style={{
              backgroundColor: colors.cardColor,
              borderRadius: moderateScale(24),
              borderWidth: 1,
              borderColor: colors.queueBorder,
              overflow: "hidden",
            }}
          >
            {/* ===== LIST HEADER ===== */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: verticalScale(14),
                paddingHorizontal: scale(16),
                borderBottomWidth: 1,
                borderColor: colors.queueBorder,
                backgroundColor: colors.cardColor,
              }}
            >
              <CustomSecondaryText style={{ width: "37%" }}>
                {authenticatedUser?.salonType === "Barber Shop"
                  ? "BARBER"
                  : "STYLIST"}
              </CustomSecondaryText>
              <CustomSecondaryText
                style={{ width: "33%", textAlign: "center" }}
              >
                CUSTOMER
              </CustomSecondaryText>
              <CustomSecondaryText style={{ width: "28%", textAlign: "right" }}>
                POS / WAIT
              </CustomSecondaryText>
            </View>

            <FlatList
              data={qlistData?.data}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => (
                <QlistItem
                  item={item}
                  index={index}
                  qlistLength={qlistData?.data}
                  setQlistData={setQlistData}
                  setShowHideQueBtn={setShowHideQueBtn}
                />
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        ) : (
          /* ===== EMPTY STATE ===== */
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: colors.cardColor,
                borderRadius: moderateScale(24),
                padding: scale(28),
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.queueBorder,
              }}
            >
              <View
                style={{
                  width: scale(72),
                  height: scale(72),
                  borderRadius: moderateScale(36),
                  backgroundColor: "rgba(20,184,166,0.12)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: verticalScale(16),
                }}
              >
                <Feather name="users" size={32} color="#14b8a6" />
              </View>

              <CustomText
                style={{
                  fontFamily: "AirbnbCereal_W_XBd",
                  fontSize: moderateScale(20),
                  textAlign: "center",
                }}
              >
                The queue is empty
              </CustomText>

              <CustomSecondaryText
                style={{
                  textAlign: "center",
                  marginVertical: verticalScale(8),
                }}
              >
                No one is waiting right now. Be the first to join!
              </CustomSecondaryText>

              <TouchableOpacity
                onPress={() => router.push("/joinpopup")}
                style={{
                  marginTop: verticalScale(12),
                  backgroundColor: "#14b8a6",
                  paddingVertical: verticalScale(14),
                  paddingHorizontal: scale(28),
                  borderRadius: moderateScale(16),
                }}
              >
                <CustomText
                  style={{
                    color: "#fff",
                    fontFamily: "AirbnbCereal_W_Bd",
                    fontSize: moderateScale(16),
                  }}
                >
                  Join Queue
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


// import { Platform, StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { scale, verticalScale } from 'react-native-size-matters'
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

// const queuelist = () => {

//     const insets = useSafeAreaInsets();

//     return (
//         <View style={{
//             flex: 1,
//             backgroundColor: "red",
//             justifyContent: "center",
//             alignItems: "center",
//             paddingBottom: Platform.OS === "ios" ? insets.bottom : undefined
//         }}>
//             <View style={{
//                 height: scale(200),
//                 width: scale(200),
//                 backgroundColor: "#fff"
//             }}>

//             </View>
//         </View>
//     )
// }

// export default queuelist

// const styles = StyleSheet.create({})
