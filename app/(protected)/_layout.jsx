import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Slot } from 'expo-router'
import { useAuth } from '../../context/AuthContext'

const ProtectedLayout = () => {
    const { isAuthenticated } = useAuth()

    console.log("Authenticated Protected", isAuthenticated)

    if (!isAuthenticated) {
        return <Redirect href="/" />
    }

    return (
        <Slot />
    )
}

export default ProtectedLayout

const styles = StyleSheet.create({})