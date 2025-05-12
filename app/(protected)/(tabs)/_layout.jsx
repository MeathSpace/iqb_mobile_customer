import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name="queuelist"
                options={{
                    title: 'Qlist',
                    // tabBarIcon: ({ color }) => <Text>Qlist</Text>,
                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    // tabBarIcon: ({ color }) => <CalendarIcon />,
                }}
            />
        </Tabs>
    )
}

const styles = StyleSheet.create({})