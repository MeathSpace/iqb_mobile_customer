import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import CustomText from './CustomText';
import { Image } from 'expo-image';
import CustomSecondaryText from './CustomSecondaryText';
import { useGlobal } from '../context/GlobalContext';

const GroupItem = ({ item }) => {

    const { colors } = useTheme()

    const { setGroupJoinMembers, setRemoveGroupMember } = useGlobal();


    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

            <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(10),
            }}>
                <Image
                    style={{ height: moderateScale(45), width: moderateScale(45), borderRadius: moderateScale(30) }}
                    source={{ uri: item.barber?.image, }}
                    // placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={300}
                />
                <View>
                    <CustomText>{item?.customerName}</CustomText>
                    <CustomSecondaryText>{item?.barber.name}</CustomSecondaryText>
                </View>
            </View>

            <View style={{ height: verticalScale(1), borderBottomColor: colors.border, borderBottomWidth: moderateScale(1.5) }}></View>

            <View style={{ gap: verticalScale(6) }}>

                {
                    item.barberServices.map((ele, index) => {
                        return (
                            <CustomSecondaryText key={index}>{index + 1}. {ele.serviceName}</CustomSecondaryText>
                        )
                    })
                }
            </View>

            <Pressable
                onPress={() => {
                    setRemoveGroupMember({
                        remove: true,
                        data: item
                    })
                    setGroupJoinMembers((prev) => {
                        const updatedArray = prev.filter((ele) => {
                            return (
                                ele.id !== item.id
                            )
                        })

                        return updatedArray
                    })
                }}
                style={[styles.btn, { backgroundColor: "red", shadowColor: "red" }]}>
                <CustomText style={{ color: "#fff" }}>Remove Customer</CustomText>
            </Pressable>

        </View>

    )
}

export default GroupItem

const styles = StyleSheet.create({

    card: {
        height: "auto",
        padding: moderateScale(10),
        borderRadius: scale(4),
        borderWidth: scale(1),
        gap: verticalScale(10),
        elevation: 3,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

    input: {
        height: verticalScale(40),
        borderRadius: scale(4),
        paddingHorizontal: scale(10),
        fontSize: moderateScale(14),
    },

    btn: {
        height: verticalScale(35),
        borderRadius: scale(4),
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,

        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },

})