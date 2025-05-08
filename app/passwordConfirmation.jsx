import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useState } from 'react'
import CustomView from '../components/CustomView'
import ProgressHeader from '../components/ProgressHeader'
import { useTheme } from '../context/ThemeContext'
import { useRouter } from 'expo-router'
import CustomText from '../components/CustomText'
import CustomSecondaryText from '../components/CustomSecondaryText'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const passwordConfirmation = () => {

    const colorScheme = useColorScheme()

    const { modeColor, theme } = useTheme()

    const router = useRouter()

    const [progressOne, setProgressOne] = useState(1)
    const [progressTwo, setProgressTwo] = useState(1)
    const [progressThree, setProgressThree] = useState(0.5)

    const passwordConfirmHandler = () => {
        router.push("/verification")
    }

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>
            <CustomView style={{ justifyContent: "space-between" }}>
                <View style={{ gap: verticalScale(20) }}>
                    <ProgressHeader
                        theme={theme}
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
                            placeholderTextColor={theme.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, { borderColor: theme.borderColor, backgroundColor: theme.InputBackground, fontFamily: "AirbnbCereal_W_Bk", color: theme.primaryText }]}
                            // onChangeText={(text) => {
                            //     setFirstNameError("")
                            //     setFirstName(text)
                            // }}
                            // value={firstName}
                            value={""}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <CustomText>Confirm password</CustomText>

                        <TextInput
                            editable
                            placeholder="Enter your confirm password"
                            placeholderTextColor={theme.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, { borderColor: theme.borderColor, backgroundColor: theme.InputBackground, fontFamily: "AirbnbCereal_W_Bk", color: theme.primaryText }]}
                            // onChangeText={(text) => {
                            //     setFirstNameError("")
                            //     setFirstName(text)
                            // }}
                            // value={firstName}
                            value={""}
                        />
                    </View>
                </View>

                <Pressable
                    onPress={() => passwordConfirmHandler()}
                    style={[styles.btn, { backgroundColor: modeColor.colorCode }]}>
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
        borderWidth: moderateScale(1.5),
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