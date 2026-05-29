import { usePreventRemove, useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import CustomText from "../../components/CustomText";
import CustomView from "../../components/CustomView";
import { ErrorIcon, EyeIcon, EyeOffIcon } from "../../constants/icons";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import * as AppleAuthentication from "expo-apple-authentication";
import { jwtDecode } from "jwt-decode";
import { Toast } from "toastify-react-native";
import i18n from "../../src/localization/i18n";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../src/firebase/auth";
import { FirebaseLogout } from "../../src/firebase/authService";

const signup = () => {
  const baseContent = i18n.t("auth.signup");

  const { colors } = useTheme();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    setIsAuthenticated,
    setAuthenticatedUser,
    setSignUpData,
    signUpData,
  } = useAuth();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [checkEmailLoading, setCheckEmailLoading] = useState(false);

  const signupPressed = async () => {
    try {
      if (!email) {
        return setEmailError(baseContent.errorStatesAndApi.emailRequired);
      } else if (!emailRegex.test(email)) {
        return setEmailError(baseContent.errorStatesAndApi.invalidEmailFormat);
      }

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

      setCheckEmailLoading(true);

      const { data } = await api.post(`/customer/checkEmail`, {
        email,
      });

      setCheckEmailLoading(false);

      router.push({
        pathname: "/personalInfo",
        params: {
          email,
          password,
        },
      });
    } catch (error) {
      console.log("Error ", error);
      setCheckEmailLoading(false);

      Toast.error(error?.response?.data?.message);
    }
  };

  // Google Firebase

  const [googleSigninLoader, setGoogleSigninLoader] = useState(false);

  useEffect(() => {
    // This configures the native Google SDK layer
    GoogleSignin.configure({
      webClientId:
        process.env.EXPO_PUBLIC_WEBCLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  const syncWithBackend = async (currentUser) => {
    try {
      setGoogleSigninLoader(true);

      const { data } = await api.post(`/customer/checkEmail`, {
        email: currentUser?.email,
      });

      setGoogleSigninLoader(false);

      router.push({
        pathname: "/personalInfo",
        params: {
          email: currentUser?.email,
          authType: "google",
        },
      });
    } catch (error) {
      await FirebaseLogout();
      setGoogleSigninLoader(false);
      Toast.error(error?.response?.data?.message);
    }
  };

  const signUpWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken || response.idToken;

      if (!idToken) {
        console.log("No ID Token found from Google Sign-In");
        return;
      }

      // This line of code is the essential bridge between Google and Firebase. It takes the successful login proof from the mobile device and translates it into a standard
      // format that the Firebase backend understands.
      const credential = GoogleAuthProvider.credential(idToken);

      // Pass token to Firebase. onAuthStateChanged automatically catches this state.
      const userCredential = await signInWithCredential(auth, credential);
      console.log("Google Logged in ");
      await syncWithBackend(userCredential.user);
    } catch (error) {
      await FirebaseLogout();
      console.error("Google Sign-Up Error: ", error);
    }
  };

  usePreventRemove(true, ({ data }) => {});

  const [appleSignupLoader, setAppleSignupLoader] = useState(false);

  const handleAppleSignup = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const decodedUser = jwtDecode(credential.identityToken);

      if (!decodedUser?.email) {
        return Toast.error(baseContent.errorStatesAndApi.retreiveEmailError);
      }

      setAppleSignupLoader(true);

      const { data } = await api.post(`/customer/checkEmail`, {
        email: decodedUser?.email,
      });

      setAppleSignupLoader(false);

      router.push({
        pathname: "/personalInfo",
        params: {
          email: decodedUser?.email,
          authType: "apple",
        },
      });
    } catch (error) {
      if (error.code === "ERR_REQUEST_CANCELED") {
        // handle that the user canceled the sign-in flow
        setAppleSignupLoader(false);
      } else {
        // handle other errors

        setAppleSignupLoader(false);
        Toast.error(error?.response?.data?.message);
        console.log("Error ", error);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <CustomView
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <View style={{ width: "100%", gap: verticalScale(20) }}>
          <Image
            style={[styles.Logo, { tintColor: colors.text }]}
            source={require("../../assets/images/iqbook.png")}
            resizeMode="cover"
          />

          <View style={{ gap: verticalScale(10) }}>
            <View
              style={{
                gap: verticalScale(10),
              }}
            >
              <CustomText>{baseContent.email.label}</CustomText>
              <TextInput
                editable
                placeholder={baseContent.email.placeholder}
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
                  setEmailError("");
                  setEmail(text);
                }}
                value={email}
              />
            </View>

            {emailError && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(5),
                }}
              >
                <ErrorIcon color="red" size={scale(16)} />
                <CustomText style={{ fontSize: scale(12), color: "red" }}>
                  {emailError}
                </CustomText>
              </View>
            )}
          </View>

          <View
            style={{
              gap: verticalScale(10),
            }}
          >
            <CustomText>{baseContent.password.label}</CustomText>
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
                placeholder={baseContent.password.placeholder}
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

          <TouchableOpacity
            onPress={signupPressed}
            disabled={checkEmailLoading}
            style={[
              styles.signupButton,
              { backgroundColor: colors.accentColor },
            ]}
            activeOpacity={0.85}
          >
            {checkEmailLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <CustomText style={styles.signupButtonText}>
                {baseContent.signUp}
              </CustomText>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View
              style={{
                flex: 1,
                height: verticalScale(0.5),
                backgroundColor: colors.secondaryText,
              }}
            />

            <View style={{ paddingHorizontal: moderateScale(10) }}>
              <CustomText style={{ color: colors.text }}>
                {baseContent.or}
              </CustomText>
            </View>

            <View
              style={{
                flex: 1,
                height: verticalScale(0.5),
                backgroundColor: colors.secondaryText,
              }}
            />
          </View>

          {Platform.OS === "ios" ? (
            <Pressable
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={
                  AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP
                }
                buttonStyle={
                  AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                }
                cornerRadius={scale(8)}
                style={{ width: scale(320), height: verticalScale(40) }}
                onPress={!appleSignupLoader ? handleAppleSignup : null}
              />
            </Pressable>
          ) : (
            <Pressable
              disabled={googleSigninLoader}
              onPress={signUpWithGoogle}
              style={[
                styles.auth_btn,
                {
                  borderWidth: scale(1),
                  backgroundColor: colors.cardColor,
                  borderColor: colors.queueBorder,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: scale(10),
                },
              ]}
            >
              <>
                <Image
                  source={require("../../assets/images/google.png")}
                  height={30}
                  width={30}
                />
                <CustomText>{baseContent.signUpWithGoogle}</CustomText>
              </>
            </Pressable>
          )}

          <Pressable
            onPress={async () => {
              await FirebaseLogout();
              router.push("/signin");
            }}
          >
            <CustomText
              style={[styles.subHeading, { color: colors.secondaryText }]}
            >
              {baseContent.alreadyMember}{" "}
              <CustomText style={{ color: colors.accentColor }}>
                {" "}
                {baseContent.logIn}
              </CustomText>
            </CustomText>
          </Pressable>
        </View>
      </CustomView>
    </TouchableWithoutFeedback>
  );
};

export default signup;

const styles = StyleSheet.create({
  Logo: {
    width: moderateScale(100),
    height: moderateScale(100),
    marginHorizontal: "auto",
  },

  inputField: {
    height: verticalScale(40),
    borderRadius: scale(8),
    paddingHorizontal: scale(10),
    fontSize: moderateScale(14),
  },
  inputFielderror: {},

  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: scale(8),
    gap: scale(10),
    paddingRight: scale(10),
    borderWidth: scale(1),
  },
  auth_btn: {
    height: verticalScale(40),
    borderRadius: scale(8),
    alignItems: "center",
    justifyContent: "center",
  },
  subHeading: {
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
