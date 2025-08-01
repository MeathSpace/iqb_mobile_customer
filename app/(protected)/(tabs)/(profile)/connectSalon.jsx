import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { CloseIcon, ErrorIcon } from '../../../../constants/icons';
import CustomText from '../../../../components/CustomText'
import { Colors } from '../../../../constants/Colors';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'

const connectSalon = () => {

    const router = useRouter()
    const { colors } = useTheme()
    const { setAuthenticatedUser, authenticatedUser } = useAuth()

    const [connectSalonLoader, setConnectSalonLoader] = useState(false)

    const changeSalonPressed = async () => {
        try {

            setConnectSalonLoader(true)

            const { data } = await axios.post(`${BASE_URL}/customer/customerDisconnectSalon`, {
                email: authenticatedUser?.email
            })

            setAuthenticatedUser({ ...authenticatedUser, salonId: 0 })
            await AsyncStorage.setItem("LoggedInUser", JSON.stringify({ ...authenticatedUser, salonId: 0 }))
            // router.replace("/home")

            router.dismiss(); // this is alias for `router.back()` inside modal
            router.replace("/home");

            setConnectSalonLoader(false)

        } catch (error) {

            setConnectSalonLoader(false)
            Toast.error(error?.response?.data?.message)
            console.log("Error connecting to salon ", error)
        }
    }

    return (
        <Pressable
            onPress={() => router.back()}
            style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.2)",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Pressable
                onPress={() => { }}
                style={{
                    width: "95%",
                    height: verticalScale(280),
                    borderRadius: scale(12),
                    borderWidth: scale(1),
                    borderColor: colors.cardBorder,
                    paddingVertical: verticalScale(24),
                    paddingHorizontal: scale(48),
                    gap: verticalScale(32),
                    backgroundColor: colors.cardColor,
                    position: 'relative'
                }}
            >
                <View style={{ gap: verticalScale(25) }}>
                    {/* <ErrorIcon size={scale(45)} color={"#FF6961"} style={{ textAlign: "center" }} /> */}
                    <View style={[styles.iconContainer, { backgroundColor: "rgba(239, 68, 68, 0.1)" }]}>
                        <ErrorIcon size={scale(45)} color={"#ef4444"} style={{ textAlign: "center" }} />
                    </View>

                    <CustomText style={{
                        fontFamily: "AirbnbCereal_W_Bd",
                        fontSize: scale(16),
                        textAlign: "center",
                        // color: colors.secondaryText,
                    }}>
                        Are you sure you want to disconnect?
                    </CustomText>
                </View>

                {/* <Pressable
                    onPress={changeSalonPressed}
                    style={{
                        height: verticalScale(44),
                        width: scale(180),
                        borderRadius: scale(40),
                        backgroundColor: Colors.modeColor.colorCode,
                        justifyContent: "center",
                        alignItems: "center",
                        marginHorizontal: "auto"
                    }}
                >
                    {
                        connectSalonLoader ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <CustomText style={{ color: "#fff" }}>Change Salon</CustomText>
                        )
                    }
                </Pressable> */}

                <TouchableOpacity
                    onPress={changeSalonPressed}
                    style={styles.queueButton} activeOpacity={0.85}>

                    {
                        connectSalonLoader ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <CustomText style={styles.queueButtonText}>Change Salon</CustomText>
                        )
                    }

                </TouchableOpacity>

                <Pressable
                    onPress={() => router.back()}
                    style={styles.closeButton}
                >
                    <CloseIcon
                        size={scale(16)}
                        color="#E11D48"
                    />
                </Pressable>


            </Pressable>
        </Pressable>
    )
}

export default connectSalon

const styles = StyleSheet.create({

    closeButton: {
        position: "absolute",
        top: verticalScale(10),
        right: scale(10),
        width: scale(30),
        height: scale(30),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E11D481A",
        borderRadius: scale(40),
    },

    iconContainer: {
        width: scale(80),
        height: scale(80),
        borderRadius: scale(80),
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "auto",
    },

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
})