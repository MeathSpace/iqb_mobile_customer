import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Header = () => {

    // const { theme, modeColor, setModeColor } = useTheme()

    // const modeColorHandler = async (colorMode) => {
    //     setModeColor(colorMode)
    //     await AsyncStorage.setItem('modeColor', JSON.stringify({ ...colorMode, default: false }));
    // }


    return (
        <View>
            <Text>Header</Text>

            {/* <Pressable
                style={{
                    height: 40,
                    width: 100,
                    backgroundColor: modeColor.colorCode
                }}
            >
                <CustomText>button</CustomText>



            </Pressable>

            <Pressable onPress={() => modeColorHandler({ colorName: "Blue", colorCode: "blue" })}><Text>Blue</Text></Pressable>
            <Pressable onPress={() => modeColorHandler({ colorName: "White", colorCode: "white" })}><Text>White</Text></Pressable>
            <Pressable onPress={() => modeColorHandler({ colorName: "Red", colorCode: "red" })}><Text>Red</Text></Pressable> */}
        </View>
    )
}

export default Header

const styles = StyleSheet.create({})