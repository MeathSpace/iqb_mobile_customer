import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    Animated,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import CustomText from '../../components/CustomText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/Colors'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import { AddIcon, ArrowLeftIcon, CheckIcon, ClockIcon } from '../../constants/icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useTheme } from '@react-navigation/native'


const SingleJoin = () => {

    const [activeSection, setActiveSection] = useState('services')
    const [scrolling, setScrolling] = useState(false)
    const [addIconPressCount, setAddIconPressCount] = useState(0);

    const handleScrollStart = (section) => {
        setActiveSection(section)
        setScrolling(true)
        setAddIconPressCount(1)
    }

    const paddingAnim = useRef(new Animated.Value(scale(15))).current;
    const flexAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(paddingAnim, {
            toValue: scrolling ? scale(0) : scale(15),
            duration: 300,
            useNativeDriver: false, // Padding cannot use native driver
        }).start();

        Animated.timing(flexAnim, {
            toValue: scrolling ? 1 : 0,
            duration: scrolling ? 300 : 0,
            useNativeDriver: false, // layout props like flex can't use native driver
        }).start();
    }, [scrolling]);



    const router = useRouter()
    const { colors } = useTheme()

    const renderSection = (key, title, content) => {
        const isActive = activeSection === key

        if (scrolling && !isActive) return null


        return isActive ? (
            <Animated.View style={[styles.boxOpenWrapper, {
                flex: flexAnim,
                backgroundColor: colors.background
            }]}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        gap: verticalScale(15),
                        paddingBottom: scale(30),
                    }}
                    onTouchStart={() => handleScrollStart(key)}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <Pressable
                            onPress={() => {
                                setScrolling(false)
                                setActiveSection("")
                                setAddIconPressCount(0)
                            }}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: scale(5)
                            }}>
                            <ArrowLeftIcon color={colors.text}/>
                            <CustomText style={{ fontSize: scale(16), fontFamily: "AirbnbCereal_W_Blk" }}>{title}</CustomText>
                        </Pressable>

                        {/* <Pressable
                            style={{
                                height: verticalScale(20),
                                width: scale(55),
                                backgroundColor: "#00B090",
                                borderRadius: scale(4),
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        ><CustomText style={{ fontSize: scale(12), color: "#fff" }}>
                                {activeSection === "services" ? "Next" : "Done"}
                            </CustomText>
                        </Pressable> */}
                    </View>
                    {
                        activeSection === "services" && (
                            content.map((item, index) => {
                                return (

                                    <Pressable
                                        key={index}
                                        style={{
                                            // height: verticalScale(195),
                                            borderRadius: scale(10),
                                            backgroundColor: "#00B0901A",
                                            padding: scale(12),
                                            gap: verticalScale(10)
                                        }}
                                    >
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: scale(10)
                                                }}
                                            >

                                                {
                                                    index % 2 === 1 ? (
                                                        <Image
                                                            style={{ height: scale(50), width: scale(50), borderRadius: scale(80) }}
                                                            source={{ uri: "https://www.knksalon.in/assets-admin/upload/category_service/6595410e1a466.webp" }}
                                                            // placeholder={{ blurhash }}
                                                            contentFit="cover"
                                                            transition={300}
                                                        />
                                                    ) : (
                                                        <View
                                                            style={{
                                                                height: scale(50),
                                                                width: scale(50),
                                                                borderRadius: scale(80),
                                                                backgroundColor: "rgba(0,0,0,0.4)",
                                                                position: "relative"
                                                            }}
                                                        >
                                                            <Image
                                                                style={{ height: scale(50), width: scale(50), borderRadius: scale(80), zIndex: -1 }}
                                                                source={{ uri: "https://www.knksalon.in/assets-admin/upload/category_service/6595410e1a466.webp" }}
                                                                // placeholder={{ blurhash }}
                                                                contentFit="cover"
                                                                transition={300}
                                                            />
                                                            <CheckIcon
                                                                color='#fff'
                                                                style={{
                                                                    position: "absolute",
                                                                    top: scale(14),
                                                                    left: scale(14)
                                                                }}
                                                            />
                                                        </View>
                                                    )
                                                }

                                                <View style={{ gap: verticalScale(5) }}>
                                                    <CustomText style={{
                                                        fontSize: scale(12),
                                                        fontFamily: "AirbnbCereal_W_Bd"
                                                    }}>Haircuts & Styling</CustomText>
                                                    <Pressable
                                                        style={{
                                                            height: verticalScale(15),
                                                            width: scale(50),
                                                            backgroundColor: "#00B0901A",
                                                            borderRadius: scale(4),
                                                            justifyContent: "center",
                                                            alignItems: "center"
                                                        }}
                                                    ><CustomText style={{ fontSize: scale(10), color: "#00B090" }}>Haircut</CustomText></Pressable>
                                                </View>
                                            </View>

                                            {
                                                index % 2 === 1 ? (
                                                    <Pressable
                                                        style={{
                                                            height: verticalScale(20),
                                                            width: scale(55),
                                                            backgroundColor: "#1f2937",
                                                            borderRadius: scale(4),
                                                            justifyContent: "center",
                                                            alignItems: "center"
                                                        }}
                                                    ><CustomText style={{ fontSize: scale(12), color: "#fff" }}>Add</CustomText>
                                                    </Pressable>
                                                ) : (<Pressable
                                                    style={{
                                                        height: verticalScale(20),
                                                        width: scale(60),
                                                        backgroundColor: "#E11D48",
                                                        borderRadius: scale(4),
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}
                                                ><CustomText style={{ fontSize: scale(12), color: "#fff" }}>Remove</CustomText>
                                                </Pressable>)
                                            }
                                        </View>

                                        <View style={{ marginTop: verticalScale(5), gap: verticalScale(5) }}>
                                            <CustomText
                                                style={{
                                                    color: "gray",
                                                    fontSize: scale(12)
                                                }}
                                            >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi in odit tenetur, exercitationem qui similique?</CustomText>

                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between"
                                                }}
                                            >
                                                <View style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    width: scale(75),
                                                    gap: scale(2),
                                                    backgroundColor: colors.background,
                                                    paddingHorizontal: scale(5),
                                                    borderRadius: scale(4)
                                                }}>
                                                    <ClockIcon size={scale(12)} color={Colors.modeColor.colorCode} />
                                                    <CustomText style={{ fontSize: scale(12), flex: 1, color: Colors.modeColor.colorCode }}>120 mins</CustomText>
                                                </View>

                                                <CustomText
                                                    style={{
                                                        fontFamily: "AirbnbCereal_W_Blk",
                                                        fontSize: scale(18),
                                                        color: Colors.modeColor.colorCode
                                                    }}
                                                >$49.00</CustomText>
                                            </View>
                                        </View>
                                    </Pressable >
                                )
                            })
                        )
                    }

                    {
                        activeSection === "barber" && (
                            content.map((item, index) => {
                                return (
                                    <Pressable
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            backgroundColor: "#00B0901A",
                                            borderRadius: scale(10),
                                            padding: scale(10)
                                        }}
                                        onPress={() => {
                                            if (addIconPressCount === 1) {
                                                setScrolling(false)
                                                setActiveSection("calendar")
                                                setAddIconPressCount(0)
                                            }
                                        }}
                                        key={index}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: scale(10)
                                            }}
                                        >
                                            <Image
                                                style={{ height: scale(50), width: scale(50), borderRadius: scale(40) }}
                                                source={{ uri: "https://media.istockphoto.com/id/1365608023/photo/shot-of-a-handsome-young-barber-standing-alone-in-his-salon.jpg?s=612x612&w=0&k=20&c=0l2Q3UVgXNnf3lbUvMM7hT18-AAnOloeoNMOHntomcw=" }}
                                                contentFit="cover"
                                                transition={300}
                                            />

                                            <View>
                                                <CustomText style={{
                                                    fontSize: scale(14)
                                                }}>Wade Warren</CustomText>
                                                <View style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: scale(2),
                                                    flex: 1
                                                }}>
                                                    <ClockIcon size={scale(12)} color='gray' />
                                                    <CustomText style={{ fontSize: scale(12), flex: 1, color: "gray" }}>120 mins</CustomText>
                                                </View>
                                            </View>
                                        </View>

                                        <View
                                            style={{

                                            }}
                                        >
                                            <CustomText style={{ fontSize: scale(16), fontFamily: "AirbnbCereal_W_Blk", textAlign: "center" }}>2</CustomText>
                                            <CustomText style={{ fontSize: scale(14), color: "gray" }}>In Queue</CustomText>
                                        </View>
                                    </Pressable>
                                )
                            })
                        )
                    }

                </ScrollView>

                {
                    scrolling && activeSection === "services" && (
                        <View style={{
                            // height: verticalScale(50),
                            width: "100%",
                            borderTopColor: "#D2D2D2",
                            borderTopWidth: scale(0.5),
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingVertical: verticalScale(10),
                            marginBottom: -verticalScale(15),
                            // position: "absolute",
                        }}>
                            <View>
                                <CustomText
                                    style={{
                                        fontSize: scale(18),
                                        fontFamily: "AirbnbCereal_W_Blk"
                                    }}
                                >$ 147</CustomText>
                                <CustomText
                                    style={{
                                        fontSize: scale(12),
                                        color: "gray"
                                    }}
                                >3 services | 45 mins</CustomText>
                            </View>

                            <Pressable
                                style={{
                                    height: verticalScale(40),
                                    width: scale(100),
                                    backgroundColor: Colors.modeColor.colorCode,
                                    borderRadius: scale(10),
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <CustomText style={{
                                    color: "#fff", fontSize: scale(16)
                                }}>Continue</CustomText>
                            </Pressable>
                        </View>
                    )
                }
            </Animated.View>
        ) : (
            <Pressable
                style={[styles.boxCloseWrapper, {
                    backgroundColor: colors.background,
                }]}
                onPress={() => setActiveSection(key)}
            >
                <CustomText>{title}</CustomText>
            </Pressable>
        )
    }

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    paddingHorizontal: paddingAnim,
                }
            ]}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={{ flex: 1, gap: verticalScale(15) }}>
                        {renderSection(
                            'services',
                            'Choose Services ?',
                            [
                                { id: 1 },
                                { id: 2 },
                                { id: 3 },
                                { id: 4 },
                                { id: 5 },
                                { id: 6 },
                                { id: 7 },
                                { id: 8 },
                                { id: 9 },
                            ]

                        )}
                        {renderSection(
                            'barber',
                            'Choose Barber ?',
                            [
                                { id: 1 },
                                { id: 2 },
                                { id: 3 },
                                { id: 4 },
                                { id: 5 },
                                { id: 6 },
                                { id: 7 },
                                { id: 8 },
                                { id: 9 },
                            ]
                        )}

                    </View>

                    {!scrolling && (
                        <View style={styles.footer}>
                            <CustomText style={styles.clearAll}>Clear all</CustomText>
                            <Pressable style={styles.searchButton}>
                                <CustomText style={{ color: '#fff' }}>Next</CustomText>
                            </Pressable>
                        </View>
                    )}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Animated.View>
    )
}

