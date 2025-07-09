import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { CloseIcon, ErrorIcon } from '../../constants/icons';
import CustomText from '../../components/CustomText'
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
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
            router.replace("/home")

            setConnectSalonLoader(false)

        } catch (error) {

            setConnectSalonLoader(false)
            Toast.error(error?.response?.data?.message)
            console.log("Error connecting to salon ", error)
        }
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.2)",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <View
                style={{
                    width: "90%",
                    height: verticalScale(244),
                    borderRadius: scale(8),
                    borderWidth: scale(1),
                    borderColor: "gray",
                    paddingVertical: verticalScale(24),
                    paddingHorizontal: scale(48),
                    gap: verticalScale(32),
                    backgroundColor: colors.background,
                    position: 'relative'
                }}
            >
                <View style={{ gap: verticalScale(25) }}>
                    <ErrorIcon size={scale(45)} color={"#FF6961"} style={{ textAlign: "center" }} />
                    <CustomText
                        style={{
                            textAlign: "center"
                        }}
                    >Are you sure you want to disconnect?</CustomText>
                </View>

                <Pressable
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
                </Pressable>

                <Pressable
                    onPress={() => router.back()}
                    style={styles.closeButton}
                >
                    <CloseIcon
                        size={scale(16)}
                        color="#E11D48"
                    />
                </Pressable>


            </View>
        </View>
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
    }
})