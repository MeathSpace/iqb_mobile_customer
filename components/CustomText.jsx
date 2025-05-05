import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

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
        fontSize: moderateScale(16),
        fontFamily: 'AirbnbCereal_W_Bk',
        textDecorationLine: 'none',
    },
});