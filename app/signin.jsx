import { Pressable, StyleSheet, Text, View } from 'react-native'
import CustomView from "../components/CustomView/CustomView"
import CustomText from "../components/CustomText/CustomText"
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react'
import { useTheme } from '../context/ThemeContext'

const signin = () => {

    const { theme, modeColor, setModeColor } = useTheme()

    // const modeColorHandler = async (colorMode) => {
    //     setModeColor(colorMode)
    //     await AsyncStorage.setItem('modeColor', JSON.stringify({ ...colorMode, default: false }));
    // }

    return (
        <CustomView style={{ flex: 1, backgroundColor: "transparent" }}>
            <CustomText>signin</CustomText>

            <Pressable
                style={{
                    height: 40,
                    width: 100,
                    backgroundColor: modeColor.colorCode
                }}
            >
                <CustomText>button</CustomText>



            </Pressable>
{/* 
            <Pressable onPress={() => modeColorHandler({ colorName: "Blue", colorCode: "blue" })}><Text>Blue</Text></Pressable>
            <Pressable onPress={() => modeColorHandler({ colorName: "White", colorCode: "white" })}><Text>White</Text></Pressable>
            <Pressable onPress={() => modeColorHandler({ colorName: "Red", colorCode: "red" })}><Text>Red</Text></Pressable> */}
        </CustomView>
    )
}

export default signin

const styles = StyleSheet.create({})