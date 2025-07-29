import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CheckIcon } from '../../constants/icons'
import { useTheme } from '@react-navigation/native'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CustomSecondaryText from '../../components/CustomSecondaryText'
import CustomText from '../../components/CustomText'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'toastify-react-native'
import { useGlobal } from '../../context/GlobalContext'

const appointmentCalenderModal = () => {

    const router = useRouter()
    const { colors } = useTheme();
    const { authenticatedUser } = useAuth()

    const params = useLocalSearchParams();

    const selectedCustomerBookAppointmentBarberParse = params?.selectedCustomerBookAppointmentBarber ? JSON.parse(params?.selectedCustomerBookAppointmentBarber) : {}
    const selectedCustomerBookAppointmentServicesParse = params?.selectedCustomerBookAppointmentServices ? JSON.parse(params?.selectedCustomerBookAppointmentServices) : []
    const selectedBookCalenderTimeslotParse = params?.selectedBookCalenderTimeslot ? JSON.parse(params?.selectedBookCalenderTimeslot) : ""
    const selectedBookCalenderDateParse = params?.selectedBookCalenderDate ? JSON.parse(params?.selectedBookCalenderDate) : ""
    const selectedBookAppointmentNoteParse = params?.selectedBookAppointmentNote ? JSON.parse(params?.selectedBookAppointmentNote) : ""

    const [bookAppointmentLoader, setBookAppointmentLoader] = useState(false)
    const { newNotification, setNewNotification } = useGlobal()

    const bookAppointmentPressed = async () => {
        // console.log("Book Appointment ")

        const appData = {
            salonId: authenticatedUser?.salonId,
            barberId: selectedCustomerBookAppointmentBarberParse?.barberId,
            serviceId: selectedCustomerBookAppointmentServicesParse.map((item) => item.serviceId),
            appointmentDate: selectedBookCalenderDateParse,
            appointmentNotes: selectedBookAppointmentNoteParse,
            startTime: selectedBookCalenderTimeslotParse,
            customerEmail: authenticatedUser?.email,
            customerName: authenticatedUser?.name,
            customerType: "Walk-In",
            methodUsed: "App"
        }

        try {

            setBookAppointmentLoader(true)

            const { data } = await axios.post(`${BASE_URL}/mobileRoutes/createAppointment`, appData)

            Toast.success(data?.message)
            setBookAppointmentLoader(false)

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

            // router.dismissTo("/appointment")

            router.replace({
                pathname: "/appointmentSuccessPage",
                params: {
                    booked: true,
                    edit: false
                }
            })

        } catch (error) {
            setBookAppointmentLoader(false)
            Alert.alert(
                "Notice",
                error?.response?.data?.message,
                [{ text: "OK" }]
            );
            console.log("Error doing book appointment ", error)
        }
    }

    function formatMinutesToHrMin(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}m`;
    }

    const totalPrice = selectedCustomerBookAppointmentServicesParse?.reduce((acc, service) => acc + service.servicePrice, 0);
    const totalTime = selectedCustomerBookAppointmentServicesParse?.reduce((acc, service) => acc + service.serviceEWT, 0);
    const totalServices = selectedCustomerBookAppointmentServicesParse?.length;

    return (
        <Pressable
            onPress={() => {
                if (!bookAppointmentLoader) {
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
                        backgroundColor: colors.background,
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


                    <View style={{
                        marginTop: verticalScale(5),
                        backgroundColor: colors.background, // Optional: subtle background to group
                        padding: scale(8),
                        borderRadius: scale(6),
                        gap: verticalScale(4)
                    }}>
                        <CustomText style={{
                            fontFamily: "AirbnbCereal_W_XBd",
                            fontSize: scale(14),
                        }}>
                            {selectedCustomerBookAppointmentBarberParse?.name}
                        </CustomText>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: scale(6) }}>
                            <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
                                {authenticatedUser?.currency} {totalPrice.toFixed(2)}
                            </CustomText>
                            <CustomSecondaryText>
                                ( {totalServices} {totalServices === 1 ? "service" : "services"} | {formatMinutesToHrMin(totalTime)} )
                            </CustomSecondaryText>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: scale(6) }}>
                            <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
                                Timeslot
                            </CustomText>
                            <CustomSecondaryText>
                                {selectedBookCalenderTimeslotParse}
                            </CustomSecondaryText>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: scale(6) }}>
                            <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
                                Date
                            </CustomText>
                            <CustomSecondaryText>
                                {selectedBookCalenderDateParse}
                            </CustomSecondaryText>
                        </View>

                        {
                            selectedBookAppointmentNoteParse && (
                                <View style={{ flexDirection: "row", alignItems: "center", gap: scale(6) }}>
                                    <CustomText style={{ fontFamily: "AirbnbCereal_W_XBd" }}>
                                        Note
                                    </CustomText>
                                    <CustomSecondaryText>
                                        {selectedBookAppointmentNoteParse}
                                    </CustomSecondaryText>
                                </View>
                            )
                        }


                    </View>

                </View>


                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        onPress={() => {
                            if (!bookAppointmentLoader) {
                                router.back();
                            }
                        }}
                        style={[styles.button, {
                            // backgroundColor: '#ef4444'
                        }]}>
                        <CustomText style={{ fontFamily: "AirbnbCereal_W_Bd" }}>No</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={bookAppointmentLoader}
                        onPress={bookAppointmentPressed}
                        style={[styles.button, {
                            backgroundColor: '#14b8a6'
                        }]}>
                        {
                            bookAppointmentLoader ? (<ActivityIndicator color={"#fff"} />) : (<CustomText style={{ color: "#fff", fontFamily: "AirbnbCereal_W_Bd" }}>Yes</CustomText>)
                        }
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Pressable>
    )
}

export default appointmentCalenderModal

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