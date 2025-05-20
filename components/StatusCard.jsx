import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { useTheme } from '@react-navigation/native'
import CustomText from './CustomText'
import CustomSecondaryText from './CustomSecondaryText'

const StatusCard = ({ item }) => {

    const { colors } = useTheme()

    return (
        <View style={[styles.statusCard, { backgroundColor: colors.background }]}>
            <View style={[styles.icon, { backgroundColor: item.color1, shadowColor: item.color1 }]}>
                <item.icon size={moderateScale(20)} color={"#fff"} />
            </View>
            <CustomText style={{ fontFamily: "AirbnbCereal_W_Md", fontSize: moderateScale(12), textAlign: "center", marginVertical: verticalScale(5) }}>{item.title}</CustomText>
            <CustomSecondaryText style={{ fontFamily: "AirbnbCereal_W_Md", textAlign: "center" }}>{item.value}</CustomSecondaryText>
        </View>
    )
}

export default StatusCard

const styles = StyleSheet.create({
    statusCard: {
        width: scale(75),
        // height: verticalScale(125),
        borderRadius: moderateScale(4),
        padding: moderateScale(10),
        // borderWidth: moderateScale(1),
        // elevation: 4,
    },
    icon: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(30),
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "auto",
        borderWidth: moderateScale(2),
        borderColor: "#fff",
        elevation: 25,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.6,
        shadowRadius: 20,
    }
})