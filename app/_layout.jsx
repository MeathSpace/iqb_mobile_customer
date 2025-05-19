import { DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { StyleSheet, useColorScheme } from 'react-native'
import React, { useEffect } from 'react'
import { Slot, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { AuthProvider } from '../context/AuthContext'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { StatusBar } from 'expo-status-bar';


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
      background: '#ffffff',
      tabBackground: '#efefef',
      text: "#000000",
      secondaryText: "#808080",
    },
  };


  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#000000',
      tabBackground: '#151718',
      text: "#ffffff",
      secondaryText: "#F4F4F5B2",
    },
  };


  return (
    <AuthProvider>
      <ClerkProvider
        // publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        publishableKey='pk_test_bGVnYWwtamF2ZWxpbi00LmNsZXJrLmFjY291bnRzLmRldiQ'
        tokenCache={tokenCache}>
        <ThemeProvider value={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}>
          {/* <Slot /> */}
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
        </ThemeProvider>
      </ClerkProvider>
    </AuthProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})
