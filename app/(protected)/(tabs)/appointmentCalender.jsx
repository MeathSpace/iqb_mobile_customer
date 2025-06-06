// import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
// import React, { useState, version } from 'react';
// import { useGlobal } from '../../../context/GlobalContext';
// import { useRouter } from 'expo-router';
// import CustomText from '../../../components/CustomText';
// import { Calendar, LocaleConfig } from 'react-native-calendars';
// import { CalenderLeftIcon, CalenderRightIcon } from '../../../constants/icons';
// import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
// import { Colors } from '../../../constants/Colors';
// import { Shadow } from 'react-native-shadow-2';
// import CustomView from '../../../components/CustomView';
// import CustomSecondaryText from '../../../components/CustomSecondaryText';
// import { useTheme } from '@react-navigation/native';

// LocaleConfig.locales['en'] = {
//     monthNames: [
//         'January', 'February', 'March', 'April', 'May', 'June',
//         'July', 'August', 'September', 'October', 'November', 'December'
//     ],
//     monthNamesShort: [
//         'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
//         'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
//     ],
//     dayNames: [
//         'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
//     ],
//     dayNamesShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
//     today: "Today"
// };

// // Set English as the default locale
// LocaleConfig.defaultLocale = 'en';

// const AppointmentCalendar = () => {
//     const { joinModes } = useGlobal();
//     const router = useRouter();

//     const [selected, setSelected] = useState('');

//     const timeslotData = [
//         {
//             id: '1',
//             startTime: '09:00 AM',
//             endTime: '09:30 AM',
//             isBooked: false
//         },
//         {
//             id: '2',
//             startTime: '09:30 AM',
//             endTime: '10:00 AM',
//             isBooked: true
//         },
//         {
//             id: '3',
//             startTime: '10:00 AM',
//             endTime: '10:30 AM',
//             isBooked: false
//         },
//         {
//             id: '4',
//             startTime: '10:30 AM',
//             endTime: '11:00 AM',
//             isBooked: true
//         },
//         {
//             id: '5',
//             startTime: '11:00 AM',
//             endTime: '11:30 AM',
//             isBooked: false
//         },
//         {
//             id: '6',
//             startTime: '11:30 AM',
//             endTime: '12:00 PM',
//             isBooked: false
//         },
//         {
//             id: '7',
//             startTime: '09:00 AM',
//             endTime: '09:30 AM',
//             isBooked: false
//         },
//         {
//             id: '8',
//             startTime: '09:30 AM',
//             endTime: '10:00 AM',
//             isBooked: true
//         },
//     ];

//     const chunkArray = (arr, size) => {
//         const chunks = [];
//         for (let i = 0; i < arr.length; i += size) {
//             chunks.push(arr.slice(i, i + size));
//         }
//         return chunks;
//     };

//     const timeSlotsChunkData = chunkArray(timeslotData, 3);

//     const [selectedTimeslot, setSelectedTimeslot] = useState("")

//     const { colors } = useTheme()

//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : undefined}
//             style={{ flex: 1 }}
//             keyboardVerticalOffset={scale(Platform.OS === "ios" ? 0 : 0)} // adjust if needed
//         >
//             <CustomView
//                 style={{
//                     justifyContent: "space-between"
//                 }}>
//                 <ScrollView
//                     style={{ flexGrow: 1 }}
//                     contentContainerStyle={{ paddingHorizontal: scale(2), gap: verticalScale(15) }}
//                     showsVerticalScrollIndicator={false}>
//                     <View>
//                         <CustomText style={styles.heading}>
//                             Choose Appointment Date
//                         </CustomText>

//                         <CustomSecondaryText>
//                             Please select a preferred date from the calendar below
//                         </CustomSecondaryText>
//                     </View>

