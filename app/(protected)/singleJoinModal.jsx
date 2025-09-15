import { ActivityIndicator, Alert, BackHandler, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import CustomText from '../../components/CustomText';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { CheckIcon } from '../../constants/icons';
import CustomSecondaryText from '../../components/CustomSecondaryText';
import { Toast } from 'toastify-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobal } from '../../context/GlobalContext';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';

const singleJoinModal = () => {

    const { selectedServices, selectBarber } = useLocalSearchParams();

    const parsedSelectedServices = JSON.parse(selectedServices)
    const parsedSelectBarber = JSON.parse(selectBarber)

    const router = useRouter()
    const { colors } = useTheme();
    const { authenticatedUser } = useAuth()


    // console.log("Modal ", parsedSelectBarber, parsedSelectedServices)

    function formatMinutesToHrMin(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}m`;
    }


    const totalPrice = parsedSelectedServices?.reduce((acc, service) => acc + service.servicePrice, 0);
    const totalTime = parsedSelectedServices?.reduce((acc, service) => acc + (service.serviceEWT) || (service.barberServiceEWT), 0);
    const totalServices = parsedSelectedServices?.length;

    const { newNotification, setNewNotification, setQueueJoinType, setJoinPopupType } = useGlobal()
    const [singleJoinLoader, setSingleJoinLoader] = useState(false)

    // console.log(router)

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (singleJoinLoader) {
                    // Prevent back during loading
                    return true; // <-- prevents default back behavior
                }
                return false; // allow default back
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [singleJoinLoader])
    );


    const singleJoinPressed = async () => {
        try {
            const singleJoinData = {
                salonId: authenticatedUser?.salonId,
                name: authenticatedUser?.name,
                customerEmail: authenticatedUser?.email,
                singleJoinedQType: "Single-Join",
                methodUsed: "App",
                mobileCountryCode: authenticatedUser?.mobileCountryCode,
                mobileNumber: authenticatedUser?.mobileNumber.toString(),
                barberName: parsedSelectBarber?.name,
                barberId: parsedSelectBarber?.barberId,
                services: parsedSelectedServices
            }

            setSingleJoinLoader(true)

            const { data } = await axios.post(`${BASE_URL}/mobileRoutes/singleJoinQueue`, singleJoinData)

            Toast.success(data?.message)

            await AsyncStorage.setItem(
                "newNotification",
                JSON.stringify({
                    email: authenticatedUser?.email,
                    value: true
                })
            );

            setNewNotification({
                email: authenticatedUser?.email,
                value: true
            })

            setQueueJoinType({
                single: false,
                group: false
            })

            setJoinPopupType({
                barberSelect: false,
                serviceSelect: false
            })

            router.replace("/singleJoinSuccessPage")

        } catch (error) {

            setSingleJoinLoader(false)
            // Toast.error(error?.response?.data?.message)
            Alert.alert(
                "Notice",
                error?.response?.data?.message,
                [{ text: "OK" }]
            );
            console.log("Error doing single join ", error)
        }
    }

    return (
        <Pressable
            onPress={() => {
                if (!singleJoinLoader) {
                    router.back();
                }
            }}
            style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Pressable
                onPress={() => { }}
                style={[styles.modalContainer, {
                    backgroundColor: colors.cardColor,
                    borderColor: colors.queueBorder
                }]}>
                <View style={styles.iconContainer}>
                    <CheckIcon style={{
                        backgroundColor: colors.tabBackground,
                        padding: scale(3),
                        borderRadius: scale(50),
                    }}
                        size={scale(16)}
                        color={colors.text}
                    />
                    <CustomText style={styles.titleText}>Please Confirm</CustomText>
                </View>

                <View style={{ gap: verticalScale(5) }}>
                    <CustomSecondaryText style={styles.confirmText}>
                        Are you sure you want to proceed?
                    </CustomSecondaryText>

                    {/* Group barber name and pricing together in a styled container */}
                    <View style={{
                        marginTop: verticalScale(5),
                        backgroundColor: colors.tabBackground, // Optional: subtle background to group
                        padding: scale(8),
                        borderRadius: scale(6),
                        gap: verticalScale(4)
                    }}>
                        <CustomText style={{
                            fontFamily: "AirbnbCereal_W_XBd",
                            fontSize: scale(14),
                        }}>
                            {parsedSelectBarber?.name}
                        </CustomText>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: scale(6) }}>
                            <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
                                {authenticatedUser?.currency} {totalPrice.toFixed(2)}
                            </CustomText>
                            <CustomSecondaryText>
                                ( {totalServices} {totalServices === 1 ? "service" : "services"} | {formatMinutesToHrMin(totalTime)} )
                            </CustomSecondaryText>
                        </View>
                    </View>
                </View>


                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        onPress={() => {
                            if (!singleJoinLoader) {
                                router.back();
                            }
                        }}
                        style={[styles.button, {
                            // backgroundColor: '#ef4444'
                        }]}>
                        <CustomText style={{ fontFamily: "AirbnbCereal_W_Bd" }}>No</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        // onPress={}
                        disabled={singleJoinLoader}
                        onPress={singleJoinPressed}
                        style={[styles.button, {
                            backgroundColor: '#14b8a6'
                        }]}>
                        {
                            singleJoinLoader ? (<ActivityIndicator color={"#fff"} />) : (<CustomText style={{ color: "#fff", fontFamily: "AirbnbCereal_W_Bd" }}>Yes</CustomText>)
                        }
                    </TouchableOpacity>
                </View>
            </Pressable>

        </ Pressable>
    )
}

export default singleJoinModal

const styles = StyleSheet.create({

    modalContainer: {
        width: "85%",
        borderRadius: scale(8),
        borderWidth: scale(1),
        padding: scale(10),
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(8)
    },
    titleText: {
        fontFamily: "AirbnbCereal_W_Bd"
    },
    confirmText: {
        marginTop: verticalScale(10),
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: scale(10),
        marginTop: verticalScale(10)
    },
    button: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(6),
        borderRadius: scale(6),
    }
})