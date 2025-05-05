import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext';

const CustomStatusBar = ({ style, children, ...props }) => {

    const { theme } = useTheme();

    return (
        <StatusBar backgroundColor={theme.globalBackground} />
    )
}

export default CustomStatusBar

const styles = StyleSheet.create({})