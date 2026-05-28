import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { usePreventRemove, useTheme } from "@react-navigation/native";
import api from "../../utils/api";
import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { jwtDecode } from "jwt-decode";
import { Toast } from "toastify-react-native";
import { ErrorIcon, EyeIcon, EyeOffIcon } from "../../constants/icons";
import i18n from "../../src/localization/i18n";
import { getToken, saveToken } from "@/utils/tokenStorage";
import axios from "axios";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../src/firebase/auth";
import { FirebaseLogout } from "../../src/firebase/authService";

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

  const {
    setIsAuthenticated,
    setAuthenticatedUser,
    setSignInData,
    signInData,
    rememberMe,
    setRememberMe,
  } = useAuth();

  const { colors } = useTheme();

  const router = useRouter();

  // const [rememberMe, setRememberMe] = useState(true);

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

      const { data } = await api.post(`/customer/signIn`, {
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

      // console.log(data)

      await saveToken(data?.token);

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
      console.log(error);
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

      const { data } = await api.post(`/customer/appleCustomerSignIn`, {
        email: decodedUser?.email,
      });

      await saveToken(data?.token);

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
  };

  // Google Firebase

  const [googleSigninLoader, setGoogleSigninLoader] = useState(false);

  useEffect(() => {
    // This configures the native Google SDK layer
    GoogleSignin.configure({
      webClientId:
        "328989269092-gs9sjo1bhn0a153olt6p1peq6i25u7f2.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  const syncWithBackend = async (currentUser) => {
    try {
      setGoogleSigninLoader(true);

      const { data } = await api.post(`/customer/googleCustomerSignIn`, {
        email: currentUser?.email,
      });

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

      await saveToken(data?.token);

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
      await FirebaseLogout();
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

  const signInWithGoogle = async () => {
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
      await syncWithBackend(userCredential.user);
    } catch (error) {
      await FirebaseLogout();
      console.error("Google Sign-In Error: ", error);
      Alert.alert("Google Sign-In Failed", error.message);
    }
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
            // <Pressable
            //   disabled={googleSigninLoader}
            //   onPress={googleSigninPressed}
            // style={[
            //   styles.auth_btn,
            //   {
            //     borderWidth: scale(1),
            //     backgroundColor: colors.cardColor,
            //     borderColor: colors.queueBorder,
            //     flexDirection: "row",
            //     alignItems: "center",
            //     gap: scale(10),
            //   },
            // ]}
            // >
            // {googleSigninLoader ? (
            //   <ActivityIndicator size="small" color={colors.text} />
            // ) : (
            //   <>
            //     <Image
            //       source={require("../../assets/images/google.png")}
            //       height={30}
            //       width={30}
            //     />
            //     <CustomText>{baseContent.signInWithGoogle}</CustomText>
            //   </>
            // )}
            // </Pressable>
            <>
              <Pressable
                onPress={signInWithGoogle}
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

              <Pressable
                onPress={async () => {
                  await FirebaseLogout();
                }}
              >
                <CustomText>Google Log out</CustomText>
              </Pressable>
            </>
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

// import React, { useEffect, useState } from "react";
// import {
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import {
//   GoogleSignin,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
// import {
//   GoogleAuthProvider,
//   signInWithCredential,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { auth } from "../../src/firebase/auth";
// import { FirebaseLogout } from "../../src/firebase/authService";

// const index = () => {
// // Track the logged-in user state and the initial checking/loading state
// const [user, setUser] = useState(null);
// const [loading, setLoading] = useState(true);

// // const auth = getAuth();

// useEffect(() => {
//   // This configures the native Google SDK layer
//   GoogleSignin.configure({
//     webClientId:
//       "328989269092-gs9sjo1bhn0a153olt6p1peq6i25u7f2.apps.googleusercontent.com",
//     offlineAccess: true,
//   });

//   // Listen globally for session updates (login, sign up, or logout events)
//   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//     setUser(currentUser);
//     setLoading(false);
//   });

//   // Clean up authentication listener thread when component unmounts
//   return unsubscribe;
// }, []);

// const signInWithGoogle = async () => {
//   try {
//     await GoogleSignin.hasPlayServices({
//       showPlayServicesUpdateDialog: true,
//     });
//     const response = await GoogleSignin.signIn();
//     const idToken = response.data?.idToken || response.idToken;

//     if (!idToken) {
//       console.log("No ID Token found from Google Sign-In");
//       return;
//     }

//     // This line of code is the essential bridge between Google and Firebase. It takes the successful login proof from the mobile device and translates it into a standard
//     // format that the Firebase backend understands.
//     const credential = GoogleAuthProvider.credential(idToken);

//     // Pass token to Firebase. onAuthStateChanged automatically catches this state.
//     await signInWithCredential(auth, credential);
//   } catch (error) {
//     console.error("Google Sign-In Error: ", error);
//     Alert.alert("Sign-In Failed", error.message);
//   }
// };

//   // Render a clean loading indicator while initializing active session state
//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#4285F4" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {user ? (
//         // ─── AUTHENTICATED / LOGGED IN PANEL ───
//         <View style={styles.authCard}>
//           <View style={styles.headerZone}>
//             <Text style={styles.titleText}>Profile Info</Text>
//             <Text style={styles.subtitleText}>
//               Successfully authenticated session
//             </Text>
//           </View>

//           {/* User Data Fields */}
//           <View style={styles.profileDataWrapper}>
//             <Text style={styles.label}>Name</Text>
//             <Text style={styles.value}>
//               {user.displayName || "Standard Email User"}
//             </Text>

//             <View style={styles.innerFieldDivider} />

//             <Text style={styles.label}>Email Address</Text>
//             <Text style={styles.value}>{user.email}</Text>
//           </View>

//           {/* System Logout Trigger */}
//           <Pressable
//             style={[styles.button, styles.logoutButton]}
//             onPress={async () => {
//               try {
//                 await FirebaseLogout();
//               } catch (error) {
//                 Alert.alert("Logout Failed", error.message);
//               }
//             }}
//           >
//             <Text style={styles.logoutButtonText}>Log out</Text>
//           </Pressable>
//         </View>
//       ) : (
//         // ─── UNAUTHENTICATED / LOGGED OUT FORMS ───
//         <View style={styles.authCard}>
//           {/* Header Title Section */}
//           <View style={styles.headerZone}>
//             <Text style={styles.titleText}>Welcome</Text>
//             <Text style={styles.subtitleText}>
//               Manage your authentication session
//             </Text>
//           </View>

//           {/* OAuth Google Federated Button */}
//           <Pressable
//             style={[styles.button, styles.googleButton]}
//             onPress={signInWithGoogle}
//           >
//             <Text style={styles.googleButtonText}>Sign In with Google</Text>
//           </Pressable>
//         </View>
//       )}
//     </View>
//   );
// };

// export default index;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 20,
//   },
//   authCard: {
//     width: "100%",
//     maxWidth: 360,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 24,
//     alignItems: "center",
//     elevation: 4,
//     shadowColor: "#0F172A",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//   },
//   headerZone: {
//     alignItems: "center",
//     marginBottom: 28,
//   },
//   titleText: {
//     fontSize: 26,
//     fontWeight: "700",
//     color: "#0F172A",
//     letterSpacing: -0.5,
//   },
//   subtitleText: {
//     fontSize: 14,
//     color: "#64748B",
//     marginTop: 4,
//     textAlign: "center",
//   },
//   profileDataWrapper: {
//     width: "100%",
//     backgroundColor: "#F8FAFC",
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 11,
//     color: "#64748B",
//     fontWeight: "600",
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   value: {
//     fontSize: 15,
//     color: "#0F172A",
//     fontWeight: "600",
//     marginTop: 2,
//   },
//   innerFieldDivider: {
//     height: 1,
//     backgroundColor: "#E2E8F0",
//     my: 12,
//     marginVertical: 12,
//   },
//   button: {
//     width: "100%",
//     height: 48,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 6,
//   },
//   primaryButton: {
//     backgroundColor: "#0F172A",
//   },
//   primaryButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "600",
//     fontSize: 15,
//   },
//   secondaryButton: {
//     backgroundColor: "#F1F5F9",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//   },
//   secondaryButtonText: {
//     color: "#334155",
//     fontWeight: "600",
//     fontSize: 15,
//   },
//   dividerContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     marginVertical: 16,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#E2E8F0",
//   },
//   dividerText: {
//     marginHorizontal: 12,
//     color: "#94A3B8",
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   googleButton: {
//     backgroundColor: "#4285F4",
//     elevation: 2,
//     shadowColor: "#4285F4",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   googleButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "700",
//     fontSize: 15,
//   },
//   logoutButton: {
//     backgroundColor: "transparent",
//     marginTop: 12,
//     borderWidth: 1,
//     borderColor: "#FEE2E2",
//     width: "100%",
//   },
//   logoutButtonText: {
//     color: "#EF4444",
//     fontWeight: "600",
//     fontSize: 14,
//   },
// });
