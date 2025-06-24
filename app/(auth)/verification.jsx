import { ActivityIndicator, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomView from '../../components/CustomView';
import ProgressHeader from '../../components/ProgressHeader';
import CustomText from '../../components/CustomText';
import CustomSecondaryText from '../../components/CustomSecondaryText';
import { useTheme } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { ErrorIcon } from '../../constants/icons';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'

const verification = () => {

    const { email,
        firstName,
        lastName,
        gender,
        callingCode,
        phoneNumber,
        verificationOtp,
        selectedDate,
        password } = useLocalSearchParams();

    const { colors } = useTheme()

    const [verificationCode, setVerificationCode] = useState("")
    const [verificationCodeError, setVerificationCodeError] = useState("")
    const [currentVerificationOtp, setCurrentVerificationOtp] = useState(verificationOtp)
    const [verificationCodeLoading, setVerificationCodeLoading] = useState(false)
    const [signupLoading, setSignupLoading] = useState(false)

    const router = useRouter()

    const [progressOne, setProgressOne] = useState(1)
    const [progressTwo, setProgressTwo] = useState(1)
    const [progressThree, setProgressThree] = useState(0.5)

    const signupHandler = async () => {
        try {
            if (!verificationCode) {
                setVerificationCodeError("Verification code is required")
                return;
            } else if (Number(verificationCode) !== Number(currentVerificationOtp)) {
                setVerificationCodeError("Verification code does not match")
                return;
            }

            const signUpData = {
                email,
                name: `${firstName} ${lastName}`,
                gender,
                dateOfBirth: selectedDate,
                mobileCountryCode: callingCode,
                mobileNumber: phoneNumber,
                password
            }

            setSignupLoading(true)

            const { data } = await axios.post(`${BASE_URL}/customer/signUp`, signUpData)

            setSignupLoading(false)

            Toast.success(data?.message)

            router.replace("/signin")

        } catch (error) {

            setSignupLoading(false)
            Toast.error(error?.response?.data?.message)
        }
    }

    const resendVerification = async () => {
        try {
            setVerificationCodeLoading(true)
            const { data } = await axios.post(`${BASE_URL}/customer/sendCustomerVerificationCode`, {
                email,
                mobileCountryCode: callingCode,
                mobileNumber: phoneNumber
            })
            setVerificationCodeLoading(false)
            setCurrentVerificationOtp(data?.response)

        } catch (error) {
            setVerificationCodeLoading(false)
            console.log("Verification Otp error ", error)
            Toast.error(error?.response?.data?.message)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>
            <CustomView style={{ justifyContent: "space-between" }}>
                <View style={{ gap: verticalScale(20) }}>
                    <ProgressHeader
                        progressOne={progressOne}
                        progressTwo={progressTwo}
                        progressThree={progressThree}
                    />

                    <View>
                        <CustomText style={styles.heading}>
                            You're all set!
                        </CustomText>

                        <CustomSecondaryText>
                            Enter the 4 digit code sent to your mail
                        </CustomSecondaryText>
                    </View>

                    <View style={styles.inputWrapper}>
                        <CustomText>Verification Code</CustomText>

                        <TextInput
                            editable
                            keyboardType="numeric"
                            placeholder="Enter your password"
                            placeholderTextColor={colors.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, {
                                backgroundColor: "#0BA3AD1A",
                                fontFamily: "AirbnbCereal_W_Bk", color: colors.text
                            }]}
                            onChangeText={(text) => {
                                setVerificationCodeError("")
                                setVerificationCode(text)
                            }}
                            value={verificationCode}
                        />


                        {
                            verificationCodeError && (
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(5),
                                }}>
                                    <ErrorIcon color='red' size={scale(16)} />
                                    <CustomText style={{ fontSize: scale(12), color: "red" }}>{verificationCodeError}</CustomText>
                                </View>
                            )
                        }

                    </View>

                    <Pressable
                        onPress={resendVerification}
                        disabled={verificationCodeLoading}
                        style={[styles.btn, { width: scale(100), marginLeft: "auto", backgroundColor: Colors.modeColor.colorCode }]}
                    >
                        {
                            verificationCodeLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <CustomText style={{ color: "#fff" }}>Resend</CustomText>
                            )
                        }
                    </Pressable>

                </View>
                <Pressable
                    disabled={signupLoading}
                    onPress={() => signupHandler()}
                    style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
                    {
                        signupLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <CustomText style={{ color: "#fff" }}>Done</CustomText>
                        )
                    }
                </Pressable>
            </CustomView>
        </TouchableWithoutFeedback>
    )
}

export default verification

const styles = StyleSheet.create({
    heading: {
        fontFamily: "AirbnbCereal_W_Bd",
        fontSize: moderateScale(22),
        marginBottom: verticalScale(10)
    },

    inputWrapper: {
        gap: verticalScale(10),
    },

    inputField: {
        height: verticalScale(40),
        borderRadius: scale(4),
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
})