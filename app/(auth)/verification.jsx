import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import api from "../../utils/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { Toast } from "toastify-react-native";
import CustomSecondaryText from "../../components/CustomSecondaryText";
import CustomText from "../../components/CustomText";
import CustomView from "../../components/CustomView";
import ProgressHeader from "../../components/ProgressHeader";
import { ErrorIcon } from "../../constants/icons";
import { useAuth } from "../../context/AuthContext";
import i18n from "../../src/localization/i18n";

const verification = () => {
  const baseContent = i18n.t("auth.verification");

  const {
    email,
    fullName,
    gender,
    callingCode,
    phoneNumber,
    selectedDate,
    authType,
    password,
  } = useLocalSearchParams();

  const { colors } = useTheme();
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCodeError, setVerificationCodeError] = useState("");
  const [currentVerificationOtp, setCurrentVerificationOtp] = useState("");
  const [verificationCodeLoading, setVerificationCodeLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  useEffect(() => {
    if (email && phoneNumber && callingCode) {
      const sendCustomerVerificationCodeFnc = async () => {
        try {
          const { data } = await api.post(
            `/customer/sendCustomerVerificationCode`,
            {
              email,
              mobileCountryCode: callingCode,
              mobileNumber: phoneNumber,
            },
          );
          setCurrentVerificationOtp(data?.response);
        } catch (error) {
          Toast.error(error?.response?.data?.message);
        }
      };

      sendCustomerVerificationCodeFnc();
    }
  }, [email, phoneNumber, callingCode]);

  const router = useRouter();

  const [progressOne, setProgressOne] = useState(1);
  const [progressTwo, setProgressTwo] = useState(1);
  const [progressThree, setProgressThree] = useState(0.5);

  const {
    setIsAuthenticated,
    setAuthenticatedUser,
    setSignInData,
    signInData,
  } = useAuth();

  const signupHandler = async () => {
    try {
      if (!verificationCode) {
        setVerificationCodeError(
          baseContent.errorStatesAndApi.verificationCodeRequired,
        );
        return;
      } else if (Number(verificationCode) !== Number(currentVerificationOtp)) {
        setVerificationCodeError(
          baseContent.errorStatesAndApi.verificationCodeNotMatch,
        );
        return;
      }

      const signUpData = {
        email,
        name: fullName,
        gender,
        dateOfBirth: selectedDate ? selectedDate : "",
        mobileCountryCode: callingCode,
        mobileNumber: phoneNumber,
        password,
      };

      const oauthSignUpData = {
        email,
        name: fullName,
        gender,
        dateOfBirth: selectedDate ? selectedDate : "",
        mobileCountryCode: callingCode,
        mobileNumber: phoneNumber,
      };

      // console.log("Sign up data ", signUpData)

      setSignupLoading(true);

      if (authType === "google") {
        const { data } = await api.post(
          `/customer/googleCustomerSignup`,
          oauthSignUpData,
        );
        setSignInData((prev) => ({
          ...prev,
          loading: false,
          user: data?.response,
          success: true,
          error: null,
        }));

        await AsyncStorage.setItem("isAuthenticated", JSON.stringify(true));
        await AsyncStorage.setItem(
          "LoggedInUser",
          JSON.stringify(data?.response),
        );
        setAuthenticatedUser(data?.response);
        setIsAuthenticated(true);
        router.push("/home");
      } else if (authType === "apple") {
        const { data } = await api.post(
          `/customer/appleCustomerSignup`,
          oauthSignUpData,
        );
        setSignInData((prev) => ({
          ...prev,
          loading: false,
          user: data?.response,
          success: true,
          error: null,
        }));

        await AsyncStorage.setItem("isAuthenticated", JSON.stringify(true));
        await AsyncStorage.setItem(
          "LoggedInUser",
          JSON.stringify(data?.response),
        );
        setAuthenticatedUser(data?.response);
        setIsAuthenticated(true);
        router.push("/home");
      } else {
        const { data } = await api.post(`/customer/signUp`, signUpData);

        setSignInData((prev) => ({
          ...prev,
          loading: false,
          user: data?.response,
          success: true,
          error: null,
        }));

        await AsyncStorage.setItem("isAuthenticated", JSON.stringify(true));
        await AsyncStorage.setItem(
          "LoggedInUser",
          JSON.stringify(data?.response),
        );
        setAuthenticatedUser(data?.response);
        setIsAuthenticated(true);
        router.push("/home");
      }
    } catch (error) {
      console.log(error?.data);
      setSignupLoading(false);
      Toast.error(error?.response?.data?.message);
    }
  };

  const [verificationTime, setVerificationTime] = useState(0); // countdown timer
  const [isCooldown, setIsCooldown] = useState(false);

  useEffect(() => {
    let interval;
    if (isCooldown && verificationTime > 0) {
      interval = setInterval(() => {
        setVerificationTime((prev) => prev - 1);
      }, 1000);
    }

    if (verificationTime === 0) {
      setIsCooldown(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isCooldown, verificationTime]);

  const resendVerification = async () => {
    if (isCooldown) {
      Toast.error(baseContent.errorStatesAndApi.coolDownRequired);
      return;
    }

    try {
      setVerificationCodeLoading(true);
      const { data } = await api.post(
        `/customer/sendCustomerVerificationCode`,
        {
          email,
          mobileCountryCode: callingCode,
          mobileNumber: phoneNumber,
        },
      );
      setVerificationCodeLoading(false);
      setCurrentVerificationOtp(data?.response);
      console.log(
        baseContent.errorStatesAndApi.resendVerificationCode,
        data?.response,
      );

      // ✅ Start cooldown here
      setIsCooldown(true);
      setVerificationTime(30);
    } catch (error) {
      setVerificationCodeLoading(false);
      console.log(baseContent.errorStatesAndApi.verificationOtpError, error);
      Toast.error(error?.response?.data?.message);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <CustomView style={{ justifyContent: "space-between" }}>
        <View style={{ gap: verticalScale(20) }}>
          <ProgressHeader
            progressOne={progressOne}
            progressTwo={progressTwo}
            progressThree={progressThree}
          />

          <View>
            <CustomText style={styles.heading}>{baseContent.header}</CustomText>

            <CustomSecondaryText>{baseContent.subHeader}</CustomSecondaryText>
          </View>

          <View style={styles.inputWrapper}>
            <CustomText>{baseContent.verificationCode.label}</CustomText>

            <TextInput
              editable
              keyboardType="numeric"
              placeholder={baseContent.verificationCode.placeholder}
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
                setVerificationCodeError("");
                setVerificationCode(text);
              }}
              value={verificationCode}
            />

            {verificationCodeError && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(5),
                }}
              >
                <ErrorIcon color="red" size={scale(16)} />
                <CustomText style={{ fontSize: scale(12), color: "red" }}>
                  {verificationCodeError}
                </CustomText>
              </View>
            )}
          </View>

          <TouchableOpacity
            disabled={signupLoading}
            onPress={() => signupHandler()}
            style={[
              styles.signinButton,
              { backgroundColor: colors.accentColor },
            ]}
            activeOpacity={0.85}
          >
            {signupLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <CustomText style={styles.signinButtonText}>
                {baseContent.verifyAndCreate}
              </CustomText>
            )}
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center", // centers the entire row
              marginHorizontal: "auto",
            }}
          >
            <CustomSecondaryText>
              {baseContent.didntReceiveCode}{" "}
            </CustomSecondaryText>

            <Pressable
              onPress={resendVerification}
              disabled={verificationCodeLoading || isCooldown}
            >
              {verificationCodeLoading ? (
                <ActivityIndicator size="small" color={colors.accentColor} />
              ) : (
                <CustomText style={{ color: colors.accentColor }}>
                  {isCooldown
                    ? i18n.t("auth.verification.waitMessage", {
                        time: verificationTime,
                      })
                    : baseContent.resend}
                </CustomText>
              )}
            </Pressable>
          </View>
        </View>
      </CustomView>
    </TouchableWithoutFeedback>
  );
};

export default verification;

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

  inputFielderror: {},

  btn: {
    height: verticalScale(40),
    borderRadius: scale(4),
    alignItems: "center",
    justifyContent: "center",
    marginBlock: verticalScale(0),
  },

  signinButton: {
    width: "100%",
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
