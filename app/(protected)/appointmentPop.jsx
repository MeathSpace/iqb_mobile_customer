import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTheme } from '@react-navigation/native'
import { scale, verticalScale } from 'react-native-size-matters'
import CustomText from '../../components/CustomText'
import { Toast } from 'toastify-react-native'
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { useAuth } from '../../context/AuthContext'

const appointmentPop = () => {

    const router = useRouter()
    const { colors } = useTheme()
    const params = useLocalSearchParams();

    const selectedAppointmentParse = params?.selectedAppointment ? JSON.parse(params?.selectedAppointment) : {}
    const { authenticatedUser } = useAuth()

    console.log("selectedAppointmentParse ", selectedAppointmentParse)
    const [deleteAppointmentLoader, setDeleteAppointmentLoader] = useState(false)

    const confirmDeleteHandler = () => {
        Alert.alert(
            "Delete Appointment",
            "Are you sure you want to delete this appointment?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteHandler()
                }
            ],
            { cancelable: true }
        )
    }

    const deleteHandler = async () => {
        try {
            setDeleteAppointmentLoader(true)

            const { data } = await axios.delete(`${BASE_URL}/mobileRoutes/deleteAppointments`, {
                data: {
                    salonId: authenticatedUser?.salonId,
                    appointmentId: selectedAppointmentParse?._id
                }
            })

            setDeleteAppointmentLoader(false)

            Alert.alert(
                "Appointment Deleted",
                "The appointment was deleted successfully.",
                [
                    {
                        text: "OK",
                        onPress: () => router.back()
                    }
                ],
                { cancelable: false }
            )

        } catch (error) {
            setDeleteAppointmentLoader(false)
            Toast.error(error?.response?.data?.message)
            console.log("Error deleting appointment ", error)
        }
    }

    return (
        <Pressable
            onPress={() => router.back()}
            style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Pressable
                onPress={() => { }}
                style={{
                    width: "85%",
                    backgroundColor: colors.background,
                    borderRadius: scale(10),
                    padding: scale(15),
                    gap: verticalScale(20),
                    borderColor: "gray",
                    borderWidth: scale(1)
                }}
            >
                <CustomText
                    style={{
                        fontFamily: "AirbnbCereal_W_Blk",
                        fontSize: scale(16),
                        textAlign: "center"
                    }}
                >Manage Appointment</CustomText>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: scale(10)
                    }}
                >
                    <Pressable
                        onPress={confirmDeleteHandler}
                        style={{
                            height: verticalScale(35),
                            width: "48%",
                            backgroundColor: "#E11D481A",
                            borderRadius: scale(4),
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        {
                            (deleteAppointmentLoader) ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <CustomText style={{ color: "#E11D48" }}>delete</CustomText>
                            )
                        }

                    </Pressable>
                    <Pressable
                        onPress={() => {
                            router.replace({
                                pathname: "/editAppointmentCalender",
                                params: {
                                    selectedAppointment: JSON.stringify(selectedAppointmentParse),
                                    editAppointment: true
                                }
                            })
                        }}
                        style={{
                            height: verticalScale(35),
                            width: "48%",
                            backgroundColor: "#0BA3AD",
                            borderRadius: scale(4),
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    ><CustomText style={{ color: "#fff" }}>Edit</CustomText></Pressable>
                </View>

            </Pressable>
        </Pressable>
    )
}

export default appointmentPop

const styles = StyleSheet.create({})