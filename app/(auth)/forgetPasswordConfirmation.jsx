import { BASE_URL } from "@/utils/api";
import { useTheme } from "@react-navigation/native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
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
import { ErrorIcon, EyeIcon, EyeOffIcon } from "../../constants/icons";
import i18n from "../../src/localization/i18n";

const forgetPasswordConfirmation = () => {
  const baseContent = i18n.t("auth.forgetPasswordConfirmation");

  const { colors } = useTheme();
  const { email } = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [resetLoader, setResetLoader] = useState(false);

  const router = useRouter();

  const resetHandler = async () => {
    try {
      if (!password) {
        setPasswordError(baseContent.errorStatesAndApi.passwordRequired);
        return;
      } else if (password.length < 8) {
        setPasswordError(baseContent.errorStatesAndApi.passwordLeastCharecter);
        return;
      } else if (password.length > 20) {
        setPasswordError(baseContent.errorStatesAndApi.passwordMostCharecter);
        return;
      }

      if (!confirmPassword) {
        setConfirmPasswordError(
          baseContent.errorStatesAndApi.confirmPasswordRequired,
        );
        return;
      } else if (password !== confirmPassword) {
        setConfirmPasswordError(
          baseContent.errorStatesAndApi.passwordsNotMatch,
        );
        return;
      }

      setResetLoader(true);

      const { data } = await axios.post(`${BASE_URL}/customer/resetPassword`, {
        email,
        newPassword: password,
      });

      setResetLoader(false);
      router.replace("/signin");
    } catch (error) {
      setResetLoader(false);
      Toast.error(error?.response?.data?.message);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <CustomView style={{ justifyContent: "space-between" }}>
        <View style={{ gap: verticalScale(20) }}>
          <View>
            <CustomText style={styles.heading}>{baseContent.header}</CustomText>

            <CustomSecondaryText>{baseContent.subHeader}</CustomSecondaryText>
          </View>

          <View style={styles.inputWrapper}>
            <CustomText>{baseContent.passwordInput.label}</CustomText>

            <View
              style={[
                styles.passwordInputContainer,
                {
                  borderColor: colors.queueBorder,
                  backgroundColor: colors.cardColor,
                  color: colors.text,
                },
              ]}
            >
              <TextInput
                editable
                placeholder={baseContent.passwordInput.placeholder}
                placeholderTextColor={colors.secondaryText}
                style={[
                  false ? styles.inputFielderror : styles.inputField,
                  {
                    fontFamily: "AirbnbCereal_W_Md",
                    color: colors.text,
                    flex: 1,
                  },
                ]}
                onChangeText={(text) => {
                  setPasswordError("");
                  setPassword(text);
                }}
                value={password}
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? (
                  <EyeOffIcon color={colors.secondaryText} />
                ) : (
                  <EyeIcon color={colors.secondaryText} />
                )}
              </Pressable>
            </View>

            {passwordError && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(5),
                }}
              >
                <ErrorIcon color="red" size={scale(16)} />
                <CustomText style={{ fontSize: scale(12), color: "red" }}>
                  {passwordError}
                </CustomText>
              </View>
            )}
          </View>

          <View style={styles.inputWrapper}>
            <CustomText>{baseContent.confirmPasswordInput.label}</CustomText>

            <View
              style={[
                styles.passwordInputContainer,
                {
                  borderColor: colors.queueBorder,
                  backgroundColor: colors.cardColor,
                  color: colors.text,
                },
              ]}
            >
              <TextInput
                editable
                placeholder={baseContent.confirmPasswordInput.placeholder}
                placeholderTextColor={colors.secondaryText}
                style={[
                  false ? styles.inputFielderror : styles.inputField,
                  {
                    fontFamily: "AirbnbCereal_W_Md",
                    color: colors.text,
                    flex: 1,
                  },
                ]}
                onChangeText={(text) => {
                  setConfirmPasswordError("");
                  setConfirmPassword(text);
                }}
                value={confirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon color={colors.secondaryText} />
                ) : (
                  <EyeIcon color={colors.secondaryText} />
                )}
              </Pressable>
            </View>

            {confirmPasswordError && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(5),
                }}
              >
                <ErrorIcon color="red" size={scale(16)} />
                <CustomText style={{ fontSize: scale(12), color: "red" }}>
                  {confirmPasswordError}
                </CustomText>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={resetHandler}
          disabled={resetLoader}
          style={[styles.signupButton, { backgroundColor: colors.accentColor }]}
          activeOpacity={0.85}
        >
          {resetLoader ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <CustomText style={styles.signupButtonText}>
              {baseContent.reset}
            </CustomText>
          )}
        </TouchableOpacity>
      </CustomView>
    </TouchableWithoutFeedback>
  );
};

export default forgetPasswordConfirmation;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "AirbnbCereal_W_Bd",
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

  resendbtn: {
    height: verticalScale(40),
    borderRadius: scale(4),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginBlock: verticalScale(0),
    paddingHorizontal: scale(20),
  },

  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: scale(4),
    // backgroundColor: "#0BA3AD1A",
    borderWidth: scale(1),
    borderColor: "gray",
    gap: scale(10),
    paddingRight: scale(10),
  },

  signupButton: {
    width: "100%",
    // bg-teal-500
    paddingVertical: verticalScale(12), // py-4
    borderRadius: scale(8), // rounded-xl
    alignItems: "center",
    justifyContent: "center",
  },
  signupButtonText: {
    color: "#fff", // text-white
    fontFamily: "AirbnbCereal_W_XBd",
    fontSize: scale(16),
  },
});
