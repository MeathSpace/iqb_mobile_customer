import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const AuthLayout = () => {

    const { isAuthenticated } = useAuth()

    if(isAuthenticated){
        return <Redirect href="/dashboard"/>
    }

    console.log("Authenticated Auth", isAuthenticated)

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="signin" />
            <Stack.Screen name="signup" />
        </Stack>
    )
}

export default AuthLayout

const styles = StyleSheet.create({})