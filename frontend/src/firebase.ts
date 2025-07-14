import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCiKj5jNyN0f4imzP7BEJ3y1V00BJgUgp0",
  authDomain: "butterflies-c1d94.firebaseapp.com",
  projectId: "butterflies-c1d94",
  storageBucket: "butterflies-c1d94.appspot.com", // fixed typo
  messagingSenderId: "613937001862",
  appId: "1:613937001862:web:52d91e923fe741f1206807",
  measurementId: "G-JY726ELM05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged }; 