import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext(Colors.light); // default value

export const ThemeProvider = ({ children }) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

    useEffect(() => {
        const fetchColorFromStorage = async () => {
            const saveColorMode = await AsyncStorage.getItem('modeColor');
            const parseColorCode = JSON.parse(saveColorMode)

            if (!parseColorCode.default) {
                setModeColor(parseColorCode)
            }

        };
        fetchColorFromStorage();
    }, []);

    const [modeColor, setModeColor] = useState({
        colorName: Colors.modeColor.colorName,
        colorCode: Colors.modeColor.colorCode,
        default: true
    })

    const value = {
        theme, modeColor, setModeColor
    }
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

