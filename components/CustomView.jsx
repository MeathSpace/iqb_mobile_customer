import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scale, verticalScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

const CustomView = ({ style, children, ...props }) => {

    const { colors } = useTheme()

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background
            }}
        >
            <View
                style={
                    [{
                        flex: 1,
                        paddingHorizontal: scale(15),
                        paddingVertical: verticalScale(15),
                    }, style]
                }
                {...props}
            >
                {children}
            </View >
        </SafeAreaView>
    )
}

export default CustomView

const styles = StyleSheet.create({})