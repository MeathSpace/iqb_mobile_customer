import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CustomText from './CustomText';
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import CustomSecondaryText from './CustomSecondaryText';
import { useRouter } from 'expo-router';

const AppointmentItem = ({ item }) => {

    const { colors } = useTheme()
    const router = useRouter()

    return (
        <Pressable
            onPress={() => router.push({
                pathname: "/appointmentConfirmation",
                params: item
            })}
            style={[styles.appointmentItem, { backgroundColor: colors.background }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) }}>
                <Image
                    style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(30) }}
                    source={{ uri: item?.barberImage }}
                    // placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={300}
                />
                <View>
                    <CustomText>{item.CustomerName}</CustomText>
                    <CustomSecondaryText >{item.barberName}</CustomSecondaryText>
                </View>
            </View>

            <View>
                <CustomText style={{ marginLeft: "auto" }}>{item.date}</CustomText>
                <CustomSecondaryText >{item.timeJoined}</CustomSecondaryText>
            </View>
        </Pressable>
    )
}

export default AppointmentItem

const styles = StyleSheet.create({
    appointmentItem: {
        marginBottom: moderateScale(10),
        borderRadius: moderateScale(4),
        padding: moderateScale(10),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: moderateScale(5),

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,

        elevation: 1.5,
    }
})