import { ActivityIndicator, Alert, BackHandler, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomScrollView from '../../../components/CustomScrollView'
import { useTheme } from '@react-navigation/native'
import { useFocusEffect, useRouter } from 'expo-router'
import DateTimePicker from "@react-native-community/datetimepicker";
import { ArrowDownIcon, ArrowLeftIcon, CalendarIcon, CameraIcon, ErrorIcon, RightIcon } from '../../../constants/icons'
import CustomText from '../../../components/CustomText'
import CountryPicker, { DARK_THEME }
    from 'react-native-country-picker-modal';
import DropDownPicker from 'react-native-dropdown-picker'
import PhoneInput
    from 'react-native-phone-input';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '@/constants/Colors';
import { useAuth } from '../../../context/AuthContext'
import { Image } from 'expo-image'
import CustomSecondaryText from '../../../components/CustomSecondaryText'
import * as ImagePicker from 'expo-image-picker';
import CustomTabView from '../../../components/CustomTabView'
import axios from 'axios'
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Skeleton from '../../../components/Skeleton';

const editProfile = () => {

    const colorScheme = useColorScheme()

    const { colors } = useTheme()

    const router = useRouter()
    const { setIsAuthenticated, authenticatedUser, setAuthenticatedUser } = useAuth()
    const phoneRef = useRef(null);


    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                router.push('/account'); // 👈 or replace('/account') if you don’t want to go back to this screen
                return true; // prevent default behavior
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove(); // ✅ correct way
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
            if (authenticatedUser) {
                setFirstName(authenticatedUser?.name?.split(" ")[0])
                setLastName(authenticatedUser?.name?.trim()?.split(" ")?.slice(1).join(" "))
                setSelectedCountry({ "cca2": authenticatedUser?.countryCca2, "callingCode": [`${authenticatedUser?.customerMobileCountryCode}`] })

                if (phoneRef.current) {
                    phoneRef.current.setValue(`${authenticatedUser?.customerMobileCountryCode}${authenticatedUser?.mobileNumber}`);
                }
                setPhoneNumber(`+${authenticatedUser?.customerMobileCountryCode}${authenticatedUser?.mobileNumber}`)

                setGender(authenticatedUser?.gender)
                setSelectedDate(authenticatedUser?.dateOfBirth?.split("T")[0])

            }

        }, [authenticatedUser])
    )

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [genderOpen, setGenderOpen] = useState(false)
    const [gender, setGender] = useState("Male");
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState("");

    const [calenderModal, setCalenderModal] = useState(false);

    const [genderItems, setGenderItems] = useState([
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' }
    ]);

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
            phoneRef?.current?.selectCountry(selectedCountry?.cca2?.toLowerCase());
        }
    }, [selectedCountry]);

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

    const [updateProfileLoader, setUpdateProfileLoader] = useState(false)

    const saveHandler = async () => {
        try {
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

            // const updatedCallingCode = Number(selectedCountry?.callingCode?.[0]);
            // let sanitizedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Remove all non-digit characters

            // const callingCodeStr = updatedCallingCode.toString();

            // // Keep removing the calling code prefix as long as it repeats at the start
            // while (sanitizedPhoneNumber.startsWith(callingCodeStr)) {
            //     sanitizedPhoneNumber = sanitizedPhoneNumber.slice(callingCodeStr.length);
            // }

            const currentCountryCode = phoneRef.current?.getCountryCode();
            const mobileNumber = phoneNumber.replace("+", "");

            // fallback logic
            const finalCallingCode = currentCountryCode || selectedCountry?.callingCode?.[0] || "";
            const updatedNumber = mobileNumber.startsWith(finalCallingCode)
                ? mobileNumber.slice(finalCallingCode.length)
                : mobileNumber;

            const editProfileData = {
                email: authenticatedUser?.email,
                name: `${firstName} ${lastName}`,
                dateOfBirth: selectedDate,
                gender,
                mobileCountryCode: finalCallingCode,
                mobileNumber: updatedNumber,
                countryCca2: selectedCountry?.cca2
            };


            setUpdateProfileLoader(true)

            const { data } = await axios.put(`${BASE_URL}/customer/updateCustomer`, editProfileData)

            await AsyncStorage.setItem("LoggedInUser", JSON.stringify({
                ...authenticatedUser,
                name: editProfileData?.name,
                email: editProfileData?.email,
                dateOfBirth: `${editProfileData?.dateOfBirth}T00:00:00.000Z`,
                gender: editProfileData?.gender,
                customerMobileCountryCode: editProfileData?.mobileCountryCode,
                mobileNumber: editProfileData?.mobileNumber,
                countryCca2: editProfileData?.countryCca2
            }))

            setUpdateProfileLoader(false)

            setAuthenticatedUser({
                ...authenticatedUser,
                name: editProfileData?.name,
                email: editProfileData?.email,
                dateOfBirth: `${editProfileData?.dateOfBirth}T00:00:00.000Z`,
                gender: editProfileData?.gender,
                customerMobileCountryCode: editProfileData?.mobileCountryCode,
                mobileNumber: editProfileData?.mobileNumber,
                countryCca2: editProfileData?.countryCca2
            })

            Toast.success("Profile updated successfully")

            router.replace("/account")

        } catch (error) {
            setUpdateProfileLoader(false)
            console.log("Error ", error?.response?.data?.response)
            Toast.error(error?.response?.data?.message)
        }

    }

    const [image, setImage] = useState(null);
    const [uploadImageLoader, setUploadImageLoader] = useState(false)

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need media library permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const { mimeType } = result.assets[0];
            const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

            if (!allowedMimeTypes.includes(mimeType)) {
                Toast.error("Invalid File Type. Only Webp, JPEG, JPG, and PNG images are allowed")
                return;
            }

            setImage(result.assets[0].uri);

            let formData = new FormData();
            formData.append("email", authenticatedUser?.email);
            formData.append("profile", {
                name: result.assets[0].fileName || "profile.jpg",
                size: result.assets[0].fileSize,
                uri: result.assets[0].uri,
                tempFilePath: result.assets[0].uri,
                mimeType: result.assets[0].mimeType,
                type: result.assets[0].mimeType
            });

            uploadImage(formData);
        }
    };


    const uploadImage = async (formData) => {

        try {

            setUploadImageLoader(true)

            const { data } = await axios.post(`${BASE_URL}/customer/uploadCustomerProfilePic`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            Toast.success("Image uploaded successfully")

            await AsyncStorage.setItem("LoggedInUser", JSON.stringify({ ...authenticatedUser, profile: data?.response?.profile }))
            setAuthenticatedUser({ ...authenticatedUser, profile: data?.response?.profile })

            setUploadImageLoader(false)

        } catch (error) {
            setUploadImageLoader(false)
            Toast.error(error?.response?.data?.message)
            console.log("Error uploading image ", error?.response?.data?.message);
        }

    };

    const [openGenderDrop, setOpenGenderDrop] = useState(false)

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: colors.background
                    // backgroundColor: "#00B0901A"
                }}

                contentContainerStyle={{
                    paddingTop: verticalScale(10),
                    paddingHorizontal: scale(10),
                    paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(10)
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <TouchableWithoutFeedback onPress={() => {
                    Keyboard.dismiss();
                    setOpenGenderDrop(false);
                }}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "space-around",
                            gap: verticalScale(15)
                        }}
                    >

                        <View
                            style={[styles.profileCard, { backgroundColor: "#00B0901A" }]}>
                            <View style={{ gap: moderateScale(5) }}>
                                <CustomText style={{ fontFamily: "AirbnbCereal_W_Bd", fontSize: scale(22) }}>{authenticatedUser?.name}</CustomText>
                                <CustomText style={{ fontSize: scale(14), color: "gray" }}>{authenticatedUser?.email}</CustomText>
                            </View>

                            <View
                                style={{
                                    position: "relative"
                                }}
                            >
                                {
                                    uploadImageLoader ? (
                                        <Skeleton
                                            height={scale(80)}
                                            width={scale(80)}
                                            borderRadius={scale(80)}
                                        />
                                    ) : (
                                        <Image
                                            style={{ height: scale(80), width: scale(80), borderRadius: scale(80) }}
                                            source={{ uri: authenticatedUser?.profile?.[0]?.url }}
                                            // placeholder={{ blurhash }}
                                            contentFit="cover"
                                            transition={300}
                                        />
                                    )
                                }


                                <Pressable
                                    disabled={uploadImageLoader}
                                    style={{
                                        position: "absolute",
                                        bottom: moderateScale(0),
                                        right: moderateScale(-6),
                                        backgroundColor: Colors.modeColor.colorCode,
                                        padding: scale(6),
                                        borderRadius: moderateScale(20),
                                    }}
                                    onPress={pickImage}>
                                    <CameraIcon color={"#fff"} size={moderateScale(16)} />
                                </Pressable>
                            </View>
                        </View>


                        <View style={styles.inputWrapper}>
                            <CustomText>First Name</CustomText>

                            <TextInput
                                editable
                                placeholder="Enter your first name"
                                placeholderTextColor={colors.secondaryText}
                                style={[false ? styles.inputFielderror : styles.inputField, {
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
                                        backgroundColor: colors.background
                                        // borderWidth: scale(1),
                                        // borderColor: "#d3d3d3"
                                    },
                                ]}
                                dropDownContainerStyle={[
                                    styles.dropdownContainer,
                                    {
                                        borderColor: "#0BA3AD1A",
                                        backgroundColor: colors.background
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
                                                        <CustomText style={{
                                                            fontFamily: "AirbnbCereal_W_Bk",
                                                            color: colors.text
                                                        }}>
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
                                initialValue={phoneNumber}
                                onChangePhoneNumber={(number) => phoneNumberHandler(number)}
                                onPressFlag={toggleCountryPicker}
                                textStyle={{ color: colors.text, fontSize: moderateScale(14) }}
                                style={[styles.inputField, {
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
                                        borderWidth: scale(1),
                                        borderColor: "gray",
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

                            {/* {calenderModal && (
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
                            )} */}

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

                        {/* <Pressable
                            onPress={() => {
                                console.log("VALUEEEE ", router.canGoBack())
                            }}
                        ><CustomText>svv</CustomText></Pressable> */}

                        <Pressable
                            onPress={() => saveHandler()}
                            style={[styles.btn, { backgroundColor: Colors.modeColor.colorCode }]}>

                            {
                                updateProfileLoader ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <CustomText style={{ color: "#fff" }}>Edit & Save</CustomText>
                                )
                            }
                        </Pressable>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default editProfile

const styles = StyleSheet.create({
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: moderateScale(10),
        height: verticalScale(118),
        padding: scale(24),
        borderRadius: scale(10),
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
        paddingHorizontal: scale(10),
        fontSize: moderateScale(14),
    },
    inputDateField: {
        height: verticalScale(40),
        borderRadius: scale(4),
        paddingHorizontal: scale(10),
        fontSize: moderateScale(14),
        position: "relative",
    },
    dateIcon: {
        position: "absolute",
        right: scale(5),
        top: verticalScale(10),
    },
    inputFielderror: {

    },
    dropdown: {
        height: verticalScale(35),
        borderRadius: scale(8),
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