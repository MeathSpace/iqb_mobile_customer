// import React, { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Constants from 'expo-constants';
// import { useRouter } from 'expo-router';
// import { StyleSheet } from 'react-native';

// const AppInitializer = ({ children }) => {
//     const [isReady, setIsReady] = useState(false);
//     const router = useRouter(); // only if you're using expo-router

//     useEffect(() => {
//         const checkAppVersion = async () => {
//             try {
//                 const currentVersion = Constants.expoConfig.version;
//                 console.log("Current Version ", currentVersion)
//                 const savedVersion = await AsyncStorage.getItem('APP_VERSION');
//                 console.log("Saved Version ", savedVersion)

//                 if (savedVersion !== currentVersion) {
//                     // App was updated
//                     await AsyncStorage.clear();
//                     await AsyncStorage.setItem('APP_VERSION', currentVersion);

//                     // Redirect to sign-in
//                     router.replace('/signin'); // or your login screen path
//                 }

//                 setIsReady(true);
//             } catch (error) {
//                 console.error('Version check failed:', error);
//             }
//         };

//         checkAppVersion();
//     }, []);


//     if (!isReady) return null; // optionally show splash

//     return children;
// }

// export default AppInitializer

// const styles = StyleSheet.create({})


// =================

// import React, { useEffect, useRef, useState } from 'react';
// import { AppState, StyleSheet } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Constants from 'expo-constants';
// import { useRouter } from 'expo-router';

// const AppInitializer = ({ children }) => {
//     const [isReady, setIsReady] = useState(false);
//     const router = useRouter();
//     const appState = useRef(AppState.currentState);
//     const hasRunInThisSession = useRef(false); // ensure it runs only once per foreground event
//     const [redirectedRoute, setRedirectedRoute] = useState(false)

//     const checkAppVersion = async () => {
//         try {
//             const currentVersion = Constants.expoConfig.version;
//             const savedVersion = await AsyncStorage.getItem('APP_VERSION');

//             console.log("Current Version ", currentVersion)
//             console.log("Saved version ", savedVersion)

//             if (savedVersion !== currentVersion) {
//                 await AsyncStorage.clear();
//                 await AsyncStorage.setItem('APP_VERSION', currentVersion);
//                 console.log("Router console ")
//                 router.replace('/signin');
//                 // router.replace('/signin');
//             }


//         } catch (error) {
//             console.error('Version check failed:', error);
//         }
//     };

//     useEffect(() => {
//         const handleAppStateChange = async (nextAppState) => {
//             if (
//                 appState.current.match(/inactive|background/) &&
//                 nextAppState === 'active'
//             ) {

//                 console.log('[AppState] App has come to foreground');

//                 if (!hasRunInThisSession.current) {
//                     hasRunInThisSession.current = true;
//                     await checkAppVersion();
//                 }
//             }

//             appState.current = nextAppState;
//         };

//         checkAppVersion(); // run on initial mount

//         const subscription = AppState.addEventListener('change', handleAppStateChange);

//         setIsReady(true);
//         setRedirectedRoute(false)

//         return () => {
//             subscription.remove();
//         };
//     }, []);


//     if (!isReady) return null;

//     return children;
// };

// export default AppInitializer;

// const styles = StyleSheet.create({});




import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { AppState, StyleSheet } from 'react-native';

const AppInitializer = ({ children }) => {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter(); // only if you're using expo-router
    const appState = useRef(AppState.currentState);

    const checkAppVersion = async () => {
        try {
            const currentVersion = Constants.expoConfig.version;
            console.log("Current Version ", currentVersion)
            const savedVersion = await AsyncStorage.getItem('APP_VERSION');
            console.log("Saved Version ", savedVersion)

            if (savedVersion !== currentVersion) {
                // App was updated
                await AsyncStorage.clear();
                await AsyncStorage.setItem('APP_VERSION', currentVersion);

                // Redirect to sign-in
                router.replace('/signin'); // or your login screen path
            }

            setIsReady(true);
        } catch (error) {
            console.error('Version check failed:', error);
        }
    };

    useEffect(() => {
        // Initial mount version check
        checkAppVersion();

        const handleAppStateChange = async (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log("[AppState] App became active");
                await checkAppVersion();
            }
            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);


    if (!isReady) return null; // optionally show splash

    return children;
}

export default AppInitializer

const styles = StyleSheet.create({})