//                     <View style={[styles.calendarWrapper, { backgroundColor: colors.card }]}>
//                         <Calendar
//                             key={colors.card}
//                             onDayPress={day => setSelected(day.dateString)}
//                             hideExtraDays={true}
//                             markedDates={{
//                                 [selected]: {
//                                     selected: true,
//                                     disableTouchEvent: true,
//                                     selectedDayTextColor: "#fff",
//                                     selectedDayBackgroundColor: Colors.modeColor.colorCode
//                                 }
//                             }}
//                             theme={{
//                                 backgroundColor: colors.card,
//                                 calendarBackground: colors.card,
//                                 textSectionTitleColor: '#8E8E93',
//                                 selectedDayBackgroundColor: '#007AFF',
//                                 textDisabledColor: '#D1D1D6',
//                                 dotColor: '#007AFF',
//                                 selectedDotColor: '#ffffff',
//                                 monthTextColor: colors.text,
//                                 indicatorColor: '#007AFF',
//                                 textMonthFontFamily: 'AirbnbCereal_W_Bd',
//                                 textDayHeaderFontWeight: 600,
//                                 textMonthFontSize: moderateScale(16),
//                                 textDayHeaderFontSize: moderateScale(12),
//                             }}

//                             dayComponent={({ date, state, marking, onPress }) => (
//                                 <CustomDay
//                                     date={date}
//                                     state={state}
//                                     marking={marking}
//                                     onPress={onPress}
//                                 />
//                             )}

//                             renderArrow={(direction) => {
//                                 // Customize left and right arrows
//                                 if (direction === "left") {
//                                     return <CalenderLeftIcon size={moderateScale(16)} color={colors.text} />
//                                 } else {
//                                     return <CalenderRightIcon size={moderateScale(16)} color={colors.text} />
//                                 }
//                             }}
//                         />
//                     </View>

//                     <View style={{ gap: verticalScale(10) }}>
//                         <CustomText>
//                             Select Timeslots
//                         </CustomText>

//                         <View>
//                             {timeSlotsChunkData.length === 0 ? (
//                                 <View
//                                     style={{
//                                         alignItems: "center",
//                                         justifyContent: "center",
//                                         paddingVertical: scale(20),
//                                         backgroundColor: Colors.modeColor.colorCode2,
//                                         borderRadius: scale(4),
//                                     }}
//                                 >
//                                     <CustomSecondaryText
//                                         style={{ color: Colors.modeColor.colorCode, fontSize: scale(14) }}
//                                     >
//                                         No time slots available.
//                                     </CustomSecondaryText>
//                                 </View>
//                             ) : (
//                                 timeSlotsChunkData.map((row, rowIndex) => (
//                                     <Pressable
//                                         key={rowIndex}
//                                         style={{
//                                             flexDirection: "row",
//                                             gap: scale(10),
//                                             marginBottom:
//                                                 rowIndex !== timeSlotsChunkData.length - 1 && scale(10),
//                                         }}
//                                     >
//                                         {row.map((slot, index) => (
//                                             <Pressable
//                                                 onPress={() => {
//                                                     if (!slot.isBooked) {
//                                                         setSelectedTimeslot(slot.id);
//                                                     }
//                                                 }}
//                                                 key={index}
//                                                 style={[
//                                                     styles.timeslotItem,
//                                                     {
//                                                         backgroundColor: Colors.modeColor.colorCode2,
//                                                         borderColor:
//                                                             selectedTimeslot === slot.id
//                                                                 ? Colors.modeColor.colorCode
//                                                                 : "transparent",
//                                                     },
//                                                 ]}
//                                             >
//                                                 <CustomSecondaryText
//                                                     style={{
//                                                         color: slot.isBooked
//                                                             ? colors.secondaryText
//                                                             : Colors.modeColor.colorCode,
//                                                     }}
//                                                 >
//                                                     {`${slot.startTime}`}
//                                                 </CustomSecondaryText>
//                                             </Pressable>
//                                         ))}
//                                     </Pressable>
//                                 ))
//                             )}
//                         </View>

//                     </View>

