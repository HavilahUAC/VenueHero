import { auth } from "./firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

// Sign up
export const signUp = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

// Login
export const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

// Logout
export const logout = () => signOut(auth);

// Listen to auth state
export const subscribeToAuth = (callback) =>
    onAuthStateChanged(auth, callback);