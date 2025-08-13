import React, { useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export const FirebaseTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('Testing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        console.log('FirebaseTest: Testing Firebase configuration...');
        console.log('FirebaseTest: Auth object:', auth);
        console.log('FirebaseTest: Google provider:', googleProvider);
        
        // Test if we can access Firebase auth
        if (auth) {
          setTestResult('Firebase Auth is initialized');
          console.log('FirebaseTest: Firebase Auth is working');
        } else {
          setTestResult('Firebase Auth is not initialized');
          setError('Firebase Auth failed to initialize');
        }
      } catch (err: any) {
        console.error('FirebaseTest: Error testing Firebase:', err);
        setError(err.message);
        setTestResult('Firebase test failed');
      }
    };

    testFirebase();
  }, []);

  const testGoogleSignIn = async () => {
    try {
      console.log('FirebaseTest: Testing Google sign-in...');
      console.log('FirebaseTest: Current domain:', window.location.hostname);
      setTestResult('Testing Google sign-in...');
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log('FirebaseTest: Google sign-in successful:', result.user);
      setTestResult(`Google sign-in successful: ${result.user.email}`);
    } catch (err: any) {
      console.error('FirebaseTest: Google sign-in test failed:', err);
      console.error('FirebaseTest: Error code:', err.code);
      console.error('FirebaseTest: Error message:', err.message);
      setError(err.message);
      setTestResult('Google sign-in test failed');
    }
  };

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-4 rounded-lg z-50 max-w-sm">
      <h3 className="font-bold mb-2">Firebase Test</h3>
      <p className="text-sm mb-2">{testResult}</p>
      {error && <p className="text-red-400 text-sm mb-2">Error: {error}</p>}
      <button
        onClick={testGoogleSignIn}
        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
      >
        Test Google Sign-in
      </button>
    </div>
  );
}; 