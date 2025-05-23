import { Pressable, StyleSheet, Text, View } from 'react-native';
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

    return (
        <CustomView style={{ justifyContent: "space-between" }}>
            <View>
                <View>
                    <CustomText style={styles.heading}>
                        Choose Appointment Date
                    </CustomText>

                    <CustomSecondaryText>
                        Please select a preferred date from the calendar below
                    </CustomSecondaryText>
                </View>

                <View style={styles.calendarWrapper}>
                    <Calendar
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
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#8E8E93',
                            selectedDayBackgroundColor: '#007AFF',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#007AFF',
                            dayTextColor: '#1C1C1E',
                            textDisabledColor: '#D1D1D6',
                            dotColor: '#007AFF',
                            selectedDotColor: '#ffffff',
                            arrowColor: '#007AFF',
                            monthTextColor: '#1C1C1E',
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
                                return <CalenderLeftIcon size={moderateScale(16)} />
                            } else {
                                return <CalenderRightIcon size={moderateScale(16)} />
                            }
                        }}
                    />
                </View>
            </View>

            <Pressable
                onPress={() => router.push("/joinConfirmation")}
                style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
                <CustomText style={{ color: "#fff" }}>Continue</CustomText>
            </Pressable>
        </CustomView>
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
        marginVertical: verticalScale(20),
        backgroundColor: '#fff',
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
});



const CustomDay = ({ date, state, marking, onPress }) => {
    const isSelected = marking?.selected;

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
                <Text
                    style={{
                        color: isSelected ? Colors.modeColor.colorCode : (state === 'disabled' ? '#D1D1D6' : '#1C1C1E'),
                        fontFamily: isSelected ? 'AirbnbCereal_W_Bd' : 'AirbnbCereal_W_Md',
                        fontSize: moderateScale(16),
                    }}
                >
                    {date.day}
                </Text>
            </View>
        </Pressable>
    );
};