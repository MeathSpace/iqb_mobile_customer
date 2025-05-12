import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Slot, Stack } from 'expo-router'

const ProtectedRoute = ({ children }) => {

    const { user } = useAuth()

    // console.log("Protected ", user)

    return (
        <Stack screenOptions={{ headerShown: false }} />
    )
}

export default ProtectedRoute

const styles = StyleSheet.create({})