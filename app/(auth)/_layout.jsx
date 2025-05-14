import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const AuthLayout = () => {

    const { isAuthenticated } = useAuth()

    if (isAuthenticated) {
        return <Redirect href="/home" />
    }

    console.log("Authenticated Auth", isAuthenticated)

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="signin" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="personalInfo" />
            <Stack.Screen name="passwordConfirmation" />
            <Stack.Screen name="verification" />
            <Stack.Screen name="forgetVerification" />
            <Stack.Screen name="forgetPassword" />
        </Stack>
    )
}

export default AuthLayout

const styles = StyleSheet.create({})