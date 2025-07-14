import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { GlassCard } from '@/components/GlassCard';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const ProfilePage: React.FC = () => {
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
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-400 to-purple-800">
      <Helmet><title>Profile | Butterflies</title></Helmet>
      <GlassCard className="p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-200 mb-2">First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} className="w-full p-3 rounded bg-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div>
            <label className="block text-gray-200 mb-2">Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} className="w-full p-3 rounded bg-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div>
            <label className="block text-gray-200 mb-2">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full p-3 rounded bg-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-brand-400" disabled />
          </div>
          <div>
            <label className="block text-gray-200 mb-2">Student ID</label>
            <input name="studentId" value={form.studentId} onChange={handleChange} className="w-full p-3 rounded bg-glass-200 text-white focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <button type="submit" className="w-full py-3 rounded bg-brand-400 hover:bg-brand-500 text-white font-semibold transition" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default ProfilePage; 