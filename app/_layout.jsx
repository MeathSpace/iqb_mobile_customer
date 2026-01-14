import {
  DefaultTheme,
  DarkTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StyleSheet, useColorScheme } from "react-native";
import React, { useEffect } from "react";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { AuthProvider } from "../context/AuthContext";
import { GlobalProvider } from "../context/GlobalContext";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { StatusBar } from "expo-status-bar";
import ToastManager from "toastify-react-native";
import AppInitializer from "./appInitializer";
import { StripeProvider } from "@stripe/stripe-react-native";

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
    AirbnbCereal_W_Bd: require("../assets/fonts/AirbnbCereal_W_Bd.otf"),
    AirbnbCereal_W_Md: require("../assets/fonts/AirbnbCereal_W_Md.otf"),
    AirbnbCereal_W_Lt: require("../assets/fonts/AirbnbCereal_W_Lt.otf"),
    AirbnbCereal_W_Bk: require("../assets/fonts/AirbnbCereal_W_Bk.otf"),
    AirbnbCereal_W_Blk: require("../assets/fonts/AirbnbCereal_W_Blk.otf"),
    AirbnbCereal_W_XBd: require("../assets/fonts/AirbnbCereal_W_XBd.otf"),
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
      background: "#F9FAFB",
      tabBackground: "#efefef",
      text: "#1f2937",
      // secondaryText: "#6b7280", // text-gray-500
      secondaryText: "rgba(0,0,0,1)",
      secondaryInputBackground: "#efefef",
      borderBottomColor: "#efefef",
      notificationBellColor: "#6b7280",
      cardColor: "#fff",
      cardBorder: "#e5e7eb",
      queueBorder: "#e5e7eb",
      selected: "#f0fdfa",
      appointmentDisableBg: "#d4d4d4",

      modalBgColor: "#fff",
      modalSectionColor: "#F9FAFB",
    },
  };

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#111827",
      tabBackground: "#151718",
      text: "#ffffff",
      // secondaryText: "#6b7280", // text-gray-500
      secondaryText: "rgba(255, 255, 255, 1)",
      secondaryInputBackground: "#000000",
      borderBottomColor: "#101010",
      notificationBellColor: "#D1D5DB",
      cardColor: "#1F2937",
      cardBorder: "#1F2937",
      queueBorder: "#374151",
      selected: "#14b8a619",
      appointmentDisableBg: "#a1a1a1",

      modalBgColor: "#111827",
      modalSectionColor: "#1F2937",
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
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      <AuthProvider>
        <GlobalProvider>
          <ClerkProvider
            telemetry={false}
            publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
            tokenCache={tokenCache}
          >
            {/* <AppInitializer> */}
            <ThemeProvider
              value={colorScheme === "dark" ? MyDarkTheme : MyLightTheme}
            >
              <Stack screenOptions={{ headerShown: false }} />
              <StatusBar style="auto" />
              <ToastManager />
            </ThemeProvider>
            {/* </AppInitializer> */}
          </ClerkProvider>
        </GlobalProvider>
      </AuthProvider>
    </StripeProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
