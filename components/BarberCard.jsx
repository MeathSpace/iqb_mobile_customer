import { Pressable, StyleSheet, Text, View } from 'react-native'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import React from 'react'
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import CustomText from './CustomText';
import CustomSecondaryText from './CustomSecondaryText';
import { ClockIcon, NextIcon } from '../constants/icons';

const BarberCard = ({ item }) => {

    const { colors } = useTheme()

    function formatMinutesToHrMin(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}min`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}min`;
    }

    return (
        <View style={[styles.cardWrapper, {}]}>
            <Image
                style={styles.cardImage}
                source={{ uri: item?.profile?.[0]?.url }}
                contentFit="cover"
                transition={300}
            />
            <View>
                <View
                    style={{
                        width: scale(40),
                        height: verticalScale(15),
                        backgroundColor: item?.isOnline ? "#00B0901A" : "#E11D481A",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: scale(4)
                    }}
                >
                    <CustomText
                        style={{
                            fontSize: scale(10),
                            color: item?.isOnline ? "#00B090" : "#E11D48",
                        }}
                    >{item?.isOnline ? "Online" : "Offline"}</CustomText>
                </View>
            </View>
            <CustomText style={{ fontSize: scale(12) }}>{item.name}</CustomText>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: scale(2),
                flex: 1
            }}>
                <ClockIcon size={scale(12)} color='gray' />
                <CustomText style={{ fontSize: scale(12), flex: 1, color: "gray" }}>{formatMinutesToHrMin(item?.barberEWT)}</CustomText>
            </View>

            {/* <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: scale(2),
                flex: 1
            }}>
                <NextIcon size={scale(12)} color='gray' />
                <CustomText style={{ fontSize: scale(12), flex: 1, color: "gray" }}>4</CustomText>
            </View> */}

            {/* <View
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
            </View> */}
        </View>
    )
}

export default BarberCard

const styles = StyleSheet.create({
    cardWrapper: {
        width: scale(103),
        marginBottom: verticalScale(15),
        gap: verticalScale(2)
    },
    cardImage: {
        height: verticalScale(110),
        width: "100%",
        borderRadius: scale(10),
        marginBottom: verticalScale(5)
    },
    cardContentWrapper: {
        gap: verticalScale(5),
    },
})