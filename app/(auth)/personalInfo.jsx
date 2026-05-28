import { Colors } from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { usePreventRemove, useTheme } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Modal,
  Platform,
  Pressable,
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
import CustomScrollView from "../../components/CustomScrollView";
import CustomSecondaryText from "../../components/CustomSecondaryText";
import CustomText from "../../components/CustomText";
import ProgressHeader from "../../components/ProgressHeader";
import { ArrowDownIcon, CalendarIcon, ErrorIcon } from "../../constants/icons";
import { useLanguage } from "../../context/LanguageContext";
import i18n from "../../src/localization/i18n";
import { FirebaseLogout } from "../../src/firebase/authService";

const personalInfo = () => {
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

  const baseContent = i18n.t("auth.personalInfo");

  const { email, authType, password } = useLocalSearchParams();

  const colorScheme = useColorScheme();

  const { colors } = useTheme();

  const router = useRouter();

  const [fullName, setFullName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState(baseContent.gender.male);
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");

  const [calenderModal, setCalenderModal] = useState(false);
  // const [selectedCountry, setSelectedCountry] = useState({});

  // console.log("sdv", date)

  //Error States

  const [fullNameError, setFullNameError] = useState("");
  // const [lastNameError, setLastNameError] = useState("");
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

  // console.log("selectedDate ", selectedDate)

  const [progressOne, setProgressOne] = useState(0.5);
  const [progressTwo, setProgressTwo] = useState(0);
  const [progressThree, setProgressThree] = useState(0);

  const phoneRef = useRef(null);
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
      phoneRef.current.selectCountry(selectedCountry.cca2.toLowerCase());
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

  const saveHandler = () => {
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

    const currentCountryCode = phoneRef.current?.getCountryCode();
    const mobileNumber = phoneNumber.replace("+", "");

    // fallback logic
    const finalCallingCode =
      currentCountryCode || selectedCountry?.callingCode?.[0] || "";
    const updatedNumber = mobileNumber.startsWith(finalCallingCode)
      ? mobileNumber.slice(finalCallingCode.length)
      : mobileNumber;

    if (authType === "google" || authType === "apple") {
      router.push({
        pathname: "/verification",
        params: {
          email,
          fullName,
          gender,
          phoneNumber: updatedNumber,
          callingCode: selectedCountry?.callingCode[0],
          selectedDate: selectedDate ? selectedDate : "",
          authType,
        },
      });
    } else {
      router.push({
        pathname: "/verification",
        params: {
          email,
          fullName,
          gender,
          phoneNumber: updatedNumber,
          callingCode: selectedCountry?.callingCode[0],
          selectedDate: selectedDate ? selectedDate : "",
          password,
        },
      });
    }
  };

  const [openGenderDrop, setOpenGenderDrop] = useState(false);
  const hasUnsavedChanges = true;

  usePreventRemove(
    hasUnsavedChanges, // This boolean determines if removal should be prevented
    ({ data }) => {
      // The action is still passed, but we're choosing not to dispatch it,
      // effectively making "going back" impossible through these means.
      Alert.alert(
        baseContent.alertBox.alertOne.header,
        baseContent.alertBox.alertOne.subHeader,
        [
          {
            text: baseContent.alertBox.alertOne.cancel,
            style: "cancel",
            onPress: () => null, // Do nothing, stay on screen
          },
          {
            text: baseContent.alertBox.alertOne.ok,
            onPress: async () => {
              await FirebaseLogout()
              router.push("/signup");
            },
          },
        ], // Only an 'OK' button
      );
    },
  );

  const ddmmformatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <CustomScrollView>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setOpenGenderDrop(false);
          setGenderOpen(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              gap: verticalScale(20),
            }}
          >
            <ProgressHeader
              progressOne={progressOne}
              progressTwo={progressTwo}
              progressThree={progressThree}
            />

            <View>
              <CustomText style={styles.heading}>
                {baseContent.header}
              </CustomText>

              <CustomSecondaryText>{baseContent.subHeader}</CustomSecondaryText>
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
                    borderWidth: scale(1),
                    borderColor: colors.queueBorder,
                    backgroundColor: colors.cardColor,
                    color: colors.text,
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
                    borderWidth: scale(1),
                    borderColor: colors.queueBorder,
                    backgroundColor: colors.cardColor,
                    color: colors.text,
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
                            color: colors.text,
                            fontFamily: "AirbnbCereal_W_Bk",
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
                initialCountry={selectedCountry.cca2.toLowerCase()}
                value={phoneNumber}
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
                    borderWidth: scale(1),
                    borderColor: colors.queueBorder,
                    backgroundColor: colors.cardColor,
                    color: colors.text,
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
                    fontFamily: "AirbnbCereal_W_Bk",
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
                    borderWidth: scale(1),
                    borderColor: colors.queueBorder,
                    backgroundColor: colors.cardColor,
                    color: colors.text,
                    justifyContent: "center", // Ensures CalendarIcon stays aligned
                  },
                ]}
                onPress={() => {
                  setSelectedDate("");
                  setDateOfBirthError("");
                  setCalenderModal(true);
                }}
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
          </View>

          <TouchableOpacity
            onPress={() => saveHandler()}
            style={[
              styles.signinButton,
              { backgroundColor: colors.accentColor },
            ]}
            activeOpacity={0.85}
          >
            <CustomText style={styles.signinButtonText}>
              {baseContent.saveAndNext}
            </CustomText>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </CustomScrollView>
  );
};

export default personalInfo;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: moderateScale(22),
    marginBottom: verticalScale(10),
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
    borderRadius: scale(8),
    // borderWidth: moderateScale(1.5),
    paddingHorizontal: scale(10),
    fontSize: moderateScale(14),
    position: "relative",
  },
  dateIcon: {
    position: "absolute",
    right: scale(5),
    top: verticalScale(18),
    transform: [{ translateY: -(moderateScale(24) / moderateScale(2)) }],
  },
  inputFielderror: {},
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

  signinButton: {
    width: "100%",
    // bg-teal-500
    paddingVertical: verticalScale(12), // py-4
    borderRadius: scale(8), // rounded-xl
    alignItems: "center",
    justifyContent: "center",
  },
  signinButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },
});
