import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Toast } from "toastify-react-native";
import CustomSecondaryText from "../../../components/CustomSecondaryText";
import CustomText from "../../../components/CustomText";
import Skeleton from "../../../components/Skeleton";
import { ArrowLeftIcon, NotificationOffIcon } from "../../../constants/icons";
import { useAuth } from "../../../context/AuthContext";
import { useGlobal } from "../../../context/GlobalContext";
import i18n from "../../../src/localization/i18n"
import api from "../../../utils/api";

const notification = () => {
  const router = useRouter();
  const { colors } = useTheme();

  const { notificationListData, setNotificationListData } = useGlobal();
  const { authenticatedUser } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const fetchNotifications = async () => {
        try {
          setNotificationListData((prev) => ({ ...prev, loading: true }));

          const { data } = await api.post(
            `/mobileRoutes/getAllNotificationsByCustomerEmail`,
            {
              email: authenticatedUser?.email,
            },
          );

          // console.log(JSON.stringify(data?.response, null, 2));

          setNotificationListData((prev) => ({
            ...prev,
            loading: false,
            notificationData: data?.response,
            success: true,
            error: null,
          }));
        } catch (error) {
          setNotificationListData((prev) => ({
            ...prev,
            loading: false,
            notificationData: null,
            success: false,
            error: error,
          }));
          console.log("Error fetching notifications ", error);
        }
      };

      fetchNotifications();
    }, []),
  );

  const cancelNotificationPressed = (item) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification ?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const cancelNotificationData = {
                customerEmail: authenticatedUser?.email,
                id: item?._id,
              };

              const { data } = await api.post(
                `/mobileRoutes/deleteNotifications`,
                cancelNotificationData,
              );

              Toast.success(data?.message || "Customer cancelled successfully");

              setNotificationListData((prev) => ({ ...prev, loading: true }));

              const { data: notificationListData } = await api.post(
                `/mobileRoutes/getAllNotificationsByCustomerEmail`,
                {
                  email: authenticatedUser?.email,
                },
              );

              // console.log(JSON.stringify(data?.response, null, 2));

              setNotificationListData((prev) => ({
                ...prev,
                loading: false,
                notificationData: notificationListData?.response,
                success: true,
                error: null,
              }));
            } catch (error) {
              Toast.error(error?.response?.data?.message);
              console.log("Canceled queue error ", error?.response?.data);
              setQlistData((prev) => ({
                ...prev,
                loading: false,
                data: null,
                success: false,
                error: error,
              }));
              setShowHideQueBtn((prev) => ({
                ...prev,
                loading: false,
                data: null,
                success: false,
                error: error,
              }));
            }
          },
        },
      ],
    );
  };

  return (
    <View
      style={{
        paddingHorizontal: scale(10),
        paddingTop: verticalScale(10),
        backgroundColor: colors.background,
        paddingVertical: verticalScale(0),
        flex: 1,
        paddingBottom:
          Platform.OS === "ios" ? verticalScale(80) : verticalScale(20),
        gap: verticalScale(10),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: scale(10),
        }}
      >
        <Pressable onPress={() => router.replace("/home")}>
          <ArrowLeftIcon color={colors.text} />
        </Pressable>
        <CustomText
          style={{
            flex: 1,
            fontSize: scale(18),
            fontFamily: "AirbnbCereal_W_XBd",
          }}
        >
          {i18n.t("protected.notification.header")}
        </CustomText>
      </View>

      <ScrollView
        contentContainerStyle={{
          gap: verticalScale(10),
          paddingBottom: verticalScale(20),
          flexGrow:
            notificationListData?.loading ||
            notificationListData?.notificationData?.length > 0
              ? 0
              : 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {notificationListData?.loading ? (
          <>
            <Skeleton
              height={verticalScale(70)}
              style={{
                borderRadius: scale(10),
              }}
            />
            <Skeleton
              height={verticalScale(70)}
              style={{
                borderRadius: scale(10),
              }}
            />
            <Skeleton
              height={verticalScale(70)}
              style={{
                borderRadius: scale(10),
              }}
            />
            <Skeleton
              height={verticalScale(70)}
              style={{
                borderRadius: scale(10),
              }}
            />
            <Skeleton
              height={verticalScale(70)}
              style={{
                borderRadius: scale(10),
              }}
            />
          </>
        ) : notificationListData?.notificationData?.length > 0 ? (
          notificationListData?.notificationData?.map((item, index) => (
            <TouchableOpacity
              onPress={() => cancelNotificationPressed(item)}
              key={index}
              style={{
                paddingVertical: verticalScale(15),
                flexDirection: "row",
                gap: scale(10),
                borderRadius: scale(12),
                paddingHorizontal: scale(15),
                backgroundColor: colors.cardColor,
                borderColor: colors.queueBorder,
                borderWidth: scale(1),
              }}
            >
              <Image
                style={{
                  height: scale(45),
                  width: scale(45),
                  borderRadius: scale(40),
                }}
                source={{ uri: item?.salonLogo?.[0]?.url }}
                contentFit="cover"
                transition={300}
              />

              <View style={{ gap: verticalScale(3), flex: 1 }}>
                <CustomText
                  style={{
                    // fontSize: scale(14),
                    fontFamily: "AirbnbCereal_W_Bd",
                  }}
                >
                  {item?.title}
                </CustomText>

                <CustomSecondaryText
                  style={
                    {
                      // fontSize: scale(12),
                    }
                  }
                >
                  {item?.body}
                </CustomSecondaryText>
              </View>
            </TouchableOpacity>
          ))
        ) : (
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
                { backgroundColor: "rgba(13, 148, 136, 0.1)" },
              ]}
            >
              <NotificationOffIcon
                size={moderateScale(32)}
                color={colors.accentColor}
              />
            </View>

            <CustomText
              style={{
                fontFamily: "AirbnbCereal_W_XBd",
                fontSize: scale(20),
                textAlign: "center",
              }}
            >
              No Notification
            </CustomText>

            <CustomText
              style={{
                fontFamily: "AirbnbCereal_W_Bd",
                fontSize: scale(16),
                textAlign: "center",
                color: colors.secondaryText,
              }}
            >
              You don't have notification
            </CustomText>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default notification;

const styles = StyleSheet.create({
  noQueueContainer: {
    width: "100%",
    borderWidth: scale(1),
    borderRadius: scale(12),
    // flex: 0.90,
    padding: scale(30),
    gap: verticalScale(20),
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

// import { useState, useEffect, useRef } from 'react';
// import { Text, View, Button, Platform } from 'react-native';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldPlaySound: true,
//         shouldSetBadge: true,
//         shouldShowBanner: true,
//         shouldShowList: true,
//     }),
// });

// async function sendPushNotification(expoPushToken) {
//     try {
//         const message = {
//             to: expoPushToken,
//             sound: 'default',
//             title: 'Original Title',
//             body: 'And here is the body!',
//             data: { someData: 'goes here' },
//             priority: 'high',
//             channelId: 'default',
//         };

//         const response = await fetch('https://exp.host/--/api/v2/push/send', {
//             method: 'POST',
//             headers: {
//                 Accept: 'application/json',
//                 'Accept-encoding': 'gzip, deflate',
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(message),
//         });

//         const result = await response.json(); // ✅ Get actual result
//         console.log("Push notification response:", result);

//     } catch (error) {
//         console.log("Error sending notification ", error)
//     }
// }

// function handleRegistrationError(errorMessage) {
//     alert(errorMessage);
//     throw new Error(errorMessage);
// }

// async function registerForPushNotificationsAsync() {
//     if (Platform.OS === 'android') {
//         Notifications.setNotificationChannelAsync('default', {
//             name: 'default',
//             importance: Notifications.AndroidImportance.MAX,
//             vibrationPattern: [0, 250, 250, 250],
//             lightColor: '#FF231F7C',
//         });
//     }

//     if (Device.isDevice) {
//         const { status: existingStatus } = await Notifications.getPermissionsAsync();
//         let finalStatus = existingStatus;
//         if (existingStatus !== 'granted') {
//             const { status } = await Notifications.requestPermissionsAsync();
//             finalStatus = status;
//         }
//         if (finalStatus !== 'granted') {
//             handleRegistrationError('Permission not granted to get push token for push notification!');
//             return;
//         }

//         const projectId =
//             Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
//         if (!projectId) {
//             handleRegistrationError('Project ID not found');
//         }
//         try {
//             const pushTokenString = (
//                 await Notifications.getExpoPushTokenAsync({
//                     projectId,
//                 })
//             ).data;
//             console.log(pushTokenString);
//             return pushTokenString;
//         } catch (e) {
//             handleRegistrationError(`${e}`);
//         }
//     } else {
//         handleRegistrationError('Must use physical device for push notifications');
//     }
// }

// async function getNoti() {
//     try {
//         const receiptResponse = await fetch("https://exp.host/--/api/v2/push/getReceipts", {
//             method: "POST",
//             headers: {
//                 "Accept": "application/json",
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 ids: ["019812eb-d4cf-7dae-9c7e-cd3467025a97"]  // array of receipt IDs
//             })
//         });

//         const result = await receiptResponse.json();
//         console.log("Push receipt:", JSON.stringify(result, null, 2));

//     } catch (error) {
//         console.log(error)
//     }
// }

// export default function notification() {
//     const [expoPushToken, setExpoPushToken] = useState('');
//     const [notification, setNotification] = useState(
//         undefined
//     );

//     useEffect(() => {
//         registerForPushNotificationsAsync()
//             .then(token => setExpoPushToken(token ?? ''))
//             .catch((error) => setExpoPushToken(`${error}`));

//         const notificationListener = Notifications.addNotificationReceivedListener(notification => {
//             setNotification(notification);
//         });

//         const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
//             console.log(response);
//         });

//         return () => {
//             notificationListener.remove();
//             responseListener.remove();
//         };
//     }, []);

//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
//             <Text>Your Expo push token: {expoPushToken}</Text>
//             <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                 <Text>Title: {notification && notification.request.content.title} </Text>
//                 <Text>Body: {notification && notification.request.content.body}</Text>
//                 <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
//             </View>
//             <Button
//                 title="Press to Send Notification"
//                 onPress={async () => {
//                     await sendPushNotification(expoPushToken);
//                 }}
//             />

//             <Button
//                 title="Press to Get Notification"
//                 onPress={async () => {
//                     await getNoti();
//                 }}
//             />
//         </View>
//     );
// }
