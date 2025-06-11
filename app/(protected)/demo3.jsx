import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    Animated,
    Easing,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import CustomText from '../../components/CustomText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/Colors'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import { AddIcon, ClockIcon } from '../../constants/icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { useTheme } from '@react-navigation/native'
import { useGlobal } from '../../context/GlobalContext'


const Demo3 = () => {
    const [activeSection, setActiveSection] = useState('addedmember')
    const [scrolling, setScrolling] = useState(false)
    const [addIconPressCount, setAddIconPressCount] = useState(0);

    const handleScrollStart = (section) => {
        setActiveSection(section)
        setScrolling(true)
        setAddIconPressCount(1)
    }

    const { colors } = useTheme()


    const {
        customerName,
        setCustomerName,
        selectedBarber,
        setSelectedBarber,
        selectedBarberServices,
        setSelectedBarberServices,
        joinModes } = useGlobal();

    const router = useRouter()

    const [groupJoinMembers, setGroupJoinMembers] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8])

    const paddingAnim = useRef(new Animated.Value(scale(15))).current;
    const flexAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(paddingAnim, {
            toValue: scrolling ? scale(0) : scale(15),
            duration: 300,
            // easing: Easing.back(),
            useNativeDriver: false, // Padding cannot use native driver
        }).start();

        Animated.timing(flexAnim, {
            toValue: scrolling ? 1 : 0,
            duration: scrolling ? 300 : 0,
            // easing: Easing.back(),
            useNativeDriver: false, // layout props like flex can't use native driver
        }).start();
    }, [scrolling]);

    const renderSection = (key, title, content) => {

        const isActive = activeSection === key

        if (scrolling && !isActive) return null

        return isActive ? (
            <Animated.View style={[styles.boxOpenWrapper, { flex: flexAnim }]}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        gap: verticalScale(15),
                        paddingBottom: scale(30),
                    }}
                    onTouchStart={() => handleScrollStart(key)}
                    showsVerticalScrollIndicator={false}
                >
                    {activeSection !== "addedmember" && <CustomText style={{ fontSize: scale(18) }}>{title}</CustomText>}

                    {
                        activeSection === "addedmember" && (
                            <>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: scale(5)
                                        }}
                                    >
                                        <CustomText
                                            style={{
                                                fontSize: scale(18)
                                            }}
                                        >Added Members</CustomText>
                                        <View
                                            style={{
                                                width: scale(20),
                                                height: scale(20),
                                                borderRadius: scale(50),
                                                backgroundColor: Colors.modeColor.colorCode,
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}
                                        ><CustomText
                                            style={{
                                                fontFamily: "AirbnbCereal_W_Bk",
                                                fontSize: scale(10),
                                                color: "#fff"
                                            }}
                                        >{groupJoinMembers.length}</CustomText></View>
                                    </View>

                                    <Pressable
                                        style={{
                                            width: scale(80),
                                            height: verticalScale(40),
                                            borderRadius: scale(8),
                                            backgroundColor: groupJoinMembers.length ? Colors.modeColor.colorCode : "#D7D7D7",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                        onPress={() => {
                                            if (groupJoinMembers.length) {
                                                router.push("/joinConfirmation")
                                            }
                                        }}
                                    >
                                        <CustomText
                                            style={{
                                                fontSize: scale(12),
                                                color: groupJoinMembers.length ? "#fff" : "#999898"
                                            }}
                                        >Book</CustomText>
                                    </Pressable>
                                </View>

                                {
                                    groupJoinMembers.map((item, index) => {
                                        return (
                                            <View
                                                key={index}
                                                style={{
                                                    paddingVertical: verticalScale(8),
                                                    width: "100%",
                                                    backgroundColor: "#fff",
                                                    position: "relative"
                                                }}>
                                                <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                                                    <Image
                                                        style={{ height: moderateScale(55), width: moderateScale(55), borderRadius: moderateScale(30) }}
                                                        source={{ uri: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg" }}
                                                        // placeholder={{ blurhash }}
                                                        contentFit="cover"
                                                        transition={300}
                                                    />
                                                    <View style={{
                                                        gap: verticalScale(8)
                                                    }}>
                                                        <CustomText style={{
                                                            fontSize: scale(14)
                                                        }}>{item.customerName}</CustomText>
                                                        <CustomText
                                                            style={{
                                                                fontSize: scale(14),
                                                                color: "rgba(0,0,0,0.6)"
                                                            }}
                                                        >Arghya Ghosh</CustomText>
                                                    </View>
                                                </View>

                                                <View
                                                    style={{
                                                        height: verticalScale(0.5),
                                                        backgroundColor: "#D2D2D2",
                                                        marginVertical: verticalScale(10)
                                                    }}
                                                />

                                                <View style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between"
                                                }}>
                                                    <View>
                                                        <CustomSecondaryText
                                                            style={{
                                                                fontSize: scale(11)
                                                            }}
                                                        >. Hair cut</CustomSecondaryText>

                                                        <CustomSecondaryText
                                                            style={{
                                                                fontSize: scale(11)
                                                            }}
                                                        >. Hair wash</CustomSecondaryText>

                                                        <CustomSecondaryText
                                                            style={{
                                                                fontSize: scale(11)
                                                            }}
                                                        >. Beard</CustomSecondaryText>

                                                    </View>

                                                    <View style={{ gap: scale(6) }}>
                                                        <CustomText style={{ textAlign: "center", fontSize: moderateScale(20) }}>$ 30.00</CustomText>
                                                        <View style={{ flexDirection: "row", alignItems: "center", gap: scale(5), }}>
                                                            <ClockIcon size={moderateScale(16)} color={colors.secondaryText} />
                                                            <CustomSecondaryText style={{ fontSize: scale(12) }}>65 mins</CustomSecondaryText>

                                                        </View>
                                                    </View>
                                                </View>

                                                <Pressable
                                                    onPress={() => {
                                                        if (addIconPressCount === 1) {
                                                            setScrolling(false)
                                                            setActiveSection("addmember")
                                                            setAddIconPressCount(0)
                                                        }
                                                    }}
                                                    style={{
                                                        position: "absolute",
                                                        right: scale(10),
                                                        top: verticalScale(10),
                                                        backgroundColor: Colors.modeColor.colorCode,
                                                        borderRadius: scale(4),
                                                        height: verticalScale(24),
                                                        width: scale(56),
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}
                                                ><CustomText style={{ color: "#fff", fontSize: scale(12) }}>Remove</CustomText></Pressable>
                                            </View>
                                        )
                                    })
                                }
                            </>
                        )
                    }

                    {
                        activeSection === "addmember" && (
                            <>
                                <TextInput
                                    editable
                                    placeholder="Enter member name"
                                    placeholderTextColor={colors.secondaryText}
                                    style={[false ? styles.inputFielderror : styles.inputField, { borderColor: Colors.modeColor.colorCode, backgroundColor: Colors.modeColor.colorCode3, fontFamily: "AirbnbCereal_W_Bk", }]}
                                    value={customerName}
                                    onChangeText={text => setCustomerName(text)}
                                />

                                <Pressable
                                    onPress={() => {
                                        if (addIconPressCount === 1) {
                                            setScrolling(false)
                                            setActiveSection("services")
                                            setAddIconPressCount(0)
                                        }
                                    }}
                                    style={styles.searchButton}>
                                    <CustomText style={{ color: '#fff' }}>Done</CustomText>
                                </Pressable>
                            </>
                        )
                    }

                    {
                        activeSection === "services" && (
                            content.map((item, index) => {
                                return (

                                    <Pressable
                                        key={index}
                                        style={styles.serviceItem}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <CustomText style={{ fontSize: scale(13) }}>Hair Cut</CustomText>

                                            <Pressable
                                                style={{
                                                    height: scale(32),
                                                    width: scale(32),
                                                    borderRadius: scale(30),
                                                    backgroundColor: Colors.modeColor.colorCode,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() => {
                                                    if (addIconPressCount === 1) {
                                                        setScrolling(false)
                                                        setActiveSection("barber")
                                                        setAddIconPressCount(0)
                                                    }
                                                }}
                                            >
                                                <AddIcon color="#fff" />
                                            </Pressable>

                                        </View >
                                        <View
                                            style={{
                                                height: scale(0.5),
                                                marginVertical: verticalScale(10),
                                                backgroundColor: '#D2D2D2',
                                            }}
                                        />
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <CustomText
                                                style={{
                                                    fontFamily: 'AirbnbCereal_W_Bk',
                                                    color: '#808080',
                                                    fontSize: scale(12),
                                                }}
                                            >
                                                The Best Hair Cutting In the Town
                                            </CustomText>

                                            <View style={{ gap: scale(6) }}>
                                                <CustomText style={{ textAlign: 'center', fontSize: moderateScale(17) }}>
                                                    € 75
                                                </CustomText>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: scale(5) }}>
                                                    <ClockIcon size={scale(12)} color={'#808080'} />
                                                    <CustomSecondaryText
                                                        style={{
                                                            fontFamily: 'AirbnbCereal_W_Bk',
                                                            color: '#808080',
                                                            fontSize: scale(12),
                                                        }}
                                                    >
                                                        15 mins
                                                    </CustomSecondaryText>
                                                </View>
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
                                        style={styles.barberItem}
                                        onPress={() => {
                                            if (addIconPressCount === 1) {
                                                setScrolling(false)
                                                setActiveSection("")
                                                setAddIconPressCount(0)
                                            }
                                        }}
                                        key={index}
                                    >
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
                                                <Image
                                                    style={{ height: scale(60), width: scale(60), borderRadius: scale(40) }}
                                                    source={{ uri: "https://media.istockphoto.com/id/1365608023/photo/shot-of-a-handsome-young-barber-standing-alone-in-his-salon.jpg?s=612x612&w=0&k=20&c=0l2Q3UVgXNnf3lbUvMM7hT18-AAnOloeoNMOHntomcw=" }}
                                                    contentFit="cover"
                                                    transition={300}
                                                />
                                                <View style={{ gap: verticalScale(5), flex: 1 }}>
                                                    <CustomText style={{ fontSize: scale(15) }}>Michael</CustomText>
                                                    <CustomSecondaryText
                                                        style={{
                                                            fontSize: scale(11),
                                                            fontFamily: "AirbnbCereal_W_Bk",
                                                            flexWrap: "wrap",
                                                            color: "#808080"
                                                        }}>
                                                        Cutting, Styling, Haircut, Hair Straightening
                                                    </CustomSecondaryText>
                                                </View>
                                            </View>

                                            <View style={{ gap: verticalScale(5) }}>
                                                <CustomSecondaryText style={{
                                                    textAlign: "center",
                                                    fontSize: scale(12),
                                                    fontFamily: "AirbnbCereal_W_Bk",
                                                    color: "#808080"
                                                }}>Queueing</CustomSecondaryText>
                                                <CustomText style={{
                                                    textAlign: "center",
                                                    fontSize: scale(22)
                                                }}>2</CustomText>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                height: scale(0.5),
                                                marginVertical: verticalScale(10),
                                                backgroundColor: '#D2D2D2',
                                            }}
                                        />

                                        <View style={{
                                            flexDirection: "row",
                                            justifyContent: "space-around"
                                        }}>
                                            <View style={{ gap: verticalScale(5) }}>
                                                <CustomSecondaryText
                                                    style={{
                                                        fontSize: scale(11),
                                                        color: "#808080",
                                                        fontFamily: "AirbnbCereal_W_Bk",
                                                    }}
                                                >Next available position</CustomSecondaryText>
                                                <CustomText style={{
                                                    textAlign: "center",
                                                    fontSize: scale(13),
                                                }}>3</CustomText>
                                            </View>

                                            <View style={{ gap: verticalScale(5) }}>
                                                <CustomSecondaryText style={{
                                                    fontSize: scale(11),
                                                    color: "#808080",
                                                    fontFamily: "AirbnbCereal_W_Bk",
                                                }}>Estimated Time</CustomSecondaryText>
                                                <CustomText style={{
                                                    textAlign: "center",
                                                    fontSize: scale(13),
                                                }}>15 mins</CustomText>
                                            </View>
                                        </View>
                                    </Pressable>
                                )
                            })
                        )
                    }

                </ScrollView>
            </Animated.View>
        ) : (
            <Pressable
                style={styles.boxCloseWrapper}
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
                            'addedmember',
                            'Added Members ?',
                            ''
                        )}

                        {renderSection(
                            'addmember',
                            'Member Name ?',
                            ''
                        )}

                        {/* {renderSection(
                        'addmember',
                        'Member Name ?',
                        ''
                    )} */}

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

export default Demo3

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
        paddingHorizontal: scale(15),
    },
    boxOpenWrapper: {
        backgroundColor: '#fff',
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
        shadowRadius: 6,
        padding: scale(25),

        elevation: 6,
    },
    boxCloseWrapper: {
        height: verticalScale(60),
        backgroundColor: '#fff',
        borderRadius: scale(15),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        paddingHorizontal: scale(25),
        justifyContent: 'center',
        elevation: 3,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: verticalScale(10),
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


    inputField: {
        width: "98%",
        height: verticalScale(40),
        borderRadius: scale(8),
        borderWidth: scale(1),
        paddingHorizontal: scale(10),
        fontSize: scale(14),
    },

})
