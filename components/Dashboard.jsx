import { FlatList, Platform, Pressable, Image as ReactNativeImage, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import CustomTabView from './CustomTabView'
import CustomText from './CustomText'
import { useAuth } from '../context/AuthContext'
import CustomSecondaryText from './CustomSecondaryText'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../constants/Colors'
import AdvertiseCard from './AdvertiseCard'
import { AboutIcon, CalendarIcon, ClockIcon, CuttingIcon, DyeIcon, MenuIcon, NextIcon, QueueIcon, RightIcon, SalonIcon, SettingsIcon, SparkleIcon, StylingIcon, TrimIcon, UserIcon } from '../constants/icons'
import StatusCard from './StatusCard'
import BarberCard from './BarberCard'
import { Link, router, useFocusEffect } from 'expo-router'
import { Dimensions } from 'react-native';
import { Image } from 'expo-image'
import { usePreventRemove, useTheme } from '@react-navigation/native'
import { useGlobal } from '../context/GlobalContext'
import axios from 'axios'
import { BASE_URL } from '@/utils/api';
import Skeleton from './Skeleton'

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage'



import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Header from './Header'

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
    console.log("Notification Error Message ", errorMessage)
}


async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
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
        handleRegistrationError('Must use physical device for push notifications');
    }
}


