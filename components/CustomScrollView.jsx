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
            keyboardVerticalOffset={Platform.OS === 'ios' ? verticalScale(45) : 0}
        >
            <ScrollView
                style={{ flex: 1, backgroundColor: theme.globalBackground }}
                contentContainerStyle={[{ flexGrow: 1, padding: scale(15) }, style]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={true}
                {...props}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default CustomScrollView

const styles = StyleSheet.create({})