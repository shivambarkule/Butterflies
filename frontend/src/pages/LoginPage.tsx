import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const LoginPage = () => {
  const { login, loading, user } = useAuth() as any;
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
        
      </form>
    </div>
  );
};

export default LoginPage; 