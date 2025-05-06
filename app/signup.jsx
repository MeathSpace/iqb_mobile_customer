import { Image, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React from 'react'
import CustomView from '../components/CustomView'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTheme } from '../context/ThemeContext';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import CustomText from '../components/CustomText';

const signup = () => {

    const colorScheme = useColorScheme()

    const { modeColor, theme } = useTheme()

    const router = useRouter()

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("")

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <CustomView style={{ padding: scale(15), alignItems: "center", justifyContent: "center" }}>
                <View style={{ width: "100%" }}>
                    <Image
                        style={[styles.Logo, { tintColor: colorScheme === "dark" ? "#fff" : "#000" }]}
                        source={require("../assets/images/IQB_Logo.png")}
                        resizeMode="cover"
                    />

                    <TextInput
                        editable
                        placeholder="Enter your email"
                        placeholderTextColor={theme.secondaryText}
                        style={[emailError ? styles.inputFielderror : styles.inputField, { borderColor: theme.borderColor, backgroundColor: theme.InputBackground, fontFamily: "AirbnbCereal_W_Bk", color: theme.primaryText }]}
                        onChangeText={(text) => {
                            setEmailError("")
                            setEmail(text)
                        }}
                        value={email}
                    />

                    {emailError && <Text style={styles.error}>{emailError}</Text>}

                    <Pressable
                        onPress={() => router.push("/personalInfo")}
                        style={[styles.auth_btn, { backgroundColor: modeColor.colorCode, marginBottom: verticalScale(10) }]}>
                        <CustomText style={{ color: "#fff" }}>Sign up</CustomText>
                    </Pressable>

                    <CustomText style={[styles.subHeading, { color: theme.secondaryText }]}>Already a member ?
                        <Link href="/signin" asChild>
                            <CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}> Log In</CustomText>
                        </Link>
                    </CustomText>

                    <View style={styles.divider}>
                        <View style={{ flex: 1, height: verticalScale(1), backgroundColor: theme.primaryText }} />

                        <View style={{ padding: moderateScale(10) }}>
                            <CustomText style={{ color: theme.primaryText }}>or</CustomText>
                        </View>

                        <View style={{ flex: 1, height: verticalScale(1), backgroundColor: theme.primaryText }} />
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
                            source={require("../assets/images/google.png")}
                            height={30}
                            width={30}
                        />
                        <CustomText
                            style={{ color: theme.primaryText }}
                        >
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