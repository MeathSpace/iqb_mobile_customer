import { Colors } from "@/constants/Colors";
import { BASE_URL } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import CountryPicker, { DARK_THEME } from "react-native-country-picker-modal";
import PhoneInput from "react-native-phone-input";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Toast } from "toastify-react-native";
import CustomSecondaryText from "../../../../components/CustomSecondaryText";
import CustomText from "../../../../components/CustomText";
import Skeleton from "../../../../components/Skeleton";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CameraIcon,
  ErrorIcon,
} from "../../../../constants/icons";
import { useAuth } from "../../../../context/AuthContext";
import { useLanguage } from "../../../../context/LanguageContext";
import i18n from "../../../../src/localization/i18n";

const editProfile = () => {
  const { locale } = useLanguage();

  // Map your i18n codes to CountryPicker's translation codes
  const countryTranslationMap = {
    en: "common",
    de: "deu",
  };

  // Map your i18n codes to the Search Placeholder text
  const searchPlaceholderMap = {
    en: "Search country...",
    de: "Land suchen...",
  };

  const baseContent = i18n.t("protected.editProfile");
  const colorScheme = useColorScheme();

  const { colors } = useTheme();

  const router = useRouter();
  const { setIsAuthenticated, authenticatedUser, setAuthenticatedUser } =
    useAuth();
  const phoneRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      if (authenticatedUser) {
        setFullName(authenticatedUser?.name);
        setSelectedCountry({
          cca2: authenticatedUser?.countryCca2,
          callingCode: [`${authenticatedUser?.customerMobileCountryCode}`],
        });

        if (phoneRef.current) {
          phoneRef.current.setValue(
            `${authenticatedUser?.customerMobileCountryCode}${authenticatedUser?.mobileNumber}`,
          );
        }
        setPhoneNumber(
          `+${authenticatedUser?.customerMobileCountryCode}${authenticatedUser?.mobileNumber}`,
        );

        setGender(authenticatedUser?.gender);
        setSelectedDate(authenticatedUser?.dateOfBirth?.split("T")[0]);
      }
    }, [authenticatedUser]),
  );

  const [fullName, setFullName] = useState("");
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState("");
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");

  const [calenderModal, setCalenderModal] = useState(false);

  //Error States
  const [fullNameError, setFullNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState("");

  const [tempDate, setTempDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      if (event.type === "set" && selectedDate) {
        setDate(new Date(selectedDate));
        setDateOfBirthError("");

        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
        const day = String(selectedDate.getDate()).padStart(2, "0");

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
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [phoneNumber, setPhoneNumber] = useState("");

  const [selectedCountry, setSelectedCountry] = useState({
    callingCode: ["44"],
    cca2: "GB",
    currency: ["GBP"],
    flag: "flag-gb",
    name: "United Kingdom",
    region: "Europe",
    subregion: "Northern Europe",
  });
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);

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

  const [inValid, setInValid] = useState(false);

  const phoneNumberHandler = (phoneNumber) => {
    const isValid = phoneRef.current?.isValidNumber();
    // Sync country based on current input
    const isoCode = phoneRef.current?.getISOCode(); // 'in', 'gb', etc.
    if (isoCode && isoCode.toUpperCase() !== selectedCountry.cca2) {
      setSelectedCountry((prev) => ({
        ...prev,
        cca2: isoCode.toUpperCase(),
        callingCode: [phoneRef.current?.getCountryCode() || ""],
      }));
    }

    if (isValid) {
      setPhoneNumber(phoneNumber);
      setPhoneNumberError("");
      setInValid(false);
    } else {
      setPhoneNumber(phoneNumber); // still keep the input
      setPhoneNumberError(baseContent.errorStatesAndApi.invalidPhoneNumber);
      setInValid(true);
    }
  };

  const [updateProfileLoader, setUpdateProfileLoader] = useState(false);

  const saveHandler = async () => {
    try {
      if (!fullName) {
        setFullNameError(baseContent.errorStatesAndApi.fullNameRequired);
        return;
      } else if (fullName.length < 2) {
        setFullNameError(baseContent.errorStatesAndApi.fullNameLeastCharecter);
        return;
      } else if (fullName.length > 20) {
        setFullNameError(baseContent.errorStatesAndApi.fullNameMostCharecter);
        return;
      }

      if (!phoneNumber) {
        setPhoneNumberError(baseContent.errorStatesAndApi.phoneNumberRequired);
        return;
      }

      if (inValid) {
        setPhoneNumberError(baseContent.errorStatesAndApi.invalidPhoneNumber);
        return;
      }

      if (!selectedDate) {
        setDateOfBirthError(baseContent.errorStatesAndApi.dateOfBirthRequired);
        return;
      }

      const currentCountryCode = phoneRef.current?.getCountryCode();
      const mobileNumber = phoneNumber.replace("+", "");

      // fallback logic
      const finalCallingCode =
        currentCountryCode || selectedCountry?.callingCode?.[0] || "";
      const updatedNumber = mobileNumber.startsWith(finalCallingCode)
        ? mobileNumber.slice(finalCallingCode.length)
        : mobileNumber;

      const editProfileData = {
        email: authenticatedUser?.email,
        // name: `${firstName} ${lastName}`,
        name: fullName,
        dateOfBirth: selectedDate,
        gender,
        mobileCountryCode: finalCallingCode,
        mobileNumber: updatedNumber,
        countryCca2: selectedCountry?.cca2,
      };

      setUpdateProfileLoader(true);

      const { data } = await axios.put(
        `${BASE_URL}/customer/updateCustomer`,
        editProfileData,
      );

      await AsyncStorage.setItem(
        "LoggedInUser",
        JSON.stringify({
          ...authenticatedUser,
          name: editProfileData?.name,
          email: editProfileData?.email,
          dateOfBirth: `${editProfileData?.dateOfBirth}T00:00:00.000Z`,
          gender: editProfileData?.gender,
          customerMobileCountryCode: editProfileData?.mobileCountryCode,
          mobileNumber: editProfileData?.mobileNumber,
          countryCca2: editProfileData?.countryCca2,
        }),
      );

      setUpdateProfileLoader(false);

      setAuthenticatedUser({
        ...authenticatedUser,
        name: editProfileData?.name,
        email: editProfileData?.email,
        dateOfBirth: `${editProfileData?.dateOfBirth}T00:00:00.000Z`,
        gender: editProfileData?.gender,
        customerMobileCountryCode: editProfileData?.mobileCountryCode,
        mobileNumber: editProfileData?.mobileNumber,
        countryCca2: editProfileData?.countryCca2,
      });

      Toast.success(baseContent.profileUpdateSuccess);

      router.back();
    } catch (error) {
      setUpdateProfileLoader(false);
      console.log("Error ", error?.response?.data?.response);
      Toast.error(error?.response?.data?.message);
    }
  };

  const [image, setImage] = useState(null);
  const [uploadImageLoader, setUploadImageLoader] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(baseContent.pickImageAlertGranted);
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
      const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (!allowedMimeTypes.includes(mimeType)) {
        Toast.error(baseContent.mimeNotInclude);
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
        type: result.assets[0].mimeType,
      });

      uploadImage(formData);
    }
  };

  const uploadImage = async (formData) => {
    try {
      setUploadImageLoader(true);

      const { data } = await axios.post(
        `${BASE_URL}/customer/uploadCustomerProfilePic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      Toast.success(baseContent.imageUploadSuccess);

      await AsyncStorage.setItem(
        "LoggedInUser",
        JSON.stringify({
          ...authenticatedUser,
          profile: data?.response?.profile,
        }),
      );
      setAuthenticatedUser({
        ...authenticatedUser,
        profile: data?.response?.profile,
      });

      setUploadImageLoader(false);
    } catch (error) {
      setUploadImageLoader(false);
      Toast.error(error?.response?.data?.message);
      console.log("Error uploading image ", error?.response?.data?.message);
    }
  };

  const [openGenderDrop, setOpenGenderDrop] = useState(false);

  const ddmmformatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          // backgroundColor: "#00B0901A"
        }}
        contentContainerStyle={{
          paddingTop: verticalScale(10),
          paddingHorizontal: scale(10),
          paddingBottom:
            Platform.OS === "ios" ? verticalScale(80) : verticalScale(10),
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            setOpenGenderDrop(false);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              gap: verticalScale(15),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(10),
              }}
            >
              <Pressable
                onPress={() => {
                  setFullNameError("");
                  setPhoneNumberError("");
                  setDateOfBirthError("");
                  router.back();
                }}
              >
                <ArrowLeftIcon color={colors.text} />
              </Pressable>
              <CustomText
                style={{
                  flex: 1,
                  fontSize: scale(18),
                  fontFamily: "AirbnbCereal_W_XBd",
                }}
              >
                {baseContent.header}
              </CustomText>
            </View>

            <View
              style={{
                marginHorizontal: "auto",
              }}
            >
              <View
                style={{
                  position: "relative",
                  // iOS shadow
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 6.84,

                  // Android shadow
                  elevation: 8,
                }}
              >
                {uploadImageLoader ? (
                  <Skeleton
                    height={scale(90)}
                    width={scale(90)}
                    borderRadius={scale(90)}
                  />
                ) : (
                  <Image
                    style={{
                      height: scale(90),
                      width: scale(90),
                      borderRadius: scale(90),
                      borderWidth: scale(3),
                      borderColor: colors.queueBorder,
                    }}
                    source={{ uri: authenticatedUser?.profile?.[0]?.url }}
                    // placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={300}
                  />
                )}

                <Pressable
                  disabled={uploadImageLoader}
                  style={{
                    position: "absolute",
                    bottom: moderateScale(0),
                    right: moderateScale(-6),
                    backgroundColor: colors.accentColor,
                    padding: scale(6),
                    borderRadius: moderateScale(20),
                    borderWidth: scale(3),
                    borderColor: colors.queueBorder,
                  }}
                  onPress={pickImage}
                >
                  <CameraIcon color={"#fff"} size={moderateScale(16)} />
                </Pressable>
              </View>
            </View>

            <View
              style={{
                gap: verticalScale(5),
                marginHorizontal: "auto",
              }}
            >
              <CustomText
                style={{
                  textAlign: "center",
                  fontSize: scale(18),
                  fontFamily: "AirbnbCereal_W_XBd",
                }}
              >
                {authenticatedUser?.name}
              </CustomText>
              <CustomSecondaryText
                style={{
                  textAlign: "center",
                }}
              >
                {authenticatedUser?.email}
              </CustomSecondaryText>
            </View>

            <View style={styles.inputWrapper}>
              <CustomText>{baseContent.fullname.label}</CustomText>

              <TextInput
                editable
                placeholder={baseContent.fullname.placeholder}
                placeholderTextColor={colors.secondaryText}
                style={[
                  false ? styles.inputFielderror : styles.inputField,
                  {
                    fontFamily: "AirbnbCereal_W_Md",
                    color: colors.text,
                    backgroundColor: colors.cardColor,
                    borderWidth: scale(1),
                    borderColor: colors.queueBorder,
                  },
                ]}
                onChangeText={(text) => {
                  setFullNameError("");
                  setFullName(text);
                }}
                value={fullName}
              />

              {fullNameError && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(5),
                  }}
                >
                  <ErrorIcon color="red" size={scale(16)} />
                  <CustomText style={{ fontSize: scale(12), color: "red" }}>
                    {fullNameError}
                  </CustomText>
                </View>
              )}
            </View>

            <View
              style={[
                styles.inputWrapper,
                {
                  zIndex: 10,
                },
              ]}
            >
              <CustomText>{baseContent.gender.label}</CustomText>

              <Pressable
                onPress={() => setOpenGenderDrop((prev) => !prev)}
                style={[
                  false ? styles.inputFielderror : styles.inputField,
                  {
                    color: colors.text,
                    backgroundColor: colors.cardColor,
                    borderWidth: scale(1),
                    borderColor: colors.queueBorder,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                  },
                ]}
              >
                <CustomText
                  style={{
                    fontFamily: "AirbnbCereal_W_Md",
                  }}
                >
                  {gender}
                </CustomText>

                <View>
                  <ArrowDownIcon size={scale(16)} color={colors.text} />
                </View>

                {openGenderDrop && (
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
                    {[
                      baseContent.gender.male,
                      baseContent.gender.female,
                      baseContent.gender.other,
                    ].map((item, index) => (
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
                        <CustomText
                          style={{
                            fontFamily: "AirbnbCereal_W_Bk",
                            color: colors.text,
                          }}
                        >
                          {item}
                        </CustomText>
                      </Pressable>
                    ))}
                  </View>
                )}
              </Pressable>
            </View>

            <View style={styles.inputWrapper}>
              <CustomText>{baseContent.mobileNumber.label}</CustomText>
              <PhoneInput
                ref={phoneRef}
                initialValue={phoneNumber}
                onChangePhoneNumber={(number) => phoneNumberHandler(number)}
                onPressFlag={toggleCountryPicker}
                textStyle={{
                  color: colors.text,
                  fontSize: moderateScale(14),
                  fontFamily: "AirbnbCereal_W_Md",
                }}
                style={[
                  styles.inputField,
                  {
                    color: colors.text,
                    backgroundColor: colors.cardColor,
                    borderWidth: scale(1),
                    borderColor: colors.queueBorder,
                  },
                ]}
              />

              {phoneNumberError && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(5),
                  }}
                >
                  <ErrorIcon color="red" size={scale(16)} />
                  <CustomText style={{ fontSize: scale(12), color: "red" }}>
                    {phoneNumberError}
                  </CustomText>
                </View>
              )}

              {countryPickerVisible && (
                <CountryPicker
                  translation={countryTranslationMap[locale]}
                  filterProps={{
                    placeholder: searchPlaceholderMap[locale],
                  }}
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
                    ...((colorScheme === "dark" && DARK_THEME) || {}),
                    fontFamily: "AirbnbCereal_W_Md",
                  }}
                />
              )}
            </View>

            <View style={[styles.inputWrapper, { position: "relative" }]}>
              <CustomText>{baseContent.dateOfBirth.label}</CustomText>

              <Pressable
                style={[
                  false ? styles.inputFielderror : styles.inputDateField,
                  {
                    fontFamily: "AirbnbCereal_W_Md",
                    color: colors.text,
                    backgroundColor: colors.cardColor,
                    borderWidth: scale(1),
                    borderColor: colors.queueBorder,
                    justifyContent: "center", // Ensures CalendarIcon stays aligned
                  },
                ]}
                onPress={() => setCalenderModal(true)}
              >
                {!calenderModal && !selectedDate && (
                  <CustomText
                    style={{
                      color: colors.secondaryText,
                      fontFamily: "AirbnbCereal_W_Md",
                    }}
                  >
                    {baseContent.dateOfBirth.placeholder}
                  </CustomText>
                )}
                {!calenderModal && selectedDate && (
                  <CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}>
                    {ddmmformatDate(selectedDate)}
                  </CustomText>
                )}
                <CalendarIcon
                  style={[styles.dateIcon, { color: colors.text }]}
                />
              </Pressable>

              {dateOfBirthError && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(5),
                  }}
                >
                  <ErrorIcon color="red" size={scale(16)} />
                  <CustomText style={{ fontSize: scale(12), color: "red" }}>
                    {dateOfBirthError}
                  </CustomText>
                </View>
              )}

              {Platform.OS === "android" ? (
                calenderModal && (
                  <View
                    style={{
                      position: "absolute",
                      top: verticalScale(34),
                      left: 0,
                      zIndex: 100,
                    }}
                  >
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
                <Modal transparent={true} visible={calenderModal}>
                  <Pressable
                    onPress={() => setCalenderModal(false)}
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(0,0,0, 0.8)",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      padding: scale(20),
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
                        accentColor={colors.accentColor}
                        onChange={onChange}
                      />

                      <View
                        style={{
                          gap: scale(10),
                          marginTop: verticalScale(16),
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Pressable
                          onPress={() => {
                            setCalenderModal(false);
                          }}
                          style={{
                            height: verticalScale(40),
                            borderRadius: scale(4),
                            flex: 1,
                            marginHorizontal: "auto",
                            backgroundColor: "#ef4444",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CustomText style={{ color: "#fff" }}>
                            {baseContent.modal.closeText}
                          </CustomText>
                        </Pressable>

                        <Pressable
                          onPress={onDoneIOS}
                          style={{
                            height: verticalScale(40),
                            borderRadius: scale(4),
                            flex: 1,
                            marginHorizontal: "auto",
                            backgroundColor: colors.accentColor,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CustomText style={{ color: "#fff" }}>
                            {baseContent.modal.openText}
                          </CustomText>
                        </Pressable>
                      </View>
                    </View>
                  </Pressable>
                </Modal>
              )}
            </View>

            <TouchableOpacity
              onPress={() => saveHandler()}
              style={[
                styles.queueButton,
                { backgroundColor: colors.accentColor },
              ]}
              activeOpacity={0.85}
            >
              {updateProfileLoader ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <CustomText style={styles.queueButtonText}>
                  {baseContent.editAndSave}
                </CustomText>
              )}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default editProfile;

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
    borderRadius: scale(8),
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
  inputFielderror: {},
  dropdown: {
    height: verticalScale(35),
    borderRadius: scale(8),
    borderWidth: moderateScale(1.5),
    paddingHorizontal: scale(10),
    zIndex: 100,
  },
  dropdownContainer: {
    borderWidth: moderateScale(1.5),
    zIndex: 100,
  },

  submitButton: {
    width: "100%",
  },
  btn: {
    height: verticalScale(40),
    borderRadius: scale(4),
    alignItems: "center",
    justifyContent: "center",
    marginBlock: verticalScale(0),
  },
  modalWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    height: "50%",
    width: "50%",
    backgroundColor: "red",
  },
  queueButton: {
    width: "100%",
    // bg-teal-500
    paddingVertical: verticalScale(16), // py-4
    borderRadius: scale(12), // rounded-xl
    marginBottom: verticalScale(15), // mb-6
    alignItems: "center",
    justifyContent: "center",
  },
  queueButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },
});
