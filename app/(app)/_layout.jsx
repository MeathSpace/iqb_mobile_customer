// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { Stack } from 'expo-router'

// const _layout = () => {
//     return (
//         <Stack screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="(tabs)" />
//             <Stack.Screen name="account" />
//         </Stack>
//     )
// }

// export default _layout

// const styles = StyleSheet.create({})


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Slot, Stack } from 'expo-router'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useAuth } from '../../context/AuthContext'

const _layout = () => {

    const { user } = useAuth()

    // console.log("protected ", user)

    if (!user) {
        return <Redirect href="/" />;
    }

    return (
        <ProtectedRoute>
            <Slot /> {/* This app is present inside the Stack , so slot will render
            all the screens present inside app, like (tabs), account etc.
            */}
        </ProtectedRoute>
    )
}

export default _layout

const styles = StyleSheet.create({})