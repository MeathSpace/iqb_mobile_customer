import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext'

const CustomView = ({ style, children, ...props }) => {

    const { theme } = useTheme();

    return (
        <View
            style={[{ flex: 1, backgroundColor: theme.globalBackground }, style]}
            {...props}
        >
            {children}
        </View >
    )
}

export default CustomView

const styles = StyleSheet.create({})