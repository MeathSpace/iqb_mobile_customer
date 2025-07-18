import { FlatList, Platform, Pressable, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import CustomTabView from '../../../components/CustomTabView';
import CustomText from '../../../components/CustomText';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../../constants/Colors';
import { useTheme } from '@react-navigation/native';
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

const QueueList = () => {

    const { authenticatedUser } = useAuth()

    const [qlistData, setQlistData] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
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

            setQlistData((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

        } catch (error) {

            setQlistData((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
            console.log("Error fetching queue list ", error)
        }
    }

    const socket = io("https://iqb-final.onrender.com", {
        transports: ['websocket'],
    });

    useFocusEffect(
        useCallback(() => {

            fetchQlist()

            socket.emit("joinSalon", authenticatedUser?.salonId);

            socket.on("queueUpdated", (queueData) => {
                setQlistData((prev) => ({ ...prev, loading: false, data: queueData, success: true, error: null }))
            })

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

    return (
        <CustomTabView
            style={{
                justifyContent: "space-between",
                paddingVertical: verticalScale(0),
                paddingTop: verticalScale(0),
                // backgroundColor: "#00B0901A"
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
                    {
                        newNotification.value && (
                            <View style={styles.badge} />
                        )
                    }

                </Pressable>
            </View>
            <View style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? verticalScale(60) : 0 }}>
                {
                    qlistData?.data?.length ? (
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: scale(10)
                            }}
                        >
                            {/* <Pressable
                                onPress={() => router.push("/joinpopup")}
                                style={{
                                    height: verticalScale(40),
                                    flex: 1,
                                    backgroundColor: Colors.modeColor.colorCode,
                                    marginHorizontal: "auto",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: scale(4),
                                    // marginVertical: verticalScale(10)
                                }}
                            >
                                <CustomText style={{ color: "#fff" }}>Join Queue</CustomText>
                            </Pressable> */}

                            <TouchableOpacity
                                onPress={() => router.push("/joinpopup")}
                                style={styles.queueButton} activeOpacity={0.85}>
                                <CustomText style={styles.queueButtonText}>Join Queue</CustomText>
                            </TouchableOpacity>

                            {/* <Pressable
                                disabled={qlistData?.loading}
                                onPress={fetchQlist}
                                style={{
                                    height: verticalScale(40),
                                    width: verticalScale(40),
                                    backgroundColor: "#0BA3AD1A",
                                    marginHorizontal: "auto",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: scale(4),
                                }}
                            >
                                <RefreshIcon color={Colors.modeColor.colorCode} />
                            </Pressable> */}

                        </View>
                    ) : null
                }


                {
                    qlistData?.loading ? (<FlatList
                        data={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                        contentContainerStyle={{
                            overflow: "visible",
                            paddingTop: verticalScale(10),
                            gap: verticalScale(10)
                        }}
                        renderItem={({ item, index }) => <Skeleton
                            height={verticalScale(70)}
                        />
                        }
                        keyExtractor={item => item}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={<View style={{ height: Platform.OS === "ios" ? verticalScale(60) : 0 }} />}
                    />) : qlistData?.data?.length ? (
                        <FlatList
                            data={qlistData?.data}
                            contentContainerStyle={{
                                overflow: "visible",
                                paddingTop: verticalScale(10),
                                gap: verticalScale(10)
                            }}
                            renderItem={({ item, index }) => <QlistItem item={item} index={index} qlistLength={qlistData?.data} />}
                            keyExtractor={item => item._id}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={<View style={{ height: Platform.OS === "ios" ? verticalScale(60) : 0 }} />}

                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    colors={['black']}
                                    progressBackgroundColor={'#fff'}
                                />
                            }
                        />

                    ) : (
                        <View style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
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
                                    <PeopleIcon
                                        color={colors.text}
                                        size={scale(40)}
                                    />
                                </View>
                                <CustomText
                                    style={{
                                        textAlign: "center",
                                        fontSize: scale(16)
                                    }}
                                >Queue's Open - Join now</CustomText>
                                <CustomSecondaryText
                                    style={{
                                        textAlign: "center"
                                    }}
                                >No waiting, no hassle! Be the first to join the queue and get served right away. Tap below to grab your spot now.</CustomSecondaryText>
                                <Pressable
                                    onPress={() => router.push("/joinpopup")}
                                    style={{
                                        height: verticalScale(40),
                                        paddingInline: scale(30),
                                        backgroundColor: Colors.modeColor.colorCode,
                                        marginHorizontal: "auto",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: scale(4),
                                    }}
                                ><CustomText style={{
                                    color: "#fff"
                                }}>Join Queue</CustomText></Pressable>
                            </View>
                        </View>
                    )
                }

                {/* <QlistItem
                    name="Jazz"
                    partner="Sumit S."
                    imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
                />
                <QlistItem
                    name="Vivob"
                    partner="Sumit S."
                    imageUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop"
                /> */}


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
        fontWeight: 'bold',
        fontSize: scale(16),
    },

    // title: {
    //     fontFamily: "AirbnbCereal_W_Md"
    // },
    // qlistHeader: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center',
    //     marginBottom: verticalScale(10),
    // },

    // btn: {
    //     width: "45%",
    //     height: verticalScale(35),
    //     borderRadius: scale(4),
    //     alignItems: "center",
    //     justifyContent: "center",
    //     elevation: 4,
    // }

    header: {
        // paddingTop: verticalScale(5),
        // paddingBottom: verticalScale(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: verticalScale(70),
        paddingTop: verticalScale(5),
        paddingBottom: verticalScale(12),
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
});

