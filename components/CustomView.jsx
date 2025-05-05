import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";

const CustomView = ({ style, children, ...props }) => {

    const { theme } = useTheme();

    return (
        <View
            style={[{ height: responsiveHeight(100), backgroundColor: theme.globalBackground }, style]}
            {...props}
        >
            {children}
        </View >
    )
}

export default CustomView

const styles = StyleSheet.create({})