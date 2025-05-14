import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    // tabBarIcon: ({ color }) => <CalendarIcon />,
                }}
            />
            <Tabs.Screen
                name="queuelist"
                options={{
                    title: 'Qlist',
                    // tabBarIcon: ({ color }) => <Text>Qlist</Text>,
                }}
            />
            <Tabs.Screen
                name="salon"
                options={{
                    title: 'Salon',
                    // tabBarIcon: ({ color }) => <Text>Qlist</Text>,
                }}
            />
            <Tabs.Screen
                name="appointment"
                options={{
                    title: 'Appointment',
                    // tabBarIcon: ({ color }) => <Text>Qlist</Text>,
                }}
            />
        </Tabs>
    )
}

const styles = StyleSheet.create({})