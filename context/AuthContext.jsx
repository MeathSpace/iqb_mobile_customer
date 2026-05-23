// // context/AuthContext.js
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createContext, useState, useContext, useEffect } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {

//     const [signInData, setSignInData] = useState({
//         user: null,
//         loading: false,
//         error: null,
//         success: false
//     })

//     const [signUpData, setSignUpData] = useState({
//         user: null,
//         loading: false,
//         error: null,
//         success: false
//     })

//     const [isAuthenticated, setIsAuthenticated] = useState(false); // null = not logged in
//     const [authenticatedUser, setAuthenticatedUser] = useState(null)
//     const [searchSalon, setSearchSalon] = useState(null)

//     useEffect(() => {
//         const loadUserFromStorage = async () => {
//             try {
//                 const value = await AsyncStorage.getItem("isAuthenticated");
//                 const user = await AsyncStorage.getItem("LoggedInUser");

//                 if (value !== null) {
//                     const parsedValue = JSON.parse(value); // Parse the value as a boolean
//                     setIsAuthenticated(parsedValue);
//                 }

//                 if (user) {
//                     const parseUser = JSON.parse(user)
//                     setAuthenticatedUser(parseUser)
//                 }

//             } catch (error) {
//                 console.error('Failed to load user data from AsyncStorage', error);
//             }
//         };

//         loadUserFromStorage();
//     }, []);

//     const value = {
//         isAuthenticated,
//         setIsAuthenticated,
//         authenticatedUser,
//         setAuthenticatedUser,
//         searchSalon,
//         setSearchSalon,
//         signInData,
//         setSignInData,
//         signUpData,
//         setSignUpData
//     }

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);

// context/AuthContext.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api"; // Ensure this points to the standalone api.js file
import { getToken, removeToken } from "@/utils/tokenStorage";

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

      await removeToken();
      await AsyncStorage.multiRemove(["isAuthenticated", "LoggedInUser"]);

      setIsAuthenticated(false);
      setAuthenticatedUser(null);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  // 2. Axios Interceptors setup
  //   useEffect(() => {
  //     const requestInterceptor = api.interceptors.request.use(
  //       async (config) => {
  //         try {
  //           console.log("Request from interceptor");
  //           const token = await getToken();
  //           if (token) {
  //             config.headers.Authorization = `Bearer ${token}`;
  //           }
  //         } catch (err) {
  //           console.error(
  //             "Failed to fetch token for API request interceptor",
  //             err,
  //           );
  //         }
  //         return config;
  //       },
  //       (error) => Promise.reject(error),
  //     );

  //     const responseInterceptor = api.interceptors.response.use(
  //       (response) => response,
  //       async (error) => {
  //         console.log("Error from interceptor");
  //         const status = error?.response?.status;

  //         if (status === 401 || status === 403) {
  //           // 1. remove secure token
  //           await removeToken();

  //           // 2. remove AsyncStorage auth data
  //           await AsyncStorage.removeItem("isAuthenticated");
  //           await AsyncStorage.removeItem("LoggedInUser");

  //           // 3. reset context state
  //           setIsAuthenticated(false);
  //           setAuthenticatedUser(null);
  //         }

  //         // You can safely uncomment your 401 log-out logic here later!
  //         return Promise.reject(error);
  //       },
  //     );

  //     return () => {
  //       api.interceptors.request.eject(requestInterceptor);
  //       api.interceptors.response.eject(responseInterceptor);
  //     };
  //   }, []);

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      async (config) => {
        try {
          // ✅ Use memory first (NO SecureStore spam)
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
