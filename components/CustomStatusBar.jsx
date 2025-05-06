import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '../context/ThemeContext';

const CustomStatusBar = ({ style, children, ...props }) => {

    const { theme } = useTheme();

    return (
        <StatusBar
            translucent={false}
            backgroundColor={theme.globalBackground} />
    )
}

export default CustomStatusBar

const styles = StyleSheet.create({})

// import { StatusBar, Platform, View } from 'react-native';
// import { useTheme } from '../context/ThemeContext';

// const CustomStatusBar = () => {
//     const { theme } = useTheme();
//     const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight;

//     return (
//         <View style={{
//             height: STATUS_BAR_HEIGHT,
//             backgroundColor: theme.globalBackground
//         }}>
//             <StatusBar
//                 translucent
//                 backgroundColor="transparent"
//                 barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
//             />
//         </View>
//     );
// };

// export default CustomStatusBar;
