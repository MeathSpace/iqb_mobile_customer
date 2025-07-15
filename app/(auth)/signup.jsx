import { ActivityIndicator, Image, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import CustomView from '../../components/CustomView'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import CustomText from '../../components/CustomText';
import { useTheme } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '../../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorIcon } from '../../constants/icons';

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

            setCheckEmailLoading(true)

            const { data } = await axios.post(`${BASE_URL}/customer/checkEmail`, {
                email
            })

            setCheckEmailLoading(false)

            router.push({
                pathname: "/personalInfo",
                params: {
                    email
                }
            });

        } catch (error) {
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

    const [googleSigninLoader, setGoogleSigninLoader] = useState(false)

    useEffect(() => {
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

                    await signOut()

                } catch (error) {
                    await signOut()
                    setGoogleSigninLoader(false)
                    Toast.error(error?.response?.data?.message)
                }
            }

            checkEmail()
        }
    }, [isSignedIn, router, user])



    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <CustomView style={{ alignItems: "center", justifyContent: "center" }}>
                <View style={{ width: "100%", gap: verticalScale(20) }}>
                    <Image
                        style={[styles.Logo, { tintColor: colors.text }]}
                        source={require("../../assets/images/iqbook.png")}
                        resizeMode="cover"
                    />

                    <View style={{ gap: verticalScale(10) }}>
                        <TextInput
                            editable
                            placeholder="Enter your email"
                            placeholderTextColor={colors.secondaryText}
                            style={[false ? styles.inputFielderror : styles.inputField, {
                                // backgroundColor: "#0BA3AD1A",
                                borderWidth: scale(1),
                                borderColor: "gray",
                                fontFamily: "AirbnbCereal_W_Bk", color: colors.text
                            }]}
                            onChangeText={(text) => {
                                setEmailError("")
                                setEmail(text)
                            }}
                            value={email}
                        />

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

                    <Pressable
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
                    </Pressable>

                    <Pressable onPress={() => router.replace("/signin")}>
                        <CustomText style={[styles.subHeading, { color: colors.secondaryText }]}>Already a member ? <CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}> Log In</CustomText></CustomText>
                    </Pressable>

                    <View style={styles.divider}>
                        <View style={{ flex: 1, height: verticalScale(1), backgroundColor: colors.text }} />

                        <View style={{ padding: moderateScale(10) }}>
                            <CustomText style={{ color: colors.text }}>or</CustomText>
                        </View>

                        <View style={{ flex: 1, height: verticalScale(1), backgroundColor: colors.text }} />
                    </View>

                    <Pressable
                        disabled={googleClicked || googleSigninLoader}
                        onPress={async () => {
                            if (isSignedIn) {
                                await signOut()
                                googleSignupPressed()
                            } else {
                                googleSignupPressed()
                            }
                        }}
                        style={
                            [styles.auth_btn,
                            {
                                borderWidth: scale(1),
                                borderColor: "gray",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: scale(10),
                            }
                            ]}>

                        {
                            googleSigninLoader ? (
                                <ActivityIndicator size="small" color="#000" />
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
                        }
                    </Pressable>

                </View>
            </CustomView>
        </TouchableWithoutFeedback>
    )
}

export default signup

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
    auth_btn: {
        height: verticalScale(40),
        borderRadius: scale(4),
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
        height: verticalScale(40),
        // marginBottom: verticalScale(20)
    }
})