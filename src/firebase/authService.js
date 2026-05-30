import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/auth";

// LOGOUT
export const FirebaseLogout = async () => {
  try {
    // 1. Log out of Firebase cloud session
    await signOut(auth);

    await GoogleSignin.signOut();

    console.log("Logged out completely from Firebase and Google cache");
  } catch (error) {
    console.log("Logout error:", error.message);
    throw error;
  }
};
