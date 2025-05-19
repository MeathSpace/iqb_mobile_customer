import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomTabView from '../../components/CustomTabView'
import CustomText from '../../components/CustomText'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'expo-router'
import { useClerk, useUser } from '@clerk/clerk-expo'
import { Image } from 'expo-image'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const account = () => {

  const { signOut } = useClerk()
  const { isSignedIn } = useUser()

  const { setIsAuthenticated, authenticatedUser, setAuthenticatedUser } = useAuth()
  const router = useRouter()

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
    // <CustomTabView>
    <View>
      <CustomText>{authenticatedUser?.name}</CustomText>
      <CustomText>{authenticatedUser?.email}</CustomText>
      <Pressable onPress={logoutPressed}><CustomText>Logout</CustomText></Pressable>
      <Image
        style={{ height: moderateScale(35), width: moderateScale(35), borderRadius: moderateScale(20) }}
        source={{ uri: authenticatedUser?.imageUrl }}
        // placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
    </View>
  )
}

export default account

const styles = StyleSheet.create({})