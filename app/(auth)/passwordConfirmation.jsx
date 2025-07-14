import { ActivityIndicator, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useState } from 'react'
import CustomView from '../../components/CustomView'
import ProgressHeader from '../../components/ProgressHeader'
import { useLocalSearchParams, useRouter } from 'expo-router'
import CustomText from '../../components/CustomText'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { usePreventRemove, useTheme } from '@react-navigation/native'
import { Colors } from '@/constants/Colors';
import { ErrorIcon, EyeIcon, EyeOffIcon } from '../../constants/icons'
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'
import { Alert } from 'react-native'

const passwordConfirmation = () => {

    // const [verificationCodeData, setVerificationCodeData] = useState({
    //     verificationData: null,
    //     loading: false,
    //     error: null,
    //     success: false
    // })

    const { email,
        firstName,
        lastName,
        gender,
        callingCode,
        phoneNumber,
        selectedDate } = useLocalSearchParams();

    // console.log("callingCode sdv ", callingCode)
    // console.log("phoneNumber wevewv ", phoneNumber)


    // console.log("Params: ", email, firstName, lastName , gender, phoneNumber, selectedDate)

    const { colors } = useTheme()

    const router = useRouter()

    const [progressOne, setProgressOne] = useState(1)
    const [progressTwo, setProgressTwo] = useState(0.5)
    const [progressThree, setProgressThree] = useState(0)

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [passwordError, setPasswordError] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")

    const [verificationLoader, setVerificationLoader] = useState(false)

    const passwordConfirmHandler = async () => {
        if (verificationLoader) return;

        try {
            if (!password) {
                setPasswordError("Password is required");
                return;
            } else if (password.length < 8) {
                setPasswordError("Password must be at least 8 characters");
                return;
            } else if (password.length > 20) {
                setPasswordError("Password must be at most 20 characters");
                return;
            }

            if (!confirmPassword) {
                setConfirmPasswordError("Confirm password is required");
                return;
            } else if (password !== confirmPassword) {
                setConfirmPasswordError("Passwords do not match");
                return;
            }


            // setVerificationCodeData((prev) => ({ ...prev, loading: true }))

            // const { data } = await axios.post(`${BASE_URL}/customer/sendCustomerVerificationCode`, {
            //     email,
            //     mobileCountryCode: callingCode,
            //     mobileNumber: phoneNumber
            // })

            // setVerificationCodeData((prev) => ({ ...prev, loading: false, verificationData: data?.response, success: true, error: null }))

            setVerificationLoader(true)

            router.push({
                pathname: "/verification",
                params: {
                    email,
                    firstName,
                    lastName,
                    gender,
                    callingCode,
                    phoneNumber,
                    selectedDate,
                    // verificationOtp: data?.response,
                    password
                }
            });


        } catch (error) {
            // setVerificationCodeData((prev) => ({ ...prev, loading: false, verificationData: null, success: false, error: error }))
            Toast.error(error?.response?.data?.message)
        } finally {
            setVerificationLoader(false);
        }
    }

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)



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
                    <ProgressHeader
                        progressOne={progressOne}
                        progressTwo={progressTwo}
                        progressThree={progressThree}
                    />

                    <View>
                        <CustomText style={styles.heading}>
                            You’re half-way there!
                        </CustomText>

                        <CustomSecondaryText>
                            Set your password for log in.
                        </CustomSecondaryText>
                    </View>

                    <View style={styles.inputWrapper}>
                        <CustomText>Password</CustomText>

                        {/* <TextInput
                            editable
                            placeholder="Enter your password"
                            placeholderTextColor={colors.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, {
                                backgroundColor: "#0BA3AD1A", fontFamily: "AirbnbCereal_W_Bk", color: colors.text
                            }]}
                            onChangeText={(text) => {
                                setPasswordError("")
                                setPassword(text)
                            }}
                            value={password}
                        /> */}

                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                editable
                                placeholder="Enter your password"
                                placeholderTextColor={colors.secondaryText}
                                style={[false ? styles.inputFielderror : styles.inputField, {
                                    // borderWidth: scale(1),
                                    // borderColor: "gray",
                                    fontFamily: "AirbnbCereal_W_Bk",
                                    color: colors.text,
                                    flex: 1
                                }]}
                                onChangeText={(text) => {
                                    setPasswordError("")
                                    setPassword(text)
                                }}
                                value={password}
                                secureTextEntry={!showPassword}
                            />
                            <Pressable
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                {showPassword ? (<EyeOffIcon />) : (<EyeIcon />)}
                            </Pressable>
                        </View>

                        {
                            passwordError && (
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(5),
                                }}>
                                    <ErrorIcon color='red' size={scale(16)} />
                                    <CustomText style={{ fontSize: scale(12), color: "red" }}>{passwordError}</CustomText>
                                </View>
                            )
                        }

                    </View>

                    <View style={styles.inputWrapper}>
                        <CustomText>Confirm password</CustomText>

                        {/* <TextInput
                            editable
                            placeholder="Enter your confirm password"
                            placeholderTextColor={colors.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, {
                                backgroundColor: "#0BA3AD1A", fontFamily: "AirbnbCereal_W_Bk", color: colors.text
                            }]}
                            onChangeText={(text) => {
                                setConfirmPasswordError("")
                                setConfirmPassword(text)
                            }}
                            value={confirmPassword}
                        /> */}


                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                editable
                                placeholder="Enter your confirm password"
                                placeholderTextColor={colors.secondaryText}
                                style={[false ? styles.inputFielderror : styles.inputField, {
                                    // borderWidth: scale(1),
                                    // borderColor: "gray",
                                    fontFamily: "AirbnbCereal_W_Bk",
                                    color: colors.text,
                                    flex: 1
                                }]}
                                onChangeText={(text) => {
                                    setConfirmPasswordError("")
                                    setConfirmPassword(text)
                                }}
                                value={confirmPassword}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <Pressable
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}
                            >
                                {showConfirmPassword ? (<EyeOffIcon />) : (<EyeIcon />)}
                            </Pressable>
                        </View>

                        {
                            confirmPasswordError && (
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(5),
                                }}>
                                    <ErrorIcon color='red' size={scale(16)} />
                                    <CustomText style={{ fontSize: scale(12), color: "red" }}>{confirmPasswordError}</CustomText>
                                </View>
                            )
                        }
                    </View>

                </View>

                <Pressable
                    onPress={() => passwordConfirmHandler()}
                    disabled={verificationLoader}
                    // disabled={verificationCodeData?.loading}
                    style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>

                    {/* {
                        verificationCodeData?.loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <CustomText style={{ color: "#fff" }}>Continue</CustomText>
                        )
                    } */}

                    <CustomText style={{ color: "#fff" }}>Continue</CustomText>

                </Pressable>
            </CustomView>
        </TouchableWithoutFeedback>
    )
}

export default passwordConfirmation

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

    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: scale(4),
        // backgroundColor: "#0BA3AD1A",
        borderWidth: scale(1),
        borderColor: "gray",
        gap: scale(10),
        paddingRight: scale(10),
    },
})