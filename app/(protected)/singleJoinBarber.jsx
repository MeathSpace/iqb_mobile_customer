import { FlatList, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomText from '../../components/CustomText'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@react-navigation/native'
import { ArrowLeftIcon, NoUserIcon, ProfileIcon } from '../../constants/icons'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Image } from 'expo-image'
import { useAuth } from '../../context/AuthContext'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'
import Skeleton from '../../components/Skeleton'

const SingleJoinBarber = () => {

    const { data } = useLocalSearchParams();

    const parsedSelectedServices = JSON.parse(data)

    const router = useRouter()
    const { colors } = useTheme();
    const insets = useSafeAreaInsets()
    const { authenticatedUser } = useAuth()

    function formatMinutesToHrMin(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}m`;
    }


    const [barberList, setBarberList] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })

    useEffect(() => {
        if (parsedSelectedServices.length > 0) {

            const fetchBarbersByMultipleServiceId = async () => {
                try {

                    setBarberList((prev) => ({ ...prev, loading: true }))

                    const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getBarberByMultipleServiceId`, {
                        salonId: authenticatedUser.salonId,
                        serviceIds: parsedSelectedServices.map((item) => item.serviceId)
                    })

                    setBarberList((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

                } catch (error) {

                    setBarberList((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                    console.log("Error fetching barbers by multiple service Id", error)
                }
            }

            fetchBarbersByMultipleServiceId()
        }

    }, [])

    const [selectBarber, setSelectedBarber] = useState("")
    const totalPrice = parsedSelectedServices?.reduce((acc, service) => acc + service.servicePrice, 0);
    const totalTime = parsedSelectedServices?.reduce((acc, service) => acc + service.serviceEWT, 0);
    const totalServices = parsedSelectedServices?.length;

    // console.log("barberList ", barberList?.data)

    return (
        // <View style={{
        //     padding: 20
        // }}>
        //     <CustomText style={{ fontSize: 28 }}>SingleJoinBarber</CustomText>

        //     <TouchableOpacity
        //         onPress={() => {
        //             router.push("/singleJoinSuccessPage")
        //         }}
        //     >
        //         <CustomText>Single Join Success Page</CustomText>
        //     </TouchableOpacity>
        // </View>

        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background,
                padding: scale(10)
            }}
        >
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(10),
                marginBottom: verticalScale(20), // Added some space below header
            }}>
                <Pressable onPress={() => router.back()}>
                    <ArrowLeftIcon color={colors.text} />
                </Pressable>
                <CustomText style={{
                    flex: 1,
                    fontFamily: "AirbnbCereal_W_XBd",
                    fontSize: scale(20),
                }}>Single Join</CustomText>
            </View>

            <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd", fontSize: scale(22), marginBottom: verticalScale(10) }}>Select Stylist</CustomText>

            {
                barberList?.loading ? (
                    <FlatList
                        key={2}
                        data={[1, 2, 3, 4, 5, 6, 7, 8]}
                        columnWrapperStyle={{
                            columnGap: scale(10),
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: scale(10) }} />}
                        renderItem={({ item }) => {
                            return (
                                <Skeleton width={scale(160)} height={scale(170)} borderRadius={scale(8)} />
                            );
                        }}
                        keyExtractor={item => item}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: verticalScale(60)
                        }}
                        numColumns={2}
                    />
                ) : barberList?.data?.length > 0 ? (
                    <FlatList
                        key={2}
                        data={barberList?.data}
                        columnWrapperStyle={{
                            columnGap: scale(10),
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: scale(10) }} />}
                        renderItem={({ item }) => {
                            return (
                                <Pressable
                                    onPress={() => setSelectedBarber(item)}
                                    style={[styles.barberCard, {
                                        backgroundColor: colors.cardColor,
                                        borderColor: selectBarber?.barberId === item?.barberId ? '#14b8a6' : colors.queueBorder,
                                        borderWidth: selectBarber?.barberId === item?.barberId ? scale(2) : scale(1),
                                    }]}
                                >
                                    <Image
                                        style={[styles.barberCardImage, {
                                            borderWidth: scale(1),
                                            borderColor: colors.queueBorder
                                        }]}
                                        source={{ uri: item?.profile?.[0]?.url }}
                                        contentFit="cover"
                                        transition={300}
                                    />
                                    <CustomText style={{
                                        fontFamily: "AirbnbCereal_W_XBd"
                                    }}>{item?.name}</CustomText>
                                    <CustomSecondaryText>~{formatMinutesToHrMin(item?.barberEWT)}</CustomSecondaryText>
                                </Pressable>
                            );
                        }}
                        keyExtractor={item => item?.barberId}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: verticalScale(60)
                        }}
                        numColumns={2}
                    />
                ) : (
                    <View style={[styles.upcomingCard, { backgroundColor: colors.cardColor, borderColor: colors.cardBorder }]}>
                        <View style={[styles.iconContainer, { backgroundColor: "rgba(13, 148, 136, 0.1)" }]}>
                            <ProfileIcon size={scale(32)}color={"#14b8a6"} />
                        </View>
                        <CustomText style={styles.cardTitle}>No Stylists</CustomText>
                        <CustomText style={[styles.cardSubtitle, { color: colors.secondaryText }]}>
                            Unfortunately, there are no available stylists for the selected services at the moment.
                        </CustomText>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.bookButton}
                            activeOpacity={0.85}
                        >
                            <CustomText style={styles.bookButtonText}>Choose Services Again</CustomText>
                        </TouchableOpacity>
                    </View>
                )
            }


            {parsedSelectedServices?.length ? (
                <View
                    style={{
                        backgroundColor: colors.cardColor,
                        borderTopColor: colors.queueBorder,
                        borderTopWidth: scale(1),
                        height: Platform.OS === "ios" ? insets.bottom + verticalScale(60) : verticalScale(80),
                        padding: scale(10),
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: 'space-between',
                    }}
                >
                    <View style={{ marginBottom: verticalScale(15) }}>
                        <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd", fontSize: scale(18) }}>
                            {authenticatedUser?.currency} {totalPrice.toFixed(2)}
                        </CustomText>
                        <CustomSecondaryText>
                            {totalServices} {totalServices === 1 ? "service" : "services"} | {formatMinutesToHrMin(totalTime)}
                        </CustomSecondaryText>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            if (!selectBarber) {
                                Toast.error("Please select a barber")
                                return
                            }
                            if (parsedSelectedServices.length === 0) {
                                Toast.error("Please select a service")
                                return
                            }

                            router.push({
                                pathname: "/singleJoinModal",
                                params: {
                                    selectedServices: JSON.stringify(parsedSelectedServices),
                                    selectBarber: JSON.stringify(selectBarber)
                                },
                            });
                        }}
                        style={styles.queueButton}
                        activeOpacity={0.85}
                    >
                        <CustomText style={styles.queueButtonText}>Continue</CustomText>
                    </TouchableOpacity>
                </View>
            ) : null}

        </SafeAreaView>
    )
}

