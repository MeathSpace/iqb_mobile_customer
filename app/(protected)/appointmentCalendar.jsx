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
import { AddIcon, ArrowLeftIcon, CheckIcon, ClockIcon, LeftIcon, RightIcon } from '../../constants/icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import moment from 'moment';
import { useTheme } from '@react-navigation/native'

const appointmentCalendar = () => {
    const [activeSection, setActiveSection] = useState('services')
    const [scrolling, setScrolling] = useState(false)
    const [addIconPressCount, setAddIconPressCount] = useState(0);

    const handleScrollStart = (section) => {
        setActiveSection(section)
        setScrolling(true)
        setAddIconPressCount(1)
    }

    const router = useRouter()
    const { colors } = useTheme()

    // Calender 
    const [currentMonth, setCurrentMonth] = useState(moment());
    const [dates, setDates] = useState([]);

    useEffect(() => {
        generateDatesForMonth(currentMonth);
    }, [currentMonth]);

    const generateDatesForMonth = (monthMoment) => {
        // Get start and end of month
        const startOfMonth = monthMoment.clone().startOf('month');
        const endOfMonth = monthMoment.clone().endOf('month');
        const daysInMonth = monthMoment.daysInMonth();

        let tempDates = [];
        for (let i = 0; i < daysInMonth; i++) {
            const dayMoment = startOfMonth.clone().add(i, 'days');
            tempDates.push({
                dayName: dayMoment.format('ddd'), // Sun, Mon, ...
                date: dayMoment.format('DD'), // 01, 02, ...
                month: dayMoment.format('MMM'), // Jan, Feb, ...
                year: dayMoment.format('YYYY'),
                fullDate: dayMoment.format('YYYY-MM-DD'),
                slots: Math.floor(Math.random() * 10),
                bgcolor: getRandomColor()
            });
        }
        setDates(tempDates);
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const goToPrevMonth = () => {
        setCurrentMonth((prev) => prev.clone().subtract(1, 'month'));
    };

    const goToNextMonth = () => {
        setCurrentMonth((prev) => prev.clone().add(1, 'month'));
    };

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

    const renderSection = (key, title, content) => {
        const isActive = activeSection === key

        if (scrolling && !isActive) return null

        return isActive ? (
            <Animated.View style={[styles.boxOpenWrapper, {
                flex: flexAnim,
                backgroundColor: colors.background,
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
                            <ArrowLeftIcon color={colors.text} />
                            <CustomText style={{ fontSize: scale(16), fontFamily: "AirbnbCereal_W_Blk" }}>{title}</CustomText>
                        </Pressable>
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


                    {
                        activeSection === "calendar" && (
                            <>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <View
                                        style={{
                                            // borderColor: "#DDDDDD",
                                            // borderWidth: scale(0.6),
                                            paddingVertical: verticalScale(4),
                                            // paddingHorizontal: scale(10),
                                            alignSelf: 'flex-start',
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: scale(0.6)
                                        }}
                                    ><CustomText
                                        style={{
                                            fontSize: scale(17),
                                        }}
                                    >
                                            {currentMonth.format('MMMM YYYY')}
                                        </CustomText></View>

                                    <View style={styles.navButtons}>
                                        <Pressable onPress={goToPrevMonth} style={styles.navButton}>
                                            <LeftIcon color={Colors.modeColor.colorCode} size={scale(16)} />
                                        </Pressable>
                                        <Pressable onPress={goToNextMonth} style={styles.navButton}>
                                            <RightIcon color={Colors.modeColor.colorCode} size={scale(16)} />
                                        </Pressable>
                                    </View>
                                </View>


                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.weekContainer}
                                >
                                    {dates.map((day, index) => (
                                        <Pressable
                                            onPress={() => console.log(day)}
                                            key={day.fullDate} style={[styles.dayBox, {
                                                backgroundColor: index === 2 && "#e5e5e5"
                                            }]}>
                                            <CustomText
                                                style={{
                                                    fontSize: scale(15),
                                                    color: index === 2 && "#000"
                                                }}
                                            >{day.dayName}</CustomText>
                                            <CustomText
                                                style={{
                                                    fontSize: scale(16),
                                                    color: index === 2 ? "#000" : Colors.modeColor.colorCode,
                                                }}
                                            >{day.date}</CustomText>
                                            {
                                                index === 2 ? (
                                                    <CustomText
                                                        style={{
                                                            fontSize: scale(13),
                                                            fontFamily: "AirbnbCereal_W_Bk",
                                                            lineHeight: scale(16),
                                                            color: "#000"
                                                        }}
                                                    >
                                                        -
                                                    </CustomText>
                                                ) : (
                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                            gap: scale(5),
                                                            paddingVertical: scale(2),
                                                        }}
                                                    >
                                                        <View
                                                            style={{
                                                                width: scale(8),
                                                                height: scale(8),
                                                                borderRadius: scale(4),
                                                                backgroundColor: day.bgcolor,
                                                            }}
                                                        />
                                                        <CustomText
                                                            style={{
                                                                fontSize: scale(13),
                                                                fontFamily: "AirbnbCereal_W_Bk",
                                                                lineHeight: scale(16),
                                                            }}
                                                        >
                                                            {day.slots} Slots
                                                        </CustomText>
                                                    </View>
                                                )
                                            }

                                        </Pressable>
                                    ))}
                                </ScrollView>

                                <View style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: scale(10)
                                }}>
                                    {
                                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => {
                                            return (
                                                <Pressable
                                                    onPress={() => {
                                                        if (addIconPressCount === 1) {
                                                            setScrolling(false)
                                                            setActiveSection("appointmentnote")
                                                            setAddIconPressCount(0)
                                                        }
                                                    }}
                                                    key={index}
                                                    style={{
                                                        backgroundColor: "#00B0901A",
                                                        alignSelf: "flex-start",
                                                        width: scrolling ? "31%" : "48%",
                                                        height: verticalScale(40),
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        // borderColor: Colors.modeColor.colorCode,
                                                        // borderWidth: scale(1),
                                                        borderRadius: scale(8)
                                                    }}>
                                                    <CustomText style={{
                                                        color: Colors.modeColor.colorCode,
                                                        fontSize: moderateScale(12)
                                                    }}>09: 00 A.M</CustomText>
                                                </Pressable>
                                            )
                                        })
                                    }

                                </View>
                            </>
                        )
                    }

                    {
                        activeSection === "appointmentnote" && (
                            <>
                                <TextInput
                                    style={{
                                        flexGrow: 1,
                                        width: "98%",
                                        // borderWidth: scale(1),
                                        minHeight: verticalScale(200),
                                        // borderColor: "#DDDDDD",
                                        padding: scale(16),
                                        borderRadius: scale(4),
                                        textAlignVertical: "top",
                                        backgroundColor: "#00B0901A",
                                        color: colors.text,
                                    }}
                                    multiline
                                    placeholderTextColor={"gray"}
                                    placeholder='Enter your appointment note'
                                />
                                <Pressable
                                    onPress={() => {
                                        if (addIconPressCount === 1) {
                                            setScrolling(false)
                                            setActiveSection("")
                                            setAddIconPressCount(0)
                                        }
                                    }}
                                    style={styles.searchButton}>
                                    <CustomText style={{ color: '#fff' }}>Done</CustomText>
                                </Pressable>
                            </>
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
                    backgroundColor: colors.background
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
                        {renderSection(
                            'calendar',
                            'Choose Date ?',
                            ''
                        )}
                        {renderSection(
                            'appointmentnote',
                            'Appointment Note',
                            ''
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

export default appointmentCalendar

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
        backgroundColor: "#00B0901A",
        // borderColor: Colors.modeColor.colorCode,
        // borderWidth: scale(1),
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
        backgroundColor: "#00B0901A",
        // borderColor: "#DDDDDD",
        // borderWidth: scale(0.6),
        borderRadius: scale(4),
        alignItems: 'center',
        justifyContent: 'center',
        gap: verticalScale(5)
    },

})


