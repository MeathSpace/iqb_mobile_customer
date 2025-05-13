import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useRouter } from 'expo-router'
import CustomView from '../../components/CustomView'
import CustomText from '../../components/CustomText'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomSecondaryText from '../../components/CustomSecondaryText'

const forgetVerification = () => {

    const colorScheme = useColorScheme()

    const { modeColor, theme } = useTheme()

    const router = useRouter()

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
                            Enter the 4 digit code sent to your mail
                        </CustomSecondaryText>
                    </View>

                    <View style={styles.inputWrapper}>
                        <CustomText>Verification Code</CustomText>

                        <TextInput
                            editable
                            keyboardType="numeric"
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


                    <Pressable
                        onPress={() => router.push("/forgetVerification")}
                        style={[styles.resendbtn, { backgroundColor: modeColor.colorCode }]}>
                        <CustomText style={{ color: "#fff" }}>Resend</CustomText>
                    </Pressable>
                </View>

                <Pressable
                    onPress={() => console.log("Svewvw")}
                    style={[styles.btn, { backgroundColor: modeColor.colorCode }]}>
                    <CustomText style={{ color: "#fff" }}>Done</CustomText>
                </Pressable>

            </CustomView>
        </TouchableWithoutFeedback>
    )
}

export default forgetVerification

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

    resendbtn: {
        height: verticalScale(40),
        borderRadius: scale(4),
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "auto",
        marginBlock: verticalScale(0),
        paddingHorizontal: scale(20),
    }
})