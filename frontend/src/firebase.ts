import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBF-GSsnayoyAfRhX29TnCErXD4N4pT3pk",
  authDomain: "butterflies-c1d94.firebaseapp.com",
  projectId: "butterflies-c1d94",
  storageBucket: "butterflies-c1d94.appspot.com",
  messagingSenderId: "316561291107",
  appId: "1:316561291107:web:339b5ea3341d774f3a0556",
  measurementId: "G-JZZX7J7C73"
};

// Log the config for debugging
console.log('Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKey: firebaseConfig.apiKey ? '***' + firebaseConfig.apiKey.slice(-4) : 'undefined'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized:', app.name);

let analytics: ReturnType<typeof getAnalytics> | null = null;
// Initialize Analytics only if supported (avoids runtime errors in unsupported environments like some in-app browsers)
isAnalyticsSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('Firebase analytics initialized');
    } else {
      console.warn('Firebase analytics is not supported in this environment');
    }
  })
  .catch((err) => {
    console.warn('Firebase analytics support check failed:', err);
  });

const auth = getAuth(app);
console.log('Firebase auth initialized:', auth.app.name);

const googleProvider = new GoogleAuthProvider();
console.log('Google provider created');

// Configure Google provider (keep params minimal to avoid OAuth mismatches)
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Add scopes if needed
googleProvider.addScope('email');
googleProvider.addScope('profile');

console.log('Google provider configured with email and profile scopes');

// Helpful for configuring OAuth on the provider (copy these into Google Cloud if you use custom credentials)
export const firebaseAuthHandlerUrl = `https://${firebaseConfig.authDomain}/__/auth/handler`;
console.log('Expected Firebase OAuth redirect handler:', firebaseAuthHandlerUrl);

export { app, analytics, auth, googleProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier }; 