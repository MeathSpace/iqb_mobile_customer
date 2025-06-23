import { Alert, Button, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomScrollView from '../../components/CustomScrollView'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import ProgressHeader from '../../components/ProgressHeader'
import CustomText from '../../components/CustomText'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import DropDownPicker from 'react-native-dropdown-picker';
import { CalendarIcon, ErrorIcon } from '../../constants/icons'
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from '@/constants/Colors';

import PhoneInput
    from 'react-native-phone-input';
import CountryPicker, { DARK_THEME }
    from 'react-native-country-picker-modal';
import { useTheme } from '@react-navigation/native';

const personalInfo = () => {

    const { email } = useLocalSearchParams();

    console.log("Email from params", email)

    const colorScheme = useColorScheme()

    const { colors } = useTheme()

    const router = useRouter()

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [genderOpen, setGenderOpen] = useState(false)
    const [gender, setGender] = useState("Male");
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState("");

    const [calenderModal, setCalenderModal] = useState(false);
    // const [selectedCountry, setSelectedCountry] = useState({});

    const [genderItems, setGenderItems] = useState([
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ]);

    // console.log("sdv", date)

    //Error States

    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [phoneNumberError, setPhoneNumberError] = useState("");
    const [dateOfBirthError, setDateOfBirthError] = useState("");

    const onChange = (event, selectedDate) => {
        setCalenderModal(false);
        if (event.type === "set" && selectedDate) {
            setDate(new Date(selectedDate));
            setDateOfBirthError("");

            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // month is 0-indexed
            const day = String(selectedDate.getDate()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}`;

            setSelectedDate(formattedDate);
        }
    };

    const [progressOne, setProgressOne] = useState(0.5)
    const [progressTwo, setProgressTwo] = useState(0)
    const [progressThree, setProgressThree] = useState(0)


    const phoneRef = useRef(null);
    const [phoneNumber, setPhoneNumber] = useState('');

    const [selectedCountry, setSelectedCountry] =
        useState({ "callingCode": ["44"], "cca2": "GB", "currency": ["GBP"], "flag": "flag-gb", "name": "United Kingdom", "region": "Europe", "subregion": "Northern Europe" });
    const [countryPickerVisible, setCountryPickerVisible] =
        useState(false);

    const onSelectCountry = (country) => {
        setSelectedCountry(country);
        setCountryPickerVisible(false);
    };


    const toggleCountryPicker = () => {
        setCountryPickerVisible(!countryPickerVisible);
    };

    useEffect(() => {
        if (selectedCountry && phoneRef.current) {
            phoneRef.current.selectCountry(selectedCountry.cca2.toLowerCase());
        }
    }, [selectedCountry]);

    const phoneNumberHandler = (phoneNumber) => {
        const isValid = phoneRef.current?.isValidNumber();
        if (isValid) {
            setPhoneNumber(phoneNumber);
            setPhoneNumberError("")
            console.log("Valid ", phoneNumber)
        } else {
            setPhoneNumberError("Invalid phone number");
            console.log("Invalid ", phoneNumber)
        }
    }


    const saveHandler = () => {
        if (!firstName) {
            setFirstNameError("First name is required");
            return;
        } else if (!lastName) {
            setLastNameError("Last name is required");
            return;
        } else if (!phoneNumber) {
            setPhoneNumberError("Phone number is required");
            return;
        } else if (!selectedDate) {
            setDateOfBirthError("Date of birth is required");
            return;
        }

        router.push({
            pathname: "/passwordConfirmation",
            params: {
                email,
                firstName,
                lastName,
                gender,
                phoneNumber,
                selectedDate
            }
        });
    }

    return (
        <CustomScrollView>

            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
                setGenderOpen(false);
            }}>

                <View
                    style={{
                        flex: 1,
                        justifyContent: "space-around",
                        gap: verticalScale(20)
                    }}
                >

                    <ProgressHeader
                        progressOne={progressOne}
                        progressTwo={progressTwo}
                        progressThree={progressThree}
                    />

                    <View>
                        <CustomText style={styles.heading}>
                            It's time to create a profile !
                        </CustomText>

                        <CustomSecondaryText>
                            Tell us little more about yourself
                        </CustomSecondaryText>
                    </View>

                    <View style={styles.inputWrapper}>
                        <CustomText>First Name</CustomText>

                        <TextInput
                            editable
                            placeholder="Enter your first name"
                            placeholderTextColor={colors.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, {
                                backgroundColor: "#0BA3AD1A", fontFamily: "AirbnbCereal_W_Bk", color: colors.text
                            }]}
                            onChangeText={(text) => {
                                setFirstNameError("")
                                setFirstName(text)
                            }}
                            value={firstName}
                        />

                        {
                            firstNameError && (
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(5),
                                }}>
                                    <ErrorIcon color='red' size={scale(16)} />
                                    <CustomText style={{ fontSize: scale(12), color: "red" }}>{firstNameError}</CustomText>
                                </View>
                            )
                        }

                    </View>

                    <View style={styles.inputWrapper}>
                        <CustomText>Last Name</CustomText>

                        <TextInput
                            editable
                            placeholder="Enter your last name"
                            placeholderTextColor={colors.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, {
                                backgroundColor: "#0BA3AD1A",
                                fontFamily: "AirbnbCereal_W_Bk", color: colors.text
                            }]}
                            onChangeText={(text) => {
                                setLastNameError("")
                                setLastName(text)
                            }}
                            value={lastName}
                        />

                        {
                            lastNameError && (
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(5),
                                }}>
                                    <ErrorIcon color='red' size={scale(16)} />
                                    <CustomText style={{ fontSize: scale(12), color: "red" }}>{lastNameError}</CustomText>
                                </View>
                            )
                        }
                    </View>

                    <View style={styles.inputWrapper}>
                        <CustomText>Select Gender</CustomText>
                        <DropDownPicker
                            listMode="SCROLLVIEW"
                            // dropDownMaxHeight={240}
                            open={genderOpen}
                            value={gender}
                            items={genderItems}
                            setOpen={setGenderOpen}
                            setValue={setGender}
                            setItems={setGenderItems}
                            itemSeparator={true}
                            itemSeparatorStyle={{
                                backgroundColor: "#0BA3AD1A"
                            }}
                            placeholder="Select a gender"
                            style={[
                                styles.dropdown,
                                {
                                    borderColor: "transparent",
                                    backgroundColor: "#0BA3AD1A",
                                },
                            ]}
                            dropDownContainerStyle={[
                                styles.dropdownContainer,
                                {
                                    borderColor: "#0BA3AD1A",
                                    backgroundColor: colors.card,
                                }
                            ]}
                            textStyle={{
                                fontSize: moderateScale(14),
                                fontFamily: 'AirbnbCereal_W_Bk',
                                color: colors.text
                            }}
                            listItemLabelStyle={{
                                fontSize: moderateScale(14),
                                fontFamily: 'AirbnbCereal_W_Bk',
                                color: colors.text,
                            }}
                            arrowIconStyle={{
                                tintColor: colors.text,
                            }}
                            tickIconStyle={{
                                tintColor: "#00A36C"
                            }}
                        />
                    </View>


                    <View style={styles.inputWrapper}>
                        <CustomText>Mobile Number</CustomText>
                        <PhoneInput
                            ref={phoneRef}
                            initialCountry={selectedCountry.cca2.toLowerCase()}
                            value={phoneNumber}
                            onChangePhoneNumber={(number) => phoneNumberHandler(number)}
                            onPressFlag={toggleCountryPicker}
                            textStyle={{ color: colors.text, fontSize: moderateScale(14) }}
                            style={[styles.inputField, {
                                backgroundColor: "#0BA3AD1A", fontFamily: "AirbnbCereal_W_Bk", color: colors.text
                            }]}
                        />

                        {
                            phoneNumberError && (
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(5),
                                }}>
                                    <ErrorIcon color='red' size={scale(16)} />
                                    <CustomText style={{ fontSize: scale(12), color: "red" }}>{phoneNumberError}</CustomText>
                                </View>
                            )
                        }

                        {countryPickerVisible && (
                            <CountryPicker
                                withFilter={true}
                                withFlagButton={true}
                                withFlag={true}
                                withCountryNameButton={false}
                                withEmoji={true}
                                withCallingCode
                                onSelect={onSelectCountry}
                                onClose={() => setCountryPickerVisible(false)}
                                visible={countryPickerVisible}
                                containerButtonStyle={styles.countryPickerButton}
                                theme={{
                                    ...((colorScheme === 'dark' && DARK_THEME) || {}),
                                    fontFamily: 'AirbnbCereal_W_Bk',
                                }}
                            />
                        )}
                    </View>

                        

                    <View style={[styles.inputWrapper, { position: "relative" }]}>
                        <CustomText>Date of Birth</CustomText>

                        <Pressable
                            style={[
                                false ? styles.inputFielderror : styles.inputDateField,
                                {
                                    // borderColor: colors.border,
                                    backgroundColor: "#0BA3AD1A",
                                    fontFamily: "AirbnbCereal_W_Bk",
                                    color: colors.text,
                                    justifyContent: "center", // Ensures CalendarIcon stays aligned
                                }
                            ]}
                            onPress={() => setCalenderModal(true)}
                        >
                            {!calenderModal && !selectedDate && <CustomText style={{ color: colors.secondaryText, fontFamily: "AirbnbCereal_W_Bk" }}>YYYY-MM-DD</CustomText>}
                            {!calenderModal && selectedDate && <CustomText style={{ fontFamily: "AirbnbCereal_W_Bk" }}>{selectedDate}</CustomText>}
                            <CalendarIcon style={[styles.dateIcon, { color: colors.text }]} />
                        </Pressable>

                        {
                            dateOfBirthError && (
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(5),
                                }}>
                                    <ErrorIcon color='red' size={scale(16)} />
                                    <CustomText style={{ fontSize: scale(12), color: "red", }}>{dateOfBirthError}</CustomText>
                                </View>
                            )
                        }

                        {calenderModal && (
                            <View style={{ position: "absolute", top: verticalScale(34), left: 0, zIndex: 100 }}>
                                <DateTimePicker
                                    mode="date"
                                    maximumDate={new Date()}
                                    value={date}
                                    display="default"
                                    accentColor={Colors.modeColor.colorCode}
                                    onChange={onChange}
                                />
                            </View>
                        )}
                    </View>

                    <Pressable
                        onPress={() => saveHandler()}
                        style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
                        <CustomText style={{ color: "#fff" }}>Save & Next</CustomText>
                    </Pressable>

                </View>

            </TouchableWithoutFeedback>

        </CustomScrollView >
    )
}

export default personalInfo

const styles = StyleSheet.create({
    heading: {
        fontFamily: "AirbnbCereal_W_Bd",
        fontSize: moderateScale(22),
        marginBottom: verticalScale(10)
    },

    inputWrapper: {
        gap: verticalScale(10),
    },

    inputField: {
        height: verticalScale(40),
        borderRadius: scale(4),
        paddingHorizontal: scale(10),
        fontSize: moderateScale(14)
    },
    inputDateField: {
        height: verticalScale(40),
        borderRadius: scale(4),
        // borderWidth: moderateScale(1.5),
        paddingHorizontal: scale(10),
        fontSize: moderateScale(14),
        position: "relative"
    },
    dateIcon: {
        position: "absolute",
        right: scale(5),
        top: verticalScale(18),
        transform: [{ translateY: -(moderateScale(24) / moderateScale(2)) }]
    },
    inputFielderror: {

    },
    dropdown: {
        height: verticalScale(40),
        borderRadius: scale(4),
        borderWidth: moderateScale(1.5),
        paddingHorizontal: scale(10),
        zIndex: 100
    },
    dropdownContainer: {
        borderWidth: moderateScale(1.5),
        zIndex: 100
    },

    submitButton: {
        width: '100%',
    },
    btn: {
        height: verticalScale(40),
        borderRadius: scale(4),
        alignItems: "center",
        justifyContent: "center",
        marginBlock: verticalScale(0)
    },
    modalWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    modalContainer: {
        height: "50%",
        width: "50%",
        backgroundColor: "red"
    }
})