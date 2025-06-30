import { FlatList, Platform, Pressable, StyleSheet, View } from 'react-native';
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
import { PeopleIcon } from '../../../constants/icons';


const QueueList = () => {

    const { authenticatedUser } = useAuth()

    const [qlistData, setQlistData] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })


    useFocusEffect(
        useCallback(() => {
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

            fetchQlist()
        }, [authenticatedUser])
    )

    const { colors } = useTheme()

    const router = useRouter()
    const { joinModes, setJoinModes, setSelectedBarber, setSelectedBarberServices } = useGlobal();

    return (
        <CustomTabView
            style={{
                justifyContent: "space-between",
                paddingVertical: verticalScale(0),
                paddingTop: verticalScale(10)
            }}>
            <View style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? verticalScale(60) : 0 }}>
                {
                    qlistData?.data?.length ? (
                        <Pressable
                            onPress={() => router.push("/joinpopup")}
                            style={{
                                height: verticalScale(40),
                                width: "100%",
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
                    ) : null
                }


                {
                    qlistData?.loading ? (<FlatList
                        data={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                        contentContainerStyle={{
                            overflow: "visible",
                        }}
                        renderItem={({ item, index }) => <Skeleton
                            height={verticalScale(70)}
                            style={{
                                marginTop: verticalScale(5)
                            }}
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
                            }}
                            renderItem={({ item, index }) => <QlistItem item={item} index={index} qlistLength={qlistData?.data} />}
                            keyExtractor={item => item._id}
                            showsVerticalScrollIndicator={false}
                            ListFooterComponent={<View style={{ height: Platform.OS === "ios" ? verticalScale(60) : 0 }} />}
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

