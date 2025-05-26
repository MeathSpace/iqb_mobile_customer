import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState, version } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { useRouter } from 'expo-router';
import CustomText from '../../components/CustomText';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { CalenderLeftIcon, CalenderRightIcon } from '../../constants/icons';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../constants/Colors';
import { Shadow } from 'react-native-shadow-2';
import CustomView from '../../components/CustomView';
import CustomSecondaryText from '../../components/CustomSecondaryText';
import { useTheme } from '@react-navigation/native';

LocaleConfig.locales['en'] = {
    monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ],
    monthNamesShort: [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ],
    dayNames: [
        'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
    ],
    dayNamesShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    today: "Today"
};

// Set English as the default locale
LocaleConfig.defaultLocale = 'en';

const AppointmentCalendar = () => {
    const { joinModes } = useGlobal();
    const router = useRouter();

    const [selected, setSelected] = useState('');

    const timeslotData = [
        {
            id: '1',
            startTime: '09:00 AM',
            endTime: '09:30 AM',
            isBooked: false
        },
        {
            id: '2',
            startTime: '09:30 AM',
            endTime: '10:00 AM',
            isBooked: true
        },
        {
            id: '3',
            startTime: '10:00 AM',
            endTime: '10:30 AM',
            isBooked: false
        },
        {
            id: '4',
            startTime: '10:30 AM',
            endTime: '11:00 AM',
            isBooked: true
        },
        {
            id: '5',
            startTime: '11:00 AM',
            endTime: '11:30 AM',
            isBooked: false
        },
        {
            id: '6',
            startTime: '11:30 AM',
            endTime: '12:00 PM',
            isBooked: false
        },
        {
            id: '7',
            startTime: '09:00 AM',
            endTime: '09:30 AM',
            isBooked: false
        },
        {
            id: '8',
            startTime: '09:30 AM',
            endTime: '10:00 AM',
            isBooked: true
        },
    ];

    const chunkArray = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const timeSlotsChunkData = chunkArray(timeslotData, 3);

    const [selectedTimeslot, setSelectedTimeslot] = useState("")

    const { colors } = useTheme()

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
            keyboardVerticalOffset={scale(Platform.OS === "ios" ? 0 : 0)} // adjust if needed
        >
            <CustomView
                style={{
                    justifyContent: "space-between"
                }}>
                <ScrollView
                    style={{ flexGrow: 1 }}
                    contentContainerStyle={{ paddingHorizontal: scale(2), gap: verticalScale(15) }}
                    showsVerticalScrollIndicator={false}>
                    <View>
                        <CustomText style={styles.heading}>
                            Choose Appointment Date
                        </CustomText>

                        <CustomSecondaryText>
                            Please select a preferred date from the calendar below
                        </CustomSecondaryText>
                    </View>

                    <View style={[styles.calendarWrapper, { backgroundColor: colors.card }]}>
                        <Calendar
                            key={colors.card}
                            onDayPress={day => setSelected(day.dateString)}
                            hideExtraDays={true}
                            markedDates={{
                                [selected]: {
                                    selected: true,
                                    disableTouchEvent: true,
                                    selectedDayTextColor: "#fff",
                                    selectedDayBackgroundColor: Colors.modeColor.colorCode
                                }
                            }}
                            theme={{
                                backgroundColor: colors.card,
                                calendarBackground: colors.card,
                                textSectionTitleColor: '#8E8E93',
                                selectedDayBackgroundColor: '#007AFF',
                                textDisabledColor: '#D1D1D6',
                                dotColor: '#007AFF',
                                selectedDotColor: '#ffffff',
                                monthTextColor: colors.text,
                                indicatorColor: '#007AFF',
                                textMonthFontFamily: 'AirbnbCereal_W_Bd',
                                textDayHeaderFontWeight: 600,
                                textMonthFontSize: moderateScale(16),
                                textDayHeaderFontSize: moderateScale(12),
                            }}

                            dayComponent={({ date, state, marking, onPress }) => (
                                <CustomDay
                                    date={date}
                                    state={state}
                                    marking={marking}
                                    onPress={onPress}
                                />
                            )}

                            renderArrow={(direction) => {
                                // Customize left and right arrows
                                if (direction === "left") {
                                    return <CalenderLeftIcon size={moderateScale(16)} color={colors.text} />
                                } else {
                                    return <CalenderRightIcon size={moderateScale(16)} color={colors.text} />
                                }
                            }}
                        />
                    </View>

                    <View style={{ gap: verticalScale(10) }}>
                        <CustomText>
                            Select Timeslots
                        </CustomText>

                        <View>
                            {timeSlotsChunkData.length === 0 ? (
                                <View
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        paddingVertical: scale(20),
                                        backgroundColor: Colors.modeColor.colorCode2,
                                        borderRadius: scale(4),
                                    }}
                                >
                                    <CustomSecondaryText
                                        style={{ color: Colors.modeColor.colorCode, fontSize: scale(14) }}
                                    >
                                        No time slots available.
                                    </CustomSecondaryText>
                                </View>
                            ) : (
                                timeSlotsChunkData.map((row, rowIndex) => (
                                    <Pressable
                                        key={rowIndex}
                                        style={{
                                            flexDirection: "row",
                                            gap: scale(10),
                                            marginBottom:
                                                rowIndex !== timeSlotsChunkData.length - 1 && scale(10),
                                        }}
                                    >
                                        {row.map((slot, index) => (
                                            <Pressable
                                                onPress={() => {
                                                    if (!slot.isBooked) {
                                                        setSelectedTimeslot(slot.id);
                                                    }
                                                }}
                                                key={index}
                                                style={[
                                                    styles.timeslotItem,
                                                    {
                                                        backgroundColor: Colors.modeColor.colorCode2,
                                                        borderColor:
                                                            selectedTimeslot === slot.id
                                                                ? Colors.modeColor.colorCode
                                                                : "transparent",
                                                    },
                                                ]}
                                            >
                                                <CustomSecondaryText
                                                    style={{
                                                        color: slot.isBooked
                                                            ? colors.secondaryText
                                                            : Colors.modeColor.colorCode,
                                                    }}
                                                >
                                                    {`${slot.startTime}`}
                                                </CustomSecondaryText>
                                            </Pressable>
                                        ))}
                                    </Pressable>
                                ))
                            )}
                        </View>

                    </View>

                    <View style={{ gap: verticalScale(10), marginBottom: verticalScale(20) }}>
                        <CustomText>
                            Write your appointment note
                        </CustomText>

                        <TextInput
                            editable
                            placeholder="Enter your appointment note"
                            placeholderTextColor={colors.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, { borderColor: colors.border, backgroundColor: colors.card, fontFamily: "AirbnbCereal_W_Bk", color: colors.text }]}
                            // onChangeText={(text) => {
                            //     setEmailError("")
                            //     setEmail(text)
                            // }}
                            // value={email}
                            value=''
                        />
                    </View>

                    <Pressable
                        onPress={() => router.push("/joinConfirmation")}
                        style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
                        <CustomText style={{ color: "#fff" }}>Continue</CustomText>
                    </Pressable>
                </ScrollView>

            </CustomView>
        </KeyboardAvoidingView>
    );
};

