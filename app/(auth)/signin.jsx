import { Image, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, useColorScheme, View } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import CustomView from "../../components/CustomView"
import CustomText from "../../components/CustomText"
import CustomSecondaryText from '../../components/CustomSecondaryText';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Link, useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { useAuth } from '../../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import { useClerk, useSSO, useUser } from '@clerk/clerk-expo'
import { useTheme } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';


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

    useWarmUpBrowser()

    const { setIsAuthenticated, setAuthenticatedUser } = useAuth()

    const { colors } = useTheme()

    const router = useRouter()

    const [rememberMe, setRememberMe] = useState(true);

    const { signOut } = useClerk()

    const signinPressed = async () => {
        if (rememberMe) {
            await AsyncStorage.setItem("isAuthenticated", JSON.stringify(true))
        }
        await AsyncStorage.setItem("LoggedInUser", JSON.stringify({
            name: "John Doe",
            email: "john@gmail.com",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUWPPJeKqMFiZdty1MgpNIUzPE0NYsz0Y0NA&s",
            salonId: 1
        }))
        setAuthenticatedUser({
            name: "John Doe",
            email: "john@gmail.com",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUWPPJeKqMFiZdty1MgpNIUzPE0NYsz0Y0NA&s",
            salonId: 1
        })
        setIsAuthenticated(true)
        router.push("/home")
    }


    const { startSSOFlow } = useSSO()

    const { isLoaded, isSignedIn, user } = useUser()

    const googleSigninPressed = useCallback(async () => {
        try {
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
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }, []);



    useEffect(() => {

        if (isSignedIn) {
            const handleAuth = async () => {
                try {
                    if (rememberMe) {
                        await AsyncStorage.setItem("isAuthenticated", JSON.stringify(true));
                        await AsyncStorage.setItem("LoggedInUser", JSON.stringify({
                            name: user?.firstName,
                            email: user?.primaryEmailAddress?.emailAddress,
                            imageUrl: user?.imageUrl
                        }))
                    } else {
                        signOut()
                    }

                    setAuthenticatedUser({
                        name: user?.firstName,
                        email: user?.primaryEmailAddress?.emailAddress,
                        imageUrl: user?.imageUrl
                    })
                    setIsAuthenticated(true);
                    router.replace("/home");
                } catch (error) {
                    console.error("Error saving to AsyncStorage", error);
                }
            };

            handleAuth();
        }

    }, [isSignedIn, router, rememberMe, user]);


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <CustomView style={{ alignItems: "center", justifyContent: "center" }}>
                <View style={{ width: "100%", gap: verticalScale(25) }}>
                    <Image
                        style={[styles.Logo, { tintColor: colors.text }]}
                        source={require("../../assets/images/IQB_Logo.png")}
                        resizeMode="cover"
                    />

                    <TextInput
                        editable
                        placeholder="Enter your email"
                        placeholderTextColor={colors.secondaryText}
                        style={[false ? styles.inputFielderror : styles.inputField, { borderColor: colors.border, backgroundColor: colors.card, fontFamily: "AirbnbCereal_W_Bk", color: colors.text }]}
                        // onChangeText={(text) => {
                        //     setEmailError("")
                        //     setEmail(text)
                        // }}
                        // value={email}
                        value=''
                    />

                    <TextInput
                        editable
                        placeholder="Enter your password"
                        placeholderTextColor={colors.secondaryText}
                        style={[false ? styles.inputFielderror : styles.inputField, { borderColor: colors.border, backgroundColor: colors.card, fontFamily: "AirbnbCereal_W_Bk", color: colors.text }]}
                        // onChangeText={(text) => {
                        //     setEmailError("")
                        //     setEmail(text)
                        // }}
                        // value={email}
                        value=''
                    />

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
                                style={styles.checkbox}
                                value={rememberMe}
                                onValueChange={setRememberMe}
                                color={rememberMe ? Colors.modeColor.colorCode : undefined}
                            />
                            <CustomSecondaryText>
                                Remember Me
                            </CustomSecondaryText>
                        </View>



                        <Pressable onPress={() => router.push("/forgetPassword")}>
                            <CustomSecondaryText>
                                Forgot Password ?
                            </CustomSecondaryText>
                        </Pressable>
                    </View>

                    <Pressable
                        onPress={() => signinPressed()}
                        style={[styles.auth_btn, { backgroundColor: Colors.modeColor.colorCode, marginBottom: verticalScale(10) }]}>
                        <CustomText style={{ color: "#fff" }}>Sign in</CustomText>
                    </Pressable>

                    <Pressable onPress={() => router.replace("/signup")}>
                        <CustomText style={[styles.subHeading, { color: colors.secondaryText }]}>Don't have an account ?<CustomText style={{ fontFamily: "AirbnbCereal_W_Md" }}> Sign up</CustomText></CustomText>
                    </Pressable>

                    <View style={styles.divider}>
                        <View style={{ flex: 1, height: verticalScale(1), backgroundColor: colors.text }} />

                        <View style={{ padding: moderateScale(10) }}>
                            <CustomText style={{ color: colors.text }}>or</CustomText>
                        </View>

                        <View style={{ flex: 1, height: verticalScale(1), backgroundColor: colors.text }} />
                    </View>

                    <Pressable
                        onPress={googleSigninPressed}
                        style={
                            [styles.auth_btn,
                            {
                                borderWidth: moderateScale(1.5),
                                borderColor: "gray",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: scale(10),
                            }
                            ]}>
                        <Image
                            source={require("../../assets/images/google.png")}
                            height={30}
                            width={30}
                        />
                        <CustomText>
                            Sign in with Google
                        </CustomText>
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
        borderWidth: moderateScale(1.5),
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
    },
})


