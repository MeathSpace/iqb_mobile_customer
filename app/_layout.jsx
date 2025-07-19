import { DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { StyleSheet, useColorScheme } from 'react-native'
import React, { useEffect } from 'react'
import { Slot, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { AuthProvider } from '../context/AuthContext'
import { GlobalProvider } from '../context/GlobalContext'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { StatusBar } from 'expo-status-bar';
import ToastManager from 'toastify-react-native'

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {

  // const colorScheme = useColorScheme()

  // useEffect(() => {
  //   if (colorScheme === 'dark') {
  //     SystemUI.setBackgroundColorAsync('#151718');
  //   } else {
  //     SystemUI.setBackgroundColorAsync('#ffffff');
  //   }
  // }, [colorScheme]);



  // const segments = useSegments();

  // const isInsideTabs = segments.includes('(tabs)');

  // const backgroundColor = isInsideTabs
  //   ? colorScheme === 'dark'
  //     ? '#151718'
  //     : '#efefef'
  //   : colorScheme === 'dark'
  //     ? '#151718'
  //     : '#ffffff'


  const colorScheme = useColorScheme();

  // Load custom fonts
  const [loaded, error] = useFonts({
    AirbnbCereal_W_Bd: require('../assets/fonts/AirbnbCereal_W_Bd.otf'),
    AirbnbCereal_W_Md: require('../assets/fonts/AirbnbCereal_W_Md.otf'),
    AirbnbCereal_W_Lt: require('../assets/fonts/AirbnbCereal_W_Lt.otf'),
    AirbnbCereal_W_Bk: require('../assets/fonts/AirbnbCereal_W_Bk.otf'),
    AirbnbCereal_W_Blk: require('../assets/fonts/AirbnbCereal_W_Blk.otf'),
    AirbnbCereal_W_XBd: require('../assets/fonts/AirbnbCereal_W_XBd.otf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#F9FAFB',
      tabBackground: '#efefef',
      text: "#1f2937",
      secondaryText: "#6b7280", // text-gray-500
      secondaryInputBackground: "#efefef",
      borderBottomColor: "#efefef",
      notificationBellColor: "#6b7280",
      cardColor: "#fff",
      cardBorder: "#e5e7eb",
      queueBorder: "#e5e7eb",
      selected: "#f0fdfa"
    },
  };


  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#111827',
      tabBackground: '#151718',
      text: "#ffffff",
      secondaryText: "#6b7280", // text-gray-500
      secondaryInputBackground: "#000000",
      borderBottomColor: "#101010",
      notificationBellColor: "#D1D5DB",
      cardColor: "#1F2937",
      cardBorder: "#1F2937",
      queueBorder: "#374151",
      selected: "#14b8a619"
    },
  };


  // 🌿 Color Palette
  // -----------------------------------------
  // const colors = {
  //   teal500: '#14B8A6', // Used in gradients, icons
  //   teal600: '#0D9488', // Darker gradient
  //   teal400: '#2DD4BF', // Notification badge dot
  //   green500: '#22C55E', // System background with 10% opacity
  //   green600: '#16A34A', // “Online” text
  // };

  return (
    <AuthProvider>
      <GlobalProvider>
        <ClerkProvider
          // publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
          publishableKey='pk_test_bGVnYWwtamF2ZWxpbi00LmNsZXJrLmFjY291bnRzLmRldiQ'
          tokenCache={tokenCache}>
          <ThemeProvider value={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}>
            {/* <Slot /> */}
            <Stack screenOptions={{
              headerShown: false,
              // gestureEnabled: false
            }} />
            <StatusBar style="auto" />
            <ToastManager />
          </ThemeProvider>
        </ClerkProvider>
      </GlobalProvider>
    </AuthProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})
