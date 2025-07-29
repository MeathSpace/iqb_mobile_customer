import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    Animated,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import CustomText from '../../components/CustomText'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '../../constants/Colors'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import { AddIcon, ArrowLeftIcon, CheckIcon, ClockIcon, LeftIcon, RightIcon } from '../../constants/icons'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import moment from 'moment';
import { useTheme } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import Skeleton from '../../components/Skeleton'
import { Toast } from 'toastify-react-native'

const appointmentCalendar = () => {

    const { authenticatedUser } = useAuth()

    const [salonServices, setSalonServices] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })

    const [salonBarber, setSalonBarber] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })


    useEffect(() => {
        const fetchSalonServices = async () => {
            try {

                setSalonServices((prev) => ({ ...prev, loading: true }))

                const { data } = await axios.get(`${BASE_URL}/mobileRoutes/getAllSalonServices`, {
                    params: {
                        salonId: authenticatedUser?.salonId
                    }
                })

                setSalonServices((prev) => ({
                    ...prev, loading: false, data: data?.response?.map((item) => {
                        return (
                            { ...item, selected: false }
                        )
                    }), success: true, error: null
                }))

            } catch (error) {

                setSalonServices((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                console.log("Error fetching salon Info ", error)
            }
        }

        fetchSalonServices()
    }, [authenticatedUser])


    const [selectCustomerServices, setSelectedCustomerServices] = useState([])
    const [selectedCustomerBarber, setSelectedCustomerBarber] = useState(null)
    const [continueService, setContinueService] = useState(false)


    useEffect(() => {
        if (selectCustomerServices.length > 0 && continueService) {

            const fetchBarbersByMultipleServiceId = async () => {
                try {

                    setSalonBarber((prev) => ({ ...prev, loading: true }))

                    const { data } = await axios.post(`${BASE_URL}/mobileRoutes/bookAppointmentBarbers`, {
                        salonId: authenticatedUser.salonId,
                        serviceIds: selectCustomerServices.map((item) => item.serviceId)
                    })

                    setSalonBarber((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

                } catch (error) {

                    setSalonBarber((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                    console.log("Error fetching barbers by multiple service Id", error)
                }
            }

            fetchBarbersByMultipleServiceId()
        }

    }, [authenticatedUser, selectCustomerServices, continueService])

    const addServiceHandler = (service) => {
        setContinueService(false)
        const updatedSalonServices = salonServices?.data?.map((item) => {
            return item?.serviceId === service?.serviceId ? { ...service, selected: true } : item
        })

        setSalonServices({
            data: updatedSalonServices,
            loading: false,
            error: null,
            success: false
        })

        setSelectedCustomerServices([...selectCustomerServices, service])
    }

    const removeServiceHandler = (service) => {
        setContinueService(false)
        const updatedSalonServices = salonServices?.data?.map((item) => {
            return item?.serviceId === service?.serviceId ? { ...service, selected: false } : item
        })

        setSalonServices({
            data: updatedSalonServices,
            loading: false,
            error: null,
            success: false
        })

        setSelectedCustomerServices((prev) => {

            const filteredArray = prev.filter((item) => {
                return item?.serviceId !== service?.serviceId
            })

            return filteredArray
        })
    }

    const [engageTimeslotsData, setEngageTimeslotsData] = useState({
        data: null,
        loading: false,
        error: null,
        success: false
    })

    const [selectedCalenderDate, setSelectedCalenderDate] = useState("")
    const [appointmentNote, setAppointmentNote] = useState("")
    const [selectedEngageTimeSlot, setSelectedEngageTimeSlot] = useState("")
    const [disableDates, setDisbaleDates] = useState([])
    const [disableLoader, setDisableLoader] = useState(false)

    // console.log("selectedEngageTimeSlot ", selectedEngageTimeSlot)

    useEffect(() => {
        if (selectedCalenderDate && selectedCustomerBarber) {
            const fetchBarberTimeSlots = async () => {
                try {

                    setEngageTimeslotsData((prev) => ({ ...prev, loading: true }))

                    const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getEngageBarberTimeSlots`, {
                        salonId: selectedCustomerBarber?.salonId,
                        barberId: selectedCustomerBarber?.barberId,
                        date: selectedCalenderDate
                    })

                    setEngageTimeslotsData((prev) => ({ ...prev, loading: false, data: data?.response, success: true, error: null }))

                } catch (error) {

                    setEngageTimeslotsData((prev) => ({ ...prev, loading: false, data: null, success: false, error: error }))
                    console.log("Error fetching timeslots ", error?.response?.data)
                }
            }

            fetchBarberTimeSlots()
        }
    }, [selectedCalenderDate, selectedCustomerBarber])

    useEffect(() => {
        if (selectedCustomerBarber) {

            const fetchFullyBookedDates = async () => {
                try {

                    setDisableLoader(true)

                    const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getFullyBookedDatesBySalonIdBarberId`, {
                        salonId: selectedCustomerBarber?.salonId,
                        barberId: selectedCustomerBarber?.barberId,
                    })

                    setDisbaleDates(prev => [...prev, ...data.response])
                    setDisableLoader(false)

                    // console.log("Get fully booked dates ", data)

                } catch (error) {
                    console.log("Error fetching fully booked dates ", error?.response?.data)
                    setDisableLoader(false)
                }
            }

            const fetchBarberDisableAppointmentDates = async () => {
                try {
                    setDisableLoader(true)
                    const { data } = await axios.post(`${BASE_URL}/mobileRoutes/getBarberDisabledAppointmentDates`, {
                        salonId: selectedCustomerBarber?.salonId,
                        barberId: selectedCustomerBarber?.barberId,
                    })

                    setDisbaleDates(prev => [...prev, ...data.response])
                    setDisableLoader(false)

                    // console.log("Get barber disable appointment dates ", data)

                } catch (error) {
                    console.log("Error fetching barber disable appointment dates ", error?.response?.data)
                    setDisableLoader(false)
                }
            }

            fetchFullyBookedDates()
            fetchBarberDisableAppointmentDates()
        }
    }, [selectedCustomerBarber])

    //=================

    // console.log("selectCustomerServices ", selectCustomerServices)
    // console.log("selectedCustomerBarber ", selectedCustomerBarber)v

    // console.log("engageTimeslotsData ", engageTimeslotsData)

    // console.log("disableDates sdvwwb ", disableDates)

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
        const startOfMonth = monthMoment.clone().startOf('month');
        const endOfMonth = monthMoment.clone().endOf('month');
        const daysInMonth = monthMoment.daysInMonth();

        const today = moment().startOf('day'); // current date at 00:00

        let tempDates = [];

        for (let i = 0; i < daysInMonth; i++) {
            const dayMoment = startOfMonth.clone().add(i, 'days');

            // 🔥 Skip today and past dates
            if (dayMoment.isSameOrBefore(today)) continue;

            tempDates.push({
                dayName: dayMoment.format('ddd'),
                date: dayMoment.format('DD'),
                month: dayMoment.format('MMM'),
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


    const continueHandler = () => {

        if (selectCustomerServices.length === 0) {
            Toast.error("Please select a service")
            return
        } else if (!selectedCustomerBarber) {
            Toast.error("Please select a barber")
            return
        } else if (!selectedEngageTimeSlot) {
            Toast.error("Please select a timeslot")
            return
        } else if (!selectedCalenderDate) {
            Toast.error("Please select a date")
            return
        }


        // router.push({
        //     pathname: "/joinConfirmation",
        //     params: {
        //         selectedCustomerBookAppointmentServices: JSON.stringify(selectCustomerServices),
        //         selectedCustomerBookAppointmentBarber: JSON.stringify(selectedCustomerBarber),
        //         selectedBookCalenderTimeslot: JSON.stringify(selectedEngageTimeSlot),
        //         selectedBookCalenderDate: JSON.stringify(selectedCalenderDate),
        //         selectedBookAppointmentNote: JSON.stringify(appointmentNote),
        //         bookAppointment: true
        //     },
        // });

        router.push({
            pathname: "/appointmentCalenderModal",
            params: {
                selectedCustomerBookAppointmentServices: JSON.stringify(selectCustomerServices),
                selectedCustomerBookAppointmentBarber: JSON.stringify(selectedCustomerBarber),
                selectedBookCalenderTimeslot: JSON.stringify(selectedEngageTimeSlot),
                selectedBookCalenderDate: JSON.stringify(selectedCalenderDate),
                selectedBookAppointmentNote: JSON.stringify(appointmentNote),
                bookAppointment: true
            },
        });
    }

    function formatMinutesToHrMin(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;

        if (hours > 0 && mins > 0) return `${hours}hr ${mins}min`;
        if (hours > 0) return `${hours}hr`;
        return `${mins}min`;
    }


    const renderSection = (key, title, content) => {
        const isActive = activeSection === key

        if (scrolling && !isActive) return null



        return isActive ? (
            <Animated.View style={[styles.boxOpenWrapper, {
                flex: flexAnim,
                backgroundColor: colors.cardColor,
                borderWidth: scale(1),
                borderColor: colors.queueBorder
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
                            salonServices?.loading ? (
                                [0, 1, 2, 3, 4, 5].map((_, index) => {
                                    return (
                                        <Skeleton
                                            key={index}
                                            height={verticalScale(150)}
                                            borderRadius={scale(10)}
                                        />
                                    )
                                })
                            ) : (
                                salonServices?.data?.map((item, index) => {
                                    return (
                                        <Pressable
                                            key={item?.serviceId}
                                            style={{
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
                                                        item?.selected ? (
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
                                                                    source={{ uri: item?.serviceIcon?.url }}
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
                                                        ) : (
                                                            <Image
                                                                style={{ height: scale(50), width: scale(50), borderRadius: scale(80) }}
                                                                source={{ uri: item?.serviceIcon?.url }}
                                                                // placeholder={{ blurhash }}
                                                                contentFit="cover"
                                                                transition={300}
                                                            />
                                                        )
                                                    }

                                                    <View style={{ gap: verticalScale(5) }}>
                                                        <CustomText style={{
                                                            fontSize: scale(12),
                                                            fontFamily: "AirbnbCereal_W_Bd"
                                                        }}>{item?.serviceName}</CustomText>
                                                        <Pressable
                                                            style={{
                                                                height: verticalScale(15),
                                                                width: scale(50),
                                                                backgroundColor: "#00B0901A",
                                                                borderRadius: scale(4),
                                                                justifyContent: "center",
                                                                alignItems: "center"
                                                            }}
                                                        ><CustomText style={{ fontSize: scale(10), color: "#00B090" }}>{item?.serviceCategoryName}</CustomText></Pressable>
                                                    </View>
                                                </View>

                                                {
                                                    item?.selected ? (
                                                        <Pressable
                                                            onPress={() => removeServiceHandler(item)}
                                                            style={{
                                                                height: verticalScale(20),
                                                                width: scale(60),
                                                                backgroundColor: "#E11D48",
                                                                borderRadius: scale(4),
                                                                justifyContent: "center",
                                                                alignItems: "center"
                                                            }}
                                                        ><CustomText style={{ fontSize: scale(12), color: "#fff" }}>Remove</CustomText>
                                                        </Pressable>
                                                    ) : (
                                                        <Pressable
                                                            onPress={() => addServiceHandler(item)}
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
                                                    )
                                                }
                                            </View>

                                            <View style={{ marginTop: verticalScale(5), gap: verticalScale(5) }}>
                                                <CustomText
                                                    style={{
                                                        color: "gray",
                                                        fontSize: scale(12)
                                                    }}
                                                >{item?.serviceDesc}</CustomText>

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
                                                        gap: scale(2),
                                                        backgroundColor: colors.background,
                                                        paddingHorizontal: scale(5),
                                                        borderRadius: scale(4)
                                                    }}>
                                                        <ClockIcon size={scale(12)} color={'#14b8a6'} />
                                                        <CustomText style={{ fontSize: scale(12), color: '#14b8a6' }}>{formatMinutesToHrMin(item?.serviceEWT)}</CustomText>
                                                    </View>

                                                    {/* Currency should also be added in authenticated user response */}
                                                    {/* Service Price doesnot have point value */}

                                                    <CustomText
                                                        style={{
                                                            fontFamily: "AirbnbCereal_W_Blk",
                                                            fontSize: scale(18),
                                                            color: '#14b8a6'
                                                        }}
                                                    >{authenticatedUser?.currency} {item?.servicePrice}</CustomText>
                                                </View>
                                            </View>
                                        </Pressable >
                                    )
                                })
                            )

                        )
                    }

                    {
                        activeSection === "barber" && (
                            salonBarber?.loading ? (
                                [0, 1, 2, 3, 4, 5].map((_, index) => {
                                    return (
                                        <Skeleton
                                            key={index}
                                            height={verticalScale(60)}
                                            borderRadius={scale(10)}
                                        />
                                    )
                                })
                            ) : salonBarber?.data?.length > 0 ? (
                                salonBarber?.data?.map((item, index) => {
                                    return (
                                        <Pressable
                                            key={item?.barberId}
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                backgroundColor: "#00B0901A",
                                                borderRadius: scale(10),
                                                padding: scale(10)
                                            }}
                                            onPress={() => {
                                                setSelectedCustomerBarber(item)
                                                setScrolling(false)
                                                setActiveSection("calendar")
                                                setAddIconPressCount(0)
                                                setSelectedCalenderDate("")
                                                setDisbaleDates([])
                                            }}
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
                                                    source={{ uri: item?.profile?.[0]?.url }}
                                                    contentFit="cover"
                                                    transition={300}
                                                />

                                                <View>
                                                    <CustomText style={{
                                                        fontSize: scale(14)
                                                    }}>{item?.name}</CustomText>
                                                    {/* <View style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        gap: scale(2),
                                                        minWidth: scale(75),
                                                        flex: 1
                                                    }}>
                                                        <ClockIcon size={scale(12)} color='gray' />
                                                        <CustomText style={{ fontSize: scale(12), flex: 1, color: "gray" }}>{item?.barberEWT} mins</CustomText>
                                                    </View> */}
                                                </View>
                                            </View>

                                            {/* <View
                                                style={{

                                                }}
                                            >
                                                <CustomText style={{ fontSize: scale(16), fontFamily: "AirbnbCereal_W_Blk", textAlign: "center" }}>{item?.queueCount}</CustomText>
                                                <CustomText style={{ fontSize: scale(14), color: "gray" }}>In Queue</CustomText>
                                            </View> */}
                                        </Pressable>
                                    )
                                })
                            ) : (
                                <View
                                    style={{
                                        paddingTop: verticalScale(20)
                                    }}
                                >
                                    <CustomText>No barbers available</CustomText>
                                </View>
                            )

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
                                            paddingVertical: verticalScale(4),
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
                                        <Pressable
                                            onPress={currentMonth.isSame(moment(), 'month') ? null : goToPrevMonth}
                                            style={[
                                                styles.navButton,
                                                currentMonth.isSame(moment(), 'month') && { opacity: 0.3 } // visually indicate disabled
                                            ]}
                                        >
                                            <LeftIcon
                                                color={'#14b8a6'}
                                                size={scale(16)}
                                            />
                                        </Pressable>
                                        <Pressable onPress={goToNextMonth} style={styles.navButton}>
                                            <RightIcon color={'#14b8a6'} size={scale(16)} />
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
                                            disabled={disableLoader || disableDates?.includes(day?.fullDate)}
                                            onPress={() => {
                                                setSelectedCalenderDate(day?.fullDate)
                                            }}
                                            key={day.fullDate}
                                            style={[styles.dayBox, {
                                                backgroundColor: disableDates?.includes(day?.fullDate) && "#e5e5e5",
                                                borderColor: selectedCalenderDate === day?.fullDate ? "#0BA3AD" : null,
                                                borderWidth: selectedCalenderDate === day?.fullDate ? scale(1) : null
                                            }]}>
                                            <CustomText
                                                style={{
                                                    fontSize: scale(15),
                                                    color: disableDates?.includes(day?.fullDate) && "#000"
                                                }}
                                            >{day.dayName}</CustomText>
                                            <CustomText
                                                style={{
                                                    fontSize: scale(16),
                                                    color: disableDates?.includes(day?.fullDate) ? "#000" : '#14b8a6',
                                                }}
                                            >{day.date}</CustomText>
                                            {/* {
                                                disableDates?.includes(day?.fullDate) ? (
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
                                            } */}

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
                                        !selectedCustomerBarber ? (
                                            <View
                                                style={{
                                                    width: "100%",
                                                    minHeight: verticalScale(300),
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <CustomText>Please select barber</CustomText>
                                            </View>
                                        ) : !selectedCalenderDate ? (
                                            <View
                                                style={{
                                                    width: "100%",
                                                    minHeight: verticalScale(300),
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <CustomText>Please select date</CustomText>
                                            </View>
                                        ) : engageTimeslotsData?.loading ? (
                                            <>
                                                <Skeleton
                                                    width={scrolling ? "31%" : "48%"}
                                                    height={verticalScale(40)}
                                                    style={{
                                                        borderRadius: scale(8)
                                                    }}
                                                />
                                                <Skeleton
                                                    width={scrolling ? "31%" : "48%"}
                                                    height={verticalScale(40)}
                                                    style={{
                                                        borderRadius: scale(8)
                                                    }}
                                                />
                                                <Skeleton
                                                    width={scrolling ? "31%" : "48%"}
                                                    height={verticalScale(40)}
                                                    style={{
                                                        borderRadius: scale(8)
                                                    }}
                                                />
                                                <Skeleton
                                                    width={scrolling ? "31%" : "48%"}
                                                    height={verticalScale(40)}
                                                    style={{
                                                        borderRadius: scale(8)
                                                    }}
                                                />
                                                <Skeleton
                                                    width={scrolling ? "31%" : "48%"}
                                                    height={verticalScale(40)}
                                                    style={{
                                                        borderRadius: scale(8)
                                                    }}
                                                />
                                                <Skeleton
                                                    width={scrolling ? "31%" : "48%"}
                                                    height={verticalScale(40)}
                                                    style={{
                                                        borderRadius: scale(8)
                                                    }}
                                                />
                                                <Skeleton
                                                    width={scrolling ? "31%" : "48%"}
                                                    height={verticalScale(40)}
                                                    style={{
                                                        borderRadius: scale(8)
                                                    }}
                                                />
                                                <Skeleton
                                                    width={scrolling ? "31%" : "48%"}
                                                    height={verticalScale(40)}
                                                    style={{
                                                        borderRadius: scale(8)
                                                    }}
                                                />
                                                <Skeleton
                                                    width={scrolling ? "31%" : "48%"}
                                                    height={verticalScale(40)}
                                                    style={{
                                                        borderRadius: scale(8)
                                                    }}
                                                />

                                            </>
                                        ) : engageTimeslotsData?.data?.map((item, index) => {
                                            return (
                                                <Pressable
                                                    onPress={() => {
                                                        if (addIconPressCount === 1 && !item?.disabled) {
                                                            setScrolling(false)
                                                            setActiveSection("appointmentnote")
                                                            setAddIconPressCount(0)
                                                            setSelectedEngageTimeSlot(item?.timeInterval)
                                                        }
                                                    }}
                                                    key={index}
                                                    style={{
                                                        backgroundColor: item?.disabled ? "#e5e5e5" : "#00B0901A",
                                                        alignSelf: "flex-start",
                                                        width: scrolling ? "31%" : "48%",
                                                        height: verticalScale(40),
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderRadius: scale(8)
                                                    }}>
                                                    <CustomText style={{
                                                        color: '#14b8a6',
                                                        fontSize: moderateScale(12)
                                                    }}>{item?.timeInterval}</CustomText>
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
                                        minHeight: verticalScale(150),
                                        // borderColor: "#DDDDDD",
                                        padding: scale(16),
                                        borderRadius: scale(8),
                                        textAlignVertical: "top",
                                        backgroundColor: "#00B0901A",
                                        color: colors.text,
                                    }}
                                    multiline
                                    placeholderTextColor={"gray"}
                                    placeholder='Enter your appointment note'
                                    value={appointmentNote}
                                    onChangeText={(text) => setAppointmentNote(text)}
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
                    scrolling && activeSection === "services" && selectCustomerServices.length > 0 && (
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
                            {/* <View>
                                <CustomText
                                    style={{
                                        fontSize: scale(18),
                                        fontFamily: "AirbnbCereal_W_Blk"
                                    }}
                                >{authenticatedUser?.currency} {selectCustomerServices.reduce((acc, item) => acc + item.servicePrice, 0)}</CustomText>
                                <CustomText
                                    style={{
                                        fontSize: scale(12),
                                        color: "gray"
                                    }}
                                >{selectCustomerServices.length} services | {formatMinutesToHrMin(selectCustomerServices.reduce((acc, item) => acc + item.serviceEWT, 0))}</CustomText>
                            </View> */}

                            <Pressable
                                onPress={() => {
                                    setContinueService(true)
                                    setScrolling(false)
                                    setActiveSection("barber")
                                    setAddIconPressCount(0)
                                }}
                                style={{
                                    height: verticalScale(40),
                                    // width: scale(100),
                                    flex: 1,
                                    backgroundColor: '#14b8a6',
                                    borderRadius: scale(6),
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
                    backgroundColor: colors.cardColor,
                    borderWidth: scale(1),
                    borderColor: colors.queueBorder
                }]}
                onPress={() => setActiveSection(key)}
            >
                <CustomText>{title}</CustomText>
            </Pressable>
        )
    }

    const insets = useSafeAreaInsets()

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

                    {/* Header */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: scale(10),
                            marginBottom: verticalScale(20),
                        }}
                    >
                        <Pressable onPress={() => router.replace("/appointment")}>
                            <ArrowLeftIcon color={colors.text} />
                        </Pressable>
                        <CustomText
                            style={{
                                flex: 1,
                                fontFamily: "AirbnbCereal_W_XBd",
                                fontSize: scale(20),
                            }}
                        >
                            Book Appointment
                        </CustomText>
                    </View>

                    <View style={{ flex: 1, gap: verticalScale(15) }}>
                        {renderSection(
                            'services',
                            'Choose Services',
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
                            'Choose Barber',
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
                            'Choose Date',
                            ''
                        )}
                        {renderSection(
                            'appointmentnote',
                            'Appointment Note',
                            ''
                        )}
                    </View>

                    {/* {!scrolling && (
                        <View style={styles.footer}>
                            <Pressable
                                onPress={() => {
                                    // router.replace("/appointment")
                                    router.dismiss()
                                }}
                                style={styles.searchButton}>
                                <CustomText style={{ color: '#fff' }}>Back</CustomText>
                            </Pressable>
                            <Pressable
                                onPress={continueHandler}
                                style={styles.searchButton}>
                                <CustomText style={{ color: '#fff' }}>Next</CustomText>
                            </Pressable>
                        </View>
                    )} */}



                    {/* Footer */}
                    {selectCustomerServices.length > 0 ? (
                        <View
                            style={{
                                backgroundColor: colors.cardColor,
                                borderTopColor: colors.queueBorder,
                                borderTopWidth: scale(1),
                                // height:
                                //     Platform.OS === "ios"
                                //         ? insets.bottom + verticalScale(60)
                                //         : verticalScale(80),
                                padding: scale(10),
                                // position: "absolute",
                                // bottom: 0,
                                // left: 0,
                                // right: 0,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <View style={{ marginBottom: verticalScale(15) }}>
                                <CustomText
                                    style={{ fontFamily: "AirbnbCereal_W_XBd", fontSize: scale(18) }}
                                >
                                    {/* {authenticatedUser?.currency} {totalPrice.toFixed(2)} */}
                                    {authenticatedUser?.currency} {selectCustomerServices.reduce((acc, item) => acc + item.servicePrice, 0)}
                                </CustomText>
                                <CustomSecondaryText>
                                    {selectCustomerServices.length} {selectCustomerServices.length === 1 ? "service" : "services"} |{" "}
                                    {formatMinutesToHrMin(
                                        selectCustomerServices.reduce((acc, item) => acc + item.serviceEWT, 0)
                                    )}
                                </CustomSecondaryText>

                            </View>

                            <TouchableOpacity
                                // onPress={() => {
                                //     // router.push({
                                //     //     pathname: "/singleJoinBarber",
                                //     //     params: {
                                //     //         data: JSON.stringify(selectedServices),
                                //     //     },
                                //     // });
                                // }}
                                onPress={continueHandler}
                                style={styles.queueButton}
                                activeOpacity={0.85}
                            >
                                <CustomText style={styles.queueButtonText}>Continue</CustomText>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                </KeyboardAvoidingView>
            </SafeAreaView>
        </Animated.View>
    )
}

export default appointmentCalendar

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#00B0901A',
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
        // marginVertical: verticalScale(15),
    },
    clearAll: {
        textDecorationLine: 'underline',
    },
    searchButton: {
        height: verticalScale(40),
        borderRadius: scale(10),
        backgroundColor: '#14b8a6',
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
        // borderColor: '#14b8a6',
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


    queueButton: {
        width: '40%',
        backgroundColor: '#14b8a6', // bg-teal-500
        paddingVertical: verticalScale(12), // py-4
        borderRadius: scale(8), // rounded-xl
        marginBottom: verticalScale(15), // mb-6
        alignItems: 'center',
        justifyContent: 'center',
    },
    queueButtonText: {
        color: '#fff', // text-white
        fontFamily: "AirbnbCereal_W_XBd",
        fontSize: scale(16),
    },
})


