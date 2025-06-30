import { ActivityIndicator, Alert, Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomScrollView from '../../../components/CustomScrollView'
import { useTheme } from '@react-navigation/native'
import { useFocusEffect, useRouter } from 'expo-router'
import DateTimePicker from "@react-native-community/datetimepicker";
import { ArrowLeftIcon, CalendarIcon, CameraIcon, ErrorIcon, RightIcon } from '../../../constants/icons'
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
            if (authenticatedUser) {
                setFirstName(authenticatedUser?.name && authenticatedUser?.name?.split(" ")[0])
                setLastName(authenticatedUser?.name && authenticatedUser?.name?.split(" ")[1])
                setSelectedCountry({ "cca2": authenticatedUser?.countryCca2, "callingCode": [`+${authenticatedUser?.mobileCountryCode}`] })

                if (phoneRef.current) {
                    phoneRef.current.setValue(`${authenticatedUser?.mobileNumber}`);
                }
                setPhoneNumber(authenticatedUser?.mobileNumber)
                setSelectedDate(authenticatedUser?.dateOfBirth?.split("T")[0])
                // setPhoneNumber(authenticatedUser?.mobileNumber && authenticatedUser?.mobileNumber)
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


    const [phoneNumber, setPhoneNumber] = useState('');

    const [selectedCountry, setSelectedCountry] =
        useState({ "cca2": "GB", "callingCode": ["44"] });
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
        } else {
            setPhoneNumberError("Invalid phone number");
        }
    }

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

            if (!selectedDate) {
                setDateOfBirthError("Date of birth is required");
                return;
            }

            const updatedCallingCode = selectedCountry?.callingCode?.[0]?.replace("+", "")
            const updateMobileNumber = phoneNumber?.toString()

            const editProfileData = {
                email: authenticatedUser?.email,
                name: `${firstName} ${lastName}`,
                dateOfBirth: selectedDate,
                gender,
                mobileCountryCode: updatedCallingCode,
                mobileNumber: updateMobileNumber.startsWith(updatedCallingCode) ? updateMobileNumber.slice(updatedCallingCode.length) : updateMobileNumber
            };

            setUpdateProfileLoader(true)

            const { data } = await axios.put(`${BASE_URL}/customer/updateCustomer`, editProfileData)

            await AsyncStorage.setItem("LoggedInUser", JSON.stringify({
                ...authenticatedUser,
                name: editProfileData?.name,
                email: editProfileData?.email,
                dateOfBirth: `${editProfileData?.dateOfBirth}T00:00:00.000Z`,
                gender: editProfileData?.gender,
                mobileCountryCode: editProfileData?.mobileCountryCode,
                mobileNumber: editProfileData?.mobileNumber
            }))

            setUpdateProfileLoader(false)

            setAuthenticatedUser({
                ...authenticatedUser,
                name: editProfileData?.name,
                email: editProfileData?.email,
                dateOfBirth: `${editProfileData?.dateOfBirth}T00:00:00.000Z`,
                gender: editProfileData?.gender,
                mobileCountryCode: editProfileData?.mobileCountryCode,
                mobileNumber: editProfileData?.mobileNumber
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

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: "#00B0901A"
            }}

            contentContainerStyle={{
                paddingTop: verticalScale(10),
                paddingHorizontal: scale(10),
                paddingBottom: Platform.OS === "ios" ? verticalScale(80) : verticalScale(10)
            }}
            showsVerticalScrollIndicator={false}
        >
            <TouchableWithoutFeedback onPress={() => {
                Keyboard.dismiss();
                setGenderOpen(false);
            }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "space-around",
                        gap: verticalScale(15)
                    }}
                >

                    <View
                        style={[styles.profileCard, { backgroundColor: colors.background }]}>
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
                            style={[false ? styles.inputFielderror : styles.inputField, { backgroundColor: colors.background, fontFamily: "AirbnbCereal_W_Bk", color: colors.text }]}
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
                            style={[false ? styles.inputFielderror : styles.inputField, { backgroundColor: colors.background, fontFamily: "AirbnbCereal_W_Bk", color: colors.text }]}
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
                    </View>


                    <View style={styles.inputWrapper}>
                        <CustomText>Mobile Number</CustomText>
                        <PhoneInput
                            ref={phoneRef}
                            initialValue={phoneNumber}
                            onChangePhoneNumber={(number) => phoneNumberHandler(number)}
                            onPressFlag={toggleCountryPicker}
                            textStyle={{ color: colors.text, fontSize: moderateScale(14) }}
                            style={[styles.inputField, { backgroundColor: colors.background, fontFamily: "AirbnbCereal_W_Bk", color: colors.text }]}
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
                                    backgroundColor: colors.background,
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