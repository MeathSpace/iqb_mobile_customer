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

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}m`;
    }

    return (
        <View style={[styles.cardWrapper, { backgroundColor: colors.cardColor, borderColor: colors.queueBorder, borderWidth: scale(1) }]}>
            <View style={{ position: "relative" }}>
                <Image
                    style={styles.cardImage}
                    source={{ uri: item?.profile?.[0]?.url }}
                    contentFit="cover"
                    transition={300}
                />

                <View style={styles.statusBadgeWrapper}>
                    <View style={[
                        styles.statusBadge,
                        {
                            backgroundColor: item?.isOnline ? "#00B090" : "#E11D48",
                        }
                    ]}>
                        <CustomText style={styles.statusText}>
                            {item?.isOnline ? "Online" : "Offline"}
                        </CustomText>
                    </View>
                </View>
            </View>

            <View style={{
                padding: scale(10),
                gap: verticalScale(5)
            }}>

                <CustomText style={{ fontSize: scale(16) }}>{item.name}</CustomText>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: scale(2),
                    flex: 1
                }}>
                    {/* <ClockIcon size={scale(14)} color={colors.secondaryText} /> */}
                    <CustomText style={{ fontSize: scale(14), flex: 1, color: colors.secondaryText }}>~ {formatMinutesToHrMin(item?.barberEWT)}</CustomText>
                </View>
            </View>

        </View>
    )
}

export default BarberCard

const styles = StyleSheet.create({
    cardWrapper: {
        width: scale(160),
        marginBottom: scale(0),
        // gap: verticalScale(2),
        borderRadius: scale(10),
    },
    cardImage: {
        height: verticalScale(110),
        width: "100%",
        borderTopLeftRadius: scale(10),
        borderTopRightRadius: scale(10),

        // marginBottom: verticalScale(5),
        // borderWidth: scale(1)
    },
    cardContentWrapper: {
        gap: verticalScale(5),
    },

    statusBadgeWrapper: {
        position: "absolute",
        top: verticalScale(8),
        right: scale(8),
        zIndex: 2,
        elevation: 3, // For Android shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },

    statusBadge: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: scale(20),
        alignItems: "center",
        justifyContent: "center",
    },

    statusText: {
        fontSize: scale(12),
        color: "#fff",
        fontWeight: "600",
    },

})