import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomView from '../../components/CustomView';
import ProgressHeader from '../../components/ProgressHeader';
import CustomText from '../../components/CustomText';
import CustomSecondaryText from '../../components/CustomSecondaryText';
import { useTheme } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';

const verification = () => {

    const { colors } = useTheme()

    const router = useRouter()

    const [progressOne, setProgressOne] = useState(1)
    const [progressTwo, setProgressTwo] = useState(1)
    const [progressThree, setProgressThree] = useState(0.5)

    const verificationHandler = () => {

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
                            style={[false ? styles.inputFielderror : styles.inputField, { borderColor: colors.border, backgroundColor: colors.card, fontFamily: "AirbnbCereal_W_Bk", color: colors.text }]}
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
                    onPress={() => verificationHandler()}
                    style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
                    <CustomText style={{ color: "#fff" }}>Done</CustomText>
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