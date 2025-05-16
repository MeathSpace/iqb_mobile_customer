import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Redirect, useRouter } from 'expo-router'
import { useAuth } from '../context/AuthContext'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomView from '../components/CustomView'
import CustomText from '../components/CustomText';
import CustomSecondaryText from '../components/CustomSecondaryText';
import { Colors } from '../constants/Colors'
import { useTheme } from '@react-navigation/native';

const index = () => {

  const { colors } = useTheme()

  const router = useRouter()

  const { isAuthenticated } = useAuth()

  const [splashLoading, setSplashLoading] = useState(true)

  useEffect(() => {
    let timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/home")
      } else {
        setSplashLoading(false)
      }
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [isAuthenticated, router])

  if (splashLoading) {
    return (
      <CustomView style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          style={[styles.Logo, { tintColor: colors.text }]}
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
          style={[styles.Logo, { tintColor: colors.background }]}
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
          style={[styles.auth_btn, { backgroundColor: Colors.modeColor.colorCode, marginBottom: verticalScale(10) }]}><CustomText style={{ color: "#fff" }}>Register</CustomText></Pressable>
        <Pressable
          onPress={() => router.push("/signin")}
          style={[styles.auth_btn, { borderWidth: moderateScale(1.5), borderColor: Colors.modeColor.colorCode }]}><CustomText style={{ color: Colors.modeColor.colorCode }}>Log In</CustomText></Pressable>
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



