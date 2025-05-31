import { Pressable, StyleSheet, Text, View } from 'react-native'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import React from 'react'
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import CustomText from './CustomText';
import CustomSecondaryText from './CustomSecondaryText';
import { ClockIcon } from '../constants/icons';

const BarberCard = ({ item }) => {

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

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <CustomText style={{ fontSize: scale(9), flex: 1 }}>{item.name}</CustomText>
                    <CustomText style={{ fontSize: scale(9), flex: 0.4, color: item?.online ? "#00B090" : "red", }}>Online</CustomText>
                </View>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <CustomText style={{ fontSize: scale(9), flex: 1 }}>Est. Time</CustomText>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent:"space-between",
                        gap: scale(2),
                        flex: 1
                    }}>
                        <ClockIcon size={scale(9)} />
                        <CustomText style={{ fontSize: scale(9), flex: 1 }}>120 mins</CustomText>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default BarberCard

const styles = StyleSheet.create({
    cardWrapper: {
        width: scale(103),
        marginBottom: verticalScale(10),
    },
    cardImage: {
        height: verticalScale(80),
        width: "100%",
        borderRadius: scale(8),
        marginBottom: verticalScale(5)
    },
    cardContentWrapper: {
        gap: verticalScale(5),
    },
})