export default SingleJoinBarber

const styles = StyleSheet.create({

    barberCard: {
        // width: scale(103), for 3 cards
        width: scale(160),
        // height: verticalScale(150),
        borderRadius: scale(8),
        justifyContent: "center",
        alignItems: "center",
        padding: scale(10),
        gap: verticalScale(5)
    },

    barberCardImage: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(120),
    },


    upcomingCard: {
        // backgroundColor: '#ffffff',
        borderRadius: scale(12),
        padding: scale(20),
        alignItems: 'center',
        // borderColor: '#e5e7eb',
        borderWidth: scale(1),
        gap: verticalScale(20),
        marginBottom: verticalScale(10)
    },

    iconContainer: {
        width: scale(80),
        height: scale(80),
        borderRadius: scale(80),
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "auto",
    },
    cardTitle: {
        fontFamily: "AirbnbCereal_W_XBd",
        fontSize: scale(20),
        textAlign: "center",
        // marginBottom: verticalScale(4),
    },
    cardSubtitle: {
        fontFamily: "AirbnbCereal_W_Bd",
        fontSize: scale(16),
        textAlign: "center",
        // marginBottom: verticalScale(20)
    },
    bookButton: {
        width: '100%',
        backgroundColor: '#14b8a6', // bg-teal-500
        paddingVertical: verticalScale(16), // py-4
        borderRadius: scale(12), // rounded-xl
        // marginBottom: verticalScale(15), // mb-6
        alignItems: 'center',
        justifyContent: 'center'
    },
    bookButtonText: {
        color: '#fff', // text-white
        fontFamily: "AirbnbCereal_W_XBd",
        fontSize: scale(16),
    },

    queueButton: {
        width: '40%',
        backgroundColor: '#14b8a6', // bg-teal-500
        paddingVertical: verticalScale(12), // py-4
        borderRadius: scale(8), // rounded-xl
        marginBottom: verticalScale(15), // mb-6
        alignItems: 'center',
        justifyContent: 'center',
    },
    queueButtonText: {
        color: '#fff', // text-white
        fontFamily: "AirbnbCereal_W_XBd",
        fontSize: scale(16),
    },
})