import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomSecondaryText from "../components/CustomSecondaryText";
import CustomText from "../components/CustomText";
import CustomView from "../components/CustomView";
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import { BASE_URL } from '@/utils/api';

const index = () => {

  const { colors } = useTheme();

  const router = useRouter();

  const { isAuthenticated } = useAuth();

  const [splashLoading, setSplashLoading] = useState(true);

  useEffect(() => {
    let timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/home");
      } else {
        setSplashLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [isAuthenticated, router]);

  if (splashLoading) {
    return (
      <CustomView style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          style={[styles.Logo, { tintColor: colors.text }]}
          source={require("../assets/images/iqbook.png")}
          resizeMode="cover"
        />
        <CustomText style={styles.heading}>iQBook</CustomText>
      </CustomView>
    );
  }

  return (
    <CustomView style={{ alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: "100%" }}>
        <Image
          style={[styles.Logo, { tintColor: colors.text }]}
          source={require("../assets/images/iqbook.png")}
          resizeMode="cover"
        />

        <CustomText style={styles.heading}>Welcome to iQBook</CustomText>
        <CustomSecondaryText
          style={[styles.sub_heading, { color: colors.secondaryText }]}
        >
          Instantly book, style your hair and mustache the way you want by the
          stylist of your choice.
        </CustomSecondaryText>

        {isAuthenticated ? (
          <TouchableOpacity
            onPress={() => router.push("/home")}
            style={[styles.authButton, { marginBottom: verticalScale(10) }]}
            activeOpacity={0.85}
          >
            <CustomText style={styles.authButtonText}>Register</CustomText>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => router.push("/signup")}
              style={[styles.authButton, { marginBottom: verticalScale(10) }]}
              activeOpacity={0.85}
            >
              <CustomText style={styles.authButtonText}>Register</CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/signin")}
              style={styles.authButton}
              activeOpacity={0.85}
            >
              <CustomText style={styles.authButtonText}>Log In</CustomText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </CustomView>
  );
};

export default index;

const styles = StyleSheet.create({
  Logo: {
    width: moderateScale(100),
    height: moderateScale(100),
    marginHorizontal: "auto",
    marginBlock: verticalScale(15),
  },
  onboardImage: {
    width: moderateScale(200),
    height: moderateScale(200),
    marginHorizontal: "auto",
    marginBottom: verticalScale(15),
  },
  heading: {
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: moderateScale(28),
    marginHorizontal: "auto",
    marginBottom: verticalScale(15),
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
    justifyContent: "center",
  },

  authButton: {
    width: "100%",
    backgroundColor: "#14b8a6", // bg-teal-500
    paddingVertical: verticalScale(12), // py-4
    borderRadius: scale(8), // rounded-xl
    alignItems: "center",
    justifyContent: "center",
  },
  authButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },
});
