// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBTUlsDau4OYObFu-HUYHnGWhwTJIy80Xo",
    authDomain: "venuehero-42b4a.firebaseapp.com",
    projectId: "venuehero-42b4a",
    storageBucket: "venuehero-42b4a.firebasestorage.app",
    messagingSenderId: "392201678524",
    appId: "1:392201678524:web:287e594151ae08a0506ab9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
