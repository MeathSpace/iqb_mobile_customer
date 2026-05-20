import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
import CustomSecondaryText from "../../components/CustomSecondaryText";
import CustomText from "../../components/CustomText";
import CustomView from "../../components/CustomView";
import { useAuth } from "../../context/AuthContext";

import { useGlobal } from "@/context/GlobalContext";
import { BASE_URL } from "@/utils/api";
import { useClerk, useSSO, useUser } from "@clerk/clerk-expo";
import { usePreventRemove, useTheme } from "@react-navigation/native";
import axios from "axios";
import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { jwtDecode } from "jwt-decode";
import { Toast } from "toastify-react-native";
import { ErrorIcon, EyeIcon, EyeOffIcon } from "../../constants/icons";
import i18n from "../../src/localization/i18n";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

const signin = () => {
  const baseContent = i18n.t("auth.signin");

  useEffect(() => {
    const fetchRememberMeData = async () => {
      const data = await AsyncStorage.getItem("LoggedInUser");
      const parseData = JSON.parse(data);

      if (parseData?.authType === "local") {
        setEmail(parseData?.email);
        setPassword(parseData?.userPassword);
      }
    };

    fetchRememberMeData();
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Error state
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  useWarmUpBrowser();

  const {
    setIsAuthenticated,
    setAuthenticatedUser,
    setSignInData,
    signInData,
  } = useAuth();

  const { colors } = useTheme();

  const router = useRouter();

  // const [rememberMe, setRememberMe] = useState(true);

  const { rememberMe, setRememberMe } = useGlobal();

  const { signOut } = useClerk();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const signinPressed = async () => {
    try {
      if (!email) {
        setEmailError(baseContent.errorStatesAndApi.emailRequired);
        return;
      } else if (!emailRegex.test(email)) {
        return setEmailError(baseContent.errorStatesAndApi.invalidEmailFormat);
      } else if (!password) {
        setPasswordError(baseContent.errorStatesAndApi.passwordRequired);
        return;
      } else if (password.length < 8) {
        setPasswordError(baseContent.errorStatesAndApi.passwordLeastCharecter);
        return;
      } else if (password.length > 20) {
        setPasswordError(baseContent.errorStatesAndApi.passwordMostCharecter);
        return;
      }

      setSignInData((prev) => ({ ...prev, loading: true }));

      const { data } = await axios.post(`${BASE_URL}/customer/signIn`, {
        email,
        password,
      });

      setSignInData((prev) => ({
        ...prev,
        loading: false,
        user: data?.response,
        success: true,
        error: null,
      }));

      if (rememberMe) {
        await AsyncStorage.setItem("isAuthenticated", JSON.stringify(true));
      }

      await AsyncStorage.setItem(
        "LoggedInUser",
        JSON.stringify({ ...data?.response, userPassword: password }),
      );
      setAuthenticatedUser({ ...data?.response, userPassword: password });
      setIsAuthenticated(true);
      router.push("/home");
    } catch (error) {
      setSignInData((prev) => ({
        ...prev,
        loading: false,
        user: null,
        success: false,
        error: error,
      }));
      Toast.error(error?.response?.data?.message);
    }
  };

  const { startSSOFlow } = useSSO();

  const { isLoaded, isSignedIn, user } = useUser();

  const [googleClicked, setGoogleClicked] = useState(false);

  const googleSigninPressed = useCallback(async () => {
    try {
      setEmail("");
      setPassword("");
      setEmailError("");
      setPasswordError("");
      setGoogleClicked(true);

      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          // redirectUrl: AuthSession.makeRedirectUri(),
          redirectUrl: AuthSession.makeRedirectUri({
            scheme: "iqbmobilecustomer",
            path: "/signin",
          }),
        });

      // This code generates the URL that your app tells
      // the authentication provider (like Google) to use when sending
      // the user back to your app. It includes the scheme (iqbmobilecustomer)
      // and the path (/callback).

      // If sign in was successful, set the active session
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }

      setGoogleClicked(false);
    } catch (err) {
      setGoogleClicked(false);
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  const [googleSigninLoader, setGoogleSigninLoader] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isSignedIn) {
        const handleAuth = async () => {
          try {
            // setSignInData((prev) => ({ ...prev, loading: true }))

            setGoogleSigninLoader(true);

            const { data } = await axios.post(
              `${BASE_URL}/customer/googleCustomerSignIn`,
              {
                email: user?.primaryEmailAddress?.emailAddress,
              },
            );

            setSignInData((prev) => ({
              ...prev,
              loading: false,
              user: {
                ...data?.response,
              },
              success: true,
              error: null,
            }));

            setGoogleSigninLoader(false);

            if (rememberMe) {
              await AsyncStorage.setItem(
                "isAuthenticated",
                JSON.stringify(true),
              );
            } else {
              await signOut();
            }

            await AsyncStorage.setItem(
              "LoggedInUser",
              JSON.stringify({
                ...data?.response,
              }),
            );
            setAuthenticatedUser({
              ...data?.response,
            });
            setIsAuthenticated(true);
            router.push("/home");
          } catch (error) {
            await signOut();
            setGoogleSigninLoader(false);
            setSignInData((prev) => ({
              ...prev,
              loading: false,
              user: null,
              success: false,
              error: error,
            }));
            Toast.error(error?.response?.data?.message);
            console.log("Error ", error);
          }
        };

        handleAuth();
      }

      // Optional cleanup when screen is unfocused
      return () => {
        // console.log('Screen is unfocused');
      };
    }, [isSignedIn, router, rememberMe, user]),
  );

  usePreventRemove(true, ({ data }) => {});

  const [appleSigninLoader, setAppleSigninLoader] = useState(false);

  const handleAppleSignin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const decodedUser = jwtDecode(credential.identityToken);

      if (!decodedUser?.email) {
        return Toast.error(baseContent.errorStatesAndApi.appleSigninFailed);
      }

      setAppleSigninLoader(true);

      const { data } = await axios.post(
        `${BASE_URL}/customer/appleCustomerSignIn`,
        {
          email: decodedUser?.email,
        },
      );

      setSignInData((prev) => ({
        ...prev,
        loading: false,
        user: {
          ...data?.response,
        },
        success: true,
        error: null,
      }));

      setAppleSigninLoader(false);

      if (rememberMe) {
        await AsyncStorage.setItem("isAuthenticated", JSON.stringify(true));
      }

      await AsyncStorage.setItem(
        "LoggedInUser",
        JSON.stringify({
          ...data?.response,
        }),
      );
      setAuthenticatedUser({
        ...data?.response,
      });
      setIsAuthenticated(true);
      router.push("/home");
    } catch (error) {
      if (error.code === "ERR_REQUEST_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
        setAppleSigninLoader(false);
        setSignInData((prev) => ({
          ...prev,
          loading: false,
          user: null,
          success: false,
          error: error,
        }));
        Toast.error(error?.response?.data?.message);
        console.log("Error ", error);
      }
    }

    // try {
    //     const token = "eyJraWQiOiJTZjJsRnF3a3BYIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiaG9zdC5leHAuRXhwb25lbnQiLCJleHAiOjE3NTg2MTQ4OTEsImlhdCI6MTc1ODUyODQ5MSwic3ViIjoiMDAwMTQ2LmUwODE3ZjJmMmNjNTQxODE4MTYyZjdkMTVmMzQ5NzQzLjA3MjUiLCJjX2hhc2giOiJDdERBRk52VnVCMm9wNUlKcV9OSWdBIiwiZW1haWwiOiJzdW1pdGNvbUBob3RtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdXRoX3RpbWUiOjE3NTg1Mjg0OTEsIm5vbmNlX3N1cHBvcnRlZCI6dHJ1ZX0.bxoGQDa2qn6XfdLyoYR-83bd7gsEU_hKFTu4L4W1niZoUUzLKUBZpJe7soMADM8PWlsANMIkFhOhZcGIII3qO35xYgS21FSpvbG9FkDrIj7SbNUIGoooZvdIS-cbA6wYOFc-kR9VLWal4gP0hJ738RB7sErQHatrD7HrZHAIfk-6SoAjEuf6WW0V0x756Em8o6oDqV4hm1aLZldLY88qhGk74NjoshIQ4LkDVmYlg29xtaMIo0pCbN-r3TkItKjeCcGseq1CJeuV0c2tms1GRnSLLjN3qCyXmeeAaHDa34MT9cRZ2OpITa4KSKpVbmDDf450xchoCLBsk_T1YAheMQ";

    //     const decodedUser = jwtDecode(token);
    //     console.log("Decoded User", decodedUser);
    // } catch (err) {
    //     console.log("Error decoding", err);
    // }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <CustomView style={{ alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: "100%", gap: verticalScale(20) }}>
          <Image
            style={[styles.Logo, { tintColor: colors.text }]}
            source={require("../../assets/images/iqbook.png")}
            resizeMode="cover"
          />

          <View
            style={{
              gap: verticalScale(10),
            }}
          >
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
                    styles.inputField,
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
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: scale(10),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(10),
              }}
            >
              <Checkbox
                style={{
                  borderRadius: scale(3),
                }}
                value={rememberMe}
                onValueChange={setRememberMe}
                color={rememberMe ? colors.accentColor : undefined}
              />
              <CustomSecondaryText>
                {baseContent.rememberMe}
              </CustomSecondaryText>
            </View>

            <Pressable onPress={() => router.push("/forgetPassword")}>
              <CustomSecondaryText style={{ color: colors.accentColor }}>
                {baseContent.forgotPassword}
              </CustomSecondaryText>
            </Pressable>
          </View>

          <TouchableOpacity
            onPress={() => signinPressed()}
            disabled={signInData?.loading}
            style={[
              styles.signinButton,
              { backgroundColor: colors.accentColor },
            ]}
            activeOpacity={0.85}
          >
            {signInData?.loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <CustomText style={styles.signinButtonText}>
                {baseContent.signIn}
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
                  AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                }
                buttonStyle={
                  AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                }
                cornerRadius={scale(8)}
                style={{ width: scale(320), height: verticalScale(40) }}
                onPress={!appleSigninLoader ? handleAppleSignin : null}
              />
            </Pressable>
          ) : (
            <Pressable
              disabled={googleSigninLoader}
              onPress={googleSigninPressed}
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
              {googleSigninLoader ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <>
                  <Image
                    source={require("../../assets/images/google.png")}
                    height={30}
                    width={30}
                  />
                  <CustomText>{baseContent.signInWithGoogle}</CustomText>
                </>
              )}
            </Pressable>
          )}

          <Pressable onPress={() => router.push("/signup")}>
            <CustomText
              style={[styles.subHeading, { color: colors.secondaryText }]}
            >
              {baseContent.dontHaveAccount}
              <CustomText style={{ color: colors.accentColor }}>
                {" "}
                {baseContent.signup}
              </CustomText>
            </CustomText>
          </Pressable>
        </View>
      </CustomView>
    </TouchableWithoutFeedback>
  );
};

export default signin;

const styles = StyleSheet.create({
  Logo: {
    width: moderateScale(100),
    height: moderateScale(100),
    marginHorizontal: "auto",
    // marginBlock: verticalScale(25)
  },

  inputField: {
    height: verticalScale(40),
    borderRadius: scale(4),
    paddingHorizontal: scale(10),
    // marginBottom: verticalScale(25),
    fontSize: moderateScale(14),
  },
  inputFielderror: {},

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