//                     <View style={{ gap: verticalScale(10), marginBottom: verticalScale(20) }}>
//                         <CustomText>
//                             Write your appointment note
//                         </CustomText>

//                         <TextInput
//                             editable
//                             placeholder="Enter your appointment note"
//                             placeholderTextColor={colors.secondaryText}
//                             style={[false ? styles.inputFielderror : styles.inputField, { borderColor: colors.border, backgroundColor: colors.card, fontFamily: "AirbnbCereal_W_Bk", color: colors.text }]}
//                             // onChangeText={(text) => {
//                             //     setEmailError("")
//                             //     setEmail(text)
//                             // }}
//                             // value={email}
//                             value=''
//                         />
//                     </View>

//                     <Pressable
//                         onPress={() => router.push("/joinConfirmation")}
//                         style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
//                         <CustomText style={{ color: "#fff" }}>Continue</CustomText>
//                     </Pressable>
//                 </ScrollView>

//             </CustomView>
//         </KeyboardAvoidingView>
//     );
// };

// export default AppointmentCalendar;

// const styles = StyleSheet.create({

//     heading: {
//         fontFamily: "AirbnbCereal_W_Bd",
//         fontSize: moderateScale(22),
//         marginBottom: verticalScale(10)
//     },


//     calendarWrapper: {
//         borderRadius: moderateScale(6),
//         padding: scale(5),
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,

//         elevation: 3
//     },
//     btn: {
//         height: verticalScale(40),
//         borderRadius: scale(4),
//         alignItems: "center",
//         justifyContent: "center",
//         marginBlock: verticalScale(0)
//     },

//     timeslotItem: {
//         height: verticalScale(40),
//         width: scale(152),
//         justifyContent: "center",
//         alignItems: "center",
//         borderRadius: scale(4),
//         borderWidth: moderateScale(1)
//     },
//     inputField: {
//         height: verticalScale(40),
//         borderRadius: scale(4),
//         borderWidth: moderateScale(1.5),
//         paddingHorizontal: scale(10),
//         // marginBottom: verticalScale(25),
//         fontSize: moderateScale(14)
//     },
//     inputFielderror: {

//     },
// });



// const CustomDay = ({ date, state, marking, onPress }) => {
//     const isSelected = marking?.selected;

//     const { colors } = useTheme()

//     return (
//         <Pressable onPress={() => onPress(date)}>
//             <View
//                 style={{
//                     width: moderateScale(35),   // Bigger width & height than default
//                     height: moderateScale(35),
//                     borderRadius: moderateScale(20),
//                     backgroundColor: isSelected ? Colors.modeColor.colorCode2 : 'transparent',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                 }}
//             >
//                 <CustomText
//                     style={{
//                         color: isSelected ? Colors.modeColor.colorCode : (state === 'disabled' ? '#D1D1D6' : colors.text),
//                         fontFamily: isSelected ? 'AirbnbCereal_W_Bd' : 'AirbnbCereal_W_Md',
//                         fontSize: moderateScale(16),
//                     }}
//                 >
//                     {date.day}
//                 </CustomText>
//             </View>
//         </Pressable>
//     );
// };




// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable } from 'react-native';
// import moment from 'moment';

// const AppointmentCalendar = () => {
// // Track the current month we're showing
// const [currentMonth, setCurrentMonth] = useState(moment());
// const [dates, setDates] = useState([]);

// useEffect(() => {
//     generateDatesForMonth(currentMonth);
// }, [currentMonth]);

// const generateDatesForMonth = (monthMoment) => {
//     // Get start and end of month
//     const startOfMonth = monthMoment.clone().startOf('month');
//     const endOfMonth = monthMoment.clone().endOf('month');
//     const daysInMonth = monthMoment.daysInMonth();

