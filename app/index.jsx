import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import CustomView from '../components/CustomView'
import CustomText from '../components/CustomText';
import CustomSecondaryText from '../components/CustomSecondaryText';
import { useTheme } from '../context/ThemeContext';

const index = () => {

    const colorScheme = useColorScheme()

    const { modeColor } = useTheme()

    return (
        <CustomView style={{ padding: responsiveWidth(3) }}>
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
                Welcome to iQueueBarbers
            </CustomText>
            <CustomSecondaryText style={styles.sub_heading}>
                Instantly book, style your hair and mustache the way you want by the
                stylist of your choice.
            </CustomSecondaryText>

            <Pressable style={[styles.auth_btn, { backgroundColor: modeColor.colorCode }]}><CustomText style={{ color: "#fff" }}>Register</CustomText></Pressable>
            <Pressable style={[styles.auth_btn, { borderWidth: responsiveWidth(0.5), borderColor: modeColor.colorCode }]}><CustomText style={{ color: modeColor.colorCode }}>Log In</CustomText></Pressable>

        </CustomView>
    )
}

export default index

const styles = StyleSheet.create({
    Logo: {
        width: responsiveWidth(10),
        // aspectRatio: 1, // keeps it square without manually setting height
        height: responsiveWidth(25),
        width: responsiveWidth(25),
        marginHorizontal: "auto",
        marginBlock: responsiveHeight(5.5)
    },
    onboardImage: {
        width: responsiveWidth(70),
        height: responsiveWidth(70),
        marginHorizontal: "auto",
        marginBottom: responsiveHeight(4)
    },
    heading: {
        fontFamily: "AirbnbCereal_W_Bd",
        fontSize: responsiveFontSize(3),
        marginHorizontal: "auto",
        marginBottom: responsiveHeight(2)
    },
    sub_heading: {
        marginHorizontal: "auto",
        textAlign: "center",
        marginBottom: responsiveHeight(3),
    },
    auth_btn: {
        height: responsiveHeight(6),
        marginBottom: responsiveHeight(1),
        borderRadius: responsiveWidth(10),
        alignItems: "center",
        justifyContent: "center"
    }
})