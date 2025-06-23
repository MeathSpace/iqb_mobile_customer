import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useState } from 'react'
import CustomView from '../../components/CustomView'
import ProgressHeader from '../../components/ProgressHeader'
import { useLocalSearchParams, useRouter } from 'expo-router'
import CustomText from '../../components/CustomText'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native'
import { Colors } from '@/constants/Colors';
import { ErrorIcon } from '../../constants/icons'

const passwordConfirmation = () => {

    const { email,
        firstName,
        lastName,
        gender,
        phoneNumber,
        selectedDate } = useLocalSearchParams();

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


    const passwordConfirmHandler = () => {
        if (!password) {
            setPasswordError("Password is required")
            return;
        } else if (!confirmPassword) {
            setConfirmPasswordError("Confirm password is required")
            return;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match")
            return;
        }

        // router.push("/verification")

        router.push({
            pathname: "/verification",
            params: {
                email,
                firstName,
                lastName,
                gender,
                phoneNumber,
                selectedDate
            }
        });

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
                            You’re half-way there!
                        </CustomText>

                        <CustomSecondaryText>
                            Set your password for log in.
                        </CustomSecondaryText>
                    </View>

                    <View style={styles.inputWrapper}>
                        <CustomText>Password</CustomText>

                        <TextInput
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
                        />

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

                        <TextInput
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
                        />

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
                    style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
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
})