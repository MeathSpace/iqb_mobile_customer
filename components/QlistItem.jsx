import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale } from 'react-native-size-matters'
import { Image } from 'expo-image'
import CustomText from './CustomText'
import CustomSecondaryText from './CustomSecondaryText'
import { useTheme } from '@react-navigation/native'

const QlistItem = ({ item }) => {

    const { colors } = useTheme()

    return (
        <View style={[styles.qlistItem, { backgroundColor: colors.background }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) }}>
                <Image
                    style={{ height: moderateScale(55), width: moderateScale(55), borderRadius: moderateScale(30) }}
                    source={{ uri: item?.image }}
                    // placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={300}
                />
                <View>
                    <CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}>{item.name}</CustomText>
                    <CustomSecondaryText style={{ fontFamily: "AirbnbCereal_W_Md" }}>Client</CustomSecondaryText>
                </View>
            </View>

            <View>
                <CustomText style={{ fontFamily: "AirbnbCereal_W_Md", marginLeft: "auto", fontSize: moderateScale(24) }}>{item.queue}</CustomText>
                <CustomSecondaryText style={{ fontFamily: "AirbnbCereal_W_Md" }}>Est. Time: {item.ewt} mins</CustomSecondaryText>
            </View>
        </View>
    )
}

export default QlistItem

const styles = StyleSheet.create({
    qlistItem: {
        // height: 100,
        marginBottom: moderateScale(10),
        // borderWidth: scale(1),
        borderRadius: moderateScale(4),
        padding: moderateScale(10),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: moderateScale(5),

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        
        elevation: 3,
    }
})