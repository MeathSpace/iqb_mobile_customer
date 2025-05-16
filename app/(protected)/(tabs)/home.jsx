import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../../../context/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useClerk, useUser } from '@clerk/clerk-expo'
import CustomText from '../../../components/CustomText'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomView from '../../../components/CustomView'
import { verticalScale } from 'react-native-size-matters'
import { useTheme } from '@react-navigation/native'
import CustomTabView from '../../../components/CustomTabView'


const dashboard = () => {

    const { signOut } = useClerk()
    const { isSignedIn } = useUser()
    const { colors } = useTheme()

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
        <CustomTabView
            style={{
                gap: 20,
            }}>
            <CustomText>dashboard</CustomText>
            <CustomText>{authenticatedUser?.name}</CustomText>
            <CustomText>{authenticatedUser?.email}</CustomText>
            <Image
                source={{ uri: authenticatedUser?.imageUrl }}
                style={styles?.profileImage}
                resizeMode="cover"
            />

            <Pressable onPress={logoutPressed}><CustomText>Logout</CustomText></Pressable>
        </CustomTabView>
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