const Dashboard = () => {

    const { homeDashboardData, setHomeDashboardData } = useGlobal()
    const { authenticatedUser } = useAuth()

    // console.log("Authenticated user", authenticatedUser)

    const [sliceBarber, setSliceBarber] = useState(4)

    const [homeAdvertisementData, setHomeAdvertisementData] = useState({
        advertisementData: null,
        loading: false,
        error: null,
        success: false
    })

    const [serviceCategoryData, setServiceCategoryData] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })

    // console.log("homeDashboardData ", homeDashboardData)

    useFocusEffect(
        useCallback(() => {
            if (authenticatedUser) {

                const fetchDashboardData = async () => {
                    try {

                        setHomeDashboardData((prev) => ({ ...prev, loading: true }))

                        const { data } = await axios.post(`${BASE_URL}/customer/customerDashboard`, {
                            salonId: authenticatedUser?.salonId,
                            customerEmail: authenticatedUser?.email
                        })

                        setHomeDashboardData((prev) => ({ ...prev, loading: false, dashboardData: data?.response, success: true, error: null }))

                    } catch (error) {
                        setHomeDashboardData((prev) => ({ ...prev, loading: false, dashboardData: null, success: false, error: error }))
                        console.error("Error fetching dashboard data: ", error?.response?.data)
                    }
                }

                const fetchAdvertisementData = async () => {
                    try {

                        setHomeAdvertisementData((prev) => ({ ...prev, loading: true }))

                        const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getAllAdvertisements`, {
                            salonId: authenticatedUser?.salonId
                        })

                        setHomeAdvertisementData((prev) => ({ ...prev, loading: false, advertisementData: data?.response, success: true, error: null }))


                    } catch (error) {
                        setHomeAdvertisementData((prev) => ({ ...prev, loading: false, advertisementData: null, success: false, error: error }))
                        console.error("Error fetching advertisement data: ", error)
                    }
                }

                const fetchServiceCategoryData = async () => {
                    try {

                        setServiceCategoryData((prev) => ({ ...prev, loading: true }))

                        const { data } = await axios.get(`${BASE_URL}/mobileRoutes/getAllServiceCategories`)

                        setServiceCategoryData((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

                    } catch (error) {
                        setServiceCategoryData((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                        console.error("Error fetching service category data: ", error)
                    }
                }

                fetchDashboardData()
                fetchAdvertisementData()
                fetchServiceCategoryData()
            }

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [authenticatedUser])
    );


    const { colors } = useTheme()

    const pageData = [
        {
            title: "header"
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
        {
            title: "advertise",
        },

        {
            title: "barber",
        },
        {
            title: "services",
        }
    ]


    // Notification Code 


    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(
        undefined
    );

    useFocusEffect(
        useCallback(() => {
            registerForPushNotificationsAsync()
                .then(token => setExpoPushToken(token ?? ''))
                .catch((error) => setExpoPushToken(`${error}`));

            const notificationListener = Notifications.addNotificationReceivedListener(notification => {
                setNotification(notification);
            });

            const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
                // console.log(response);
            });

            return () => {
                notificationListener.remove();
                responseListener.remove();
            };
        }, [])
    )

    useFocusEffect(
        useCallback(() => {
            if (expoPushToken) {
                const saveExpoPushToken = async () => {
                    try {
                        const { data } = await axios.post(`${BASE_URL}/mobileRoutes/pushDevices`, {
                            salonId: authenticatedUser?.salonId,
                            name: authenticatedUser?.name,
                            email: authenticatedUser?.email,
                            deviceToken: expoPushToken,
                            deviceType: "android"
                        })


                        // console.log("Saved Notifcation Data ", data)
                    } catch (error) {
                        // console.log("Error saving token ", error)
                    }
                }

                saveExpoPushToken()
            }

        }, [expoPushToken, authenticatedUser])
    )

    // "android": {
    //     "allowBackup": false
    // }

    // useFocusEffect(
    //     useCallback(() => {
    //         const initPush = async () => {
    //             try {
    //                 const newToken = await registerForPushNotificationsAsync();

    //                 if (newToken) {
    //                     const storedToken = await AsyncStorage.getItem("expoPushToken");

    //                     if (!storedToken || storedToken !== newToken) {
    //                         // Update saved token
    //                         await AsyncStorage.setItem("expoPushToken", newToken);
    //                         setExpoPushToken(newToken); // Save in state

    //                         // ✅ Save to your backend
    //                         await axios.post(`${BASE_URL}/mobileRoutes/pushDevices`, {
    //                             salonId: authenticatedUser?.salonId,
    //                             name: authenticatedUser?.name,
    //                             email: authenticatedUser?.email,
    //                             deviceToken: newToken,
    //                             deviceType: "android",
    //                         });
    //                     } else {
    //                         // Already up-to-date
    //                         setExpoPushToken(storedToken);
    //                     }
    //                 }
    //             } catch (err) {
    //                 console.log("Push token error:", err);
    //             }
    //         };

    //         initPush();

    //         const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    //             setNotification(notification);
    //         });

    //         const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    //             // Handle notification tap
    //         });

    //         return () => {
    //             notificationListener.remove();
    //             responseListener.remove();
    //         };
    //     }, [authenticatedUser])
    // );



    const { setJoinModes, joinModes } = useGlobal();

    const hasUnsavedChanges = true

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
        }
    );


    const statusData = [
        {
            label: 'System',
            value: homeDashboardData?.dashboardData?.salonInfo?.mobileBookingAvailability ? "Online" : "Offline",
            icon: 'power',
            bgColor: homeDashboardData?.dashboardData?.salonInfo?.mobileBookingAvailability
                ? 'rgba(34, 197, 94, 0.1)'    // ✅ green-500/10
                : 'rgba(239, 68, 68, 0.1)',   // ❌ red-500/10
            iconColor: homeDashboardData?.dashboardData?.salonInfo?.mobileBookingAvailability
                ? '#22c55e'                   // green-500
                : '#ef4444',                 // red-500
            valueColor: homeDashboardData?.dashboardData?.salonInfo?.mobileBookingAvailability
                ? '#22c55e'
                : '#ef4444',
            fontSize: scale(18),
        },

        {
            label: 'Next In',
            value: homeDashboardData?.dashboardData?.leastQueueCount + 1,
            icon: 'user-check',
            bgColor: 'rgba(168, 85, 247, 0.1)', // purple-500/10
            iconColor: '#a855f7',
        },
        {
            label: 'On Duty',
            value: homeDashboardData?.dashboardData?.barberOnDuty,
            icon: 'scissors',
            bgColor: 'rgba(56, 189, 248, 0.1)', // sky-500/10
            iconColor: '#38bdf8',
        },
        {
            label: 'In Queue',
            value: homeDashboardData?.dashboardData?.totalQueueCount || 0,
            icon: 'users',
            bgColor: 'rgba(13, 148, 136, 0.1)', // teal-500/10
            iconColor: '#14b8a6',
        },

    ];


    const services = [
        {
            id: '1',
            title: 'Haircut & Style',
            image: 'https://images.unsplash.com/photo-1599351431202-184b39349549?q=80&w=2574&auto=format&fit=crop',
            fallback: 'https://placehold.co/160x200/E5E7EB/1F2937?text=Haircut',
        },
        {
            id: '2',
            title: 'Beard Trim',
            image: 'https://images.unsplash.com/photo-1600948836842-8453549544b3?q=80&w=2574&auto=format&fit=crop',
            fallback: 'https://placehold.co/160x200/E5E7EB/1F2937?text=Beard',
        },
        {
            id: '3',
            title: 'Massage',
            image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2670&auto=format&fit=crop',
            fallback: 'https://placehold.co/160x200/E5E7EB/1F2937?text=Massage',
        },
        {
            id: '4',
            title: 'Spa Treatment',
            image: 'https://images.unsplash.com/photo-1544161515-cfd826dbaa0b?q=80&w=2574&auto=format&fit=crop',
            fallback: 'https://placehold.co/160x200/E5E7EB/1F2937?text=Spa',
        },
    ];


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
                paddingTop: verticalScale(0),
                paddingBottom: Platform.OS === "ios" ? verticalScale(0) : verticalScale(0)
            }}
        >
            <FlatList
                data={pageData}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    gap: verticalScale(20)
                }}
                renderItem={({ item }) => {
                    switch (item.title) {

                        case "header": {
                            return (
                                <Header />
                            )
                        }
                        case "hero": {
                            return (
                                <>
                                    {
                                        homeDashboardData?.loading ? (
                                            <Skeleton
                                                borderRadius={scale(20)}
                                                height={verticalScale(90)}
                                            />
                                        ) : homeDashboardData?.dashboardData?.isJoinedData?.length > 0 ? (
                                            <LinearGradient
                                                colors={['#14b8a6', '#0d9488']}
                                                style={styles.card}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                            >
                                                <View style={styles.topRow}>
                                                    <View>
                                                        <View style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            gap: scale(10),

                                                        }}>
                                                            <CustomText
                                                                style={[styles.title, {}]}
                                                                numberOfLines={1}
                                                                ellipsizeMode="tail"
                                                            >{homeDashboardData?.dashboardData?.isJoinedData?.[0]?.name}</CustomText>
                                                            {/* <View style={styles.moreWrapper}>
                                                                <CustomText style={styles.moreText}>+4 more</CustomText>
                                                            </View> */}
                                                        </View>

                                                        <CustomText style={styles.subtitle}>{homeDashboardData?.dashboardData?.isJoinedData?.[0]?.barberName}</CustomText>
                                                    </View>
                                                    <View>
                                                        <CustomText style={[styles.title, {
                                                            marginLeft: "auto"
                                                        }]}>{homeDashboardData?.dashboardData?.isJoinedData?.[0]?.qPosition === 1 ? "Next" : `#${homeDashboardData?.dashboardData?.isJoinedData?.[0]?.qPosition}`}</CustomText>
                                                        <CustomText style={styles.subtitle}>~{formatMinutesToHrMin(homeDashboardData?.dashboardData?.isJoinedData?.[0]?.customerEWT)}</CustomText>
                                                    </View>
                                                </View>

                                                {/* +4 more text inside the card */}

                                            </LinearGradient>
                                        ) : (
                                            <LinearGradient
                                                colors={['#14b8a6', '#0d9488']}
                                                style={styles.card}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 1 }}
                                            >
                                                <View style={styles.topRow}>
                                                    <View>
                                                        <CustomText style={styles.title}>Your Visit, Your Way</CustomText>
                                                        <CustomText style={styles.subtitle}>Join the queue or book for later.</CustomText>
                                                    </View>
                                                    <CalendarIcon color="white" style={styles.icon} />
                                                </View>

                                                <View style={styles.btnContainer}>
                                                    <TouchableOpacity
                                                        onPress={() => router.push("/joinpopup")}
                                                        style={[styles.joinQueue, {
                                                            borderWidth: scale(1),
                                                            borderColor: colors.queueBorder
                                                        }]} activeOpacity={0.85}>
                                                        <CustomText style={styles.joinQueueText}>Join Queue</CustomText>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setJoinModes((prev) => ({ ...prev, appointment: true, appointmentType: "Book" }));
                                                            router.push("/appointmentCalendar");
                                                        }}
                                                        style={[styles.bookAhead, {
                                                            borderWidth: scale(1),
                                                            borderColor: colors.queueBorder
                                                        }]} activeOpacity={0.85}>
                                                        <CustomText style={styles.bookAheadText}>Book</CustomText>
                                                    </TouchableOpacity>
                                                </View>
                                            </LinearGradient >
                                        )
                                    }


                                </>

                            )
                        }

                        case "status": {
                            return (

                                // homeDashboardData?.loading ? (<FlatList
                                //     style={{
                                //         overflow: "visible",
                                //     }}
                                //     contentContainerStyle={{
                                //         flex: 1,
                                //         flexDirection: "row",
                                //         gap: scale(10),
                                //         paddingVertical: verticalScale(10),
                                //         justifyContent: "space-evenly"
                                //     }}
                                //     data={salonStatus}
                                //     renderItem={({ item }) => <Skeleton width={scale(60)} height={scale(80)} />}
                                //     keyExtractor={item => item.id}
                                //     horizontal
                                //     showsHorizontalScrollIndicator={false}
                                //     bounces={false}
                                // />) : (<FlatList
                                //     style={{
                                //         overflow: "visible",
                                //     }}
                                //     contentContainerStyle={{
                                //         flex: 1,
                                //         flexDirection: "row",
                                //         gap: scale(10),
                                //         paddingVertical: verticalScale(10),
                                //         justifyContent: "space-evenly"
                                //     }}
                                //     data={salonStatus}
                                //     renderItem={({ item }) => <StatusCard item={item} />}
                                //     keyExtractor={item => item.id}
                                //     horizontal
                                //     showsHorizontalScrollIndicator={false}
                                //     bounces={false}
                                // />)


                                homeDashboardData?.loading ? (
                                    <View>
                                        <CustomText style={styles.heading}>Live Queue Status</CustomText>
                                        <View style={styles.grid}>
                                            {
                                                statusData.map((item, index) => (
                                                    <Skeleton
                                                        key={index}
                                                        width={"48%"}
                                                        height={verticalScale(75)}
                                                        style={{
                                                            width: '48%',
                                                            borderRadius: scale(12),
                                                            marginBottom: verticalScale(16),
                                                        }}
                                                    />
                                                ))
                                            }
                                        </View>

                                    </View>
                                ) : (
                                    <View>
                                        <CustomText style={styles.heading}>Live Queue Status</CustomText>
                                        <View style={styles.grid}>
                                            {statusData.map((item, index) => (
                                                <View key={index} style={[styles.statusCard, { backgroundColor: colors.cardColor, borderColor: colors.queueBorder }]}>
                                                    <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
                                                        <Feather name={item.icon} size={24} color={item.iconColor} />
                                                    </View>
                                                    <View>
                                                        <CustomText style={[styles.label, {
                                                            color: colors.secondaryText
                                                        }]}>{item.label}</CustomText>
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
                                )

                            )
                        }

                        case "hint": {
                            return (
                                <View style={[styles.hintCard, {
                                    backgroundColor: colors.cardColor,
                                    borderColor: colors.queueBorder
                                }]}>
                                    <View style={[styles.hintIconWrapper, {
                                        backgroundColor: colors.background,
                                        borderColor: colors.cardBorder,
                                        borderWidth: scale(1)
                                    }]}>
                                        <SalonIcon color={colors.text} />
                                    </View>
                                    <View style={styles.hintTextWrapper}>
                                        <CustomText style={[styles.hintTitle, { color: colors.secondaryText }]}>Salon Info</CustomText>
                                        <CustomText style={[styles.hintDescription]}>
                                            {homeDashboardData?.dashboardData?.salonInfo?.salonDesc}
                                        </CustomText>
                                    </View>
                                </View>
                            )
                        }


                        case "advertise": {
                            return (
                                <>
                                    {
                                        homeAdvertisementData?.loading ? (<FlatList
                                            style={{
                                                overflow: "visible",
                                            }}
                                            contentContainerStyle={{
                                                gap: scale(10),
                                            }}
                                            data={[0, 1, 2, 3]}
                                            renderItem={({ item }) => <View style={{
                                                // paddingVertical: verticalScale(20),
                                            }}>
                                                <Skeleton width={scale(300.56)} height={verticalScale(145 / 1.2)} borderRadius={scale(12)} />
                                            </View>}
                                            keyExtractor={item => item}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                        />) : homeAdvertisementData?.advertisementData?.length > 0 ? (<FlatList
                                            style={{
                                                overflow: "visible",
                                            }}
                                            contentContainerStyle={{
                                                gap: scale(10),
                                            }}
                                            data={homeAdvertisementData?.advertisementData}
                                            renderItem={({ item }) => <AdvertiseCard item={item} />}
                                            keyExtractor={item => item._id}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                        />) : (
                                            <View
                                                style={{
                                                    width: "100%",
                                                    height: verticalScale(180),
                                                    paddingVertical: verticalScale(20),
                                                }}
                                            >
                                                <Image
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        borderRadius: scale(12),
                                                        borderWidth: scale(1),
                                                        borderColor: "#d3d3d3"
                                                    }}
                                                    source={require('@/assets/images/dummygallery.jpg')}
                                                    contentFit="cover"
                                                    transition={300}
                                                />
                                            </View>
                                        )
                                    }

                                </>
                            )
                        }

                        // case "serviceCategory": {
                        //     return (
                        //         <View View style={styles.container} >
                        //             <CustomText style={styles.heading}>Our Services</CustomText>
                        //             <View
                        //                 style={{
                        //                     // height: verticalScale(97),
                        //                     flexDirection: "row",
                        //                     alignItems: "center",
                        //                     flexDirection: "row",
                        //                     flexWrap: "wrap",
                        //                     // paddingVertical: verticalScale(20),
                        //                     gap: scale(20),
                        //                     // justifyContent: "space-between"
                        //                 }}
                        //             >
                        //                 {
                        //                     serviceCategoryData?.loading ? (
                        //                         [0, 1, 2, 3, 4].map((item, index) => {
                        //                             return (
                        //                                 <View
                        //                                     key={index}
                        //                                     style={{
                        //                                         gap: verticalScale(10),
                        //                                         width: scale(65),
                        //                                         // marginBottom: verticalScale(10)
                        //                                     }}
                        //                                 >

                        //                                     <Skeleton
                        //                                         width={scale(70)}
                        //                                         height={scale(70)}
                        //                                         borderRadius={scale(50)}
                        //                                     >

                        //                                     </Skeleton>

                        //                                 </View>
                        //                             )
                        //                         })
                        //                     ) : (
                        //                         serviceCategoryData?.data?.map((item, index) => {
                        //                             return (
                        //                                 <View
                        //                                     key={item?._id}
                        //                                     style={{
                        //                                         gap: verticalScale(10),
                        //                                         width: scale(65),
                        //                                     }}
                        //                                 >

                        //                                     <View
                        //                                         style={{
                        //                                             width: scale(70),
                        //                                             height: scale(70),
                        //                                             borderRadius: scale(50),
                        //                                             // backgroundColor: "red",
                        //                                             borderWidth: scale(3),
                        //                                             borderColor: colors.cardColor,
                        //                                             marginHorizontal: "auto",

                        //                                             // ✅ iOS shadow
                        //                                             shadowColor: '#000',
                        //                                             shadowOffset: { width: 0, height: 2 },
                        //                                             shadowOpacity: 0.2,
                        //                                             shadowRadius: 3,

                        //                                             // ✅ Android elevation
                        //                                             elevation: 2,
                        //                                         }}
                        //                                     >
                        //                                         <Image
                        //                                             style={{ width: "100%", height: "100%", borderRadius: scale(50) }}
                        //                                             source={{ uri: item?.serviceCategoryImage?.url.replace("http", "https") }}
                        //                                             contentFit="cover"
                        //                                             transition={1000}
                        //                                         />
                        //                                     </View>
                        //                                     <CustomText
                        //                                         style={{
                        //                                             fontFamily: "AirbnbCereal_W_Md",
                        //                                             fontSize: scale(14),
                        //                                             textAlign: "center",
                        //                                             // color: "gray",
                        //                                         }}
                        //                                     >{item.serviceCategoryName}</CustomText>
                        //                                 </View>
                        //                             )
                        //                         })
                        //                     )
                        //                 }
                        //             </View>
                        //         </View>


                        //         // serviceCategoryData?.loading ? (
                        //         //     <View View style={styles.container} >
                        //         //         <CustomText style={styles.sectionTitle}>Our Services</CustomText>
                        //         //         <FlatList
                        //         //             data={[0, 1, 2, 3, 4, 5, 6, 7]}
                        //         //             horizontal
                        //         //             showsHorizontalScrollIndicator={false}
                        //         //             // keyExtractor={(item) => item._id}
                        //         //             contentContainerStyle={styles.scrollContainer}
                        //         //             renderItem={({ item }) => (
                        //         //                 <Skeleton
                        //         //                     width={scale(160)}
                        //         //                     height={verticalScale(192)}
                        //         //                 />
                        //         //             )}
                        //         //         />
                        //         //     </View>
                        //         // ) : (
                        //         //     <View View style={styles.container} >
                        //         //         <CustomText style={styles.sectionTitle}>Our Services</CustomText>
                        //         //         <FlatList
                        //         //             data={serviceCategoryData?.data}
                        //         //             horizontal
                        //         //             showsHorizontalScrollIndicator={false}
                        //         //             keyExtractor={(item) => item._id}
                        //         //             contentContainerStyle={styles.scrollContainer}
                        //         //             renderItem={({ item }) => (
                        //         //                 <ServiceCard
                        //         //                     title={item.serviceCategoryName}
                        //         //                     image={item?.serviceCategoryImage?.url.replace("http", "https")}
                        //         //                     fallback={item.fallback}
                        //         //                 />
                        //         //             )}
                        //         //         />
                        //         //     </View>
                        //         // )
                        //     )
                        // }

                        case "barber": {
                            return (
                                <>
                                    <View style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        // marginBottom: verticalScale(10)
                                    }}>
                                        <CustomText style={styles.heading}>Our Stylists
                                            {/* <CustomText style={[styles.heading, { color: Colors.modeColor.colorCode }]}>{homeDashboardData?.dashboardData?.barberOnDuty}</CustomText> */}
                                        </CustomText>

                                        <View
                                            style={{
                                                marginLeft: scale(8),
                                                width: scale(24),
                                                height: scale(24),
                                                borderRadius: scale(12),
                                                backgroundColor: colors.cardColor,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: verticalScale(10)
                                            }}
                                        >
                                            <CustomText style={{ fontSize: scale(14), fontFamily: "AirbnbCereal_W_Bd" }}>
                                                {homeDashboardData?.dashboardData?.barberOnDuty}
                                            </CustomText>
                                        </View>
                                    </View>

                                    {
                                        homeDashboardData?.loading ? (
                                            <FlatList
                                                key={2}
                                                style={{
                                                    overflow: "visible",
                                                }}
                                                columnWrapperStyle={{
                                                    columnGap: scale(10),
                                                }}
                                                data={[0, 1, 2, 3]}
                                                renderItem={({ item }) => <Skeleton
                                                    height={verticalScale(160)}
                                                    width={scale(160)}
                                                    borderRadius={scale(10)}

                                                    style={{
                                                        marginBottom: verticalScale(15)
                                                    }}
                                                />}
                                                keyExtractor={item => item}
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
                                                ItemSeparatorComponent={() => <View style={{ height: scale(10) }} />}
                                                data={homeDashboardData?.dashboardData?.barbers.slice(0, sliceBarber)}
                                                renderItem={({ item }) => <BarberCard item={item} />}
                                                keyExtractor={item => item.barberId}
                                                bounces={false}
                                                numColumns={2}
                                            />
                                        ) : (
                                            <View
                                                style={{
                                                    height: verticalScale(100),
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginBottom: verticalScale(40)
                                                }}
                                            ><CustomText>No barbers available</CustomText></View>
                                        )
                                    }

                                    {
                                        sliceBarber < homeDashboardData?.dashboardData?.barbers?.length && (
                                            <Pressable
                                                onPress={() => {
                                                    setSliceBarber(homeDashboardData?.dashboardData?.barbers?.length)
                                                }}
                                                style={{
                                                    height: verticalScale(35),
                                                    // backgroundColor: "#00B0901A",
                                                    backgroundColor: "#14b8a6",
                                                    borderRadius: scale(4),
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginTop: verticalScale(15)
                                                    // marginBottom: verticalScale(20)
                                                }}
                                            >
                                                <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                        {
                                                            homeDashboardData?.dashboardData?.barbers?.slice(0, 3).map((item, index) => {
                                                                return (
                                                                    <View
                                                                        key={index}
                                                                        style={{
                                                                            height: scale(25),
                                                                            width: scale(25),
                                                                            borderRadius: scale(20),
                                                                            marginLeft: -scale(1 * 5)
                                                                        }}>
                                                                        <Image
                                                                            style={{
                                                                                height: "100%",
                                                                                width: "100%",
                                                                                borderRadius: scale(20)
                                                                            }}
                                                                            source={{ uri: item?.profile?.[0]?.url }}
                                                                            contentFit="cover"
                                                                            transition={300}
                                                                        />
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            gap: scale(5)
                                                        }}
                                                    >
                                                        <CustomText style={{ color: "#fff" }}>See all barbers</CustomText>
                                                        <RightIcon size={scale(14)} color={"#fff"} />
                                                    </View>
                                                </View>
                                            </Pressable>
                                        )
                                    }

                                </>
                            )
                        }

                    }
                }}
                keyExtractor={item => item.title}
                ListFooterComponent={< View style={{ height: Platform.OS === "ios" ? verticalScale(60) : 0 }} />}
            />

        </CustomTabView >
    )
}

