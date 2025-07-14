import { FlatList, Platform, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
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
import { PeopleIcon, RefreshIcon } from '../../../constants/icons';
import { io } from "socket.io-client";

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

    return (
        <CustomTabView
            style={{
                justifyContent: "space-between",
                paddingVertical: verticalScale(0),
                paddingTop: verticalScale(10),
                // backgroundColor: "#00B0901A"
                backgroundColor: colors.background
            }}>
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
                            <Pressable
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
                            </Pressable>

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


            </View>
        </CustomTabView>
    );
};

export default QueueList;

const styles = StyleSheet.create({
    title: {
        fontFamily: "AirbnbCereal_W_Md"
    },
    qlistHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },

    btn: {
        width: "45%",
        height: verticalScale(35),
        borderRadius: scale(4),
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    }
});

