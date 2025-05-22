import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const CustomText = ({ style, children, ...props }) => {

    const { colors } = useTheme()

    return (
        <Text style={[styles.defaultText, { color: colors.text }, style]} {...props}>
            {children}
        </Text>
    )
}

export default CustomText

const styles = StyleSheet.create({
    defaultText: {
        fontSize: moderateScale(16),
        fontFamily: 'AirbnbCereal_W_Md',
        textDecorationLine: 'none',
    },
});