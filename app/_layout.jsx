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


import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useEffect } from 'react'
import { Slot } from 'expo-router'
import { ThemeProvider } from '../context/ThemeContext';
import CustomStatusBar from '../components/CustomStatusBar';
import * as SystemUI from 'expo-system-ui';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext'

const RootLayout = () => {
  const colorScheme = useColorScheme()

  useEffect(() => {
    if (colorScheme === 'dark') {
      SystemUI.setBackgroundColorAsync('#151718');
    } else {
      SystemUI.setBackgroundColorAsync('#ffffff');
    }
  }, [colorScheme]);


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

  return (
    <AuthProvider>
      <ThemeProvider>
        <SafeAreaView style={{
          flex: 1,
          backgroundColor: colorScheme === 'dark' ? '#151718' : '#ffffff' // If i dont give this thing here then in ios i will see a blank white color statusbar and navigation bar default
        }}>
          {/* <CustomStatusBar /> */}
          <Slot />
        </SafeAreaView>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})
