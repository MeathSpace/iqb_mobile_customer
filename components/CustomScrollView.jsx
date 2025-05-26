import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { scale, verticalScale } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

const CustomScrollView = ({ style, children, ...props }) => {

    const { colors } = useTheme()

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: colors.background
            }}
        >
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                    // backgroundColor: colors.background
                }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? verticalScale(0) : 0}
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
        </SafeAreaView>
    )
}

export default CustomScrollView

const styles = StyleSheet.create({})