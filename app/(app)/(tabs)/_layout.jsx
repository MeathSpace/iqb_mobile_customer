import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import { CalendarIcon, UserIcon } from '../../../constants/icons';

export default function _layout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name="queuelist"
                options={{
                    title: 'Qlist',
                    tabBarIcon: ({ color }) => <CalendarIcon />,
                }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <CalendarIcon />,
                }}
            />
        </Tabs>
    )
}

const styles = StyleSheet.create({})