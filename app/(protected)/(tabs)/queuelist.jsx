import { FlatList, Platform, Pressable, RefreshControl, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
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
import { Feather } from '@expo/vector-icons';

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


    const queueData = [
        {
            id: '1',
            barber: 'Jazz',
            barberImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop',
            customer: 'Sumit S.',
            position: 'Next',
            eta: '~0m',
            highlighted: true,
        },
        {
            id: '2',
            barber: 'John Doe',
            barberImage: 'https://placehold.co/40x40/E5E7EB/1F2937?text=JD',
            customer: 'Client',
            position: 'Next',
            eta: '~0m',
        },
        {
            id: '3',
            barber: 'Bob',
            barberImage: 'https://placehold.co/40x40/E5E7EB/1F2937?text=B',
            customer: 'Client',
            position: '#2',
            eta: '~3hr',
        },
        {
            id: '4',
            barber: 'Steve',
            barberImage: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2680&auto=format&fit=crop',
            customer: 'Aarav M.',
            position: '#3',
            eta: '~4hr 15m',
            highlighted: true,
        },
        {
            id: '5',
            barber: 'Bob',
            barberImage: 'https://placehold.co/40x40/E5E7EB/1F2937?text=B',
            customer: 'Client',
            position: '#4',
            eta: '~5hr',
        },
        {
            id: '6',
            barber: 'Chris',
            barberImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop',
            customer: 'Client',
            position: '#4',
            eta: '~5hr 30m',
        },
        {
            id: '7',
            barber: 'David',
            barberImage: 'https://placehold.co/40x40/E5E7EB/1F2937?text=D',
            customer: 'Client',
            position: '#5',
            eta: '~6hr',
        },
        {
            id: '8',
            barber: 'Emily',
            barberImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop',
            customer: 'Priya K.',
            position: '#5',
            eta: '~6hr 20m',
            highlighted: true,
        },
        {
            id: '9',
            barber: 'Frank',
            barberImage: 'https://placehold.co/40x40/E5E7EB/1F2937?text=F',
            customer: 'Client',
            position: '#6',
            eta: '~7hr',
        },
        {
            id: '10',
            barber: 'Grace',
            barberImage: 'https://placehold.co/40x40/E5E7EB/1F2937?text=G',
            customer: 'Client',
            position: '#6',
            eta: '~7hr 30m',
        },
    ];


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
                            <TouchableOpacity
                                onPress={() => router.push("/joinpopup")}
                                style={styles.queueButton} activeOpacity={0.85}>
                                <CustomText style={styles.queueButtonText}>Join Queue</CustomText>
                            </TouchableOpacity>

                        </View>
                    ) : null
                }


                {/* {
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
                } */}

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
                                renderItem={({ item, index }) => <Skeleton width='100%' height={verticalScale(60)} style={{
                                    marginBottom: verticalScale(5)
                                }} />}
                            />

                        </View>
                    )
                        : qlistData?.data?.length ? (
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
                                    data={qlistData?.data}
                                    renderItem={({ item, index }) => <QlistItem item={item} index={index} qlistLength={qlistData?.data} />}
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
                                paddingTop: verticalScale(20),
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: verticalScale(40),
        // paddingTop: verticalScale(5),
        // paddingBottom: verticalScale(12),
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


    // Queue List

    // container: {
    //     borderWidth: 1,
    //     borderRadius: 12,
    //     borderColor: '#e5e7eb',
    //     overflow: 'hidden',
    // },
    // headerRow: {
    //     flexDirection: 'row',
    //     paddingVertical: 12,
    //     paddingHorizontal: 16,
    //     borderBottomWidth: 1,
    //     borderColor: '#e5e7eb',
    //     backgroundColor: 'transparent',
    // },
    // headerText: {
    //     flex: 1,
    //     fontWeight: '600',
    //     fontSize: 13,
    //     color: '#6b7280',
    // },
    // row: {
    // flexDirection: 'row',
    // paddingVertical: 12,
    // paddingHorizontal: 16,
    // alignItems: 'center',
    // },
    // barberCell: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     gap: 8,
    // },
    // barberName: {
    //     fontWeight: '600',
    // },
    // customerCell: {
    //     flex: 1,
    //     fontSize: 14,
    // },
    // positionCell: {
    //     flex: 1,
    //     alignItems: 'flex-end',
    // },
    // positionText: {
    //     fontWeight: '600',
    // },
    // etaText: {
    //     fontSize: 12,
    // },
    // avatar: {
    //     width: 40,
    //     height: 40,
    //     borderRadius: 20,
    // },


    queueListContainer: {
        flex: 0.90,
        borderWidth: scale(1),
        borderRadius: scale(12),
        // padding: scale(12)
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

