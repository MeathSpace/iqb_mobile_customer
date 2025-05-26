import { Image, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React from 'react'
import CustomView from '../../components/CustomView'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import CustomText from '../../components/CustomText';
import { useTheme } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';

const signup = () => {

    const { colors } = useTheme()

    const router = useRouter()

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("")

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <CustomView style={{ alignItems: "center", justifyContent: "center" }}>
                <View style={{ width: "100%" }}>
                    <Image
                        style={[styles.Logo, { tintColor: colors.text }]}
                        source={require("../../assets/images/icon.png")}
                        resizeMode="cover"
                    />

                    <TextInput
                        editable
                        placeholder="Enter your email"
                        placeholderTextColor={colors.secondaryText}
                        style={[false ? styles.inputFielderror : styles.inputField, { borderColor: colors.border, backgroundColor: colors.card, fontFamily: "AirbnbCereal_W_Bk", color: colors.text }]}
                        onChangeText={(text) => {
                            setEmailError("")
                            setEmail(text)
                        }}
                        value={email}
                    />

                    {emailError && <Text style={styles.error}>{emailError}</Text>}

                    <Pressable
                        onPress={() => router.push("/personalInfo")}
                        style={[styles.auth_btn, { backgroundColor: Colors.modeColor.colorCode, marginBottom: verticalScale(10) }]}>
                        <CustomText style={{ color: "#fff" }}>Sign up</CustomText>
                    </Pressable>

                    <Pressable onPress={() => router.replace("/signin")}>
                        <CustomText style={[styles.subHeading, { color: colors.secondaryText }]}>Already a member ? <CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}> Log In</CustomText></CustomText>
                    </Pressable>

                    <View style={styles.divider}>
                        <View style={{ flex: 1, height: verticalScale(1), backgroundColor: colors.text }} />

                        <View style={{ padding: moderateScale(10) }}>
                            <CustomText style={{ color: colors.text }}>or</CustomText>
                        </View>

                        <View style={{ flex: 1, height: verticalScale(1), backgroundColor: colors.text }} />
                    </View>

                    <Pressable
                        // onPress={() => googleSignUp}
                        style={
                            [styles.auth_btn,
                            {
                                borderWidth: moderateScale(1.5),
                                borderColor: "gray",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: scale(10),
                            }
                            ]}>
                        <Image
                            source={require("../../assets/images/google.png")}
                            height={30}
                            width={30}
                        />
                        <CustomText>
                            Sign up with Google
                        </CustomText>
                    </Pressable>

                </View>
            </CustomView>
        </TouchableWithoutFeedback>
    )
}

export default signup

const styles = StyleSheet.create({
    Logo: {
        width: moderateScale(100),
        height: moderateScale(100),
        marginHorizontal: "auto",
        marginBlock: verticalScale(25)
    },

    inputField: {
        height: verticalScale(40),
        borderRadius: scale(4),
        borderWidth: moderateScale(1.5),
        paddingHorizontal: scale(10),
        marginBottom: verticalScale(25),
        fontSize: moderateScale(14)
    },
    inputFielderror: {

    },
    auth_btn: {
        height: verticalScale(40),
        borderRadius: scale(4),
        alignItems: "center",
        justifyContent: "center",
    },
    subHeading: {
        marginBlock: verticalScale(10),
        textAlign: "center",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: verticalScale(40),
        marginBottom: verticalScale(20)
    }
})