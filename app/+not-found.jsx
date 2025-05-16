import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '@react-navigation/native';

const NotFound = () => {
  const { colors } = useTheme();

  console.log("THEME COLORS ", colors)


  return (
    <View>
      <Text style={{color: colors.text}}> NotFound</Text>
    </View >
  )
}

export default NotFound

const styles = StyleSheet.create({})