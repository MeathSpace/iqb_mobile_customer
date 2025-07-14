import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useFocusEffect, useRouter } from 'expo-router';
import CustomTabView from '../../../components/CustomTabView';
import { ArrowLeftIcon, NotificationOffIcon } from '../../../constants/icons';
import CustomText from '../../../components/CustomText';
import { Image } from 'expo-image';
import { useTheme } from '@react-navigation/native';
import { useGlobal } from '../../../context/GlobalContext';
import axios from 'axios'
import { BASE_URL } from '@/utils/api';
import { useAuth } from '../../../context/AuthContext';
import Skeleton from '../../../components/Skeleton';
import { io } from "socket.io-client";
import CustomSecondaryText from '../../../components/CustomSecondaryText';

const notification = () => {

    const router = useRouter()
    const { colors } = useTheme()

    const { notificationListData, setNotificationListData } = useGlobal()
    const { authenticatedUser } = useAuth()

    // useEffect(() => {
    //     const fetchNotifications = async () => {
    //         try {
    //             const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getAllNotificationsByCustomerEmail`, {
    //                 email: authenticatedUser?.email
    //             })
    //             // console.log(JSON.stringify(data?.response, null, 2));

    //             setNotificationListData((prev) => ({ ...prev, loading: false, notificationData: JSON.stringify(data?.response), success: true, error: null }))

    //         } catch (error) {
    //             setNotificationListData((prev) => ({ ...prev, loading: false, notificationData: null, success: false, error: error }))
    //             console.log("Error fetching notifications ", error)
    //         }
    //     }

    //     fetchNotifications()
    // }, [])


    // console.log("notificationListData ", notificationListData)

    const socket = io("https://iqb-final.onrender.com", {
        transports: ['websocket'],
    });

    const fetchNotifications = async () => {
        try {

            setNotificationListData((prev) => ({ ...prev, loading: true }))

            const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getAllNotificationsByCustomerEmail`, {
                email: authenticatedUser?.email
            });

            // console.log("Data ",data)

            setNotificationListData((prev) => ({
                ...prev,
                loading: false,
                notificationData: data?.response || [],
                success: true,
                error: null
            }));
        } catch (error) {
            setNotificationListData((prev) => ({
                ...prev,
                loading: false,
                notificationData: [],
                success: false,
                error: error
            }));
            console.log("Error fetching notifications ", error);
        }
    };


    useFocusEffect(
        useCallback(() => {

            fetchNotifications();

            socket.emit("joinCustomerforNotifications", { salonId: authenticatedUser?.salonId, customerEmail: authenticatedUser?.email });

            socket.on("receiveNotifications", (notificationData) => {

                setNotificationListData((prev) => ({
                    ...prev,
                    loading: false,
                    notificationData: notificationData,
                    success: true,
                    error: null
                }));
            })

        }, [authenticatedUser])
    )

    return (
        <CustomTabView
            style={{
                backgroundColor: "#00B0901A",
                paddingVertical: verticalScale(0),
                // paddingTop: verticalScale(10),
                paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(20),
                gap: verticalScale(10),
            }}
        >
            <ScrollView
                contentContainerStyle={{
                    gap: verticalScale(10),
                    paddingBottom: verticalScale(20),
                }}
                showsVerticalScrollIndicator={false}
            >
                {
                    notificationListData?.loading ? (
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
                            <View
                                key={index}
                                style={{
                                    paddingVertical: verticalScale(15),
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(10),
                                    borderRadius: scale(10),
                                    paddingHorizontal: scale(15),
                                    backgroundColor: colors.background
                                }}
                            >
                                <Image
                                    style={{ height: scale(50), width: scale(50), borderRadius: scale(40) }}
                                    source={{ uri: item?.salonLogo?.[0]?.url }}
                                    contentFit="cover"
                                    transition={300}
                                />

                                <View style={{ gap: verticalScale(5), flex: 1 }}>
                                    <CustomText
                                        style={{
                                            fontSize: scale(14),
                                            fontFamily: "AirbnbCereal_W_Bd"
                                        }}
                                    >{item?.title}</CustomText>

                                    <CustomText
                                        style={{
                                            fontSize: scale(12),
                                            color: "#696D6E"
                                        }}
                                    >{item?.body}</CustomText>

                                    {/* <CustomText
                                        style={{
                                            fontSize: scale(12),
                                            color: "#696D6E"
                                        }}
                                    >{item?.time?.split("T")[0]}</CustomText> */}
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: verticalScale(500)
                        }}>
                            <View
                                style={{
                                    gap: verticalScale(12)
                                }}
                            >
                                <View
                                    style={{
                                        width: scale(60),
                                        height: scale(60),
                                        backgroundColor: colors.background,
                                        marginHorizontal: "auto",
                                        borderRadius: scale(50),
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <NotificationOffIcon
                                        color={colors.text}
                                        size={scale(40)}
                                    />
                                </View>
                                <CustomText
                                    style={{
                                        textAlign: "center",
                                        fontSize: scale(16)
                                    }}
                                >No Notification</CustomText>
                                <CustomSecondaryText
                                    style={{
                                        textAlign: "center"
                                    }}
                                >
                                    You don't have notification
                                </CustomSecondaryText>

                            </View>
                        </View>
                    )

                }
            </ScrollView>
        </CustomTabView>
    )
}

export default notification

const styles = StyleSheet.create({})

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
//     const message = {
//         to: expoPushToken,
//         sound: 'default',
//         title: 'Original Title',
//         body: 'And here is the body!',
//         data: { someData: 'goes here' },
//     };

//     await fetch('https://exp.host/--/api/v2/push/send', {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Accept-encoding': 'gzip, deflate',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(message),
//     });
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
//         </View>
//     );
// }
