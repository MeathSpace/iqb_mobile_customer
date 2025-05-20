import { Pressable, StyleSheet, Text, View } from 'react-native'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import React from 'react'
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import CustomText from './CustomText';
import CustomSecondaryText from './CustomSecondaryText';

const ServiceCard = ({ item }) => {

    const { colors } = useTheme()

    return (
        <View style={[styles.cardWrapper, { backgroundColor: colors.background }]}>
            <Image
                style={styles.cardImage}
                source={{ uri: item.image }}
                contentFit="cover"
                transition={1000}
            />
            <View
                style={styles.cardContentWrapper}
            >

                <CustomText style={{ fontSize: moderateScale(14), fontFamily: "AirbnbCereal_W_Md" }}>{item.name}</CustomText>
            </View>
        </View>
    )
}

export default ServiceCard

const styles = StyleSheet.create({
    cardWrapper: {
        width: scale(160),
        borderRadius: moderateScale(8),
        marginBottom: verticalScale(10),
        elevation: 4,

        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardImage: {
        height: verticalScale(100),
        width: "100%",
        borderTopLeftRadius: moderateScale(8),
        borderTopRightRadius: moderateScale(8)
    },
    cardContentWrapper: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(10),
        // flexDirection: "row",
        // alignItems: "center",
        gap: verticalScale(5),
    },
})