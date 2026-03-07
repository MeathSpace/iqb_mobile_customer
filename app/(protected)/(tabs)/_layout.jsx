import { useTheme } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, FlatList, Platform, Pressable, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import AdvertiseCard from "../../../components/AdvertiseCard";
import {
  CalenderIcon,
  HomeIcon,
  ProfileIcon,
  QueueIcon,
  SalonIcon,
} from "../../../constants/icons";
import { useAuth } from "../../../context/AuthContext";

export default function TabLayout() {
  const { colors } = useTheme();

  const insets = useSafeAreaInsets();

  const { authenticatedUser } = useAuth();

  return (
    <>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.accentColor,
            tabBarInactiveTintColor: colors.text,
            headerShown: false,

            tabBarButton: (props) => (
              <Pressable
                {...props}
                android_ripple={{
                  color: "transparent", // Makes the ripple effect invisible on Android
                  // Alternatively, for a more definitive removal, you could try:
                  // foreground: false,
                }}
                // For iOS, ensure no opacity change on press if you don't want it
                style={({ pressed }) => ({
                  opacity: Platform.OS === "ios" && pressed ? 1 : 1, // Keep full opacity on iOS press
                  // You can add other base styles here if needed that were implicitly
                  // handled by the default component
                  flex: 1, // Ensure it fills the space correctly
                  alignItems: "center",
                  justifyContent: "center",
                })}
              >
                {props.children}
              </Pressable>
            ),

            tabBarStyle: {
              ...Platform.select({
                ios: {
                  position: "absolute",
                },
                default: {},
              }),

              // Base height for content
              height: verticalScale(65) + insets.bottom,
              backgroundColor: colors.cardColor,
              borderTopWidth: scale(1),
              borderTopColor: colors.queueBorder,
            },

            tabBarLabelStyle: {
              fontFamily: "AirbnbCereal_W_Md",
              fontSize: scale(9.9),
              marginTop: verticalScale(5),
            },
            // tabBarItemStyle: {},
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              tabBarIcon: ({ color, focused }) => (
                <AnimatedTabIcon
                  focused={focused}
                  color={color}
                  Icon={HomeIcon}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="queuelist"
            options={{
              title: "Qlist",
              tabBarIcon: ({ color, focused }) => (
                <AnimatedTabIcon
                  focused={focused}
                  color={color}
                  Icon={QueueIcon}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="salon"
            options={{
              title: "Salon",
              tabBarIcon: ({ color, focused }) => (
                <AnimatedTabIcon
                  focused={focused}
                  color={color}
                  // theme={theme}
                  Icon={SalonIcon}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="appointment"
            options={{
              title: "Appointment",
              tabBarIcon: ({ color, focused }) => (
                <AnimatedTabIcon
                  focused={focused}
                  color={color}
                  Icon={CalenderIcon}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="(profile)"
            options={{
              title: "Profile",
              tabBarIcon: ({ color, focused }) => (
                <AnimatedTabIcon
                  focused={focused}
                  color={color}
                  Icon={ProfileIcon}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="notification"
            options={{
              href: null, // This hides the tab from the tab bar
            }}
          />
        </Tabs>

      </SafeAreaView>
    </>
  );
}

function AnimatedTabIcon({ focused, color, Icon }) {
  const { colors } = useTheme();

  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const iconScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pill animation (no translateY)
    Animated.spring(scaleAnim, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      friction: 6,
    }).start();

    // Small pop animation for icon (no movement)
    if (focused) {
      Animated.sequence([
        Animated.spring(iconScale, {
          toValue: 1.15,
          useNativeDriver: true,
          friction: 4,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
        }),
      ]).start();
    } else {
      iconScale.setValue(1);
    }
  }, [focused]);

  const pillScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const pillOpacity = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Pill Background */}
      <Animated.View
        style={{
          // position: "absolute",
          // width: scale(50),
          // height: verticalScale(30),
          // borderRadius: 25,
          // backgroundColor: focused ? color : "transparent",
          // opacity: pillOpacity,
          // transform: [{ scale: pillScale }],
        }}
      />

      {/* Icon */}
      <Animated.View
        style={{
          // transform: [{ scale: iconScale }],
        }}
      >
        <Icon 
        // color={focused ? "#FFFFFF" : colors.text} 
        color={focused ? colors.accentColor : colors.text}
        />
      </Animated.View>
    </View>
  );
}


