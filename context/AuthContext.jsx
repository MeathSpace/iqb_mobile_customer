import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useContext, useEffect } from "react";

import api from "../utils/api";

import { getToken, removeToken } from "@/utils/tokenStorage";

import { FirebaseLogout } from "@/src/firebase/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ----------------------------------------
  // Sign In State
  // ----------------------------------------
  const [signInData, setSignInData] = useState({
    user: null,
    loading: false,
    error: null,
    success: false,
  });

  // ----------------------------------------
  // Sign Up State
  // ----------------------------------------
  const [signUpData, setSignUpData] = useState({
    user: null,
    loading: false,
    error: null,
    success: false,
  });

  // ----------------------------------------
  // Auth State
  // ----------------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const [searchSalon, setSearchSalon] = useState(null);

  const [rememberMe, setRememberMe] = useState(true);

  // ----------------------------------------
  // Initial Hydration
  // ----------------------------------------
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem("isAuthenticated");

        const storedUser = await AsyncStorage.getItem("LoggedInUser");

        if (storedAuth !== null) {
          setIsAuthenticated(JSON.parse(storedAuth));
        }

        if (storedUser) {
          setAuthenticatedUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log("Failed to hydrate auth state:", error);
      }
    };

    loadUserFromStorage();
  }, []);

  // ----------------------------------------
  // Logout Function
  // ----------------------------------------
  const logout = async () => {
    try {
      // Firebase Logout
      try {
        await FirebaseLogout();
      } catch (firebaseError) {
        console.log("Firebase logout failed:", firebaseError);
      }

      // Remove Secure Token
      await removeToken();

      // Remove Persisted User Data
      await AsyncStorage.multiRemove(["isAuthenticated", "LoggedInUser"]);

      // Reset React State
      setIsAuthenticated(false);
      setAuthenticatedUser(null);
      setRememberMe(false);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  // ----------------------------------------
  // Axios Interceptors
  // ----------------------------------------
  useEffect(() => {
    // Request Interceptor
    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        try {
          // Always get fresh token
          const token = await getToken();

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.log("Request interceptor error:", error);
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response Interceptor
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,

      async (error) => {
        const status = error?.response?.status;

        // Auto logout on auth failure
        if ((status === 401 || status === 403) && isAuthenticated) {
          await logout();
        }

        return Promise.reject(error);
      },
    );

    // Cleanup Interceptors
    return () => {
      api.interceptors.request.eject(requestInterceptor);

      api.interceptors.response.eject(responseInterceptor);
    };
  }, [isAuthenticated]);

  // ----------------------------------------
  // Context Value
  // ----------------------------------------
  const value = {
    // Auth State
    isAuthenticated,
    setIsAuthenticated,

    authenticatedUser,
    setAuthenticatedUser,

    // Salon State
    searchSalon,
    setSearchSalon,

    // Sign In State
    signInData,
    setSignInData,

    // Sign Up State
    signUpData,
    setSignUpData,

    // Remember Me
    rememberMe,
    setRememberMe,

    // Logout
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ----------------------------------------
// Custom Hook
// ----------------------------------------
export const useAuth = () => useContext(AuthContext);
