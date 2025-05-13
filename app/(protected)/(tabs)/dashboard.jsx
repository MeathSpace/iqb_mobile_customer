import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useClerk, useUser } from '@clerk/clerk-expo'
import CustomText from '../../../components/CustomText'

const dashboard = () => {

    const { signOut } = useClerk()
    const { isSignedIn } = useUser()


    const { setIsAuthenticated, authenticatedUser, setAuthenticatedUser } = useAuth()
    const router = useRouter()

    console.log("authUser:", authenticatedUser);


    const logoutPressed = async () => {
        if (isSignedIn) {
            signOut()
        }

        setIsAuthenticated(false)
        setAuthenticatedUser(null)
        await AsyncStorage.removeItem("LoggedInUser")
        await AsyncStorage.removeItem("isAuthenticated")
        router.replace("/")
    }

    return (
        <View style={{
            gap: 20
        }}>
            <Text>dashboard</Text>
            <Text>{authenticatedUser?.name}</Text>
            <Text>{authenticatedUser?.email}</Text>
            <Image
                source={{ uri: authenticatedUser?.imageUrl }}
                style={styles?.profileImage}
                resizeMode="cover"
            />

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