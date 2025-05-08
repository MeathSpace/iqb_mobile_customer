import { Image, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, } from 'react-native'
import CustomView from "../components/CustomView"
import CustomText from "../components/CustomText"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Link, useRouter } from 'expo-router';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useState } from 'react';
import Checkbox from 'expo-checkbox';
import CustomSecondaryText from '../components/CustomSecondaryText';

const signin = () => {

    const colorScheme = useColorScheme()

    const { modeColor, theme } = useTheme()

    const router = useRouter()

    const [isChecked, setChecked] = useState(false);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <CustomView style={{ alignItems: "center", justifyContent: "center" }}>
                <View style={{ width: "100%", gap: verticalScale(25) }}>
                    <Image
                        style={[styles.Logo, { tintColor: colorScheme === "dark" ? "#fff" : "#000" }]}
                        source={require("../assets/images/IQB_Logo.png")}
                        resizeMode="cover"
                    />

                    <TextInput
                        editable
                        placeholder="Enter your email"
                        placeholderTextColor={theme.secondaryText}
                        style={[false ? styles.inputFielderror : styles.inputField, { borderColor: theme.borderColor, backgroundColor: theme.InputBackground, fontFamily: "AirbnbCereal_W_Bk", color: theme.primaryText }]}
                        // onChangeText={(text) => {
                        //     setEmailError("")
                        //     setEmail(text)
                        // }}
                        // value={email}
                        value=''
                    />

                    <TextInput
                        editable
                        placeholder="Enter your password"
                        placeholderTextColor={theme.secondaryText}
                        style={[false ? styles.inputFielderror : styles.inputField, { borderColor: theme.borderColor, backgroundColor: theme.InputBackground, fontFamily: "AirbnbCereal_W_Bk", color: theme.primaryText }]}
                        // onChangeText={(text) => {
                        //     setEmailError("")
                        //     setEmail(text)
                        // }}
                        // value={email}
                        value=''
                    />

                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingHorizontal: scale(10)
                        }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                onValueChange={setChecked}
                                color={isChecked ? modeColor.colorCode : undefined}
                            />
                            <CustomSecondaryText>
                                Remember Me
                            </CustomSecondaryText>
                        </View>



                        <Pressable>
                            <CustomSecondaryText>
                                Forgot Password ?
                            </CustomSecondaryText>
                        </Pressable>
                    </View>

                    <Pressable
                        onPress={() => router.push("/")}
                        style={[styles.auth_btn, { backgroundColor: modeColor.colorCode, marginBottom: verticalScale(10) }]}>
                        <CustomText style={{ color: "#fff" }}>Sign in</CustomText>
                    </Pressable>

                    <CustomText style={[styles.subHeading, { color: theme.secondaryText }]}>Don't have an account ?
                        <Link href="/signup" asChild>
                            <CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}> Sign up</CustomText>
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
                            Sign in with Google
                        </CustomText>
                    </Pressable>

                </View>
            </CustomView>
        </TouchableWithoutFeedback>
    )
}

export default signin

const styles = StyleSheet.create({
    Logo: {
        width: moderateScale(100),
        height: moderateScale(100),
        marginHorizontal: "auto",
        // marginBlock: verticalScale(25)
    },

    inputField: {
        height: verticalScale(40),
        borderRadius: scale(4),
        borderWidth: moderateScale(1.5),
        paddingHorizontal: scale(10),
        // marginBottom: verticalScale(25),
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
        // marginBlock: verticalScale(10),
        textAlign: "center",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: verticalScale(40),
        // marginBottom: verticalScale(20)
    },
})

