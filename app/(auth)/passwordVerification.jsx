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
import { ErrorIcon } from "../../constants/icons";
import i18n from "../../src/localization/i18n";

const passwordVerification = () => {

  const baseContent = i18n.t("auth.passwordVerification")

  const { colors } = useTheme();
  const { email, verificationCodeValue } = useLocalSearchParams();

  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCodeError, setVerificationCodeError] = useState("");
  const [currentVerificationOtp, setCurrentVerificationOtp] = useState(
    verificationCodeValue,
  );
  const [verificationCodeLoading, setVerificationCodeLoading] = useState(false);
  const [verificationTime, setVerificationTime] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const router = useRouter();

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
      Toast.error(baseContent.errorStatesAndApi.waitRequestCode);
      return;
    }

    try {
      setVerificationCodeLoading(true);
      const { data } = await api.post(`/customer/forgetPassword`, {
        email,
      });

      setVerificationCodeLoading(false);
      setCurrentVerificationOtp(data?.response?.verificationCode);
      console.log(baseContent.errorStatesAndApi.resendVerifyCode, data?.response);

      // ✅ Start cooldown here
      setIsCooldown(true);
      setVerificationTime(30);
    } catch (error) {
      setVerificationCodeLoading(false);
      console.log(baseContent.errorStatesAndApi.verificationOtpError, error);
      Toast.error(error?.response?.data?.message);
    }
  };

  const continueHandler = () => {
    if (!verificationCode) {
      setVerificationCodeError(baseContent.errorStatesAndApi.verificationCodeRequired);
      return;
    } else if (Number(verificationCode) !== Number(currentVerificationOtp)) {
      setVerificationCodeError(baseContent.errorStatesAndApi.verificationCodeNotMatched);
      return;
    }

    router.push({
      pathname: "/forgetPasswordConfirmation",
      params: {
        email,
      },
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <CustomView style={{ justifyContent: "space-between" }}>
        <View style={{ gap: verticalScale(20) }}>
          <View>
            <CustomText style={styles.heading}>
              {baseContent.header}
            </CustomText>

            <CustomSecondaryText>
              {baseContent.subHeader}
            </CustomSecondaryText>
          </View>

          <View style={styles.inputWrapper}>
            <CustomText>
              {baseContent.verificationCode.label}
            </CustomText>

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
            onPress={continueHandler}
            style={[
              styles.signinButton,
              { backgroundColor: colors.accentColor },
            ]}
            activeOpacity={0.85}
          >
            <CustomText style={styles.signinButtonText}>
              {baseContent.verifyAndContinue}
            </CustomText>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center", // centers the entire row
              marginHorizontal: "auto",
            }}
          >
            <CustomSecondaryText>{baseContent.didntReceiveCode} </CustomSecondaryText>

            <Pressable
              onPress={resendVerification}
              disabled={verificationCodeLoading || isCooldown}
            >
              {verificationCodeLoading ? (
                <ActivityIndicator size="small" color={colors.accentColor} />
              ) : (
                <CustomText style={{ color: colors.accentColor }}>
                  {isCooldown
                    ? i18n.t("auth.passwordVerification.waitMessage", {
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

export default passwordVerification;

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
    borderRadius: scale(4),
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
