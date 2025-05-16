import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React from 'react'
import CustomView from '../../components/CustomView';
import CustomText from '../../components/CustomText';
import * as Progress from 'react-native-progress';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useRouter } from 'expo-router';
import CustomSecondaryText from '../../components/CustomSecondaryText';
import { useTheme } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';

const forgetPassword = () => {

    const { colors } = useTheme()

    const router = useRouter()

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
                            style={[false ? styles.inputFielderror : styles.inputField, { borderColor: colors.border, backgroundColor: colors.card, fontFamily: "AirbnbCereal_W_Bk", color: colors.text }]}
                        // onChangeText={(text) => {
                        //     setFirstNameError("")
                        //     setFirstName(text)
                        // }}
                        // value={firstName}
                        />
                    </View>

                </View>

                <Pressable
                    onPress={() => router.push("/forgetVerification")}
                    style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
                    <CustomText style={{ color: "#fff" }}>Save & next</CustomText>
                </Pressable>
            </CustomView>
        </TouchableWithoutFeedback>
    )
}

export default forgetPassword

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