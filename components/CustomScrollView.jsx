import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { scale, verticalScale } from 'react-native-size-matters';

const CustomScrollView = ({ style, children, ...props }) => {

    const { theme } = useTheme();

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: theme.globalBackground }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={[{ flexGrow: 1, paddingHorizontal: scale(15), paddingVertical: verticalScale(15) }, style]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                {...props}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default CustomScrollView

const styles = StyleSheet.create({})