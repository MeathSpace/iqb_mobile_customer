import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomTabView from '../../../components/CustomTabView'
import CustomText from '../../../components/CustomText'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { ArrowLeftIcon } from '../../../constants/icons';
import { useRouter } from 'expo-router';

const termService = () => {
  const router = useRouter()

  return (
    <CustomTabView
      style={{
        paddingVertical: verticalScale(0),
        paddingTop: verticalScale(10),
        paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(20)
      }}>
      <Pressable
        onPress={() => router.push("/about")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: scale(10),
          height: verticalScale(60)
        }}
      >
        <ArrowLeftIcon size={scale(18)} />
        <CustomText>Term of Services</CustomText>
      </Pressable>
    </CustomTabView>
  )
}

export default termService

const styles = StyleSheet.create({})