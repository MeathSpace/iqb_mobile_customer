// import React, { useEffect, useLayoutEffect, useState } from 'react';
// import { StyleSheet, SafeAreaView, Text, Platform, useColorScheme } from 'react-native';
// import { useFonts } from 'expo-font';
// import { Redirect, Stack, useFocusEffect } from 'expo-router';
// import CustomStatusBar from '../components/CustomStatusBar';
// import { ThemeProvider } from '../context/ThemeContext';
// import { AuthProvider } from '../context/AuthContext'
// import * as SystemUI from 'expo-system-ui';
// import * as SplashScreen from 'expo-splash-screen';


// SplashScreen.preventAutoHideAsync();

// const _layout = () => {

//   const colorScheme = useColorScheme()

//   useEffect(() => {
//     if (colorScheme === 'dark') {
//       SystemUI.setBackgroundColorAsync('#151718');
//     } else {
//       SystemUI.setBackgroundColorAsync('#ffffff');
//     }
//   }, [colorScheme]);


//   // Load custom fonts
//   const [loaded, error] = useFonts({
//     AirbnbCereal_W_Bd: require('../assets/fonts/AirbnbCereal_W_Bd.otf'),
//     AirbnbCereal_W_Md: require('../assets/fonts/AirbnbCereal_W_Md.otf'),
//     AirbnbCereal_W_Lt: require('../assets/fonts/AirbnbCereal_W_Lt.otf'),
//     AirbnbCereal_W_Bk: require('../assets/fonts/AirbnbCereal_W_Bk.otf'),
//     AirbnbCereal_W_XBd: require('../assets/fonts/AirbnbCereal_W_XBd.otf'),
//   });

//   useEffect(() => {
//     if (loaded || error) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded, error]);

//   if (!loaded && !error) {
//     return null;
//   }



//   return (
//     <AuthProvider>
//       <ThemeProvider>

//         <SafeAreaView style={{
//           flex: 1,
//           backgroundColor: colorScheme === 'dark' ? '#151718' : '#ffffff' // If i dont give this thing here then in ios i will see a blank white color statusbar and navigation bar default
//         }}>
//           {/* Custom Status Bar Component */}
//           <CustomStatusBar />

//           {/* Main Navigation Stack */}
//           <Stack screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="index" />
//             <Stack.Screen name="signin" />
//             <Stack.Screen name="signup" />
//             <Stack.Screen name="personalInfo" />
//             <Stack.Screen name="passwordConfirmation" />
//             <Stack.Screen name="verification" />
//             <Stack.Screen name="forgetPassword" />
//             <Stack.Screen name="forgetVerification" />
//             <Stack.Screen name="(app)" />
//           </Stack>
//         </SafeAreaView>

//       </ThemeProvider>
//     </AuthProvider>
//   );
// };

// export default _layout;

// const styles = StyleSheet.create({});


import { Platform, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect } from 'react'
import { Slot, usePathname, useSegments } from 'expo-router'
import { ThemeProvider } from '../context/ThemeContext';
import CustomStatusBar from '../components/CustomStatusBar';
import * as SystemUI from 'expo-system-ui';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext'
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import * as NavigationBar from 'expo-navigation-bar';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {

  useEffect(() => {
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };

    hideSplash();
  }, []);

  const colorScheme = useColorScheme()

  // useEffect(() => {
  //   if (colorScheme === 'dark') {
  //     SystemUI.setBackgroundColorAsync('#151718');
  //   } else {
  //     SystemUI.setBackgroundColorAsync('#ffffff');
  //   }
  // }, [colorScheme]);

  useEffect(() => {
    const isDark = colorScheme === 'dark';
    // Set status bar background color (SystemUI)
    // SystemUI.setBackgroundColorAsync(isDark ? '#151718' : '#ffffff');

    if (Platform.OS === "android") {
      // Set navigation bar background color
      // NavigationBar.setBackgroundColorAsync(isDark ? '#151718' : '#ffffff');

      // Optional: change navigation bar button icons (light or dark)
      // NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
    }

  }, [colorScheme]);


  const segments = useSegments();

  const isInsideTabs = segments.includes('(tabs)');

  const backgroundColor = isInsideTabs
    ? colorScheme === 'dark'
      ? '#151718'
      : '#efefef'
    : colorScheme === 'dark'
      ? '#151718'
      : '#ffffff'


  // Load custom fonts
  const [loaded, error] = useFonts({
    AirbnbCereal_W_Bd: require('../assets/fonts/AirbnbCereal_W_Bd.otf'),
    AirbnbCereal_W_Md: require('../assets/fonts/AirbnbCereal_W_Md.otf'),
    AirbnbCereal_W_Lt: require('../assets/fonts/AirbnbCereal_W_Lt.otf'),
    AirbnbCereal_W_Bk: require('../assets/fonts/AirbnbCereal_W_Bk.otf'),
    AirbnbCereal_W_XBd: require('../assets/fonts/AirbnbCereal_W_XBd.otf'),
  });

  // useEffect(() => {
  //   if (loaded || error) {
  //     SplashScreen.hideAsync();
  //   }
  // }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <ClerkProvider
        // publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        publishableKey='pk_test_bGVnYWwtamF2ZWxpbi00LmNsZXJrLmFjY291bnRzLmRldiQ'
        tokenCache={tokenCache}>
        <ThemeProvider>
          <StatusBar
            backgroundColor={backgroundColor}
          />
          <Slot />
        </ThemeProvider>
      </ClerkProvider>
    </AuthProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})
