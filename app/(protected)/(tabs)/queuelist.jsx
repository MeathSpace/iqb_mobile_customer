import { FlatList, Platform, Pressable, RefreshControl, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import CustomTabView from '../../../components/CustomTabView';
import CustomText from '../../../components/CustomText';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../../constants/Colors';
import { usePreventRemove, useTheme } from '@react-navigation/native';
import QlistItem from '../../../components/QlistItem';
import { useFocusEffect, useRouter } from 'expo-router';
import { useGlobal } from '../../../context/GlobalContext';
import CustomSecondaryText from '../../../components/CustomSecondaryText';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import Skeleton from '../../../components/Skeleton';
import { NotificationIcon, PeopleIcon, RefreshIcon } from '../../../constants/icons';
import { io } from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QueueList = () => {

    const { authenticatedUser } = useAuth()

    const [qlistData, setQlistData] = useState({
        data: null,
        loading: false,
        error: null,
        success: false,
    })

    const fetchQlist = async () => {
        try {

            setQlistData((prev) => ({ ...prev, loading: true }))

            const { data } = await axios.get(`${BASE_URL}/mobileRoutes/getQlistBySalonId`, {
                params: {
                    salonId: authenticatedUser?.salonId,
                    customerEmail: authenticatedUser?.email
                }
            })

            setQlistData((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null, isJoinedQueue: data?.isJoinedQueue }))

        } catch (error) {

            setQlistData((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
            console.log("Error fetching queue list ", error)
        }
    }

    const [showHideQueBtn, setShowHideQueBtn] = useState({
        data: null,
        loading: false,
        error: null,
        success: false,
    })

    const fetchShowHideQueueButton = async () => {
        try {

            setShowHideQueBtn((prev) => ({ ...prev, loading: true }))

            const { data } = await axios.post(`${BASE_URL}/customer/showHideJoinQueueButton`, {
                customerEmail: authenticatedUser?.email
            })

            // console.log(data)

            setShowHideQueBtn((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

        } catch (error) {
            setShowHideQueBtn((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
            console.log("Error fetching queue button status ", error)
        }
    }

    const socket = io("https://iqb-final.onrender.com", {
        transports: ['websocket'],
    });

    useFocusEffect(
        useCallback(() => {

            fetchQlist()

            fetchShowHideQueueButton()

            socket.emit("joinSalon", authenticatedUser?.salonId); // this is for queue list
            // socket.emit("customerJoinQueueButton", {
            //     salonId: authenticatedUser?.salonId,
            //     customerEmail: authenticatedUser?.email
            // }); // this is for show/hide joinqueue button

            socket.on("queueUpdated", (queueData) => {
                setQlistData((prev) => ({ ...prev, loading: false, data: queueData, success: true, error: null }))
            })

            // socket.on("queueButtonToggle", (toggleData) => {
            //     console.log("toggleData ", toggleData)
            //     setShowHideQueBtn((prev) => ({ ...prev, loading: false, data: toggleData, success: true, error: null }))
            //     // console.log("toggleData ", toggleData)
            //     // setQlistData((prev) => ({ ...prev, loading: false, data: queueData, success: true, error: null }))
            // })

        }, [authenticatedUser])
    )

    const { colors } = useTheme()

    const router = useRouter()

    // console.log("Queue List Data ", qlistData?.data)

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            fetchQlist()
            setRefreshing(false);
        }, 2000);
    };

    const { newNotification, setNewNotification } = useGlobal()


    usePreventRemove(
        true, // This boolean determines if removal should be prevented
        ({ data }) => {

        }
    );

    // console.log("showHideQueBtn ", showHideQueBtn?.data)

    // console.log(qlistData)

    return (
        <CustomTabView
            style={{
                justifyContent: "space-between",
                paddingVertical: verticalScale(0),
                paddingTop: verticalScale(0),
                backgroundColor: colors.background
            }}>
            <View style={styles.header}>

                <CustomText style={{ fontSize: scale(18), fontFamily: "AirbnbCereal_W_XBd" }}>Live Queue</CustomText>

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
                                    value: false
                                })
                            );
                            setNewNotification({
                                email: "",
                                value: false
                            })
                        }

                        router.push("/notification")
                    }}
                >
                    <NotificationIcon size={moderateScale(24)} color={colors.notificationBellColor} />
                    {/* {
                        newNotification.value && (
                            <View style={styles.badge} />
                        )
                    } */}

                </Pressable>
            </View>

            <View style={{
                flex: 1,
                paddingBottom: Platform.OS === 'ios' ? verticalScale(60) : 0
            }}>
                {
                    showHideQueBtn?.loading ? (
                        <Skeleton
                            height={verticalScale(50)}
                            borderRadius={scale(12)}
                            style={{
                                marginBottom: verticalScale(15),

                            }} />
                    ) : !showHideQueBtn?.data?.isJoinedQueue && qlistData?.data?.length > 0 ? (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: scale(10)
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => router.push("/joinpopup")}
                                style={styles.queueButton} activeOpacity={0.85}>
                                <CustomText style={styles.queueButtonText}>Join Queue</CustomText>
                            </TouchableOpacity>

                        </View>
                    ) : (null)
                }

                {
                    qlistData?.loading ? (
                        <View
                            style={[styles.queueListContainer, {
                                borderColor: colors.queueBorder,
                                backgroundColor: colors.cardColor,
                            }]}
                        >
                            <View style={[styles.queueListheader, { borderBottomColor: colors.queueBorder }]}>
                                <CustomText style={[styles.queueListheaderText, { color: colors.secondaryText, width: "37%" }]}>BARBER</CustomText>
                                <CustomText style={[styles.queueListheaderText, { color: colors.secondaryText, width: "33%", textAlign: "center" }]}>CUSTOMER</CustomText>
                                <CustomText
                                    style={[styles.queueListheaderText,
                                    {
                                        color: colors.secondaryText,
                                        width: "28%",
                                        textAlign: "right"
                                    }]}>POS / WAIT</CustomText>
                            </View>
                            <FlatList
                                data={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                                contentContainerStyle={{ padding: scale(5)}}
                                renderItem={({ item, index }) => <Skeleton width='100%' height={verticalScale(60)} style={{
                                    marginBottom: verticalScale(5)
                                }} />}
                            />

                        </View>
                    )
                        : qlistData?.data?.length > 0 ? (
                            <View
                                style={[styles.queueListContainer, {
                                    borderColor: colors.queueBorder,
                                    backgroundColor: colors.cardColor,
                                }]}
                            >
                                <View style={[styles.queueListheader, {
                                    borderBottomColor: colors.queueBorder
                                }]}>
                                    <CustomText style={[styles.queueListheaderText, { color: colors.secondaryText, width: "37%" }]}>BARBER</CustomText>
                                    <CustomText style={[styles.queueListheaderText, { color: colors.secondaryText, width: "33%", textAlign: "center" }]}>CUSTOMER</CustomText>
                                    <CustomText
                                        style={[styles.queueListheaderText,
                                        {
                                            color: colors.secondaryText,
                                            width: "28%",
                                            textAlign: "right"
                                        }]}>POS / WAIT</CustomText>
                                </View>
                                <FlatList
                                    data={qlistData?.data}
                                    renderItem={({ item, index }) => <QlistItem
                                        item={item}
                                        index={index}
                                        qlistLength={qlistData?.data}
                                        setQlistData={setQlistData}
                                        setShowHideQueBtn={setShowHideQueBtn}
                                    />}
                                    keyExtractor={item => item._id}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={onRefresh}
                                            colors={['black']}
                                            progressBackgroundColor={'#fff'}
                                        />
                                    }
                                />
                            </View>
                        ) : (
                            <View style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <View style={[styles.noQueueContainer, {
                                    borderColor: colors.queueBorder,
                                    backgroundColor: colors.cardColor,
                                }]}>
                                    <View style={[styles.iconContainer, { backgroundColor: "rgba(13, 148, 136, 0.1)" }]}>
                                        <Feather name={"users"} size={moderateScale(32)} color={"#14b8a6"} />
                                    </View>

                                    <CustomText style={{
                                        fontFamily: "AirbnbCereal_W_XBd",
                                        fontSize: scale(20),
                                        textAlign: "center",
                                    }}>The queue is empty</CustomText>

                                    <CustomText style={{
                                        fontFamily: "AirbnbCereal_W_Bd",
                                        fontSize: scale(16),
                                        textAlign: "center",
                                        color: colors.secondaryText,
                                    }}>
                                        There's no one in the queue right now. Be the first to join!
                                    </CustomText>

                                    <TouchableOpacity
                                        onPress={() => router.push("/joinpopup")}
                                        style={styles.queueButton} activeOpacity={0.85}>
                                        <CustomText style={styles.queueButtonText}>Join Queue</CustomText>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        )
                }

            </View>
        </CustomTabView>
    );
};

