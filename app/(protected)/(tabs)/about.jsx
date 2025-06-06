import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomTabView from '../../../components/CustomTabView'
import CustomText from '../../../components/CustomText'
import { ArrowLeftIcon, CertificateIcon, GlobalIcon, LeftIcon, PolicyIcon, RightIcon, TermServiceIcon } from '../../../constants/icons';

const about = () => {

  const router = useRouter()

  const aboutData = [
    {
      id: 1,
      name: "iqueueBook Website",
      icon: <GlobalIcon size={scale(18)} />,
      url: "#"
    },
    {
      id: 2,
      name: "Terms of Services",
      icon: <TermServiceIcon size={scale(18)} />,
      url: "/termService"
    },
    {
      id: 3,
      name: "Privacy Policy",
      icon: <PolicyIcon size={scale(18)} />,
      url: "/privacyPolicy"
    },
    {
      id: 4,
      name: "Licenses",
      icon: <CertificateIcon size={scale(18)} />,
      url: "/licenses"
    },
  ]

  return (
    <CustomTabView
      style={{
        paddingVertical: verticalScale(0),
        paddingTop: verticalScale(10),
        paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(20)
      }}>
      <Pressable
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
      </Pressable>

      <View style={{
        paddingVertical: verticalScale(20)
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
                  height: verticalScale(60)
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

                <RightIcon size={scale(16)} color={"#222222"} />
              </Pressable>
            )
          })
        }

      </View>

      <View
        style={{
          height: verticalScale(60)
        }}
      >
        <CustomText
          style={{
            fontFamily: "AirbnbCereal_W_Bk",
          }}
        >Version 1.0.0.1</CustomText>
      </View>

    </CustomTabView>
  )
}

export default about

const styles = StyleSheet.create({})