export default AppointmentCalendar;

const styles = StyleSheet.create({

    heading: {
        fontFamily: "AirbnbCereal_W_Bd",
        fontSize: moderateScale(22),
        marginBottom: verticalScale(10)
    },


    calendarWrapper: {
        borderRadius: moderateScale(6),
        padding: scale(5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,

        elevation: 3
    },
    btn: {
        height: verticalScale(40),
        borderRadius: scale(4),
        alignItems: "center",
        justifyContent: "center",
        marginBlock: verticalScale(0)
    },

    timeslotItem: {
        height: verticalScale(40),
        width: scale(152),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: scale(4),
        borderWidth: moderateScale(1)
    },
    inputField: {
        height: verticalScale(40),
        borderRadius: scale(4),
        borderWidth: moderateScale(1.5),
        paddingHorizontal: scale(10),
        // marginBottom: verticalScale(25),
        fontSize: moderateScale(14)
    },
    inputFielderror: {

    },
});



const CustomDay = ({ date, state, marking, onPress }) => {
    const isSelected = marking?.selected;

    const { colors } = useTheme()

    return (
        <Pressable onPress={() => onPress(date)}>
            <View
                style={{
                    width: moderateScale(35),   // Bigger width & height than default
                    height: moderateScale(35),
                    borderRadius: moderateScale(20),
                    backgroundColor: isSelected ? Colors.modeColor.colorCode2 : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CustomText
                    style={{
                        color: isSelected ? Colors.modeColor.colorCode : (state === 'disabled' ? '#D1D1D6' : colors.text),
                        fontFamily: isSelected ? 'AirbnbCereal_W_Bd' : 'AirbnbCereal_W_Md',
                        fontSize: moderateScale(16),
                    }}
                >
                    {date.day}
                </CustomText>
            </View>
        </Pressable>
    );
};