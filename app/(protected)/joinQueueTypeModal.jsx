import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { useTheme } from '@react-navigation/native'
import { scale, verticalScale } from 'react-native-size-matters'
import CustomText from '../../components/CustomText'
import { CuttingIcon, PeopleIcon, RightIcon } from '../../constants/icons';
import { useGlobal } from '../../context/GlobalContext'

const joinQueueTypeModal = () => {

    const router = useRouter()
    const { colors } = useTheme()
    const { type } = useLocalSearchParams();

    // console.log(type)

    const {
        setQueueJoinType,
        queueJoinType,
        joinPopupType
    } = useGlobal()

    useFocusEffect(useCallback(() => {
        if (joinPopupType?.single && !joinPopupType?.group) {

            if (queueJoinType.barberSelect && !queueJoinType.serviceSelect) {
                // console.log("Single join barber")
                router.replace("/singleJoinServicesBarber")
            } else if (queueJoinType.serviceSelect && !queueJoinType.barberSelect) {
                // console.log("Single join services")
                router.replace("/singleJoin")
            }
        } else {
            console.log("Group Join going")
        }
    }, [queueJoinType]))

    return (
        <Pressable
            onPress={() => router.back()}
            style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Pressable
                onPress={() => { }}
                style={{
                    width: "95%",
                    // height: verticalScale(350),
                    backgroundColor: colors.cardColor,
                    borderRadius: scale(12),
                    padding: scale(20),
                    gap: verticalScale(20),
                    borderColor: colors.cardBorder,
                    borderWidth: scale(1)
                }}
            >
                <CustomText
                    style={{
                        textAlign: "center",
                        fontFamily: "AirbnbCereal_W_Blk",
                        fontSize: scale(22),
                    }}
                >Select Option</CustomText>

                <Pressable
                    onPress={() => {
                        setQueueJoinType({
                            barberSelect: true,
                            serviceSelect: false
                        })

                        // if (joinPopupType?.single && !joinPopupType?.group) {
                        //     router.replace("/singleJoin")
                        // }
                    }}
                    style={[styles.select_btn, {
                        backgroundColor: '#14b8a6',
                    }]}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: scale(10)
                    }}>
                        <View><PeopleIcon size={scale(18)} color='#fff' /></View>
                        <CustomText style={{ color: "#fff" }}>Barber</CustomText>
                    </View>

                    <View><RightIcon size={scale(18)} color='#fff' /></View>
                </Pressable>

                <Pressable
                    onPress={() => setQueueJoinType({
                        barberSelect: false,
                        serviceSelect: true
                    })}
                    style={[styles.select_btn, {
                        backgroundColor: '#14b8a6',
                    }]}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: scale(10)
                    }}>
                        <View><CuttingIcon size={scale(18)} color='#fff' /></View>
                        <CustomText style={{ color: "#fff" }}>Services</CustomText>
                    </View>

                    <View><RightIcon size={scale(18)} color='#fff' /></View>
                </Pressable>

            </Pressable>
        </Pressable>
    )
}

export default joinQueueTypeModal

const styles = StyleSheet.create({
    select_btn: {
        height: verticalScale(45),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: scale(10),
        borderRadius: scale(10)
    }
})