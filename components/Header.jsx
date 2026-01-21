// // import { StyleSheet, Text, View } from 'react-native'
// // import React from 'react'

// // const Header = () => {

// //     // const { theme, modeColor, setModeColor } = useTheme()

// //     // const modeColorHandler = async (colorMode) => {
// //     //     setModeColor(colorMode)
// //     //     await AsyncStorage.setItem('modeColor', JSON.stringify({ ...colorMode, default: false }));
// //     // }

// //     return (
// //         <View>
// //             <Text>Header</Text>

// //             {/* <Pressable
// //                 style={{
// //                     height: 40,
// //                     width: 100,
// //                     backgroundColor: modeColor.colorCode
// //                 }}
// //             >
// //                 <CustomText>button</CustomText>

// //             </Pressable>

// //             <Pressable onPress={() => modeColorHandler({ colorName: "Blue", colorCode: "blue" })}><Text>Blue</Text></Pressable>
// //             <Pressable onPress={() => modeColorHandler({ colorName: "White", colorCode: "white" })}><Text>White</Text></Pressable>
// //             <Pressable onPress={() => modeColorHandler({ colorName: "Red", colorCode: "red" })}><Text>Red</Text></Pressable> */}
// //         </View>
// //     )
// // }

// // export default Header

// // const styles = StyleSheet.create({})

// // ========= The top commented code is for changing theme colors  =======

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { memo } from "react";
import { Pressable, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { NotificationIcon } from "../constants/icons";
import { useAuth } from "../context/AuthContext";
import { useGlobal } from "../context/GlobalContext";
import CustomSecondaryText from "./CustomSecondaryText";
import CustomText from "./CustomText";

const Header = () => {
  const { authenticatedUser } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const { newNotification, setNewNotification } = useGlobal();

  const handleNotification = async () => {
    if (newNotification.value) {
      await AsyncStorage.setItem(
        "newNotification",
        JSON.stringify({
          email: authenticatedUser?.email,
          value: false,
        }),
      );
      setNewNotification({ email: "", value: false });
    }
    router.push("/notification");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // paddingBottom: verticalScale(15),
      }}
    >
      {/* --- LEFT SECTION: PROFILE & GREETING --- */}
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: scale(12) }}
      >
        <Pressable
          onPress={() => router.push("/profile")}
          style={{
            padding: scale(3),
            borderRadius: moderateScale(15),
            backgroundColor: colors.modalBgColor,
            borderWidth: 1,
            borderColor: colors.queueBorder,
          }}
        >
          <Image
            source={{ uri: authenticatedUser?.profile?.[0]?.url }}
            style={{
              width: scale(45),
              height: scale(45),
              borderRadius: moderateScale(12),
            }}
            contentFit="cover"
            transition={500}
          />
        </Pressable>

        <View>
          <CustomText
            style={{
              fontFamily: "AirbnbCereal_W_XBd",
              fontSize: moderateScale(18),
              color: colors.text,
              letterSpacing: -0.5,
            }}
          >
            Hello, {authenticatedUser?.name.split(" ")[0]}
          </CustomText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: scale(4),
            }}
          >
            {/* <View
              style={{
                width: scale(6),
                height: scale(6),
                borderRadius: 3,
                backgroundColor: "#14b8a6",
              }}
            /> */}
            <CustomSecondaryText
              style={{
                fontSize: moderateScale(12),
                color: "#64748b",
                fontFamily: "AirbnbCereal_W_Bd",
              }}
            >
              {authenticatedUser?.salonName}
            </CustomSecondaryText>
          </View>
        </View>
      </View>

      {/* --- RIGHT SECTION: NOTIFICATION BELL --- */}
      <Pressable
        onPress={handleNotification}
        style={({ pressed }) => ({
          width: scale(44),
          height: scale(44),
          borderRadius: moderateScale(22),
          backgroundColor: colors.cardColor,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.queueBorder,
        })}
      >
        <NotificationIcon size={moderateScale(22)} color={colors.text} />

        {newNotification.value && (
          <View
            style={{
              position: "absolute",
              top: verticalScale(12),
              right: scale(13),
              width: scale(9),
              height: scale(9),
              borderRadius: 5,
              backgroundColor: "#ef4444",
              borderWidth: 2,
              borderColor: colors.modalBgColor,
            }}
          />
        )}
      </Pressable>
    </View>
  );
};

export default memo(Header);
