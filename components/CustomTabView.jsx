import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scale, verticalScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

const CustomTabView = ({ style, children, ...props }) => {

    const { colors } = useTheme()

    return (
        <SafeAreaView
            edges={['top', 'left', 'right']}
            style={{
                flex: 1,
                backgroundColor: colors.tabBackground,
                paddingHorizontal: scale(15),
            }}
        >

            {children}
        </SafeAreaView>
    )
}

export default CustomTabView

const styles = StyleSheet.create({})