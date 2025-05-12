import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomText from '../../../components/CustomText'
import { useAuth } from '../../../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

const dashboard = () => {

    const router = useRouter()

    const { setUser } = useAuth()

    const logoutPressed = async () => {
        await AsyncStorage.removeItem("auth")
        setUser(null)
    }

    return (
        <View>
            <Text>dashboard</Text>
            <Pressable onPress={logoutPressed}><CustomText>Logout</CustomText></Pressable>
        </View>
    )
}

export default dashboard

const styles = StyleSheet.create({})