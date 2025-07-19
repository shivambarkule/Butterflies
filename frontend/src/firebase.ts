import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBF-GSsnayoyAfRhX29TnCErXD4N4pT3pk",
  authDomain: "labyrinth-db7a0.firebaseapp.com",
  projectId: "labyrinth-db7a0",
  storageBucket: "labyrinth-db7a0.appspot.com", // fixed to .com
  messagingSenderId: "316561291107",
  appId: "1:316561291107:web:339b5ea3341d774f3a0556",
  measurementId: "G-JZZX7J7C73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier }; 