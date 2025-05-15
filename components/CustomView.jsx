import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { scale, verticalScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomView = ({ style, children, ...props }) => {

    const { theme } = useTheme();

    return (
        <SafeAreaView
            edges={['top', 'left', 'right']}
            style={{
                flex: 1,
                backgroundColor: theme.globalBackground
            }}
        >
            <View
                style={
                    [{
                        flex: 1,
                        paddingHorizontal: scale(15),
                        paddingVertical: verticalScale(15),
                        backgroundColor: theme.globalBackground
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