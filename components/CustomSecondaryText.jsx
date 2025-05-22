import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '@/constants/Colors'
import React from 'react'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';

const CustomSecondaryText = ({ style, children, ...props }) => {

    const { colors } = useTheme()

    return (
        <Text style={[styles.defaultText, { color: colors.secondaryText }, style]} {...props}>
            {children}
        </Text>
    )
}

export default CustomSecondaryText

const styles = StyleSheet.create({
    defaultText: {
        fontSize: moderateScale(14),
        fontFamily: 'AirbnbCereal_W_Md',
        textDecorationLine: 'none',
    },
});