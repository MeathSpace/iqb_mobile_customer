import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { useTheme } from '@react-navigation/native'
import CustomText from './CustomText'
import CustomSecondaryText from './CustomSecondaryText'

const StatusCard = ({ item }) => {

    const { colors } = useTheme()

    return (
        <View style={[styles.statusCard]}>
            <View style={[styles.icon, { backgroundColor: item.color2 }]}>
                <item.icon size={moderateScale(18)} color={item.color1} />
            </View>
            <CustomText style={{ fontSize: scale(11), textAlign: "center", marginVertical: verticalScale(6) }}>{item.title}</CustomText>
            <CustomText style={{
                fontFamily: "AirbnbCereal_W_Bd",
                fontSize: scale(14),
                textAlign: "center",
                // color: `${item.color1}`
            }}>{item.value}</CustomText>
        </View>
    )
}

export default StatusCard

const styles = StyleSheet.create({
    statusCard: {
        // width: scale(75),
        // height: verticalScale(125),
        // borderRadius: moderateScale(4),
        // padding: moderateScale(10),
        // marginTop: verticalScale(17),
        // borderWidth: scale(1),
        // elevation: 4,
        // gap: verticalScale(5),
        marginBottom: verticalScale(20)
    },
    icon: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(8),
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: "auto",
        // borderWidth: moderateScale(2),
        // borderColor: "#fff",
        // elevation: 25,
        // shadowOffset: {
        //     width: 0,
        //     height: 10,
        // },
        // shadowOpacity: 0.6,
        // shadowRadius: 20,
    }
})