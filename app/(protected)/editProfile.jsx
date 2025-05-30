import { Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import CustomScrollView from '../../components/CustomScrollView'
import { useTheme } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarIcon, CameraIcon, RightIcon } from '../../constants/icons'
import CustomText from '../../components/CustomText'
import CountryPicker, { DARK_THEME }
    from 'react-native-country-picker-modal';
import DropDownPicker from 'react-native-dropdown-picker'
import PhoneInput
    from 'react-native-phone-input';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '@/constants/Colors';
import { useAuth } from '../../context/AuthContext'
import { Image } from 'expo-image'
import CustomSecondaryText from '../../components/CustomSecondaryText'
import * as ImagePicker from 'expo-image-picker';

const editProfile = () => {

    const colorScheme = useColorScheme()

    const { colors } = useTheme()

    const router = useRouter()
    const { setIsAuthenticated, authenticatedUser, setAuthenticatedUser } = useAuth()

    const [phone, setPhone] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [genderOpen, setGenderOpen] = useState(false)
    const [gender, setGender] = useState("Male");
    const [date, setDate] = useState(new Date());
    const [calenderModal, setCalenderModal] = useState(false);
    // const [selectedCountry, setSelectedCountry] = useState({});

    const [genderItems, setGenderItems] = useState([
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ]);

    //Error States

    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");

    const onChange = (event, selectedDate) => {
        setCalenderModal(false);
        if (event.type === "set" && selectedDate) {
            setDate(new Date(selectedDate));
        }
    };

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

    const saveHandler = () => {
        router.push("/account")
    }


    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need media library permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImageUri = result.assets[0].uri;
            // do something with selectedImageUri
            console.log("Selected Image:", selectedImageUri);
        }
    };


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

                    <View style={{ flexDirection: "row", alignItems: "center", gap: moderateScale(10) }}>
                        <View
                            style={{
                                position: "relative"
                            }}
                        >
                            <Image
                                style={{ height: moderateScale(65), width: moderateScale(65), borderRadius: moderateScale(40) }}
                                source={{ uri: authenticatedUser?.imageUrl }}
                                contentFit="cover"
                                transition={300}
                            />

                            <Pressable
                                style={{
                                    position: "absolute",
                                    bottom: moderateScale(-8),
                                    right: moderateScale(-6),
                                    backgroundColor: Colors.modeColor.colorCode,
                                    borderWidth: moderateScale(2),
                                    borderColor: colors.border,
                                    padding: scale(6),
                                    borderRadius: moderateScale(20),
                                }}
                                onPress={pickImage}>
                                <CameraIcon color={"#fff"} size={moderateScale(16)} />
                            </Pressable>
                        </View>

                        <View style={{ gap: moderateScale(5) }}>
                            <CustomText>{authenticatedUser?.name}</CustomText>
                            <CustomSecondaryText>{authenticatedUser?.email}</CustomSecondaryText>
                            <CustomText style={{ fontSize: moderateScale(14), color: "#00B090" }}>Verified</CustomText>
                        </View>
                    </View>


                    <View style={styles.inputWrapper}>
                        <CustomText>First Name</CustomText>

                        <TextInput
                            editable
                            placeholder="Enter your first name"
                            placeholderTextColor={colors.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, { borderColor: colors.border, backgroundColor: colors.card, fontFamily: "AirbnbCereal_W_Bk", color: colors.text }]}
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
                            placeholderTextColor={colors.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, { borderColor: colors.border, backgroundColor: colors.card, fontFamily: "AirbnbCereal_W_Bk", color: colors.text }]}
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
                                backgroundColor: colors.border
                            }}
                            placeholder="Select a gender"
                            style={[
                                styles.dropdown,
                                {
                                    borderColor: colors.border,
                                    backgroundColor: colors.card,
                                },
                            ]}
                            dropDownContainerStyle={[
                                styles.dropdownContainer,
                                {
                                    borderColor: colors.border,
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
                            style={[styles.inputField, { borderColor: colors.border, backgroundColor: colors.card, fontFamily: "AirbnbCereal_W_Bk", color: colors.text }]}
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

                    <View style={[styles.inputWrapper, { position: "relative" }]}>
                        <CustomText>Date of Birth</CustomText>

                        <Pressable
                            style={[
                                firstNameError ? styles.inputFielderror : styles.inputDateField,
                                {
                                    borderColor: colors.border,
                                    backgroundColor: colors.card,
                                    fontFamily: "AirbnbCereal_W_Bk",
                                    color: colors.text,
                                    justifyContent: "center", // Ensures CalendarIcon stays aligned
                                }
                            ]}
                            onPress={() => setCalenderModal(true)}
                        >
                            <CalendarIcon style={[styles.dateIcon, { color: colors.text }]} />
                        </Pressable>

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
                        <CustomText style={{ color: "#fff" }}>Save</CustomText>
                    </Pressable>
                </View>
            </TouchableWithoutFeedback>
        </CustomScrollView>
    )
}

export default editProfile

const styles = StyleSheet.create({
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: moderateScale(10),
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(15),
        borderRadius: scale(4),
        marginVertical: verticalScale(0),
        borderWidth: scale(1),
        elevation: 3,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    profile_item: {
        flexDirection: "row",
        alignItems: "center",
        gap: moderateScale(10),
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(15),
        borderRadius: scale(4),
        marginVertical: verticalScale(5),
        borderWidth: scale(1),
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
    inputDateField: {
        height: verticalScale(40),
        borderRadius: scale(4),
        borderWidth: moderateScale(1.5),
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