import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api"; // Ensure this points to the standalone api.js file
import { getToken, removeToken } from "@/utils/tokenStorage";
import { FirebaseLogout } from "@/src/firebase/authService";

const AuthContext = createContext();

let cachedToken = null;

export const AuthProvider = ({ children }) => {
  const [signInData, setSignInData] = useState({
    user: null,
    loading: false,
    error: null,
    success: false,
  });

  const [signUpData, setSignUpData] = useState({
    user: null,
    loading: false,
    error: null,
    success: false,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [searchSalon, setSearchSalon] = useState(null);
  const [rememberMe, setRememberMe] = useState(true);

  // 1. Initial hydration
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const value = await AsyncStorage.getItem("isAuthenticated");
        const user = await AsyncStorage.getItem("LoggedInUser");

        if (value !== null) {
          const parsedValue = JSON.parse(value);
          setIsAuthenticated(parsedValue);
        }

        if (user) {
          const parseUser = JSON.parse(user);
          setAuthenticatedUser(parseUser);
        }
      } catch (error) {
        console.error("Failed to load user data from AsyncStorage", error);
      }
    };

    loadUserFromStorage();
  }, []);

  useEffect(() => {
    const initToken = async () => {
      const token = await getToken();
      cachedToken = token;
    };

    initToken();
  }, []);


  const logout = async () => {
    try {
      cachedToken = null;

      await FirebaseLogout()
      await removeToken();
      await AsyncStorage.removeItem("isAuthenticated");

      setIsAuthenticated(false);
      setAuthenticatedUser(null);
      setRememberMe(false)
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        try {
          if (!cachedToken) {
            cachedToken = await getToken();
          }

          if (cachedToken) {
            config.headers.Authorization = `Bearer ${cachedToken}`;
          }
        } catch (err) {
          console.log("Token interceptor error", err);
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        // -----------------------------
        // Auto logout on auth failure
        // -----------------------------
        if (status === 401 || status === 403) {
          await logout();
        }

        return Promise.reject(error);
      },
    );

    // cleanup
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    authenticatedUser,
    setAuthenticatedUser,
    searchSalon,
    setSearchSalon,
    signInData,
    setSignInData,
    signUpData,
    setSignUpData,
    rememberMe,
    setRememberMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