export default Dashboard


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
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: scale(12), // or use marginRight on first button if gap isn't supported
    },
    joinQueue: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: verticalScale(12),
        borderRadius: scale(12),
        alignItems: 'center',
        transform: [{ scale: 1 }],
    },
    joinQueueText: {
        color: '#0d9488', // teal-600
        fontWeight: 'bold',
        fontSize: scale(14),
        fontFamily: "AirbnbCereal_W_XBd",
    },
    bookAhead: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.25)', // white/25
        paddingVertical: verticalScale(12),
        borderRadius: scale(12),
        alignItems: 'center',
        transform: [{ scale: 1 }],
    },
    bookAheadText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: scale(14),
        fontFamily: "AirbnbCereal_W_XBd",
    },

    cardImage: {
        height: scale(80),
        width: scale(80),
        borderRadius: scale(8),
        marginBottom: verticalScale(5)
    },

    // Card Csss
    card: {
        borderRadius: scale(16),
        padding: scale(24),
        // marginBottom: verticalScale(24),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: scale(20),
        fontFamily: "AirbnbCereal_W_XBd",
        color: '#fff',
    },
    subtitle: {
        fontSize: scale(14),
        color: '#fff',
        opacity: 0.9,
        marginTop: verticalScale(4),
    },
    icon: {
        opacity: 0.5,
    },
    button: {
        marginTop: verticalScale(24),
        width: '100%',
        backgroundColor: '#fff',
        paddingVertical: verticalScale(12),
        borderRadius: scale(12),
        alignItems: 'center',
        transform: [{ scale: 1 }],
    },
    buttonText: {
        color: '#0d9488',
        fontWeight: 'bold',
        fontSize: scale(16),
    },

    // Status Card

    heading: {
        fontSize: scale(20),
        fontFamily: "AirbnbCereal_W_XBd",
        marginBottom: verticalScale(10),
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statusCard: {
        // backgroundColor: '#fff',
        // backgroundColor: "#1F2937",
        width: '47%',
        padding: scale(16),
        borderRadius: scale(12),
        marginBottom: verticalScale(15),
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(6),
        borderWidth: scale(1),
        // borderColor: '#e5e7eb', // border-gray-200
    },
    iconContainer: {
        padding: scale(12),
        borderRadius: scale(12),
        marginRight: scale(12),
    },
    label: {
        fontSize: scale(14),
        // color: '#6b7280', // text-gray-500
    },
    value: {
        fontSize: scale(24),
        fontFamily: "AirbnbCereal_W_XBd"
    },

    hintCard: {
        borderWidth: 1,
        borderRadius: scale(12),
        padding: scale(16),
        // marginBottom: verticalScale(24),
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
    },

    hintIconWrapper: {
        // backgroundColor: '#f3f4f6',  // bg-gray-100
        padding: scale(12),
        borderRadius: scale(12),
    },

    hintTextWrapper: {
        width: '80%',
    },

    hintTitle: {
        fontFamily: 'AirbnbCereal_W_XBd',
        // color: '#1f2937',            // text-gray-800
        fontSize: scale(16),
        marginBottom: verticalScale(2),
    },

    hintDescription: {
        fontSize: scale(13),
        // color: '#4b5563',            // text-gray-600
    },


    // Service Category Card

    container: {
        // marginBottom: verticalScale(32),
    },
    sectionTitle: {
        fontSize: scale(20),
        fontWeight: '600',
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
        width: '100%',
        height: verticalScale(192), // equivalent to h-48
        borderRadius: scale(16),
        marginBottom: verticalScale(8),
        backgroundColor: '#e5e7eb',
    },
    serviceCardTitle: {
        textAlign: 'center',
        fontWeight: '600',
        // color: '#374151', // text-gray-700
    },

    moreWrapper: {
        alignSelf: 'flex-end',
        backgroundColor: '#0f766e',
        paddingHorizontal: scale(6),
        paddingVertical: verticalScale(4),
        borderRadius: scale(8)
    },
    moreText: {
        color: '#fff',
        fontSize: moderateScale(12),
        fontFamily: 'AirbnbCereal_W_Bd',
    }
})