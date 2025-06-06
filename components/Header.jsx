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
import React, { memo } from 'react'
import { NotificationIcon } from '../constants/icons'
import { useAuth } from '../context/AuthContext'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native'
import CustomText from './CustomText'
import { Link, useRouter } from 'expo-router';

const Header = () => {

    const { authenticatedUser } = useAuth()
    const { colors } = useTheme()

    const blurhash =
        'https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg';

    const router = useRouter()

    return (
        <View style={[styles.headerWrapper, { backgroundColor: colors.background, borderBottomColor: "#DDDDDD", borderBottomWidth: scale(1) }]}>
            <View style={styles.headerLeft}>
                <Image
                    style={{
                        height: scale(37.25),
                        width: scale(37.25),
                        borderRadius: scale(20),
                        position: "relative"
                    }}
                    source="https://marketplace.canva.com/EAGUXS_OW4A/1/0/1600w/canva-purple-abstract-feminine-woman-hair-salon-line-art-logo-JWrVbRab4Vs.jpg"
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={1000}
                />

                <CustomText style={{ fontSize: scale(18), fontFamily: "AirbnbCereal_W_Bd" }}>Modern Unisex Salon</CustomText>
            </View>

            {/* <View style={styles.headerRight}>
                <Pressable><NotificationIcon size={moderateScale(24)} /></Pressable>
                <Link href="/account">
                    <Image
                        style={{ height: moderateScale(35), width: moderateScale(35), borderRadius: moderateScale(20) }}
                        source={authenticatedUser?.imageUrl}
                        placeholder={{ blurhash }}
                        contentFit="cover"
                        transition={1000}
                    />
                </Link>
            </View> */}

            <View
                style={{
                    position: "relative"
                }}
            >
                <Pressable
                    style={{
                        height: scale(40),
                        width: scale(40),
                        borderRadius: scale(30),
                        backgroundColor: "#EAA82433",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    onPress={() => router.push("/notification")}
                >
                    <NotificationIcon size={moderateScale(24)} color={colors.text} />
                </Pressable>
                <View
                    style={{
                        width: scale(7),
                        height: scale(7),
                        backgroundColor: "#D63163",
                        borderRadius: scale(20),
                        position: "absolute",
                        top: scale(10),
                        right: scale(12.5)
                    }}
                />
            </View>

        </View>
    )
}

export default memo(Header)

const styles = StyleSheet.create({
    headerWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: scale(10),
        minHeight: verticalScale(50)
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
        height: "100%",
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: scale(10),
        height: "100%",
    },
})

