import { Alert, Button, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomView from '../components/CustomView'
import { useTheme } from '../context/ThemeContext'
import { useRouter } from 'expo-router'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import ProgressHeader from '../components/ProgressHeader'
import CustomText from '../components/CustomText'
import CustomSecondaryText from '../components/CustomSecondaryText'
import DropDownPicker from 'react-native-dropdown-picker';

import PhoneInput
    from 'react-native-phone-input';
import CountryPicker, { DARK_THEME }
    from 'react-native-country-picker-modal';

const personalInfo = () => {


    const [phone, setPhone] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [genderOpen, setGenderOpen] = useState(false)
    const [gender, setGender] = useState("Male");
    const [date, setDate] = useState(new Date());
    // const [selectedCountry, setSelectedCountry] = useState({});

    const [genderItems, setGenderItems] = useState([
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ]);

    //Error States

    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");

    const colorScheme = useColorScheme()

    const { modeColor, theme } = useTheme()

    const router = useRouter()

    const [progressOne, setProgressOne] = useState(1)
    const [progressTwo, setProgressTwo] = useState(1)
    const [progressThree, setProgressThree] = useState(0.5)


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
            console.log("Valid ", phoneNumber)
        } else {
            console.log("Invalid ", phoneNumber)
        }
    }
    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
            setGenderOpen(false);
        }}>

            {/* <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                > */}
            <CustomView style={{ padding: scale(15), justifyContent: "space-around", gap: 15 }}>

                <ProgressHeader
                    theme={theme}
                    progressOne={progressOne}
                    progressTwo={progressTwo}
                    progressThree={progressThree}
                />

                <View>
                    <CustomText style={styles.heading}>
                        It's time to create a profile !
                    </CustomText>

                    <CustomSecondaryText style={styles.sub_heading}>
                        Tell us little more about yourself
                    </CustomSecondaryText>
                </View>

                <View style={styles.inputWrapper}>
                    <CustomText>First Name</CustomText>

                    <TextInput
                        editable
                        placeholder="Enter your first name"
                        placeholderTextColor={theme.secondaryText}
                        style={[firstNameError ? styles.inputFielderror : styles.inputField, { borderColor: theme.borderColor, backgroundColor: theme.InputBackground, fontFamily: "AirbnbCereal_W_Bk", color: theme.primaryText }]}
                        onChangeText={(text) => {
                            setFirstNameError("")
                            setFirstName(text)
                        }}
                        value={firstName}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <CustomText>Last Name</CustomText>

                    <TextInput
                        editable
                        placeholder="Enter your last name"
                        placeholderTextColor={theme.secondaryText}
                        style={[lastNameError ? styles.inputFielderror : styles.inputField, { borderColor: theme.borderColor, backgroundColor: theme.InputBackground, fontFamily: "AirbnbCereal_W_Bk", color: theme.primaryText }]}
                        onChangeText={(text) => {
                            setLastNameError("")
                            setLastName(text)
                        }}
                        value={firstName}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <CustomText>Select Gender</CustomText>
                    <DropDownPicker
                        open={genderOpen}
                        value={gender}
                        items={genderItems}
                        setOpen={setGenderOpen}
                        setValue={setGender}
                        setItems={setGenderItems}
                        itemSeparator={true}
                        itemSeparatorStyle={{
                            backgroundColor: theme.borderColor
                        }}
                        placeholder="Select a gender"
                        style={[
                            styles.dropdown,
                            {
                                borderColor: theme.borderColor,
                                backgroundColor: theme.InputBackground,
                            },
                        ]}
                        dropDownContainerStyle={[
                            styles.dropdownContainer,
                            {
                                borderColor: theme.borderColor,
                                backgroundColor: theme.InputBackground,
                            }
                        ]}
                        textStyle={{
                            fontSize: moderateScale(14),
                            fontFamily: 'AirbnbCereal_W_Bk',
                            color: theme.primaryText
                        }}
                        listItemLabelStyle={{
                            fontSize: moderateScale(14),
                            fontFamily: 'AirbnbCereal_W_Bk',
                            color: theme.primaryText,
                        }}
                        arrowIconStyle={{
                            tintColor: theme.primaryText,
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
                        textStyle={{ color: theme.primaryText, fontSize: moderateScale(14) }}
                        style={[styles.inputField, { borderColor: theme.borderColor, backgroundColor: theme.InputBackground, fontFamily: "AirbnbCereal_W_Bk", color: theme.primaryText }]}
                    />

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

                <View style={styles.inputWrapper}>
                    <CustomText>Date of Birth</CustomText>

                    <TextInput
                        editable
                        placeholder="Select your date of birth"
                        placeholderTextColor={theme.secondaryText}
                        style={[firstNameError ? styles.inputFielderror : styles.inputField, { borderColor: theme.borderColor, backgroundColor: theme.InputBackground, fontFamily: "AirbnbCereal_W_Bk", color: theme.primaryText }]}
                        onChangeText={(text) => {
                            setFirstNameError("")
                            setFirstName(text)
                        }}
                        value={firstName}
                    />
                </View>

                <Pressable
                    // onPress={() => router.push("/personalInfo")}
                    style={[styles.btn, { backgroundColor: modeColor.colorCode }]}>
                    <CustomText style={{ color: "#fff" }}>Save & Next</CustomText>
                </Pressable>

            </CustomView >
            {/* </ScrollView> */}

        </TouchableWithoutFeedback>
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
        borderWidth: moderateScale(1.5),
        paddingHorizontal: scale(10),
        fontSize: moderateScale(14)
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
})
