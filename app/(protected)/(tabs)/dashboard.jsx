import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useClerk, useUser } from '@clerk/clerk-expo'

const dashboard = () => {

    const { signOut } = useClerk()

    // console.log("Google User EmailAddress Dashboard", user?.primaryEmailAddress?.emailAddress)
    // console.log("Google User Image Url Dashboard", user?.imageUrl)
    // console.log("Google User Image Url Dashboard", user?.firstName)

    const { isSignedIn, user } = useUser()

    // console.log("Signed in user ", isSignedIn)

    const { setIsAuthenticated } = useAuth()
    const router = useRouter()

    const logoutPressed = async () => {
        if (isSignedIn) {
            signOut()
        }

        setIsAuthenticated(false)
        router.replace("/")
        await AsyncStorage.removeItem("isAuthenticated")    
    }

    return (
        <View>
            <Text>dashboard</Text>
            <Text>{user?.primaryEmailAddress?.emailAddress}</Text>
            <Image
                source={{ uri: user?.imageUrl }}
                style={styles?.profileImage}
                resizeMode="cover"
            />
            <Text>{user?.firstName}</Text>
            <Pressable onPress={logoutPressed}><Text>Logout</Text></Pressable>
        </View>
    )
}

export default dashboard

const styles = StyleSheet.create({
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50, // Makes it circular
    },
})