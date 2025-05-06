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
import { StyleSheet, SafeAreaView, Text, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack, useFocusEffect } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomStatusBar from '../components/CustomStatusBar';
import { ThemeProvider } from '../context/ThemeContext';

const _layout = () => {

  // Load custom fonts
  const [loaded] = useFonts({
    AirbnbCereal_W_Bd: require('../assets/fonts/AirbnbCereal_W_Bd.otf'),
    AirbnbCereal_W_Md: require('../assets/fonts/AirbnbCereal_W_Md.otf'),
    AirbnbCereal_W_Lt: require('../assets/fonts/AirbnbCereal_W_Lt.otf'),
    AirbnbCereal_W_Bk: require('../assets/fonts/AirbnbCereal_W_Bk.otf'),
    AirbnbCereal_W_XBd: require('../assets/fonts/AirbnbCereal_W_XBd.otf'),
  });

  if (!loaded) {
    return null; // Wait for fonts to load
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SafeAreaView style={{ flex: 1 }}>
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
    </SafeAreaProvider>
  );
};

export default _layout;

const styles = StyleSheet.create({});

