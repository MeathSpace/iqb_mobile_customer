// context/AuthContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    useEffect(() => {
        const loadUserFromStorage = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('auth');
                if (storedUser) {
                    console.log("Stored User ", storedUser)
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Failed to load user data from AsyncStorage', error);
            }
        };

        loadUserFromStorage();
    }, []);

    const [user, setUser] = useState(null); // null = not logged in

    // console.log("Context User ", user)
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
