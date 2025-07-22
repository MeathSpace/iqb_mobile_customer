import { ActivityIndicator, Alert, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomView from '../../components/CustomView';
import ProgressHeader from '../../components/ProgressHeader';
import CustomText from '../../components/CustomText';
import CustomSecondaryText from '../../components/CustomSecondaryText';
import { usePreventRemove, useTheme } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { ErrorIcon } from '../../constants/icons';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'
import { useAuth } from '../../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage';

const verification = () => {

    const { email,
        fullName,
        gender,
        callingCode,
        phoneNumber,
        // verificationOtp,
        selectedDate,
        authType,
        password } = useLocalSearchParams();

    const { colors } = useTheme()

    // console.log("Current Email ", email)
    // console.log("Auth Type Verification ", authType ?? " none")

    const [verificationCode, setVerificationCode] = useState("")
    const [verificationCodeError, setVerificationCodeError] = useState("")
    const [currentVerificationOtp, setCurrentVerificationOtp] = useState("")
    const [verificationCodeLoading, setVerificationCodeLoading] = useState(false)
    const [signupLoading, setSignupLoading] = useState(false)

    useEffect(() => {
        if (email && phoneNumber && callingCode) {
            const sendCustomerVerificationCodeFnc = async () => {
                try {
                    const { data } = await axios.post(`${BASE_URL}/customer/sendCustomerVerificationCode`, {
                        email,
                        mobileCountryCode: callingCode,
                        mobileNumber: phoneNumber
                    })

                    console.log("UseEffect Code ", data)
                    setCurrentVerificationOtp(data?.response)

                } catch (error) {
                    Toast.error(error?.response?.data?.message)
                }
            }

            sendCustomerVerificationCodeFnc()
        }
    }, [email, phoneNumber, callingCode])

    const router = useRouter()

    const [progressOne, setProgressOne] = useState(1)
    const [progressTwo, setProgressTwo] = useState(1)
    const [progressThree, setProgressThree] = useState(0.5)

    const { setIsAuthenticated, setAuthenticatedUser, setSignInData, signInData } = useAuth()

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
                name: fullName,
                gender,
                dateOfBirth: selectedDate,
                mobileCountryCode: callingCode,
                mobileNumber: phoneNumber,
                password
            }

            const googleSignUpData = {
                email,
                name: fullName,
                gender,
                dateOfBirth: selectedDate,
                mobileCountryCode: callingCode,
                mobileNumber: phoneNumber,
            }

            setSignupLoading(true)

            // if (authType === "google") {
            //     const { data } = await axios.post(`${BASE_URL}/customer/googleCustomerSignup`, googleSignUpData)

            //     setSignupLoading(false)

            //     Toast.success(data?.message)

            // } else {
            //     const { data } = await axios.post(`${BASE_URL}/customer/signUp`, signUpData)

            //     setSignupLoading(false)

            //     Toast.success(data?.message)
            // }

            // router.replace("/signin")



            if (authType === "google") {
                const { data } = await axios.post(`${BASE_URL}/customer/googleCustomerSignup`, googleSignUpData)

                // console.log("Sign up data ", data)

                setSignInData((prev) => ({ ...prev, loading: false, user: data?.response, success: true, error: null }))

                await AsyncStorage.setItem("isAuthenticated", JSON.stringify(true))
                await AsyncStorage.setItem("LoggedInUser", JSON.stringify(data?.response))
                setAuthenticatedUser(data?.response)
                setIsAuthenticated(true)
                router.push("/home")

            } else {

                const { data } = await axios.post(`${BASE_URL}/customer/signUp`, signUpData)

                setSignInData((prev) => ({ ...prev, loading: false, user: data?.response, success: true, error: null }))

                await AsyncStorage.setItem("isAuthenticated", JSON.stringify(true))
                await AsyncStorage.setItem("LoggedInUser", JSON.stringify(data?.response))
                setAuthenticatedUser(data?.response)
                setIsAuthenticated(true)
                router.push("/home")
            }

        } catch (error) {
            console.log(error?.data)
            setSignupLoading(false)
            Toast.error(error?.response?.data?.message)
        }
    }


    const [verificationTime, setVerificationTime] = useState(0); // countdown timer
    const [isCooldown, setIsCooldown] = useState(false);

    useEffect(() => {
        let interval;
        if (isCooldown && verificationTime > 0) {
            interval = setInterval(() => {
                setVerificationTime(prev => prev - 1);
            }, 1000);
        }

        if (verificationTime === 0) {
            setIsCooldown(false);
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isCooldown, verificationTime]);


    const resendVerification = async () => {

        if (isCooldown) {
            Toast.error("Please wait before requesting another code.");
            return;
        }

        try {
            setVerificationCodeLoading(true)
            const { data } = await axios.post(`${BASE_URL}/customer/sendCustomerVerificationCode`, {
                email,
                mobileCountryCode: callingCode,
                mobileNumber: phoneNumber
            })
            setVerificationCodeLoading(false)
            setCurrentVerificationOtp(data?.response)
            console.log("Resend verification Code ", data?.response)

            // ✅ Start cooldown here
            setIsCooldown(true);
            setVerificationTime(30);

        } catch (error) {
            setVerificationCodeLoading(false)
            console.log("Verification Otp error ", error)
            Toast.error(error?.response?.data?.message)
        }
    }


    const hasUnsavedChanges = true;

    usePreventRemove(
        hasUnsavedChanges, // This boolean determines if removal should be prevented
        ({ data }) => {
            // The action is still passed, but we're choosing not to dispatch it,
            // effectively making "going back" impossible through these means.
            Alert.alert(
                'Cannot Go Back',
                'You cannot go back during the signup flow. Please complete the current step.',
                [{ text: 'OK', onPress: () => null }] // Only an 'OK' button
            );
        }
    );

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>
            <CustomView style={{ justifyContent: "space-between" }}>
                <View style={{ gap: verticalScale(20) }}>


                    {/* {authType === "google" ? (
                        <ProgressHeader
                            progressOne={progressOne}
                            progressTwo={0.5}
                            authType={"google"}
                        />
                    ) : (
                        <ProgressHeader
                            progressOne={progressOne}
                            progressTwo={progressTwo}
                            progressThree={progressThree}
                        />
                    )} */}


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
                            Enter the 4 digit code sent to your mobile number and email
                        </CustomSecondaryText>
                    </View>

                    <View style={styles.inputWrapper}>
                        <CustomText>Verification Code</CustomText>

                        <TextInput
                            editable
                            keyboardType="numeric"
                            placeholder="Enter your otp"
                            placeholderTextColor={colors.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, {
                                borderWidth: scale(1),
                                borderColor: colors.queueBorder,
                                backgroundColor: colors.cardColor,
                                color: colors.text
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

                    <TouchableOpacity
                        disabled={signupLoading}
                        onPress={() => signupHandler()}
                        style={styles.signinButton} activeOpacity={0.85}>
                        {
                            signupLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <CustomText style={styles.signinButtonText}>Verify & Create Account</CustomText>
                            )
                        }
                    </TouchableOpacity>

                    {/* <Pressable
                        onPress={resendVerification}
                        style={[
                            styles.btn,
                            {
                                width: scale(100),
                                marginLeft: "auto",
                                backgroundColor: (verificationCodeLoading || isCooldown)
                                    ? "#999"
                                    : Colors.modeColor.colorCode
                            }
                        ]}
                    >
                        {
                            verificationCodeLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <CustomText style={{ color: "#fff" }}>
                                    {isCooldown ? `Wait ${verificationTime}s` : "Resend"}
                                </CustomText>
                            )
                        }
                    </Pressable> */}

                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center", // centers the entire row
                            marginHorizontal: "auto",
                        }}
                    >
                        <CustomSecondaryText>Didn't receive the code? </CustomSecondaryText>

                        <Pressable
                            onPress={resendVerification}
                            disabled={verificationCodeLoading || isCooldown}
                        >
                            {verificationCodeLoading ? (
                                <ActivityIndicator size="small" color="#14b8a6" />
                            ) : (
                                <CustomText style={{ color: '#14b8a6' }}>
                                    {isCooldown ? `Wait ${verificationTime}s` : "Resend"}
                                </CustomText>
                            )}
                        </Pressable>
                    </View>



                </View>

                {/* <Pressable
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
                </Pressable> */}
            </CustomView>
        </TouchableWithoutFeedback>
    )
}

export default verification

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