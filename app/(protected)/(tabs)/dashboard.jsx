import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

const dashboard = () => {

    const { setIsAuthenticated } = useAuth()
    const router = useRouter()

    const logoutPressed = async () => {
        setIsAuthenticated(false)
        router.replace("/")
        await AsyncStorage.removeItem("isAuthenticated")
    }

    return (
        <View>
            <Text>dashboard</Text>
            <Pressable onPress={logoutPressed}><Text>Logout</Text></Pressable>
        </View>
    )
}

export default dashboard

const styles = StyleSheet.create({})