export default QueueList;

const styles = StyleSheet.create({

    queueButton: {
        width: '100%',
        backgroundColor: '#14b8a6', // bg-teal-500
        paddingVertical: verticalScale(16), // py-4
        borderRadius: scale(12), // rounded-xl
        marginBottom: verticalScale(15), // mb-6
        alignItems: 'center',
        justifyContent: 'center',
    },
    queueButtonText: {
        color: '#fff', // text-white
        fontFamily: "AirbnbCereal_W_XBd",
        fontSize: scale(16),
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: verticalScale(40),
    },

    bellWrapper: {
        padding: scale(8),
        borderRadius: scale(999),
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: scale(6),
        right: scale(6),
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: '#2dd4bf', // bg-teal-400
    },


    queueListContainer: {
        flex: Platform.OS === "ios" ? 0.90 : 0.95,
        borderWidth: scale(1),
        borderRadius: scale(12),
    },

    queueListheader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        height: verticalScale(40),
        paddingHorizontal: scale(12),
        borderBottomWidth: scale(1),
        gap: scale(2)
    },
    queueListheaderText: {
        fontFamily: "AirbnbCereal_W_Bd",
        fontSize: scale(14),
    },

    noQueueContainer: {
        width: '100%',
        borderWidth: scale(1),
        borderRadius: scale(12),
        // flex: 0.90,
        padding: scale(30),
        gap: verticalScale(20)
    },

    iconContainer: {
        width: scale(80),
        height: scale(80),
        borderRadius: scale(80),
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "auto",
    }
});


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

