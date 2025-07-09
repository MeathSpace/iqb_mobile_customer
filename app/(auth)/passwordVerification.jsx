import { ActivityIndicator, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomView from '../../components/CustomView';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomText from '../../components/CustomText';
import CustomSecondaryText from '../../components/CustomSecondaryText';
import { useTheme } from '@react-navigation/native';
import { ErrorIcon } from '../../constants/icons';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native';
import { Colors } from '@/constants/Colors';

const passwordVerification = () => {

    const { colors } = useTheme()
    const { email, verificationCodeValue } = useLocalSearchParams();

    const [verificationCode, setVerificationCode] = useState("")
    const [verificationCodeError, setVerificationCodeError] = useState("")
    const [currentVerificationOtp, setCurrentVerificationOtp] = useState(verificationCodeValue)
    const [verificationCodeLoading, setVerificationCodeLoading] = useState(false)

    console.log("Email ", email)
    console.log("currentVerificationOtp Code ", currentVerificationOtp)


    const [verificationTime, setVerificationTime] = useState(0);
    const [isCooldown, setIsCooldown] = useState(false);
    const router = useRouter()

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
            const { data } = await axios.post(`${BASE_URL}/customer/forgetPassword`, {
                email,
            })

            setVerificationCodeLoading(false)
            setCurrentVerificationOtp(data?.response?.verificationCode)
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

    const continueHandler = () => {
        if (!verificationCode) {
            setVerificationCodeError("Verification code is required")
            return;
        } else if (Number(verificationCode) !== Number(currentVerificationOtp)) {
            setVerificationCodeError("Verification code does not match")
            return;
        }

        router.push({
            pathname: "/forgetPasswordConfirmation",
            params: {
                email
            }
        });

    }

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>
            <CustomView style={{ justifyContent: "space-between" }}>
                <View style={{ gap: verticalScale(20) }}>
                    <View>
                        <CustomText style={styles.heading}>
                            You're all set!
                        </CustomText>

                        <CustomSecondaryText>
                            Enter the 4 digit code sent to your mobile number
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
                    </Pressable>



                </View>

                <Pressable
                    onPress={continueHandler}
                    style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}
                >
                    <CustomText style={{ color: "#fff" }}>Continue</CustomText>
                </Pressable>

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

export default passwordVerification

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


