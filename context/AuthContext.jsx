// context/AuthContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false); // null = not logged in
    const [authenticatedUser, setAuthenticatedUser] = useState(null)
    const [searchSalon, setSearchSalon] = useState(null)

    useEffect(() => {
        const loadUserFromStorage = async () => {
            try {
                const value = await AsyncStorage.getItem("isAuthenticated");
                const user = await AsyncStorage.getItem("LoggedInUser");

                if (value !== null) {
                    const parsedValue = JSON.parse(value); // Parse the value as a boolean
                    setIsAuthenticated(parsedValue);
                }

                if (user) {
                    const parseUser = JSON.parse(user)
                    setAuthenticatedUser(parseUser)
                }

            } catch (error) {
                console.error('Failed to load user data from AsyncStorage', error);
            }
        };

        loadUserFromStorage();
    }, []);

    const value = {
        isAuthenticated,
        setIsAuthenticated,
        authenticatedUser,
        setAuthenticatedUser,
        searchSalon,
        setSearchSalon
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
