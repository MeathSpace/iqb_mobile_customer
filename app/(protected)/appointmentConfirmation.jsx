import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from "expo-router";
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import CustomText from '../../components/CustomText';
import CustomSecondaryText from '../../components/CustomSecondaryText';
import { Colors } from '../../constants/Colors';

const appointmentConfirmation = () => {

    const barber = useLocalSearchParams();
    const { colors } = useTheme()
    const router = useRouter()

    // console.log("Barber ", barber)

    return (
        <Pressable
            onPress={() => router.back()}
            style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: "center", alignItems: "center"
            }}>
            <Pressable
                onPress={() => { }}
                style={[styles.appointmentWrapper, { backgroundColor: colors.background }]}>
                <View style={[styles.appointmentItem]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) }}>
                        <Image
                            style={{ height: moderateScale(50), width: moderateScale(50), borderRadius: moderateScale(30) }}
                            source={{ uri: barber?.barberImage }}
                            // placeholder={{ blurhash }}
                            contentFit="cover"
                            transition={300}
                        />
                        <View>
                            <CustomText>{barber.CustomerName}</CustomText>
                            <CustomSecondaryText >{barber.barberName}</CustomSecondaryText>
                        </View>
                    </View>

                    <View>
                        <CustomText style={{ marginLeft: "auto" }}>{barber.date}</CustomText>
                        <CustomSecondaryText >{barber.timeJoined}</CustomSecondaryText>
                    </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: scale(20) }}>
                    <Pressable style={[styles.btn, {
                        backgroundColor: "red",
                        shadowColor: Colors.modeColor.colorCode
                    }]}><CustomText style={{ color: "#fff" }}>Cancel</CustomText></Pressable>
                    <Pressable
                        onPress={() => {
                            router.push({
                                pathname: "/selectBarber",
                                
                            })
                        }}
                        style={[styles.btn, {
                            backgroundColor: "#006FFD",
                            shadowColor: Colors.modeColor.colorCode
                        }]}
                    ><CustomText style={{ color: "#fff" }}>Edit</CustomText></Pressable>
                </View>
            </Pressable>


        </Pressable>
    )
}

export default appointmentConfirmation

const styles = StyleSheet.create({

    appointmentWrapper: {
        borderRadius: moderateScale(4),
        padding: moderateScale(10),
        gap: verticalScale(10),

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,

        elevation: 1.5,
    },

    appointmentItem: {
        marginBottom: moderateScale(10),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    btn: {
        width: scale(130),
        height: verticalScale(35),
        borderRadius: scale(4),
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
    }
})