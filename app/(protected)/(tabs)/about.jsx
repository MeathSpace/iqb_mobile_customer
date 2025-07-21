// import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { useRouter } from 'expo-router'
// import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
// import CustomTabView from '../../../components/CustomTabView'
// import CustomText from '../../../components/CustomText'
// import { ArrowLeftIcon, CertificateIcon, GlobalIcon, LeftIcon, PolicyIcon, RightIcon, TermServiceIcon } from '../../../constants/icons';
// import { useTheme } from '@react-navigation/native';

// const about = () => {

//   const router = useRouter()

//   const aboutData = [
//     {
//       id: 1,
//       name: "iqBook Website",
//       icon: <GlobalIcon color='gray' />,
//       url: "#"
//     },
//     {
//       id: 2,
//       name: "Terms of Services",
//       icon: <TermServiceIcon color='gray' />,
//       url: "/termService"
//     },
//     {
//       id: 3,
//       name: "Privacy Policy",
//       icon: <PolicyIcon color='gray' />,
//       url: "/privacyPolicy"
//     },
//     {
//       id: 4,
//       name: "Licenses",
//       icon: <CertificateIcon color='gray' />,
//       url: "/licenses"
//     },
//   ]

//   const { colors } = useTheme()

//   return (
//     <View
//       style={{
//         backgroundColor: colors.background,
//         flex: 1,
//         paddingHorizontal: scale(10),
//         paddingTop: verticalScale(10),
//         paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(0)
//       }}
//     >

//       <View style={{
//         backgroundColor: colors.background,
//         padding: scale(10),
//         borderRadius: scale(10),
//       }}>

//         {
//           aboutData.map((item) => {
//             return (
//               <Pressable
//                 onPress={() => router.push(item.url)}
//                 key={item.id}
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   height: verticalScale(50),
//                   borderBottomColor: colors.borderBottomColor,
//                   borderBottomWidth: scale(1)
//                 }}
//               >
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     gap: scale(10)
//                   }}
//                 >
//                   {item.icon}
//                   <CustomText
//                     style={{
//                       fontFamily: "AirbnbCereal_W_Bk",
//                     }}
//                   >{item.name}</CustomText>
//                 </View>

//                 <RightIcon size={scale(16)} color={colors.text} />
//               </Pressable>
//             )
//           })
//         }

//       </View>

//       <View
//         style={{
//           padding: scale(10),
//           borderRadius: scale(10),
//           height: verticalScale(50),
//           marginTop: verticalScale(20),
//           justifyContent: "center",
//           alignItems: "center"
//         }}
//       >
//         <CustomText
//         >Version 1.0.0.19</CustomText>
//       </View>

//     </View>
//   )
// }

// export default about

// const styles = StyleSheet.create({})



import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomText from "../../../components/CustomText";
import {
  CertificateIcon,
  GlobalIcon,
  PolicyIcon,
  TermServiceIcon,
  RightIcon,
  ArrowLeftIcon,
} from "../../../constants/icons";
import { useTheme } from "@react-navigation/native";

const About = () => {
  const router = useRouter();
  const { colors } = useTheme();

  const aboutData = [
    {
      id: 1,
      name: "iqBook Website",
      icon: <GlobalIcon color="#3b82f6" />, // blue-500
      bgColor: "rgba(147, 197, 253, 0.2)", // bg-blue-100
      url: "#",
    },
    {
      id: 2,
      name: "Terms of Services",
      icon: <TermServiceIcon color="#10b981" />, // emerald-500
      bgColor: "rgba(167, 243, 208, 0.2)", // bg-emerald-100
      url: "/termService",
    },
    {
      id: 3,
      name: "Privacy Policy",
      icon: <PolicyIcon color="#f59e0b" />, // amber-500
      bgColor: "rgba(253, 224, 71, 0.2)", // bg-amber-100
      url: "/privacyPolicy",
    },
    {
      id: 4,
      name: "Licenses",
      icon: <CertificateIcon color="#6366f1" />, // indigo-500
      bgColor: "rgba(199, 210, 254, 0.2)", // bg-indigo-100
      url: "/licenses",
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(10),
        paddingBottom:
          Platform.OS === "ios" ? verticalScale(80) : verticalScale(20),
      }}
    >
      <View style={{
        flexDirection: "row",
        alignItems: "center"
      }}>
        <Pressable onPress={() => router.replace("/account")}><ArrowLeftIcon color={colors.text} /></Pressable>
        <CustomText style={{
          flex: 1,
          textAlign: "center",
          fontSize: scale(18),
          fontFamily: "AirbnbCereal_W_XBd",
        }}>About</CustomText>
      </View>

      {/* Main Box */}
      <View
        style={{
          backgroundColor: colors.cardColor,
          borderRadius: scale(16),
          borderWidth: scale(1),
          borderColor: colors.queueBorder,
          overflow: "hidden",
          marginTop: verticalScale(20)
        }}
      >
        {aboutData.map((item, index) => (
          <React.Fragment key={item.id}>
            <Pressable
              onPress={() => router.push(item.url)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: scale(14),
              }}
            >
              {/* Icon Wrapper */}
              <View
                style={{
                  backgroundColor: item.bgColor,
                  padding: scale(8),
                  borderRadius: scale(10),
                }}
              >
                {item.icon}
              </View>

              {/* Text */}
              <CustomText
                style={{
                  marginLeft: scale(12),
                  fontSize: scale(14),
                  color: colors.text,
                  flex: 1,
                  fontWeight: "600",
                }}
              >
                {item.name}
              </CustomText>

              <RightIcon size={moderateScale(16)} color={colors.text} />
            </Pressable>

            {/* Divider */}
            {index !== aboutData.length - 1 && (
              <View
                style={{
                  height: scale(1),
                  backgroundColor: colors.queueBorder,
                  marginHorizontal: scale(14),
                }}
              />
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Version Info */}
      <View style={styles.versionWrapper}>
        <CustomText style={[styles.versionText, {
          color: colors.secondaryText
        }]}>Version 1.0.0.20</CustomText>
      </View>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  versionWrapper: {
    marginTop: verticalScale(30),
    alignItems: "center",
    justifyContent: "center",
  },
  versionText: {
    fontSize: scale(13),
  },
});
