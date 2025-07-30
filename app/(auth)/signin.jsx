import { ActivityIndicator, Image, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import CustomView from "../../components/CustomView"
import CustomText from "../../components/CustomText"
import CustomSecondaryText from '../../components/CustomSecondaryText';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { useAuth } from '../../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useClerk, useSSO, useUser } from '@clerk/clerk-expo'
import { useTheme } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { ErrorIcon, EyeIcon, EyeOffIcon } from '../../constants/icons';
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'
import { useGlobal } from '@/context/GlobalContext';

export const useWarmUpBrowser = () => {
    useEffect(() => {
        // Preloads the browser for Android devices to reduce authentication load time
        // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
        void WebBrowser.warmUpAsync()
        return () => {
            // Cleanup: closes browser when component unmounts
            void WebBrowser.coolDownAsync()
        }
    }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

const signin = () => {

    useEffect(() => {
        const fetchRememberMeData = async () => {
            const data = await AsyncStorage.getItem("LoggedInUser")
            const parseData = JSON.parse(data)
            setEmail(parseData?.email)
            setPassword(parseData?.userPassword)
        }

        fetchRememberMeData()
    }, [])

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);

    // Error state 
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    useWarmUpBrowser()

    const { setIsAuthenticated, setAuthenticatedUser, setSignInData, signInData } = useAuth()

    const { colors } = useTheme()

    const router = useRouter()

    // const [rememberMe, setRememberMe] = useState(true);

    const { rememberMe, setRememberMe } = useGlobal()

    const { signOut } = useClerk()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const signinPressed = async () => {
        try {
            if (!email) {
                setEmailError("Email is required");
                return;
            } else if (!emailRegex.test(email)) {
                return setEmailError("Invalid email format")
            } else if (!password) {
                setPasswordError("Password is required");
                return;
            } else if (password.length < 8) {
                setPasswordError("Password must be at least 8 characters");
                return;
            } else if (password.length > 20) {
                setPasswordError("Password must be at most 20 characters");
                return;
            }

            setSignInData((prev) => ({ ...prev, loading: true }))

            const { data } = await axios.post(`${BASE_URL}/customer/signIn`, {
                email,
                password
            })

            setSignInData((prev) => ({ ...prev, loading: false, user: data?.response, success: true, error: null }))

            if (rememberMe) {
                await AsyncStorage.setItem("isAuthenticated", JSON.stringify(true))
            }

            await AsyncStorage.setItem("LoggedInUser", JSON.stringify({ ...data?.response, userPassword: password }))
            setAuthenticatedUser({ ...data?.response, userPassword: password })
            setIsAuthenticated(true)
            router.push("/home")

        } catch (error) {
            setSignInData((prev) => ({ ...prev, loading: false, user: null, success: false, error: error }))
            Toast.error(error?.response?.data?.message)
        }

    }


    const { startSSOFlow } = useSSO()

    const { isLoaded, isSignedIn, user } = useUser()

    const [googleClicked, setGoogleClicked] = useState(false)

    const googleSigninPressed = useCallback(async () => {
        try {

            setGoogleClicked(true)

            // Start the authentication process by calling `startSSOFlow()`
            const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
                strategy: 'oauth_google',
                // For web, defaults to current path
                // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
                // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
                // redirectUrl: AuthSession.makeRedirectUri(),
                redirectUrl: AuthSession.makeRedirectUri({ scheme: 'iqbmobilecustomer', path: '/signin' })
            })

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

            setGoogleClicked(false)
        } catch (err) {
            setGoogleClicked(false)
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))


        }
    }, []);


    const [googleSigninLoader, setGoogleSigninLoader] = useState(false)

    // useEffect(() => {

    //     if (isSignedIn) {
    //         const handleAuth = async () => {
    //             try {
    //                 // setSignInData((prev) => ({ ...prev, loading: true }))

    //                 setGoogleSigninLoader(true)

    //                 const { data } = await axios.post(`${BASE_URL}/customer/googleCustomerSignIn`, {
    //                     email: user?.primaryEmailAddress?.emailAddress,
    //                 })

    //                 setSignInData((prev) => ({
    //                     ...prev, loading: false, user: {
    //                         ...data?.response,
    //                         // profile: [
    //                         //     { url: user?.imageUrl }
    //                         // ]
    //                     }, success: true, error: null
    //                 }))

    //                 setGoogleSigninLoader(false)


    //                 if (rememberMe) {
    //                     await AsyncStorage.setItem("isAuthenticated", JSON.stringify(true))
    //                 } else {
    //                     await signOut()
    //                 }

    //                 await AsyncStorage.setItem("LoggedInUser", JSON.stringify({
    //                     ...data?.response,
    //                     // profile: [
    //                     //     { url: user?.imageUrl }
    //                     // ]
    //                 }))
    //                 setAuthenticatedUser({
    //                     ...data?.response,
    //                     // profile: [
    //                     //     { url: user?.imageUrl }
    //                     // ]
    //                 })
    //                 setIsAuthenticated(true)
    //                 router.push("/home")

    //             } catch (error) {
    //                 await signOut()
    //                 setGoogleSigninLoader(false)
    //                 setSignInData((prev) => ({ ...prev, loading: false, user: null, success: false, error: error }))
    //                 Toast.error(error?.response?.data?.message)
    //                 console.log("Error ", error)
    //             }
    //         };

    //         handleAuth();
    //     }


    // }, [isSignedIn, router, rememberMe, user]);

    useFocusEffect(
        useCallback(() => {
            if (isSignedIn) {
                const handleAuth = async () => {
                    try {
                        // setSignInData((prev) => ({ ...prev, loading: true }))

                        setGoogleSigninLoader(true)

                        const { data } = await axios.post(`${BASE_URL}/customer/googleCustomerSignIn`, {
                            email: user?.primaryEmailAddress?.emailAddress,
                        })

                        setSignInData((prev) => ({
                            ...prev, loading: false, user: {
                                ...data?.response,
                                // profile: [
                                //     { url: user?.imageUrl }
                                // ]
                            }, success: true, error: null
                        }))

                        setGoogleSigninLoader(false)


                        if (rememberMe) {
                            await AsyncStorage.setItem("isAuthenticated", JSON.stringify(true))
                        } else {
                            await signOut()
                        }

                        await AsyncStorage.setItem("LoggedInUser", JSON.stringify({
                            ...data?.response,
                            // profile: [
                            //     { url: user?.imageUrl }
                            // ]
                        }))
                        setAuthenticatedUser({
                            ...data?.response,
                            // profile: [
                            //     { url: user?.imageUrl }
                            // ]
                        })
                        setIsAuthenticated(true)
                        router.push("/home")

                    } catch (error) {
                        await signOut()
                        setGoogleSigninLoader(false)
                        setSignInData((prev) => ({ ...prev, loading: false, user: null, success: false, error: error }))
                        Toast.error(error?.response?.data?.message)
                        console.log("Error ", error)
                    }
                };

                handleAuth();
            }

            // Optional cleanup when screen is unfocused
            return () => {
                // console.log('Screen is unfocused');
            };
        }, [isSignedIn, router, rememberMe, user]) // You can pass dependencies here
    );


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <CustomView style={{ alignItems: "center", justifyContent: "center" }}>
                <View style={{ width: "100%", gap: verticalScale(20) }}>
                    <Image
                        style={[styles.Logo, { tintColor: colors.text }]}
                        source={require("../../assets/images/iqbook.png")}
                        resizeMode="cover"
                    />

                    <View style={{
                        gap: verticalScale(10)
                    }}>
                        <View style={{
                            gap: verticalScale(10)
                        }}>
                            <CustomText>Email</CustomText>
                            <TextInput
                                editable
                                placeholder="Enter your email"
                                placeholderTextColor={colors.secondaryText}
                                style={[false ? styles.inputFielderror : styles.inputField, {
                                    fontFamily: "AirbnbCereal_W_Md",
                                    borderWidth: scale(1),
                                    borderColor: colors.queueBorder,
                                    backgroundColor: colors.cardColor,
                                    color: colors.text
                                }]}
                                onChangeText={(text) => {
                                    setEmailError("")
                                    setEmail(text)
                                }}
                                value={email}
                            />
                        </View>

                        {
                            emailError && (
                                <View style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: scale(5),
                                }}>
                                    <ErrorIcon color='red' size={scale(16)} />
                                    <CustomText style={{ fontSize: scale(12), color: "red", }}>{emailError}</CustomText>
                                </View>
                            )
                        }
                    </View>

                    <View style={{
                        gap: verticalScale(10)
                    }}>
                        <View style={{
                            gap: verticalScale(10)
                        }}>
                            <CustomText>Password</CustomText>
                            <View style={[styles.passwordInputContainer, {
                                borderColor: colors.queueBorder,
                                backgroundColor: colors.cardColor,
                                color: colors.text
                            }]}>
                                <TextInput
                                    editable
                                    placeholder="Enter your password"
                                    placeholderTextColor={colors.secondaryText}
                                    style={[
                                        styles.inputField,
                                        {
                                            fontFamily: "AirbnbCereal_W_Md",
                                            color: colors.text,
                                            flex: 1,
                                        }
                                    ]}
                                    onChangeText={(text) => {
                                        setPasswordError("")
                                        setPassword(text);
                                    }}
                                    value={password}
                                    secureTextEntry={!showPassword}
                                />
                                <Pressable
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    {showPassword ? (<EyeOffIcon color={colors.secondaryText} />) : (<EyeIcon color={colors.secondaryText} />)}
                                </Pressable>
                            </View>

                            {
                                passwordError && (
                                    <View style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: scale(5),
                                    }}>
                                        <ErrorIcon color='red' size={scale(16)} />
                                        <CustomText style={{ fontSize: scale(12), color: "red", }}>{passwordError}</CustomText>
                                    </View>
                                )
                            }
                        </View>
                    </View>

                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingHorizontal: scale(10)
                        }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center", gap: scale(10) }}>
                            <Checkbox
                                style={{
                                    borderRadius: scale(3),
                                }}
                                value={rememberMe}
                                onValueChange={setRememberMe}
                                color={rememberMe ? '#14b8a6' : undefined}
                            />
                            <CustomSecondaryText>
                                Remember Me
                            </CustomSecondaryText>
                        </View>



                        <Pressable onPress={() => router.push("/forgetPassword")}>
                            <CustomSecondaryText style={{ color: '#14b8a6' }}>
                                Forgot Password ?
                            </CustomSecondaryText>
                        </Pressable>
                    </View>

                    {/* <Pressable
                        onPress={() => signinPressed()}
                        disabled={signInData?.loading}
                        style={[styles.auth_btn, { backgroundColor: Colors.modeColor.colorCode, marginBottom: verticalScale(10) }]}>
                        {
                            signInData?.loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <CustomText style={{ color: "#fff" }}>Sign in</CustomText>
                            )
                        }

                    </Pressable> */}

                    <TouchableOpacity
                        onPress={() => signinPressed()}
                        disabled={signInData?.loading}
                        style={styles.signinButton} activeOpacity={0.85}>
                        {
                            signInData?.loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <CustomText style={styles.signinButtonText}>Sign in</CustomText>
                            )
                        }
                    </TouchableOpacity>

                    {/* <Pressable onPress={() => router.replace("/signup")}>
                        <CustomText style={[styles.subHeading, { color: colors.secondaryText }]}>Don't have an account ?<CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}> Sign up</CustomText></CustomText>
                    </Pressable> */}

                    <View style={styles.divider}>
                        <View style={{ flex: 1, height: verticalScale(0.5), backgroundColor: colors.secondaryText }} />

                        <View style={{ paddingHorizontal: moderateScale(10) }}>
                            <CustomText style={{ color: colors.text }}>or</CustomText>
                        </View>

                        <View style={{ flex: 1, height: verticalScale(0.5), backgroundColor: colors.secondaryText }} />
                    </View>

                    <Pressable
                        disabled={googleClicked || googleSigninLoader}
                        onPress={googleSigninPressed}
                        style={
                            [styles.auth_btn,
                            {
                                borderWidth: scale(1),
                                // borderColor: "gray",
                                backgroundColor: colors.cardColor,
                                borderColor: colors.queueBorder,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: scale(10),
                            }
                            ]}>
                        {
                            googleSigninLoader ? (
                                <ActivityIndicator size="small" color={colors.text} />
                            ) : (
                                <>
                                    <Image
                                        source={require("../../assets/images/google.png")}
                                        height={30}
                                        width={30}
                                    />
                                    <CustomText>Sign in with Google</CustomText>
                                </>
                            )
                        }

                    </Pressable>

                    <Pressable onPress={() => router.replace("/signup")}>
                        <CustomText style={[styles.subHeading, { color: colors.secondaryText }]}>Don't have an account ?<CustomText style={{ color: '#14b8a6' }}> Sign up</CustomText></CustomText>
                    </Pressable>
                </View>
            </CustomView>
        </TouchableWithoutFeedback>
    )
}

