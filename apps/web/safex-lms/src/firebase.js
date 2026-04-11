// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {GoogleAuthProvider, getAuth} from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDXUNPHx0ZSWr2TuHbJ1O_I1IENQgBcG3g",
  authDomain: "etoa-frontend.firebaseapp.com",
  projectId: "etoa-frontend",
  storageBucket: "etoa-frontend.appspot.com",
  messagingSenderId: "803432734111",
  appId: "1:803432734111:web:a737b7cbb77e286650b1aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();
export default app;