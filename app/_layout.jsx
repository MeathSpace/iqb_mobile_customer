import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import ToastManager from "toastify-react-native";
import { AuthProvider } from "../context/AuthContext";
import { GlobalProvider } from "../context/GlobalContext";
import { LanguageProvider } from "../context/LanguageContext";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
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
      background: "#efefef", // Main Background
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

      // linearColor1: "#000000",
      // linearColor2: "#1a1a1a",
      linearColor1: "#E65100",
      linearColor2: "#FF8F00",
      accentColor: "#E65100",
    },
  };

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#121212", // Main Background
      tabBackground: "#151718",
      text: "#ffffff",
      // secondaryText: "#6b7280", // text-gray-500
      secondaryText: "rgba(255, 255, 255, 1)",
      secondaryInputBackground: "#000000",
      borderBottomColor: "#101010",
      notificationBellColor: "#D1D5DB",
      // cardColor: "#1F2937",
      cardColor: "#2a2a2a",
      cardBorder: "#303030",
      queueBorder: "#303030",
      selected: "#14b8a619",
      appointmentDisableBg: "#a1a1a1",

      modalBgColor: "#121212",
      modalSectionColor: "#2A2A2A",

      // linearColor1: "#1e1e1e",
      // linearColor2: "#2a2a2a",

      linearColor1: "#FF6A00",
      linearColor2: "#FFB347",
      accentColor: "#FF6A00",
    },
  };

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      <LanguageProvider>
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
      </LanguageProvider>
    </StripeProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
