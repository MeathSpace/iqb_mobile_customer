// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
// import { Image } from 'expo-image'
// import CustomText from './CustomText'
// import CustomSecondaryText from './CustomSecondaryText'
// import { useTheme } from '@react-navigation/native'
// import { ClockIcon } from '../constants/icons'
// import { useAuth } from '../context/AuthContext'
// import { Background } from '@react-navigation/elements'
// import { useGlobal } from '../context/GlobalContext'

// const QlistItem = ({ item, index, qlistLength }) => {

//     const { colors } = useTheme()
//     const { authenticatedUser } = useAuth()

// function formatMinutesToHrMin(totalMinutes) {
//     const hours = Math.floor(totalMinutes / 60);
//     const mins = totalMinutes % 60;

//     if (hours > 0 && mins > 0) return `${hours}hr ${mins}min`;
//     if (hours > 0) return `${hours}hr`;
//     return `${mins}min`;
// }

//     return (
//         <View style={[styles.qlistItem, { backgroundColor: "#00B0901A" }]}>
//             <View>
//                 <View
//                     style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         gap: scale(10),
//                         marginTop: verticalScale(5)
//                     }}
//                 >
// <Image
//     style={{
//         width: scale(40),
//         height: scale(40),
//         borderRadius: scale(40),
//         borderWidth: scale(1),
//         borderColor: "#d3d3d3"
//     }}
//     source={{ uri: item?.customerProfile?.[0]?.url }}
//     contentFit="cover"
//     transition={300}
// />
//                     <View style={{ gap: verticalScale(3) }}>
//                         {/* <CustomText style={{ fontSize: scale(14), color: "#00B090" }}>{authenticatedUser?.email === item?.customerEmail ? item?.name : "client"}</CustomText>
//                         <CustomText style={{ fontSize: scale(14), color: "#696D6E" }}>{formatMinutesToHrMin(item.customerEWT)}</CustomText> */}

//                         <CustomText style={{ fontSize: scale(14) }}>{item.barberName}</CustomText>
//                         <CustomText style={{ fontSize: scale(12), color: authenticatedUser?.email === item?.customerEmail ? "#00B090" : "#696D6E" }}>{authenticatedUser?.email === item?.customerEmail ? item?.name : "client"}</CustomText>
//                     </View>
//                 </View>
//             </View>

//             <View style={{
//                 minWidth: scale(80),
//             }}>
//                 <CustomText
//                     style={{
//                         fontFamily: "AirbnbCereal_W_Bd",
//                         textAlign: "center"
//                     }}
//                 >{item.qPosition === 1 ? "Next" : item.qPosition}</CustomText>
//                 <CustomText style={{ fontSize: scale(14), color: "#696D6E", textAlign: "center" }}>{formatMinutesToHrMin(item.customerEWT)}</CustomText>
//             </View>
//         </View>
//     )
// }

// export default QlistItem

// const styles = StyleSheet.create({
//     qlistItem: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         height: verticalScale(75),
//         borderRadius: scale(10),
//         paddingInline: scale(15)
//     }
// })


import { View, Text, StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import CustomText from './CustomText';
import { Image } from 'expo-image'
import { useAuth } from '../context/AuthContext';
import { useTheme } from '@react-navigation/native';

const QlistItem = ({ item, index, qlistLength }) => {

    const { colors } = useTheme()
    const { authenticatedUser } = useAuth()


    function formatMinutesToHrMin(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}m`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}m`;
    }

    return (
        <View style={[styles.queueItem, { backgroundColor: colors.cardColor, borderColor: colors.cardBorder }]}>
            <View style={styles.leftSection}>
                <Image
                    style={[styles.avatar, { borderColor: colors.cardBorder }]}
                    source={{ uri: item?.barberProfile?.[0]?.url }}
                    contentFit="cover"
                    transition={300}
                />
                {/* <View style={{
                    width: scale(40),
                    height: scale(40),
                    borderRadius: scale(20),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    borderWidth: scale(1)
                }}>
                    <CustomText>A</CustomText>
                </View> */}
                <CustomText numberOfLines={1} style={[styles.nameText, { color: colors.secondaryText }]}>
                    {/* <CustomText style={styles.nameBold}>{item.barberName}</CustomText> (with {authenticatedUser?.email === item?.customerEmail ? item?.name : "Client"}) */}
                    <CustomText style={styles.nameBold}>{item.barberName}</CustomText> {authenticatedUser?.email === item?.customerEmail ? `(with ${item?.name})` : "(Client)"}
                </CustomText>
            </View>
            <CustomText style={[styles.statusText, { color: colors.secondaryText }]}>
                <CustomText style={[item.qPosition === 1 && styles.statusHighlight]}>{item.qPosition === 1 ? "Next" : `#${item.qPosition}`}</CustomText> / ~{formatMinutesToHrMin(item.customerEWT)}
            </CustomText>
        </View>
    )
}

export default QlistItem

const styles = StyleSheet.create({
    queueItem: {
        backgroundColor: '#fff',
        padding: scale(12),
        borderRadius: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // borderColor: '#e5e7eb', // border-gray-200
        borderWidth: scale(1),
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        flexShrink: 1,
    },
    avatar: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
        borderWidth: scale(1)
    },
    nameText: {
        // color: '#4b5563', // text-gray-600
        fontSize: scale(13),
        flexShrink: 1,
    },
    nameBold: {
        fontFamily: "AirbnbCereal_W_Bd"
        // fontWeight: '600',
        // color: '#1f2937', // text-gray-800
    },
    statusText: {
        fontSize: scale(13),
        fontWeight: '600',
        textAlign: 'right',
        marginLeft: scale(8),
        whiteSpace: 'nowrap',
        fontFamily: "AirbnbCereal_W_Bd"
    },
    statusHighlight: {
        color: '#14b8a6', // text-teal-500
    },
});