export default signin

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
        fontSize: moderateScale(14)
    },
    inputFielderror: {

    },

    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        // marginBlock: verticalScale(10),
        textAlign: "center",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // marginBottom: verticalScale(20)
    },

    signinButton: {
        width: '100%',
        backgroundColor: '#14b8a6', // bg-teal-500
        paddingVertical: verticalScale(12), // py-4
        borderRadius: scale(8), // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
    },
    signinButtonText: {
        color: '#fff', // text-white
        fontFamily: "AirbnbCereal_W_XBd",
        fontSize: scale(16),
    },
})

// import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
// import React, { useState } from 'react'
// import { useTheme } from '@react-navigation/native';
// import { ErrorIcon, EyeIcon, EyeOffIcon } from '../../constants/icons';
// import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// const signin = () => {

//     const [password, setPassword] = useState("")
//     const [showPassword, setShowPassword] = useState(false);
//     const [passwordError, setPasswordError] = useState(false);

//     const { colors } = useTheme()

//     return (
//         <View>
//             <Text>signin</Text>

//             <View style={styles.passwordInputContainer}>
//                 <TextInput
//                     editable
//                     placeholder="Enter your password"
//                     placeholderTextColor={colors.secondaryText}
//                     style={[
//                         styles.inputField,
//                         {
//                             fontFamily: "AirbnbCereal_W_Md",
//                             color: colors.text,
//                             flex: 1,
//                         }
//                     ]}
//                     onChangeText={(text) => {
//                         setPasswordError("")
//                         setPassword(text);
//                     }}
//                     value={password}
//                     secureTextEntry={!showPassword}
//                 />
//                 <Pressable
//                     onPress={() => setShowPassword(!showPassword)}
//                     style={styles.eyeIcon}
//                 >
//                     {showPassword ? (<EyeOffIcon />) : (<EyeIcon />)}
//                 </Pressable>
//             </View>
//         </View >
//     )
// }

// export default signin

// const styles = StyleSheet.create({
//     passwordInputContainer: {
//         marginTop: verticalScale(100),
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderRadius: scale(4),
//         backgroundColor: "#0BA3AD1A",
//         height: verticalScale(60),
//         gap: scale(10),
//         paddingRight: scale(10),
//     },
// })