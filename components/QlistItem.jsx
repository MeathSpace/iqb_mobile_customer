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

// const QlistItem = ({ item, index, qlistLength }) => {

//     const { colors } = useTheme()
//     const { authenticatedUser } = useAuth()

//     return (
//         <View style={[styles.qlistItem, {
//         }]}>
//             <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(10) }}>
//                 <Image
//                     style={{ height: scale(50), width: scale(50), borderRadius: moderateScale(30) }}
//                     source={{ uri: item?.customerProfile?.[0]?.url }}
//                     contentFit="cover"
//                     transition={300}
//                 />
//                 <View style={{ gap: verticalScale(5) }}>
//                     <CustomText style={{ fontFamily: "AirbnbCereal_W_Md", fontSize: scale(14) }}>{item.barberName}</CustomText>
//                     <CustomSecondaryText style={{
//                         fontFamily: "AirbnbCereal_W_Md",
//                         fontSize: scale(12),
//                         color: authenticatedUser?.name === item?.name ? "#0BA3AD" : colors.secondaryText
//                     }}>
//                         {authenticatedUser?.name === item?.name ? authenticatedUser?.name : "client"}
//                     </CustomSecondaryText>
//                 </View>
//             </View>

//             <View style={{
//                 gap: verticalScale(5),
//                 minWidth: scale(80),
//                 alignItems: "center",
//                 justifyContent: "center",
//             }}>
//                 <CustomText
//                     style={{
//                         fontFamily: "AirbnbCereal_W_Blk",
//                         fontSize: scale(16),
//                         minWidth: scale(50),
//                         textAlign: "center",
//                     }}>
//                     {item.qPosition}
//                 </CustomText>

//                 {
//                     item.customerEWT === 0 ? (
//                         <CustomText style={{
//                             fontSize: scale(12),
//                             color: "gray",
//                             textAlign: "center"
//                         }}>-</CustomText>
//                     ) : (
//                         <View style={{
//                             flexDirection: "row",
//                             alignItems: "center",
//                             gap: scale(2),
//                             justifyContent: "center"
//                         }}>
//                             <ClockIcon size={scale(12)} color='gray' />
//                             <CustomText style={{ fontSize: scale(12), color: "gray" }}>
//                                 {item.customerEWT} mins
//                             </CustomText>
//                         </View>
//                     )
//                 }
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
//     }
// })



import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import { Image } from 'expo-image'
import CustomText from './CustomText'
import CustomSecondaryText from './CustomSecondaryText'
import { useTheme } from '@react-navigation/native'
import { ClockIcon } from '../constants/icons'
import { useAuth } from '../context/AuthContext'
import { Background } from '@react-navigation/elements'
import { useGlobal } from '../context/GlobalContext'

const QlistItem = ({ item, index, qlistLength }) => {

    const { colors } = useTheme()
    const { authenticatedUser } = useAuth()

    return (
        <View style={[styles.qlistItem, { backgroundColor: colors.background }]}>
            <View>
                <CustomText
                    style={{
                        fontFamily: "AirbnbCereal_W_Bd"
                    }}
                >{item.barberName}</CustomText>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: scale(10),
                        marginTop: verticalScale(5)
                    }}
                >
                    <Image
                        style={{
                            width: scale(40),
                            height: scale(40),
                            borderRadius: scale(40),
                            borderWidth: scale(1),
                            borderColor: "#d3d3d3"
                        }}
                        source={{ uri: item?.customerProfile?.[0]?.url }}
                        contentFit="cover"
                        transition={300}
                    />
                    <View>
                        <CustomText style={{ fontSize: scale(14), color: "#00B090" }}>{authenticatedUser?.email === item?.customerEmail ? item?.name : "client"}</CustomText>
                        <CustomText style={{ fontSize: scale(14), color: "#696D6E" }}>{item.customerEWT} mins</CustomText>
                    </View>
                </View>
            </View>

            <CustomText
                style={{
                    fontFamily: "AirbnbCereal_W_Bd"
                }}
            >{item.qPosition === 1 ? "Next" : item.qPosition}</CustomText>
        </View>
    )
}

export default QlistItem

const styles = StyleSheet.create({
    qlistItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: verticalScale(75),
        borderRadius: scale(10),
        paddingInline: scale(15)
    }
})