import { Alert, BackHandler, Button, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomScrollView from '../../components/CustomScrollView'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import ProgressHeader from '../../components/ProgressHeader'
import CustomText from '../../components/CustomText'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import DropDownPicker from 'react-native-dropdown-picker';
import { ArrowDownIcon, CalendarIcon, ErrorIcon } from '../../constants/icons'
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from '@/constants/Colors';

import PhoneInput
    from 'react-native-phone-input';
import CountryPicker, { DARK_THEME }
    from 'react-native-country-picker-modal';
import { useNavigation, usePreventRemove, useTheme } from '@react-navigation/native';

const personalInfo = () => {

    const { email, authType } = useLocalSearchParams();

    // console.log("email ", email)
    // console.log("authType ", authType ?? "none")

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

    const [tempDate, setTempDate] = useState(new Date());

    const onChange = (event, selectedDate) => {
        // setCalenderModal(false);
        if (Platform.OS === "android") {
            if (event.type === "set" && selectedDate) {
                setDate(new Date(selectedDate));
                setDateOfBirthError("");

                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // month is 0-indexed
                const day = String(selectedDate.getDate()).padStart(2, '0');

                const formattedDate = `${year}-${month}-${day}`;

                setSelectedDate(formattedDate);
            }

            setCalenderModal(false);
        } else {
            // IOS CODE AND SAVE IN TEMO DATE
            if (selectedDate) {
                setTempDate(selectedDate);
            }

        }

    };

    const onDoneIOS = () => {
        setDate(tempDate);
        setSelectedDate(formatDate(tempDate));
        setDateOfBirthError("");
        setCalenderModal(false);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // console.log("selectedDate ", selectedDate)

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

    // const phoneNumberHandler = (phoneNumber) => {

    //     const isValid = phoneRef.current?.isValidNumber();
    //     if (isValid) {
    //         setPhoneNumber(phoneNumber);
    //         setPhoneNumberError("")
    //     } else {
    //         setPhoneNumberError("Invalid phone number");
    //     }
    // }

    const [inValid, setInValid] = useState(false)

    const phoneNumberHandler = (phoneNumber) => {
        const isValid = phoneRef.current?.isValidNumber();

        // Sync country based on current input
        const isoCode = phoneRef.current?.getISOCode(); // 'in', 'gb', etc.
        if (isoCode && isoCode.toUpperCase() !== selectedCountry.cca2) {
            setSelectedCountry(prev => ({
                ...prev,
                cca2: isoCode.toUpperCase(),
                callingCode: [phoneRef.current?.getCountryCode() || ""],
            }));
        }

        if (isValid) {
            setPhoneNumber(phoneNumber);
            setPhoneNumberError("");
            setInValid(false)
        } else {
            setPhoneNumber(phoneNumber); // still keep the input
            setPhoneNumberError("Invalid phone number");
            setInValid(true)
        }
    };


    const saveHandler = () => {
        if (!firstName) {
            setFirstNameError("First name is required");
            return;
        } else if (firstName.length < 2) {
            setFirstNameError("First name must be at least 2 characters");
            return;
        } else if (firstName.length > 20) {
            setFirstNameError("First name must be at most 20 characters");
            return;
        }

        if (!lastName) {
            setLastNameError("Last name is required");
            return;
        } else if (lastName.length < 2) {
            setLastNameError("Last name must be at least 2 characters");
            return;
        } else if (lastName.length > 20) {
            setLastNameError("Last name must be at most 20 characters");
            return;
        }

        if (!phoneNumber) {
            setPhoneNumberError("Phone number is required");
            return;
        }

        if (inValid) {
            setPhoneNumberError("Invalid phone number");
            return;
        }

        if (!selectedDate) {
            setDateOfBirthError("Date of birth is required");
            return;
        }

        // const mobileNumber = phoneNumber.replace("+", "")
        // const updatedNumber = mobileNumber.startsWith(selectedCountry?.callingCode[0]) ? mobileNumber.slice(selectedCountry?.callingCode[0].length) : mobileNumber

        const currentCountryCode = phoneRef.current?.getCountryCode();
        const mobileNumber = phoneNumber.replace("+", "");

        // fallback logic
        const finalCallingCode = currentCountryCode || selectedCountry?.callingCode?.[0] || "";
        const updatedNumber = mobileNumber.startsWith(finalCallingCode)
            ? mobileNumber.slice(finalCallingCode.length)
            : mobileNumber;


        if (authType === "google") {
            router.push({
                pathname: "/verification",
                params: {
                    email,
                    firstName,
                    lastName,
                    gender,
                    phoneNumber: updatedNumber,
                    callingCode: selectedCountry?.callingCode[0],
                    selectedDate,
                    authType
                }
            });
        } else {
            router.push({
                pathname: "/passwordConfirmation",
                params: {
                    email,
                    firstName,
                    lastName,
                    gender,
                    phoneNumber: updatedNumber,
                    callingCode: selectedCountry?.callingCode[0],
                    selectedDate
                }
            });
        }

    }

    const [openGenderDrop, setOpenGenderDrop] = useState(false)

    const hasUnsavedChanges = true;

    usePreventRemove(
        hasUnsavedChanges, // This boolean determines if removal should be prevented
        ({ data }) => {
            // The action is still passed, but we're choosing not to dispatch it,
            // effectively making "going back" impossible through these means.
            Alert.alert(
                'Cannot Go Back',
                'You cannot go back during the signup flow. Please complete the current step.',
                [{ text: 'OK', onPress: () => null }] // Only an 'OK' button
            );
        }
    );


    return (
        <CustomScrollView>

            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
                setOpenGenderDrop(false)
                setGenderOpen(false);
            }}>

                <View
                    style={{
                        flex: 1,
                        justifyContent: "space-around",
                        gap: verticalScale(20)
                    }}
                >

                    {authType === "google" ? (
                        <ProgressHeader
                            progressOne={0.5}
                            progressTwo={progressTwo}
                            authType={"google"}
                        />
                    ) : (
                        <ProgressHeader
                            progressOne={progressOne}
                            progressTwo={progressTwo}
                            progressThree={progressThree}
                        />
                    )}

                    {/* <View>
                        <CustomText>Here in the sign up flow user cannot go back on any page</CustomText>
                    </View> */}

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
                                // backgroundColor: "#0BA3AD1A", 
                                borderWidth: scale(1),
                                borderColor: "gray",
                                fontFamily: "AirbnbCereal_W_Bk", color: colors.text
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
                                // backgroundColor: "#0BA3AD1A",
                                borderWidth: scale(1),
                                borderColor: "gray",
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

                    <View
                        style={[styles.inputWrapper, {
                            zIndex: 10
                        }]}
                    >
                        <CustomText>Gender</CustomText>

                        <Pressable
                            onPress={() => setOpenGenderDrop((prev) => !prev)}
                            style={[false ? styles.inputFielderror : styles.inputField, {
                                // backgroundColor: "#0BA3AD1A",
                                borderWidth: scale(1),
                                borderColor: "gray",
                                fontFamily: "AirbnbCereal_W_Bk", color: colors.text,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                position: "relative"
                            }]}
                        >
                            <CustomText
                                style={{
                                    fontFamily: "AirbnbCereal_W_Bk"
                                }}
                            >{gender}</CustomText>

                            <View><ArrowDownIcon size={scale(16)} color={colors.text} /></View>

                            {
                                openGenderDrop && (
                                    <View
                                        style={{
                                            position: "absolute",
                                            top: verticalScale(50),
                                            backgroundColor: colors.card, // use themed color
                                            left: 0,
                                            right: 0,
                                            borderRadius: scale(4),
                                            zIndex: 999, // Higher than 100 to ensure it's above everything
                                            elevation: 5, // Android support
                                            paddingVertical: scale(8), // spacing
                                            shadowColor: "#000", // iOS support
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.1,
                                            shadowRadius: 4,
                                        }}
                                    >
                                        {
                                            ["Male", "Female", "Other"].map((item, index) => (
                                                <Pressable
                                                    key={index}
                                                    onPress={() => {
                                                        setGender(item);
                                                        setOpenGenderDrop(false); // close dropdown after selection
                                                    }}
                                                    style={{
                                                        paddingVertical: scale(8),
                                                        paddingHorizontal: scale(12),
                                                        backgroundColor: colors.card, // solid background
                                                    }}
                                                >
                                                    <CustomText style={{ color: colors.text, fontFamily: "AirbnbCereal_W_Bk" }}>
                                                        {item}
                                                    </CustomText>
                                                </Pressable>
                                            ))
                                        }
                                    </View>
                                )
                            }


                        </Pressable>
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
                                // backgroundColor: "#0BA3AD1A", 
                                borderWidth: scale(1),
                                borderColor: "gray",
                                fontFamily: "AirbnbCereal_W_Bk", color: colors.text
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
                                    // backgroundColor: "#0BA3AD1A",
                                    borderWidth: scale(1),
                                    borderColor: "gray",
                                    fontFamily: "AirbnbCereal_W_Bk",
                                    color: colors.text,
                                    justifyContent: "center", // Ensures CalendarIcon stays aligned
                                }
                            ]}
                            onPress={() => {
                                setSelectedDate("")
                                setDateOfBirthError("")
                                setCalenderModal(true)
                            }}
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

                        {
                            Platform.OS === "android" ? (
                                calenderModal && (
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
                                )
                            ) : (
                                <Modal
                                    transparent={true}
                                    visible={calenderModal}
                                >
                                    <Pressable
                                        onPress={() => setCalenderModal(false)}
                                        style={{
                                            flex: 1,
                                            backgroundColor: "rgba(0,0,0, 0.8)",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            position: "relative",
                                            padding: scale(20)
                                        }}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: colors.background,
                                                borderColor: colors.border,
                                                borderWidth: scale(1),
                                                padding: scale(10),
                                                borderRadius: scale(10),
                                                // iOS shadow
                                                shadowColor: "#000",
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 2,
                                                },
                                                shadowOpacity: 0.1,
                                                shadowRadius: 4,
                                            }}
                                        >
                                            <DateTimePicker
                                                mode="date"
                                                maximumDate={new Date()}
                                                value={date}
                                                display="inline"
                                                accentColor={Colors.modeColor.colorCode}
                                                onChange={onChange}
                                            />
                                        </View>

                                        <View
                                            style={{
                                                width: "100%",
                                                position: "absolute",
                                                bottom: verticalScale(40),
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            <Pressable
                                                onPress={() => {
                                                    setCalenderModal(false)
                                                }}
                                                style={{
                                                    height: verticalScale(40),
                                                    borderRadius: scale(4),
                                                    width: "45%",
                                                    marginHorizontal: "auto",
                                                    backgroundColor: "#E11D48",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >
                                                <CustomText style={{ color: "#fff" }}>Cancel</CustomText>
                                            </Pressable>

                                            <Pressable
                                                onPress={onDoneIOS}
                                                style={{
                                                    height: verticalScale(40),
                                                    borderRadius: scale(4),
                                                    width: "45%",
                                                    marginHorizontal: "auto",
                                                    backgroundColor: Colors.modeColor.colorCode,
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            ><CustomText style={{ color: "#fff" }}>Done</CustomText>
                                            </Pressable>
                                        </View>


                                    </Pressable>
                                </Modal>
                            )
                        }


                    </View>

                    <Pressable
                        onPress={() => saveHandler()}
                        style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>
                        <CustomText style={{ color: "#fff" }}>Save & Next</CustomText>
                    </Pressable>

                </View>

            </TouchableWithoutFeedback>

        </CustomScrollView>
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
        // zIndex: 100
    },
    dropdownContainer: {
        borderWidth: moderateScale(1.5),
        // zIndex: 100
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













{/* <View style={styles.inputWrapper}>
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
                    </View> */}