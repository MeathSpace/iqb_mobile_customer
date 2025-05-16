import { Platform, StyleSheet, Text, View, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Tabs } from 'expo-router';
import { CalenderIcon, HomeIcon, QueueIcon, SalonIcon } from '../../../constants/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { Colors } from '../../../constants/Colors';
import { HapticTab } from '../../../components/HapticTab';

export default function TabLayout() {

    const { colors } = useTheme()

    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                // tabBarShowLabel: false,
                tabBarActiveTintColor: Colors.modeColor.colorCode,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: {
                    ...Platform.select({
                        ios: {
                            // Use a transparent background on iOS to show the blur effect
                            position: 'absolute',
                        },
                        default: {},
                    }),
                    backgroundColor: colors.background,
                    borderTopColor: "none",
                    // paddingTop: verticalScale(5),
                    // ✅ iOS Shadow
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -3 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                },
                tabBarLabelStyle: {
                    fontFamily: 'AirbnbCereal_W_Md',
                    fontSize: moderateScale(12),
                },
                tabBarItemStyle: {
                    // width: 120
                }
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedTabIcon
                            focused={focused}
                            color={color}
                            // theme={theme}
                            Icon={HomeIcon}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="queuelist"
                options={{
                    title: 'Qlist',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedTabIcon
                            focused={focused}
                            color={color}
                            // theme={theme}
                            Icon={QueueIcon}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="salon"
                options={{
                    title: 'Salon',
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
                    title: 'Appt.',
                    tabBarIcon: ({ color, focused }) => (
                        <AnimatedTabIcon
                            focused={focused}
                            color={color}
                            // theme={theme}
                            Icon={CalenderIcon}
                        />
                    ),
                }}

            />
        </Tabs>
    )
}

const styles = StyleSheet.create({})


function AnimatedTabIcon({ focused, color, Icon }) {

    const { colors } = useTheme()

    const scale = useRef(new Animated.Value(focused ? 1.2 : 1)).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: focused ? 1 : 0.9,
            useNativeDriver: true,
            friction: 4,
        }).start();
    }, [focused]);

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Icon color={focused ? color : colors.text} />
        </Animated.View>
    );
}
