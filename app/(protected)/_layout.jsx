import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Slot, Stack } from 'expo-router'
import { useAuth } from '../../context/AuthContext'

const ProtectedLayout = () => {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Redirect href="/" />
    }

    return (
        <Stack
            initialRouteName="(tabs)"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="selectBarber"
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }}
            />
            <Stack.Screen
                name="selectServices"
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }} />
            <Stack.Screen
                name="confirmationQueue"
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }} />
            <Stack.Screen
                name="groupJoin"
                options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                }} />
        </Stack>
    )
}

export default ProtectedLayout

const styles = StyleSheet.create({})