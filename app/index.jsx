import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomView from '../components/CustomView'
import CustomText from '../components/CustomText';
import CustomSecondaryText from '../components/CustomSecondaryText';
import { useTheme } from '../context/ThemeContext';
import { Link, Redirect, useFocusEffect, useRouter } from "expo-router";
import { useAuth } from '../context/AuthContext';

const index = () => {

    const colorScheme = useColorScheme()

    const { modeColor } = useTheme()

    const router = useRouter()

    const [loading, setLoading] = useState(true);

    const { user } = useAuth()


    useEffect(() => {
        let timer = setTimeout(() => {
            if (user) {
                router.replace("/dashboard")
            } else {
                setLoading(false)
            }
        }, 500)

        return () => {
            clearTimeout(timer)
        }

    }, [user, router])


    if (loading) {
        return (
            <CustomView style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                    style={[styles.Logo, { tintColor: colorScheme === "dark" ? "#fff" : "#000" }]}
                    source={require("../assets/images/IQB_Logo.png")}
                    resizeMode="cover"
                />
                <CustomText style={styles.heading}>iQueueBook</CustomText>
            </CustomView>
        )
    }


    return (
        <CustomView style={{ alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: "100%" }}>
                <Image
                    style={[styles.Logo, { tintColor: colorScheme === "dark" ? "#fff" : "#000" }]}
                    source={require("../assets/images/IQB_Logo.png")}
                    resizeMode="cover"
                />
                <Image
                    style={styles.onboardImage}
                    source={require("../assets/images/Onboarding.png")}
                />
                <CustomText style={styles.heading}>
                    Welcome to iQueueBook
                </CustomText>
                <CustomSecondaryText style={styles.sub_heading}>
                    Instantly book, style your hair and mustache the way you want by the
                    stylist of your choice.
                </CustomSecondaryText>

                <Pressable
                    onPress={() => router.push("/signup")}
                    style={[styles.auth_btn, { backgroundColor: modeColor.colorCode, marginBottom: verticalScale(10) }]}><CustomText style={{ color: "#fff" }}>Register</CustomText></Pressable>
                <Pressable
                    onPress={() => router.push("/signin")}
                    style={[styles.auth_btn, { borderWidth: moderateScale(1.5), borderColor: modeColor.colorCode }]}><CustomText style={{ color: modeColor.colorCode }}>Log In</CustomText></Pressable>
            </View>

        </CustomView>
    )
}

export default index


const styles = StyleSheet.create({
    Logo: {
        width: moderateScale(100),
        height: moderateScale(100),
        marginHorizontal: "auto",
        marginBlock: verticalScale(15)
    },
    onboardImage: {
        width: moderateScale(200),
        height: moderateScale(200),
        marginHorizontal: "auto",
        marginBottom: verticalScale(15)
    },
    heading: {
        fontFamily: "AirbnbCereal_W_Bd",
        fontSize: moderateScale(22),
        marginHorizontal: "auto",
        marginBottom: verticalScale(15)
    },
    sub_heading: {
        marginHorizontal: "auto",
        textAlign: "center",
        marginBottom: verticalScale(25),
    },
    auth_btn: {
        height: verticalScale(40),
        borderRadius: scale(4),
        alignItems: "center",
        justifyContent: "center"
    }
})