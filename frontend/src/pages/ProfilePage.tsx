import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard } from '../components/GlassCard';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { FloatingShapes } from '../components/FloatingShapes';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    studentId: user?.studentId || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      updateUser(form);
      // Show success message
    } catch (err) {
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Profile - Butterflies</title>
      </Helmet>
      
      <AnimatedBackground />
      <FloatingShapes />
      
      <div className="relative z-10 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center min-h-[calc(100vh-3rem)]"
        >
          <GlassCard className="p-8 w-full max-w-lg">
            <h1 className="text-3xl font-bold mb-6 text-white text-center">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">First Name</label>
                <input 
                  name="firstName" 
                  value={form.firstName} 
                  onChange={handleChange} 
                  className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Last Name</label>
                <input 
                  name="lastName" 
                  value={form.lastName} 
                  onChange={handleChange} 
                  className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  className="w-full p-3 rounded-xl bg-glass-100/30 backdrop-blur-md border border-glass-200 text-gray-400 cursor-not-allowed" 
                  disabled 
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Student ID</label>
                <input 
                  name="studentId" 
                  value={form.studentId} 
                  onChange={handleChange} 
                  className="w-full p-3 rounded-xl bg-glass-100/50 backdrop-blur-md border border-glass-200 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" 
                />
              </div>
              <motion.button 
                type="submit" 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl" 
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}; 