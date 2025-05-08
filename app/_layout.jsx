// // import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// // import { useFonts } from 'expo-font';
// // import { Stack } from 'expo-router';
// // import { StatusBar } from 'expo-status-bar';
// // import 'react-native-reanimated';

// // import { useColorScheme } from '@/hooks/useColorScheme';

// // export default function RootLayout() {
// //   const colorScheme = useColorScheme();
// // const [loaded] = useFonts({
// //   // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
// //   AirbnbCereal_W_Bd: require('../assets/fonts/AirbnbCereal_W_Bd.otf')
// // });

// // if (!loaded) {
// //   // Async font loading only occurs in development.
// //   return null;
// // }

// //   return (
// //     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
// // <Stack>
// //   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
// //   <Stack.Screen name="+not-found" />
// // </Stack>
// //       <StatusBar style="auto" />
// //     </ThemeProvider>
// //   );
// // }

// import { StyleSheet, Text, View } from 'react-native'
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import React, { useEffect } from 'react'
// import CustomStatusBar from '../components/CustomStatusBar'
// import { ThemeProvider } from '../context/ThemeContext';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import SystemNavigationBar from 'react-native-system-navigation-bar';

// const _layout = () => {

//   useEffect(() => {
//     // Set the bottom navigation bar color to dark or any color based on your theme
//     SystemNavigationBar.setNavigationColor('#000000');  // Set color for the bottom bar

//     // Optionally, set other properties (e.g., hide the bottom bar buttons)
//     // SystemNavigationBar.setNavigationVisibility(true);
//   }, []);

//   const [loaded] = useFonts({
//     AirbnbCereal_W_Bd: require('../assets/fonts/AirbnbCereal_W_Bd.otf'),
//     AirbnbCereal_W_Md: require('../assets/fonts/AirbnbCereal_W_Md.otf'),
//     AirbnbCereal_W_Lt: require('../assets/fonts/AirbnbCereal_W_Lt.otf'),
//     AirbnbCereal_W_Bk: require('../assets/fonts/AirbnbCereal_W_Bk.otf'),
//     AirbnbCereal_W_XBd: require('../assets/fonts/AirbnbCereal_W_XBd.otf')
//   });

//   if (!loaded) {
//     // Async font loading only occurs in development.
//     return null;
//   }


//   return (
//     <SafeAreaProvider>
//       <ThemeProvider>
//         <SafeAreaView style={{ flex: 1 }}>
//           <CustomStatusBar />
//           {/* now every screen under here is inset‐aware */}
//           <Stack>
//             <Stack.Screen name="index" options={{ headerShown: false }} />
//             <Stack.Screen name="signin" options={{ headerShown: false }} />
//           </Stack>

//         </SafeAreaView>
//       </ThemeProvider>
//     </SafeAreaProvider>
//   )
// }

// export default _layout

// const styles = StyleSheet.create({})


import React, { useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, Platform, useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack, useFocusEffect } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';
import { ThemeProvider } from '../context/ThemeContext';
import * as SystemUI from 'expo-system-ui';
import * as SplashScreen from 'expo-splash-screen';


SplashScreen.preventAutoHideAsync();

const _layout = () => {
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
    // <SafeAreaProvider>
    <ThemeProvider>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? '#151718' : '#ffffff' // If i dont give this thing here then in ios i will see a blank white color statusbar and navigation bar default
      }}>
        {/* Custom Status Bar Component */}
        <CustomStatusBar />

        {/* Main Navigation Stack */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="signin" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="personalInfo" />
        </Stack>
      </SafeAreaView>
    </ThemeProvider>
    // </SafeAreaProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({});

