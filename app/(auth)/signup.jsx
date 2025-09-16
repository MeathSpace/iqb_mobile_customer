import { ActivityIndicator, Image, InteractionManager, Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import CustomView from '../../components/CustomView'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { useState } from 'react';
import CustomText from '../../components/CustomText';
import { usePreventRemove, useTheme } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '../../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppleIcon, ErrorIcon, EyeIcon, EyeOffIcon } from '../../constants/icons';

import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useClerk, useSSO, useUser } from '@clerk/clerk-expo'
import axios from 'axios';
import { BASE_URL } from '@/utils/api';
import { Toast } from 'toastify-react-native'


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


const signup = () => {

    useWarmUpBrowser()

    const { colors } = useTheme()

    const router = useRouter()

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);

    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [showPassword, setShowPassword] = useState(false);

    const { setIsAuthenticated, setAuthenticatedUser, setSignUpData, signUpData } = useAuth()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [checkEmailLoading, setCheckEmailLoading] = useState(false)

    const signupPressed = async () => {
        try {
            if (!email) {
                return setEmailError("Email is required")
            } else if (!emailRegex.test(email)) {
                return setEmailError("Invalid email format")
            }

            if (!password) {
                setPasswordError("Password is required");
                return;
            } else if (password.length < 8) {
                setPasswordError("Password must be at least 8 characters");
                return;
            } else if (password.length > 20) {
                setPasswordError("Password must be at most 20 characters");
                return;
            }

            setCheckEmailLoading(true)

            const { data } = await axios.post(`${BASE_URL}/customer/checkEmail`, {
                email
            })

            // console.log("Data ", data)

            setCheckEmailLoading(false)

            router.push({
                pathname: "/personalInfo",
                params: {
                    email,
                    password
                }
            });

        } catch (error) {
            console.log("Error ", error)
            setCheckEmailLoading(false)

            Toast.error(error?.response?.data?.message)
        }
    }


    const { startSSOFlow } = useSSO()

    const { isLoaded, isSignedIn, user } = useUser()
    const { signOut } = useClerk()

    const [googleClicked, setGoogleClicked] = useState(false)

    const googleSignupPressed = useCallback(async () => {
        try {
            setGoogleClicked(true)

            // Start the authentication process by calling `startSSOFlow()`
            const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
                strategy: 'oauth_google',
                // For web, defaults to current path
                // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
                // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
                // redirectUrl: AuthSession.makeRedirectUri(),
                redirectUrl: AuthSession.makeRedirectUri({ scheme: 'iqbmobilecustomer', path: '/signup' })
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
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
            setGoogleClicked(false)
        }
    }, []);

    const appleSignupPressed = useCallback(async () => {
        try {
            setGoogleClicked(true)

            // Start the authentication process by calling `startSSOFlow()`
            const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
                strategy: 'oauth_apple',
                // For web, defaults to current path
                // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
                // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
                // redirectUrl: AuthSession.makeRedirectUri(),
                redirectUrl: AuthSession.makeRedirectUri({ scheme: 'iqbmobilecustomer', path: '/signup' })
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
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
            setGoogleClicked(false)
        }
    }, []);

    const [googleSigninLoader, setGoogleSigninLoader] = useState(false)

    // useEffect(() => {
    //     if (isSignedIn) {

    //         const checkEmail = async () => {
    //             try {

    //                 setGoogleSigninLoader(true)

    //                 const { data } = await axios.post(`${BASE_URL}/customer/checkEmail`, {
    //                     email: user?.primaryEmailAddress?.emailAddress
    //                 })

    //                 setGoogleSigninLoader(false)

    //                 router.push({
    //                     pathname: "/personalInfo",
    //                     params: {
    //                         email: user?.primaryEmailAddress?.emailAddress,
    //                         authType: "google"
    //                     }
    //                 });

    //                 // await signOut()

    //                 // Delay signOut slightly so it doesn't interrupt navigation
    //                 InteractionManager.runAfterInteractions(() => {
    //                     signOut(); // Donot give await
    //                 });

    //             } catch (error) {
    //                 await signOut()
    //                 setGoogleSigninLoader(false)
    //                 Toast.error(error?.response?.data?.message)
    //             }
    //         }

    //         checkEmail()
    //     }
    // }, [isSignedIn, router, user])

    useFocusEffect(
        useCallback(() => {
            if (isSignedIn) {

                const checkEmail = async () => {
                    try {

                        setGoogleSigninLoader(true)

                        const { data } = await axios.post(`${BASE_URL}/customer/checkEmail`, {
                            email: user?.primaryEmailAddress?.emailAddress
                        })

                        setGoogleSigninLoader(false)

                        router.push({
                            pathname: "/personalInfo",
                            params: {
                                email: user?.primaryEmailAddress?.emailAddress,
                                authType: "google"
                            }
                        });

                        // await signOut()

                        // // Delay signOut slightly so it doesn't interrupt navigation
                        // InteractionManager.runAfterInteractions(() => {
                        //     signOut(); // Donot give await
                        // });

                    } catch (error) {
                        await signOut()
                        setGoogleSigninLoader(false)
                        Toast.error(error?.response?.data?.message)
                    }
                }

                checkEmail()
            }

            return () => {
                // console.log("Screen unfocused")
            }
        }, [isSignedIn, router, user])
    )

    usePreventRemove(
        true, ({ data }) => { }
    )
    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}>
            <CustomView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <View style={{ width: "100%", gap: verticalScale(20) }}>
                    <Image
                        style={[styles.Logo, { tintColor: colors.text }]}
                        source={require("../../assets/images/iqbook.png")}
                        resizeMode="cover"
                    />

                    <View style={{ gap: verticalScale(10) }}>
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
                                    <CustomText style={{ fontSize: scale(12), color: "red" }}>{emailError}</CustomText>
                                </View>
                            )
                        }
                    </View>

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
                                style={[false ? styles.inputFielderror : styles.inputField, {
                                    fontFamily: "AirbnbCereal_W_Md",
                                    color: colors.text,
                                    flex: 1
                                }]}
                                onChangeText={(text) => {
                                    setPasswordError("")
                                    setPassword(text)
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
                                    <CustomText style={{ fontSize: scale(12), color: "red" }}>{passwordError}</CustomText>
                                </View>
                            )
                        }
                    </View>

                    {/* <Pressable
                        onPress={signupPressed}
                        disabled={checkEmailLoading}
                        style={[styles.auth_btn, { backgroundColor: Colors.modeColor.colorCode }]}>
                        {
                            checkEmailLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <CustomText style={{ color: "#fff" }}>Sign up</CustomText>
                            )
                        }
                    </Pressable> */}

                    <TouchableOpacity
                        onPress={signupPressed}
                        disabled={checkEmailLoading}
                        style={styles.signupButton} activeOpacity={0.85}>
                        {
                            checkEmailLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <CustomText style={styles.signupButtonText}>Sign up</CustomText>
                            )
                        }
                    </TouchableOpacity>


                    <View style={styles.divider}>
                        <View style={{ flex: 1, height: verticalScale(0.5), backgroundColor: colors.secondaryText }} />

                        <View style={{ paddingHorizontal: moderateScale(10) }}>
                            <CustomText style={{ color: colors.text }}>or</CustomText>
                        </View>

                        <View style={{ flex: 1, height: verticalScale(0.5), backgroundColor: colors.secondaryText }} />
                    </View>

                    <Pressable
                        disabled={googleClicked || googleSigninLoader}
                        onPress={async () => {
                            if (Platform.OS === "ios") {
                                if (isSignedIn) {
                                    await signOut()
                                    await appleSignupPressed()
                                } else {
                                    await appleSignupPressed()
                                }
                            } else {
                                if (isSignedIn) {
                                    await signOut()
                                    await googleSignupPressed()
                                } else {
                                    await googleSignupPressed()
                                }
                            }

                        }}
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
                                Platform.OS === "ios" ? (
                                    <>
                                        <AppleIcon />
                                        <CustomText>Sign in with Apple</CustomText>
                                    </>
                                ) : (
                                    <>
                                        <Image
                                            source={require("../../assets/images/google.png")}
                                            height={30}
                                            width={30}
                                        />
                                        <CustomText>
                                            Sign up with Google
                                        </CustomText>
                                    </>
                                )

                            )
                        }
                    </Pressable>

                    <Pressable onPress={async () => {
                        await signOut()
                        router.push("/signin")
                    }}>
                        <CustomText style={[styles.subHeading, { color: colors.secondaryText }]}>Already a member ? <CustomText style={{ color: '#14b8a6' }}> Log In</CustomText></CustomText>
                    </Pressable>

                </View>
            </CustomView>
        </TouchableWithoutFeedback >
    )
}

export default signup

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
        fontSize: moderateScale(14)
    },
    inputFielderror: {

    },

    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        // height: verticalScale(40),
    },

    signupButton: {
        width: '100%',
        backgroundColor: '#14b8a6', // bg-teal-500
        paddingVertical: verticalScale(12), // py-4
        borderRadius: scale(8), // rounded-xl
        alignItems: 'center',
        justifyContent: 'center',
    },
    signupButtonText: {
        color: '#fff', // text-white
        fontFamily: "AirbnbCereal_W_XBd",
        fontSize: scale(16),
    },
})