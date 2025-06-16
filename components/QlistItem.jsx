import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { Image } from 'expo-image'
import CustomText from './CustomText'
import CustomSecondaryText from './CustomSecondaryText'
import { useTheme } from '@react-navigation/native'
import { ClockIcon } from '../constants/icons'

const QlistItem = ({ item, index, qlistLength }) => {

    const { colors } = useTheme()

    return (
        <View style={[styles.qlistItem, {
            // backgroundColor: colors.background
            borderBottomWidth: index !== qlistLength.length - 1 ? scale(1) : 0,
            borderBottomColor: index !== qlistLength.length - 1 && "#0BA3AD1A"
        }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10) }}>
                <Image
                    style={{ height: scale(50), width: scale(50), borderRadius: moderateScale(30) }}
                    source={{ uri: item?.image }}
                    // placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={300}
                />
                <View style={{ gap: verticalScale(5) }}>
                    <CustomText style={{ fontFamily: "AirbnbCereal_W_Md", fontSize: scale(14) }}>{item.name}</CustomText>
                    <CustomSecondaryText style={{ fontFamily: "AirbnbCereal_W_Md", fontSize: scale(12) }}>Client</CustomSecondaryText>
                </View>
            </View>

            <View style={{ gap: verticalScale(5) }}>
                <CustomText style={{ fontFamily: "AirbnbCereal_W_Blk", textAlign: "center", fontSize: scale(16) }}>{item.queue}</CustomText>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(2),
                    // flex: 1
                }}>
                    <ClockIcon size={scale(12)} color='gray' />
                    <CustomText style={{ fontSize: scale(12), color: "gray" }}>120 mins</CustomText>
                </View>
            </View>
        </View>
    )
}

export default QlistItem

const styles = StyleSheet.create({
    qlistItem: {
        // height: 100,
        // marginBottom: moderateScale(10),
        // borderWidth: scale(1),
        // borderRadius: moderateScale(4),
        // padding: moderateScale(10),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: verticalScale(75),
        // backgroundColor: "#F7F7F7",
        // marginHorizontal: moderateScale(5)
    }
})