import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { Image } from 'expo-image'
import CustomText from './CustomText'
import CustomSecondaryText from './CustomSecondaryText'
import { useTheme } from '@react-navigation/native'

const QlistItem = ({ item, index, qlistLength }) => {

    const { colors } = useTheme()

    return (
        <View style={[styles.qlistItem, {
            // backgroundColor: colors.background
            borderBottomWidth: index !== qlistLength.length - 1 ? scale(1) : 0,
            borderBottomColor: index !== qlistLength.length - 1 && "#DDDDDD"
        }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10) }}>
                <Image
                    style={{ height: scale(55), width: scale(55), borderRadius: moderateScale(30) }}
                    source={{ uri: item?.image }}
                    // placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={300}
                />
                <View style={{ gap: verticalScale(5) }}>
                    <CustomText style={{ fontFamily: "AirbnbCereal_W_Md", fontSize: scale(14) }}>{item.name}</CustomText>
                    <CustomSecondaryText style={{ fontFamily: "AirbnbCereal_W_Bk", fontSize: scale(12) }}>Client</CustomSecondaryText>
                </View>
            </View>

            <View style={{ gap: verticalScale(5) }}>
                <CustomText style={{ fontFamily: "AirbnbCereal_W_Md", marginLeft: "auto", fontSize: scale(14) }}>{item.queue}</CustomText>
                <CustomSecondaryText style={{ fontFamily: "AirbnbCereal_W_Bk", fontSize: scale(12) }}>Est. Time: {item.ewt} mins</CustomSecondaryText>
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
        height: verticalScale(85),
        backgroundColor: "#F7F7F7",
        // marginHorizontal: moderateScale(5)
    }
})