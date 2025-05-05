// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
// const [loaded] = useFonts({
//   // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   AirbnbCereal_W_Bd: require('../assets/fonts/AirbnbCereal_W_Bd.otf')
// });

// if (!loaded) {
//   // Async font loading only occurs in development.
//   return null;
// }

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
// <Stack>
//   <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//   <Stack.Screen name="+not-found" />
// </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }

import { StyleSheet, Text, View } from 'react-native'
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react'
import CustomStatusBar from '../components/CustomStatusBar/CustomStatusBar'
import { ThemeProvider } from '../context/ThemeContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';


const _layout = () => {

  const [loaded] = useFonts({
    AirbnbCereal_W_Bd: require('../assets/fonts/AirbnbCereal_W_Bd.otf'),
    AirbnbCereal_W_Md: require('../assets/fonts/AirbnbCereal_W_Md.otf'),
    AirbnbCereal_W_Lt: require('../assets/fonts/AirbnbCereal_W_Lt.otf'),
    AirbnbCereal_W_Bk: require('../assets/fonts/AirbnbCereal_W_Bk.otf'),
    AirbnbCereal_W_XBd: require('../assets/fonts/AirbnbCereal_W_XBd.otf')
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }


  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <CustomStatusBar />
          {/* now every screen under here is inset‐aware */}
          <Stack>
            <Stack.Screen name="signin" options={{ headerShown: false }} />
          </Stack>

        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

export default _layout

const styles = StyleSheet.create({})
