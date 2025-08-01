import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen
                name="index"
            />

            <Stack.Screen
                name="myFavourites"
            />

            <Stack.Screen
                name="helpSupport"
                options={{
                    presentation: 'transparentModal',
                    animation: 'fade',
                }} />

            <Stack.Screen
                name="connectSalon"
                options={{
                    presentation: 'transparentModal',
                    animation: 'fade',
                }} />
        </Stack>
    )
}

export default _layout

const styles = StyleSheet.create({})