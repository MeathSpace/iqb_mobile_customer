🚀 Running the Project

To start the project in development mode:
npx expo start

📦 Building the Project

Android (Production Build)
eas build --platform android --profile production

iOS (Production Build)
eas build --platform ios --profile production

📁 Project Structure

The project is organized into the following main folders:

🔐 (auths) Folder

Contains all authentication-related screens:

Sign In

Sign Up

Forgot Password

Personal Info

Verification

🔒 (protected) Folder

Contains screens accessible only after user authentication.

This folder includes two types of screens:

Tab Screens

Located inside the tab folder

Accessible via bottom tab navigation

Other App Screens

Not part of the tab navigation

Still accessible after login

🧠 Context Folder

Manages application state using React Context:

AuthContext.jsx – Handles authentication-related state and logic

GlobalContext.jsx – Manages global application state

🧩 Components Folder

Contains all reusable components used throughout the application.




Firebase code


import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../src/firebase/auth";
import { FirebaseLogout } from "../../src/firebase/authService";

const index = () => {
  // Track the logged-in user state and the initial checking/loading state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // const auth = getAuth();

  useEffect(() => {
    // This configures the native Google SDK layer
    GoogleSignin.configure({
      webClientId:
        "328989269092-gs9sjo1bhn0a153olt6p1peq6i25u7f2.apps.googleusercontent.com",
      offlineAccess: true,
    });

    // Listen globally for session updates (login, sign up, or logout events)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Clean up authentication listener thread when component unmounts
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken || response.idToken;

      if (!idToken) {
        console.log("No ID Token found from Google Sign-In");
        return;
      }

      // This line of code is the essential bridge between Google and Firebase. It takes the successful login proof from the mobile device and translates it into a standard
      // format that the Firebase backend understands.
      const credential = GoogleAuthProvider.credential(idToken);

      // Pass token to Firebase. onAuthStateChanged automatically catches this state.
      await signInWithCredential(auth, credential);
    } catch (error) {
      console.error("Google Sign-In Error: ", error);
      Alert.alert("Sign-In Failed", error.message);
    }
  };

  // Render a clean loading indicator while initializing active session state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        // ─── AUTHENTICATED / LOGGED IN PANEL ───
        <View style={styles.authCard}>
          <View style={styles.headerZone}>
            <Text style={styles.titleText}>Profile Info</Text>
            <Text style={styles.subtitleText}>
              Successfully authenticated session
            </Text>
          </View>

          {/* User Data Fields */}
          <View style={styles.profileDataWrapper}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>
              {user.displayName || "Standard Email User"}
            </Text>

            <View style={styles.innerFieldDivider} />

            <Text style={styles.label}>Email Address</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          {/* System Logout Trigger */}
          <Pressable
            style={[styles.button, styles.logoutButton]}
            onPress={async () => {
              try {
                await FirebaseLogout();
              } catch (error) {
                Alert.alert("Logout Failed", error.message);
              }
            }}
          >
            <Text style={styles.logoutButtonText}>Log out</Text>
          </Pressable>
        </View>
      ) : (
        // ─── UNAUTHENTICATED / LOGGED OUT FORMS ───
        <View style={styles.authCard}>
          {/* Header Title Section */}
          <View style={styles.headerZone}>
            <Text style={styles.titleText}>Welcome</Text>
            <Text style={styles.subtitleText}>
              Manage your authentication session
            </Text>
          </View>

          {/* OAuth Google Federated Button */}
          <Pressable
            style={[styles.button, styles.googleButton]}
            onPress={signInWithGoogle}
          >
            <Text style={styles.googleButtonText}>Sign In with Google</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  authCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  headerZone: {
    alignItems: "center",
    marginBottom: 28,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },
  profileDataWrapper: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "600",
    marginTop: 2,
  },
  innerFieldDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    my: 12,
    marginVertical: 12,
  },
  button: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  primaryButton: {
    backgroundColor: "#0F172A",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  secondaryButtonText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 15,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },
  googleButton: {
    backgroundColor: "#4285F4",
    elevation: 2,
    shadowColor: "#4285F4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  googleButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  logoutButton: {
    backgroundColor: "transparent",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    width: "100%",
  },
  logoutButtonText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 14,
  },
});