//     let tempDates = [];
//     for (let i = 0; i < daysInMonth; i++) {
//         const dayMoment = startOfMonth.clone().add(i, 'days');
//         tempDates.push({
//             dayName: dayMoment.format('ddd'), // Sun, Mon, ...
//             date: dayMoment.format('DD'), // 01, 02, ...
//             month: dayMoment.format('MMM'), // Jan, Feb, ...
//             year: dayMoment.format('YYYY'),
//             fullDate: dayMoment.format('YYYY-MM-DD'),
//             slots: Math.floor(Math.random() * 10)
//         });
//     }
//     setDates(tempDates);
// };

// const goToPrevMonth = () => {
//     setCurrentMonth((prev) => prev.clone().subtract(1, 'month'));
// };

// const goToNextMonth = () => {
//     setCurrentMonth((prev) => prev.clone().add(1, 'month'));
// };

//     return (
// <View style={styles.container}>
//     <Text style={styles.title}>Dynamic Monthly Calendar</Text>

//     <View style={styles.navButtons}>
//         <TouchableOpacity onPress={goToPrevMonth} style={styles.navButton}>
//             <Text style={styles.navButtonText}>Prev</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
//             <Text style={styles.navButtonText}>Next</Text>
//         </TouchableOpacity>
//     </View>

//     <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.weekContainer}
//     >
//         {dates.map((day) => (
//             <Pressable
//                 onPress={() => console.log(day)}
//                 key={day.fullDate} style={styles.dayBox}>
//                 <Text style={styles.dayName}>{day.dayName}</Text>
//                 <Text style={styles.date}>{day.date}</Text>
//                 <Text>{day.slots}</Text>
//             </Pressable>
//         ))}
//     </ScrollView>

//     {/* Current month and year below the calendar */}
//     <View style={styles.currentMonthContainer}>
//         <Text style={styles.currentMonthText}>
//             {currentMonth.format('MMMM YYYY')}
//         </Text>
//     </View>
// </View>
//     );
// };

// export default AppointmentCalendar;

// const styles = StyleSheet.create({
// container: {
//     marginTop: 50,
// },
// title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     alignSelf: 'center',
// },
// navButtons: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 10,
// },
// navButton: {
//     backgroundColor: '#007bff',
//     paddingVertical: 6,
//     paddingHorizontal: 15,
//     marginHorizontal: 10,
//     borderRadius: 5,
// },
// navButtonText: {
//     color: '#fff',
//     fontWeight: '600',
// },
// weekContainer: {
//     paddingHorizontal: 10,
// },
// dayBox: {
//     width: 60,
//     height: 90,
//     backgroundColor: '#f0f0f0',
//     marginHorizontal: 4,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 8,
// },
// dayName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
// },
// date: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginTop: 4,
//     color: '#000',
// },
// currentMonthContainer: {
//     marginTop: 15,
//     alignItems: 'center',
// },
// currentMonthText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
// },
// });


import { FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { moderateScale, scale, verticalScale } from 'react-native-size-matters'
import CustomText from '../../../components/CustomText'
import { useTheme } from '@react-navigation/native'
import { AddIcon, ArrowLeftIcon, ClockIcon, LeftIcon, RightIcon, SearchIcon } from '../../../constants/icons'
import CustomSecondaryText from '../../../components/CustomSecondaryText'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import CustomTabView from '../../../components/CustomTabView'
import { useGlobal } from '../../../context/GlobalContext'
import { Colors } from '../../../constants/Colors'
import moment from 'moment';


const AppointmentCalendar = () => {

    const pageData = [
        {
            title: "ChooseService",
        },
        {
            title: "ChooseBarber",
        },
        {
            title: "chooseDate"
        },
        {
            title: "AppointmentNote"
        }
    ]

    const { colors } = useTheme()

    const serviceData = [
        {
            id: '1',
            name: 'Hair Cut',
            description: 'The Best Hair Cutting In the Town',
            price: 75,
            duration: '15 mins',
        },
        {
            id: '2',
            name: 'Hair Cut',
            description: 'The Best Hair Cutting In the Town',
            price: 75,
            duration: '15 mins',
        },
        {
            id: '3',
            name: 'Hair Cut',
            description: 'The Best Hair Cutting In the Town',
            price: 75,
            duration: '15 mins',
        },
        {
            id: '4',
            name: 'Hair Cut',
            description: 'The Best Hair Cutting In the Town',
            price: 75,
            duration: '15 mins',
        },
        {
            id: '5',
            name: 'Hair Cut',
            description: 'The Best Hair Cutting In the Town',
            price: 75,
            duration: '15 mins',
        },
        {
            id: '6',
            name: 'Hair Cut',
            description: 'The Best Hair Cutting In the Town',
            price: 75,
            duration: '15 mins',
        },
    ];

    const barberData = [
        {
            name: "Michael",
            image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
            services: [
                { serviceName: "Cutting" },
                { serviceName: "Styling" },
                { serviceName: "Hair color" },
                { serviceName: "Hair Straightening" },
            ],
            queue: 2,
            nextPos: 3,
            est: 15
        },
    ];

    const [chooseService, serChooseService] = useState(true)
    const [chooseBarber, setChooseBarber] = useState(false)
    const [chooseDate, setChooseDate] = useState(false)
    const [appointmentNoteOpen, setAppointmentNoteOpen] = useState(false)

    const router = useRouter()

    const { selectedBarber, setSelectedBarber, selectedBarberServices, setSelectedBarberServices, joinModes } = useGlobal();

    // console.log("joinModes ", joinModes)

    // ========================


    // Track the current month we're showing
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

    const nextHandler = () => {
        if (chooseService) {
            serChooseService(false)
            setChooseBarber(true)
        } else if (chooseBarber) {
            setChooseBarber(false)
            setChooseDate(true)
        } else if (chooseDate) {
            setChooseDate(false)
            setAppointmentNoteOpen(true)
        } else {
            serChooseService(false)
            setChooseBarber(false)
            setChooseDate(false)
            setAppointmentNoteOpen(false)
            router.push("/joinConfirmation")
        }
    }

    return (
        <View style={{
            flex: 1, paddingHorizontal: scale(10),
            paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(5),
            backgroundColor: "#f7f7f7", gap: verticalScale(15)
        }}>
            {
                chooseService ? (
                    <ScrollView
                        style={styles.serviceContainer}
                        contentContainerStyle={{ gap: verticalScale(20), paddingBottom: verticalScale(40) }}
                        showsVerticalScrollIndicator={false}
                    >
                        <CustomText
                            style={{
                                fontSize: scale(22.5),
                            }}
                        >Choose Services?</CustomText>
                        <View style={styles.inputWrapper}>
                            <SearchIcon
                                size={scale(18)}
                                color={"rgba(0, 0, 0, 0.5)"}
                                style={styles.icon}
                            />
                            <TextInput
                                editable
                                placeholder="Search Your Services"
                                placeholderTextColor={colors.secondaryText}
                                style={[
                                    styles.inputField,
                                    {
                                        borderColor: Colors.modeColor.colorCode,
                                        backgroundColor: Colors.modeColor.colorCode3,
                                        fontFamily: "AirbnbCereal_W_Bk",
                                        color: colors.text,
                                        paddingLeft: scale(45), // leave space for icon
                                    }
                                ]}
                                value=""
                            />
                        </View>

                        {
                            serviceData.map((item, index) => {
                                return <ServiceItem key={index} item={item} index={index} />
                            })
                        }
                    </ScrollView>
                ) : (
                    <Pressable
                        onPress={() => {
                            serChooseService(true)
                            setChooseBarber(false)
                            setChooseDate(false)
                            setAppointmentNoteOpen(false)
                        }}
                        style={{
                            height: verticalScale(60),
                            backgroundColor: "#fff",
                            elevation: 2,
                            padding: scale(16),
                            marginTop: verticalScale(5),
                            borderRadius: scale(8),
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    ><CustomText>Services</CustomText></Pressable>
                )
            }
            {
                chooseBarber ? (
                    <ScrollView
                        style={styles.barberContainer}
                        contentContainerStyle={{ gap: verticalScale(20), paddingBottom: verticalScale(40) }}
                        showsVerticalScrollIndicator={false}
                    >
                        <CustomText
                            style={{
                                fontSize: scale(22.5),
                            }}
                        >Choose Barber?</CustomText>
                        <View style={styles.inputWrapper}>
                            <SearchIcon
                                size={scale(18)}
                                color={"rgba(0, 0, 0, 0.5)"}
                                style={styles.icon}
                            />
                            <TextInput
                                editable
                                placeholder="Search Your Barber"
                                placeholderTextColor={colors.secondaryText}
                                style={[
                                    styles.inputField,
                                    {
                                        borderColor: Colors.modeColor.colorCode,
                                        backgroundColor: Colors.modeColor.colorCode3,
                                        fontFamily: "AirbnbCereal_W_Bk",
                                        color: colors.text,
                                        paddingLeft: scale(45), // leave space for icon
                                    }
                                ]}
                                value=""
                            />


                        </View>

                        {
                            [0, 1, 2, 3, 4, 5, 6].map((item, index) => {
                                return <BarberItem key={index} />
                            })
                        }
                    </ScrollView>
                ) : (
                    <Pressable
                        onPress={() => {
                            serChooseService(false)
                            setChooseBarber(true)
                            setChooseDate(false)
                            setAppointmentNoteOpen(false)
                        }}
                        style={{
                            height: verticalScale(60),
                            backgroundColor: "#fff",
                            elevation: 2,
                            padding: scale(16),
                            marginTop: verticalScale(5),
                            borderRadius: scale(8),
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    ><CustomText>Barber</CustomText></Pressable>
                )
            }

            {
                chooseDate ? (
                    <ScrollView
                        style={styles.dateContainer}
                        contentContainerStyle={{ gap: verticalScale(15), paddingBottom: verticalScale(40) }}
                        showsVerticalScrollIndicator={false}
                    >
                        <CustomText
                            style={{
                                fontSize: scale(22.5),
                            }}
                        >Choose Date?</CustomText>

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
                                        <View
                                            key={index}
                                            style={{
                                                backgroundColor: Colors.modeColor.colorCode3,
                                                alignSelf: "flex-start",
                                                width: "31%",
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
                                        </View>
                                    )
                                })
                            }

                        </View>

                    </ScrollView>
                ) : (
                    <Pressable
                        onPress={
                            () => {
                                serChooseService(false)
                                setChooseBarber(false)
                                setChooseDate(true)
                                setAppointmentNoteOpen(false)
                            }
                        }
                        style={{
                            height: verticalScale(60),
                            backgroundColor: "#fff",
                            elevation: 2,
                            padding: scale(16),
                            marginTop: verticalScale(5),
                            borderRadius: scale(8),
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    ><CustomText>Select Date</CustomText></Pressable>
                )
            }

            {
                appointmentNoteOpen ? (
                    <ScrollView
                        style={styles.appointmentContainer}
                        contentContainerStyle={{ gap: verticalScale(15), flexGrow: 1, paddingBottom: verticalScale(0) }}
                        showsVerticalScrollIndicator={false}
                    >
                        <CustomText
                            style={{
                                fontSize: scale(22.5),
                            }}
                        >Appointment Note</CustomText>

                        <TextInput
                            style={{
                                flex: 1,
                                width: "100%",
                                borderWidth: scale(0.6),
                                borderColor: "#DDDDDD",
                                padding: scale(16),
                                borderRadius: scale(4),
                                textAlignVertical: "top",
                            }}
                            multiline
                            placeholder='Enter your appointment note'
                        />
                    </ScrollView>
                ) : (
                    <Pressable
                        onPress={
                            () => {
                                serChooseService(false)
                                setChooseBarber(false)
                                setChooseDate(false)
                                setAppointmentNoteOpen(true)
                            }
                        }
                        style={{
                            height: verticalScale(60),
                            backgroundColor: "#fff",
                            elevation: 2,
                            padding: scale(16),
                            marginTop: verticalScale(5),
                            borderRadius: scale(8),
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    ><CustomText>Appointment Note</CustomText></Pressable>
                )
            }


            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: verticalScale(10)
            }}>
                <CustomText>Clear All</CustomText>
                <Pressable
                    // onPress={() => {
                    //     // if (joinModes.appointmentType === "Book" && joinModes.appointment) {
                    //     //     router.push("/appointmentCalender")
                    //     // } else {
                    //     //     router.push("/joinConfirmation")
                    //     // }
                    //     router.push("/joinConfirmation")
                    // }}
                    onPress={nextHandler}
                    style={{
                        height: verticalScale(40),
                        width: scale(95),
                        borderRadius: scale(8),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.modeColor.colorCode
                    }}>
                    <CustomText style={{ color: "#fff", fontSize: scale(12) }}>Next</CustomText>
                </Pressable>
            </View>
        </View >
    )
}

export default AppointmentCalendar

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ensures the SafeAreaView takes full screen height
    },
    serviceContainer: {
        width: "100%",
        height: verticalScale(550),
        backgroundColor: "#fff",
        borderRadius: scale(16),
        padding: scale(16),
        elevation: 1,
        marginTop: verticalScale(5),
    },
    barberContainer: {
        width: "100%",
        height: verticalScale(550),
        backgroundColor: "#fff",
        borderRadius: scale(16),
        padding: scale(16),
        elevation: 1
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    icon: {
        position: 'absolute',
        left: scale(10),
        zIndex: 1,
    },
    inputField: {
        height: verticalScale(40),
        borderRadius: scale(8),
        borderWidth: scale(1),
        paddingHorizontal: scale(10),
        fontSize: scale(14),
    },
    serviceItem: {
        width: "100%",
        height: verticalScale(124),
        borderWidth: scale(0.5),
        borderColor: "#D2D2D2",
        borderRadius: scale(8),
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(10),
        backgroundColor: "#fff",
        elevation: 1
    },

    barberItem: {
        width: "100%",
        height: verticalScale(145),
        borderWidth: scale(0.5),
        borderColor: "#D2D2D2",
        borderRadius: scale(8),
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(10),
        backgroundColor: "#fff",
        elevation: 1
    },

    dateContainer: {
        width: "100%",
        height: verticalScale(550),
        backgroundColor: "#fff",
        borderRadius: scale(16),
        padding: scale(16),
        elevation: 1
    },



    container: {
        // marginTop: 50,
    },
    title: {
        // fontSize: 22,
        // fontWeight: 'bold',
        // marginBottom: 10,
        // alignSelf: 'center',
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
    navButtonText: {
        color: '#fff',
        fontWeight: '600',
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

    appointmentContainer: {
        width: "100%",
        height: verticalScale(550),
        backgroundColor: "#fff",
        borderRadius: scale(16),
        padding: scale(16),
        elevation: 1
    }
})

const ServiceItem = ({ item, index }) => (
    <View key={index} style={styles.serviceItem}>
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <CustomText style={{ fontSize: scale(13) }}>{item.name}</CustomText>
            <Pressable
                style={{
                    height: scale(32),
                    width: scale(32),
                    borderRadius: scale(30),
                    backgroundColor: Colors.modeColor.colorCode,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <AddIcon color="#fff" />
            </Pressable>
        </View>
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
                {item.description}
            </CustomText>

            <View style={{ gap: scale(6) }}>
                <CustomText style={{ textAlign: 'center', fontSize: moderateScale(17) }}>
                    € {item.price}
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
                        {item.duration}
                    </CustomSecondaryText>
                </View>
            </View>
        </View>
    </View>
);


const BarberItem = ({ item, index }) => (
    <View key={index} style={styles.barberItem}>
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
    </View>
)