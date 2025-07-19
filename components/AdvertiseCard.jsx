import { StyleSheet, Text, View } from 'react-native'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import React from 'react'
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';

const AdvertiseCard = ({ item }) => {

    const { colors } = useTheme()

    return (
        <View style={[styles.cardWrapper, {}]}>
            <Image
                style={[styles.cardImage, { borderColor: colors.queueBorder}]}
                source={{ uri: item.url }}
                contentFit="cover"
                transition={300}
            />
        </View>
    )
}

export default AdvertiseCard

const styles = StyleSheet.create({
    cardWrapper: {
        // height: verticalScale(200),
        // paddingVertical: verticalScale(20),
        // marginBottom: verticalScale(10),
        width: scale(330.56),
    },
    cardImage: {
        // height: "100%",
        height: verticalScale(145 / 1.2),
        width: "100%",
        borderRadius: scale(12),
        borderWidth: scale(1)
    }
})