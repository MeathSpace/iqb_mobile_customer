import { StyleSheet, Text, View } from 'react-native'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import React from 'react'
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';

const AdvertiseCard = ({ item }) => {

    const { colors } = useTheme()

    return (
        <View style={[styles.cardWrapper, { backgroundColor: colors.background }]}>
            <Image
                style={styles.cardImage}
                source={{ uri: item.image }}
                contentFit="cover"
                transition={300}
            />
        </View>
    )
}

export default AdvertiseCard

const styles = StyleSheet.create({
    cardWrapper: {
        height: verticalScale(150),
        width: scale(280),
        borderRadius: moderateScale(8),
        elevation: 4,

        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardImage: {
        height: "100%",
        width: "100%",
        borderRadius: moderateScale(8),
    }
})