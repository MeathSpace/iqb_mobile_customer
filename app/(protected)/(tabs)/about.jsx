import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomTabView from '../../../components/CustomTabView'
import CustomText from '../../../components/CustomText'
import { ArrowLeftIcon, CertificateIcon, GlobalIcon, LeftIcon, PolicyIcon, RightIcon, TermServiceIcon } from '../../../constants/icons';
import { useTheme } from '@react-navigation/native';

const about = () => {

  const router = useRouter()

  const aboutData = [
    {
      id: 1,
      name: "iqBook Website",
      icon: <GlobalIcon color='gray' />,
      url: "#"
    },
    {
      id: 2,
      name: "Terms of Services",
      icon: <TermServiceIcon color='gray' />,
      url: "/termService"
    },
    {
      id: 3,
      name: "Privacy Policy",
      icon: <PolicyIcon color='gray' />,
      url: "/privacyPolicy"
    },
    {
      id: 4,
      name: "Licenses",
      icon: <CertificateIcon color='gray' />,
      url: "/licenses"
    },
  ]

  const { colors } = useTheme()

  return (
    <View
      style={{
        // backgroundColor: "#00B0901A",
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: scale(10),
        paddingTop: verticalScale(10),
        paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(0)
      }}
    >
      {/* <Pressable
        onPress={() => router.back()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: scale(10),
          height: verticalScale(60)
        }}
      >
        <ArrowLeftIcon size={scale(18)} />
        <CustomText>About</CustomText>
      </Pressable> */}

      <View style={{
        // paddingVertical: verticalScale(20)
        backgroundColor: colors.background,
        padding: scale(10),
        borderRadius: scale(10),
        // borderWidth: scale(1),
        // borderColor: "rgba(0,0,0,0.15)"
      }}>

        {
          aboutData.map((item) => {
            return (
              <Pressable
                onPress={() => router.push(item.url)}
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: verticalScale(50),
                  borderBottomColor: colors.borderBottomColor,
                  borderBottomWidth: scale(1)
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(10)
                  }}
                >
                  {item.icon}
                  <CustomText
                    style={{
                      fontFamily: "AirbnbCereal_W_Bk",
                    }}
                  >{item.name}</CustomText>
                </View>

                <RightIcon size={scale(16)} color={colors.text} />
              </Pressable>
            )
          })
        }

      </View>

      <View
        style={{
          // backgroundColor: colors.background,
          padding: scale(10),
          borderRadius: scale(10),
          // borderWidth: scale(1),
          // borderColor: "rgba(0,0,0,0.15)",
          height: verticalScale(50),
          marginTop: verticalScale(20),
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CustomText
          style={{
            // fontFamily: "AirbnbCereal_W_MD",

          }}
        >Version 1.0.0.19</CustomText>
      </View>

    </View>
  )
}

export default about

const styles = StyleSheet.create({})