export default SingleJoin

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00B0901A',
        paddingHorizontal: scale(15),
    },
    boxOpenWrapper: {
        // backgroundColor: '#fff',
        borderRadius: scale(20),
        height: verticalScale(300),
        padding: scale(25),

        // iOS shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        padding: scale(25),

        elevation: 3,
    },
    boxCloseWrapper: {
        height: verticalScale(60),
        
        // backgroundColor: '#fff',
        borderRadius: scale(15),
        paddingHorizontal: scale(25),
        justifyContent: 'center',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: verticalScale(15),
    },
    clearAll: {
        textDecorationLine: 'underline',
    },
    searchButton: {
        height: verticalScale(40),
        borderRadius: scale(10),
        backgroundColor: Colors.modeColor.colorCode,
        paddingHorizontal: scale(25),
        justifyContent: 'center',
        alignItems: 'center',
    },







    serviceItem: {
        width: "100%",
        height: verticalScale(124),
        backgroundColor: "red",
        // borderWidth: scale(0.5),
        // borderColor: "#D2D2D2",
        // borderRadius: scale(8),
        paddingVertical: verticalScale(8),
        // paddingHorizontal: scale(10),
        backgroundColor: "#fff",
        // elevation: 1
    },


    barberItem: {
        width: "100%",
        height: verticalScale(145),
        // borderWidth: scale(0.5),
        // borderColor: "#D2D2D2",
        borderRadius: scale(8),
        paddingVertical: verticalScale(8),
        // paddingHorizontal: scale(10),
        backgroundColor: "#fff",
        // elevation: 1
    },

    navButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: scale(10)
        // marginBottom: 10,
    },
    navButton: {
        backgroundColor: Colors.modeColor.colorCode3,
        borderColor: Colors.modeColor.colorCode,
        borderWidth: scale(1),
        width: scale(30),
        height: scale(30),
        borderRadius: scale(25),
        justifyContent: "center",
        alignItems: "center"
    },

    weekContainer: {
        gap: scale(10)
    },
    dayBox: {
        width: scale(60),
        height: verticalScale(100),
        borderColor: "#DDDDDD",
        borderWidth: scale(0.6),
        borderRadius: scale(4),
        alignItems: 'center',
        justifyContent: 'center',
        gap: verticalScale(5)
    },

})
