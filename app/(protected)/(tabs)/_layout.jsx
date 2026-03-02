import { Platform, StyleSheet, Text, View, Animated, Alert, Pressable } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Tabs } from 'expo-router';
import { CalenderIcon, HomeIcon, ProfileIcon, QueueIcon, SalonIcon } from '../../../constants/icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { Colors } from '../../../constants/Colors';
import { HapticTab } from '../../../components/HapticTab';
import Header from '../../../components/Header';
import { useAuth } from '../../../context/AuthContext';

export default function TabLayout() {

    const { colors } = useTheme()

    const insets = useSafeAreaInsets();

    const { authenticatedUser } = useAuth()

    return (
        <>
            <SafeAreaView
                edges={['top', 'left', 'right']}
                style={{
                    flex: 1,
                    backgroundColor: colors.background,
                }}
            >
                {/* {authenticatedUser?.salonId ? <Header /> : null} */}

                <Tabs
                    screenOptions={{
                        // tabBarActiveTintColor: colors.text,
                        tabBarActiveTintColor: "#FF6A00",
                        headerShown: false,
                        // tabBarButton: HapticTab,

                        tabBarButton: (props) => (
                            <Pressable
                                {...props}
                                android_ripple={{
                                    color: 'transparent', // Makes the ripple effect invisible on Android
                                    // Alternatively, for a more definitive removal, you could try:
                                    // foreground: false,
                                }}
                                // For iOS, ensure no opacity change on press if you don't want it
                                style={({ pressed }) => ({
                                    opacity: Platform.OS === 'ios' && pressed ? 1 : 1, // Keep full opacity on iOS press
                                    // You can add other base styles here if needed that were implicitly
                                    // handled by the default component
                                    flex: 1, // Ensure it fills the space correctly
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                })}
                            >
                                {props.children}
                            </Pressable>
                        ),

                        tabBarStyle: {
                            ...Platform.select({
                                ios: {
                                    position: 'absolute',
                                },
                                default: {},
                            }),

                            // Base height for content
                            height: verticalScale(65) + insets.bottom,

                            // // Padding so icons/text don't sit too low
                            // paddingBottom: insets.bottom > 0
                            //     ? insets.bottom / 2
                            //     : verticalScale(10),

                            backgroundColor: colors.cardColor,
                            borderTopWidth: scale(1),
                            borderTopColor: colors.queueBorder,
                        },


                        tabBarLabelStyle: {
                            fontFamily: 'AirbnbCereal_W_Md',
                            fontSize: scale(9.8),
                            // marginTop: verticalScale(2)
                        },
                        tabBarItemStyle: {
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
                            title: 'Appointment',
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

                    <Tabs.Screen
                        name="(profile)"
                        options={{
                            title: 'Profile',
                            tabBarIcon: ({ color, focused }) => (
                                <AnimatedTabIcon
                                    focused={focused}
                                    color={color}
                                    // theme={theme}
                                    Icon={ProfileIcon}
                                />
                            ),
                        }}
                    />


                    <Tabs.Screen
                        name="notification"
                        options={{
                            href: null, // This hides the tab from the tab bar
                        }} />


                </Tabs>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({})


function AnimatedTabIcon({ focused, color, Icon }) {

    const { colors } = useTheme()

    const scale = useRef(new Animated.Value(focused ? 1.2 : 1)).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: focused ? 1.1 : 1,
            useNativeDriver: true,
            friction: 4,
        }).start();
    }, [focused]);

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Icon color={focused ? color : "#6A6A6A"} />
        </Animated.View>
    );
}
