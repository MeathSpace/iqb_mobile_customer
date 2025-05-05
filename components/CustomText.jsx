import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import {
    responsiveFontSize
} from "react-native-responsive-dimensions";

const CustomText = ({ style, children, ...props }) => {

    const { theme } = useTheme();

    return (
        <Text style={[styles.defaultText, { color: theme.primaryText }, style]} {...props}>
            {children}
        </Text>
    )
}

export default CustomText

const styles = StyleSheet.create({
    defaultText: {
        fontSize: responsiveFontSize(2.2),
        fontFamily: 'AirbnbCereal_W_Bk',
        textDecorationLine: 'none',
    },
});