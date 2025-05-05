import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import {
    responsiveFontSize
} from "react-native-responsive-dimensions";

const CustomSecondaryText = ({ style, children, ...props }) => {

    const { theme } = useTheme();

    return (
        <Text style={[styles.defaultText, { color: theme.secondaryText }, style]} {...props}>
            {children}
        </Text>
    )
}

export default CustomSecondaryText

const styles = StyleSheet.create({
    defaultText: {
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'AirbnbCereal_W_Bk',
        textDecorationLine: 'none',
    },
});