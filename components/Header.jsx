// // import { StyleSheet, Text, View } from 'react-native'
// // import React from 'react'

// // const Header = () => {

// //     // const { theme, modeColor, setModeColor } = useTheme()

// //     // const modeColorHandler = async (colorMode) => {
// //     //     setModeColor(colorMode)
// //     //     await AsyncStorage.setItem('modeColor', JSON.stringify({ ...colorMode, default: false }));
// //     // }


// //     return (
// //         <View>
// //             <Text>Header</Text>

// //             {/* <Pressable
// //                 style={{
// //                     height: 40,
// //                     width: 100,
// //                     backgroundColor: modeColor.colorCode
// //                 }}
// //             >
// //                 <CustomText>button</CustomText>



// //             </Pressable>

// //             <Pressable onPress={() => modeColorHandler({ colorName: "Blue", colorCode: "blue" })}><Text>Blue</Text></Pressable>
// //             <Pressable onPress={() => modeColorHandler({ colorName: "White", colorCode: "white" })}><Text>White</Text></Pressable>
// //             <Pressable onPress={() => modeColorHandler({ colorName: "Red", colorCode: "red" })}><Text>Red</Text></Pressable> */}
// //         </View>
// //     )
// // }

// // export default Header

// // const styles = StyleSheet.create({})


// // ========= The top commented code is for changing theme colors  =======

import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Image } from 'expo-image';
import React, { memo, useState } from 'react'
import { NotificationIcon } from '../constants/icons'
import { useAuth } from '../context/AuthContext'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native'
import CustomText from './CustomText'
import { Link, useRouter } from 'expo-router';
import { useGlobal } from '../context/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = () => {

    const { authenticatedUser } = useAuth()
    const { colors } = useTheme()

    const blurhash =
        'https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg';

    const router = useRouter()

    const { newNotification, setNewNotification } = useGlobal()

    console.log("authenticatedUser ", authenticatedUser?.salonType)

    return (
        // <View style={[styles.headerWrapper, {
        //     backgroundColor: colors.background,
        // }]}>
        //     <View style={styles.headerLeft}>
        //         <Image
        //             style={{
        //                 height: scale(37.25),
        //                 width: scale(37.25),
        //                 borderRadius: scale(20),
        //                 position: "relative"
        //             }}
        //             source={authenticatedUser?.salonLogo?.[0]?.url}
        //             placeholder={{ blurhash }}
        //             contentFit="cover"
        //             transition={1000}
        //         />

        //         <CustomText style={{ fontSize: scale(16), fontFamily: "AirbnbCereal_W_Blk" }}>{authenticatedUser?.salonName}</CustomText>
        //     </View>


        //     <View
        //         style={{
        //             position: "relative"
        //         }}
        //     >
        //         <Pressable
        //             style={{
        //                 height: scale(40),
        //                 width: scale(40),
        //                 borderRadius: scale(30),
        //                 justifyContent: "center",
        //                 alignItems: "center"
        //             }}
        //             onPress={async () => {

        //                 if (newNotification.value) {
        //                     await AsyncStorage.setItem(
        //                         "newNotification",
        //                         JSON.stringify({
        //                             email: authenticatedUser?.email,
        //                             value: false
        //                         })
        //                     );
        //                     setNewNotification({
        //                         email: "",
        //                         value: false
        //                     })
        //                 }

        //                 router.push("/notification")
        //             }}
        //         >
        //             <NotificationIcon size={moderateScale(24)} color={colors.text} />
        //         </Pressable>

        //         {
        //             newNotification.value && (
        //                 <View
        //                     style={{
        //                         width: scale(7),
        //                         height: scale(7),
        //                         backgroundColor: "#D63163",
        //                         borderRadius: scale(20),
        //                         position: "absolute",
        //                         top: scale(6),
        //                         right: scale(8)
        //                     }}
        //                 />
        //             )
        //         }

        //     </View>

        // </View>

        <View style={styles.header}>
            {/* Left section - Avatar and Welcome Text */}
            <View style={styles.leftSection}>
                <Image
                    source={{ uri: authenticatedUser?.profile?.[0]?.url }}
                    style={styles.avatar}
                />
                <View>
                    <CustomText style={styles.nameText}>{authenticatedUser?.name}</CustomText>
                    <CustomText style={[styles.welcomeText, { color: colors.secondaryText }]}>{authenticatedUser?.salonName}</CustomText>
                </View>
            </View>

            {/* Right section - Notification bell */}
            <Pressable
                style={styles.bellWrapper}
                activeOpacity={0.7}
                onPress={async () => {

                    if (newNotification.value) {
                        await AsyncStorage.setItem(
                            "newNotification",
                            JSON.stringify({
                                email: authenticatedUser?.email,
                                value: false
                            })
                        );
                        setNewNotification({
                            email: "",
                            value: false
                        })
                    }

                    router.push("/notification")
                }}
            >
                <NotificationIcon size={moderateScale(24)} color={colors.notificationBellColor} />
                {/* {
                    newNotification.value && (
                        <View style={styles.badge} />
                    )
                } */}

            </Pressable>
        </View>

    )
}

export default memo(Header)

const styles = StyleSheet.create({
    // headerWrapper: {
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     alignItems: "center",
    //     paddingHorizontal: scale(10),
    //     minHeight: verticalScale(50)
    // },
    // headerLeft: {
    //     flexDirection: "row",
    //     alignItems: "center",
    //     gap: scale(10),
    //     height: "100%",
    // },
    // headerRight: {
    //     flexDirection: "row",
    //     alignItems: "center",
    //     gap: scale(10),
    //     height: "100%",
    // },


    header: {
        // paddingHorizontal: scale(10),
        // paddingTop: verticalScale(5),
        // paddingBottom: verticalScale(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: verticalScale(40),
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
    },
    avatar: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(20),
    },
    welcomeText: {
        fontSize: scale(14),
    },
    nameText: {
        fontSize: scale(18),
        fontFamily: "AirbnbCereal_W_XBd"
    },
    bellWrapper: {
        padding: scale(8),
        borderRadius: scale(999),
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: scale(6),
        right: scale(6),
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: '#2dd4bf', // bg-teal-400
    },
})

