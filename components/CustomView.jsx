import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { scale, verticalScale } from 'react-native-size-matters';

const CustomView = ({ style, children, ...props }) => {

    const { theme } = useTheme();

    return (
        <View
            style={[{ flex: 1, paddingHorizontal: scale(15), paddingVertical: verticalScale(15), backgroundColor: theme.globalBackground }, style]}
            {...props}
        >
            {children}
        </View >
    )
}

export default CustomView

const styles = StyleSheet.create({})