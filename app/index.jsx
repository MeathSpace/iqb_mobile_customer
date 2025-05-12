import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Redirect, useRouter } from 'expo-router'
import { useAuth } from '../context/AuthContext'

const index = () => {

  const router = useRouter()

  const { isAuthenticated } = useAuth()

  const [splashLoading, setSplashLoading] = useState(true)

  useEffect(() => {
    let timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/dashboard")
      } else {
        setSplashLoading(false)
      }
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [isAuthenticated, router])

  if (splashLoading) {
    return (
      <View>
        <Text>Loading....</Text>
      </View>
    )
  }

  return (
    <View>
      <Text>Welcome Screen</Text>
      <Pressable onPress={() => router.replace("/signin")}><Text>Login</Text></Pressable>
      <Text>sdv</Text>
      <Text>sdv</Text>
      <Pressable onPress={() => router.replace("/dashboard")}><Text>Dashboard</Text></Pressable>
    </View>
  )
}

export default index

const styles = StyleSheet.create({})