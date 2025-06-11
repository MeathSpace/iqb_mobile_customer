import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    TextInput,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import CustomText from '../../components/CustomText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../../constants/Colors'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import { AddIcon, ClockIcon, LeftIcon, RightIcon } from '../../constants/icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import moment from 'moment';

const Demo = () => {
    const [activeSection, setActiveSection] = useState('services')
    const [scrolling, setScrolling] = useState(false)
    const [addIconPressCount, setAddIconPressCount] = useState(0);

    const handleScrollStart = (section) => {
        setActiveSection(section)
        setScrolling(true)
        setAddIconPressCount(1)
    }

    const router = useRouter()

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

    const renderSection = (key, title, content) => {
        const isActive = activeSection === key

        if (scrolling && !isActive) return null

        return isActive ? (
            <View style={[styles.boxOpenWrapper, { flex: 1 }]}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        gap: verticalScale(15),
                        paddingBottom: scale(30),
                    }}
                    // onTouchStart={() => handleScrollStart(key)}
                    onScrollBeginDrag={() => handleScrollStart(key)}
                    showsVerticalScrollIndicator={false}
                >
                    <CustomText style={{ fontSize: scale(18) }}>{title}</CustomText>
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
                                                setActiveSection("calendar")
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
                                            borderColor: "#DDDDDD",
                                            borderWidth: scale(0.6),
                                            paddingVertical: verticalScale(4),
                                            paddingHorizontal: scale(10),
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
                                                backgroundColor: index === 2 && "#efefef"
                                            }]}>
                                            <CustomText
                                                style={{
                                                    fontSize: scale(15),
                                                    color: index === 2 && "#DDDDDD"
                                                }}
                                            >{day.dayName}</CustomText>
                                            <CustomText
                                                style={{
                                                    fontSize: scale(16),
                                                    color: index === 2 ? "#DDDDDD" : Colors.modeColor.colorCode,
                                                }}
                                            >{day.date}</CustomText>
                                            {
                                                index === 2 ? (
                                                    <CustomText
                                                        style={{
                                                            fontSize: scale(13),
                                                            fontFamily: "AirbnbCereal_W_Bk",
                                                            lineHeight: scale(16),
                                                            color: "#DDDDDD"
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
                                                        backgroundColor: Colors.modeColor.colorCode3,
                                                        alignSelf: "flex-start",
                                                        width: scrolling ? "31%" : "48%",
                                                        height: verticalScale(40),
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderColor: Colors.modeColor.colorCode,
                                                        borderWidth: scale(1),
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
                                        borderWidth: scale(1),
                                        minHeight: verticalScale(200),
                                        borderColor: "#DDDDDD",
                                        padding: scale(16),
                                        borderRadius: scale(4),
                                        textAlignVertical: "top",
                                    }}
                                    multiline
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
            </View>
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
        <SafeAreaView style={[
            styles.container, {
                paddingHorizontal: scrolling ? scale(0) : scale(15)
            }
        ]}>
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
    )
}

export default Demo

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

})
