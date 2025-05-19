import { Pressable, StyleSheet, Text, View } from 'react-native'
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
import Header from '../../../components/Header'
import Map from '../../../components/Map'
import Dashboard from '../../../components/Dashboard'
import SearchHeader from '../../../components/SearchHeader'

const dashboard = () => {

    const { authenticatedUser } = useAuth()

    return (
        <View style={{ flex: 1 }}>
            {
                authenticatedUser?.salonId ? (
                    <Dashboard />
                ) : (
                    <>
                        <SearchHeader />
                        <Map />
                    </>
                )
            }

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

