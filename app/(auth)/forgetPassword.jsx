import { ActivityIndicator, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useState } from 'react'
import CustomView from '../../components/CustomView';
import CustomText from '../../components/CustomText';
import * as Progress from 'react-native-progress';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useRouter } from 'expo-router';
import CustomSecondaryText from '../../components/CustomSecondaryText';
import { useTheme } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { ErrorIcon } from '../../constants/icons';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'

const forgetPassword = () => {

    const { colors } = useTheme()

    const router = useRouter()

    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [forgetLoader, setForgetLoader] = useState(false)

    const forgetHandler = async () => {
        if (!email) {
            setEmailError("Email is required")
            return;
        } else if (!emailRegex.test(email)) {
            return setEmailError("Invalid email format")
        }

        try {
            setForgetLoader(true)

            const { data } = await axios.post(`${BASE_URL}/customer/forgetPassword`, {
                email,
            })

            router.push({
                pathname: "/passwordVerification",
                params: {
                    email,
                    verificationCodeValue: data?.response?.verificationCode
                }
            })

            setForgetLoader(false)

        } catch (error) {
            Toast.error(error?.response?.data?.message)
            console.log("Error in forget password ", error)

            setForgetLoader(false)
        }

    }

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>
            <CustomView style={{ justifyContent: "space-between" }}>
                <View style={{ gap: verticalScale(20) }}>
                    <View>
                        <CustomText style={styles.heading}>
                            What’s your email?
                        </CustomText>

                        <CustomSecondaryText>
                            Enter your email address to reset your password.
                        </CustomSecondaryText>
                    </View>

                    <View style={styles.inputWrapper}>
                        <CustomText>Email</CustomText>

                        <TextInput
                            editable
                            placeholder="Enter your email"
                            placeholderTextColor={colors.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, {
                                fontFamily: "AirbnbCereal_W_Md",
                                borderWidth: scale(1),
                                borderColor: colors.queueBorder,
                                backgroundColor: colors.cardColor,
                                color: colors.text
                            }]}
                            onChangeText={(text) => {
                                setEmailError("")
                                setEmail(text)
                            }}
                            value={email}
                        />

                        {
                            emailError && (
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(5),
                                }}>
                                    <ErrorIcon color='red' size={scale(16)} />
                                    <CustomText style={{ fontSize: scale(12), color: "red", }}>{emailError}</CustomText>
                                </View>
                            )
                        }

                    </View>

                </View>

                {/* <Pressable
                    disabled={forgetLoader}
                    onPress={() => forgetHandler()}
                    style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
                    <CustomText style={{ color: "#fff" }}>continue</CustomText>
                </Pressable> */}

                <TouchableOpacity
                    onPress={() => forgetHandler()}
                    disabled={forgetLoader}
                    style={styles.signinButton} activeOpacity={0.85}>
                    {
                        forgetLoader ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <CustomText style={styles.signinButtonText}>Continue</CustomText>
                        )
                    }
                </TouchableOpacity>

            </CustomView>
        </TouchableWithoutFeedback>
    )
}

export default forgetPassword

const styles = StyleSheet.create({
    heading: {
        fontFamily: "AirbnbCereal_W_XBd",
        fontSize: moderateScale(22),
        marginBottom: verticalScale(10)
    },

    inputWrapper: {
        gap: verticalScale(10),
    },

    inputField: {
        height: verticalScale(40),
        borderRadius: scale(8),
        paddingHorizontal: scale(10),
        fontSize: moderateScale(14)
    },

    inputFielderror: {

    },

    btn: {
        height: verticalScale(40),
        borderRadius: scale(4),
        alignItems: "center",
        justifyContent: "center",
        marginBlock: verticalScale(0)
    },

    signinButton: {
        width: '100%',
        backgroundColor: '#14b8a6', // bg-teal-500
        paddingVertical: verticalScale(12), // py-4
        borderRadius: scale(8), // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
    },
    signinButtonText: {
        color: '#fff', // text-white
        fontFamily: "AirbnbCereal_W_XBd",
        fontSize: scale(16),
    },
})