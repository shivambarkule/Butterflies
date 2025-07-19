import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const LoginPage = () => {
  const { login, loginWithGoogle, loading, user } = useAuth() as any;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-400 to-purple-800">
      <form onSubmit={handleSubmit} className="bg-glass-100 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block text-gray-200 mb-2">Email</label>
          <input
            type="email"
            className="w-full p-3 rounded bg-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-brand-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-200 mb-2">Password</label>
          <input
            type="password"
            className="w-full p-3 rounded bg-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-brand-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded bg-brand-400 hover:bg-brand-500 text-white font-semibold transition mb-4"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full py-3 rounded bg-white text-brand-500 font-semibold border border-brand-400 hover:bg-brand-50 transition flex items-center justify-center"
          disabled={loading}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.09 30.18 0 24 0 14.82 0 6.71 5.48 2.69 13.44l7.98 6.2C12.13 13.09 17.57 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.04l7.19 5.59C43.93 37.36 46.1 31.45 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.65c-1.01-2.99-1.01-6.21 0-9.2l-7.98-6.2C.64 17.09 0 20.45 0 24c0 3.55.64 6.91 1.69 10.55l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.18 0 11.64-2.09 15.85-5.7l-7.19-5.59c-2.01 1.35-4.59 2.14-8.66 2.14-6.43 0-11.87-3.59-14.33-8.74l-7.98 6.2C6.71 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage; 