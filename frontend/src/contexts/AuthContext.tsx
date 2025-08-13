import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from '../firebase';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  studentId: string;
  username?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  phone?: string;
  dateOfBirth?: string;
  interests?: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  gamification: {
    level: number;
    xp: number;
    totalXp: number;
    streak: number;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for redirect result first
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('AuthContext: Redirect result found:', result.user);
        }
      } catch (error) {
        console.error('AuthContext: Error checking redirect result:', error);
      }
    };

    checkRedirectResult();

    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // You can fetch additional user data from Firestore if needed
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          studentId: '',
          avatar: firebaseUser.photoURL || undefined,
          gamification: {
            level: 1,
            xp: 0,
            totalXp: 0,
            streak: 0,
          },
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      // Optionally update profile with displayName, etc.
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    console.log('AuthContext: loginWithGoogle called');
    console.log('AuthContext: Current domain:', window.location.hostname);
    console.log('AuthContext: Current URL:', window.location.href);
    
    setLoading(true);
    try {
      console.log('AuthContext: Starting Google sign-in...');
      
      // Try popup first
      try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('AuthContext: Google sign-in successful (popup):', result.user);
        console.log('AuthContext: User email:', result.user.email);
        console.log('AuthContext: User display name:', result.user.displayName);
        return;
      } catch (popupError: any) {
        console.warn('AuthContext: Popup sign-in failed, attempting redirect fallback...', popupError);
        try {
          await signInWithRedirect(auth, googleProvider);
          console.log('AuthContext: Redirect initiated');
          return;
        } catch (redirectError) {
          console.error('AuthContext: Redirect sign-in also failed:', redirectError);
          throw redirectError;
        }
      }
    } catch (error: any) {
      console.error('AuthContext: Google sign-in error:', error);
      console.error('AuthContext: Error code:', error.code);
      console.error('AuthContext: Error message:', error.message);
      console.error('AuthContext: Full error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up was blocked. Please allow pop-ups for this site and try again.');
      } else if (error.code === 'auth/operation-not-supported-in-this-environment') {
        throw new Error('This browser does not support Google popup sign-in. We tried redirect and it failed. Please try a different browser.');
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error(`Domain '${window.location.hostname}' is not authorized. Please contact support.`);
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Google sign-in is not enabled for this project. Please contact support.');
      } else {
        throw new Error(error.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    firebaseSignOut(auth);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 