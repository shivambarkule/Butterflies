import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Zap, 
  ArrowRight,
  Play,
  Shield,
  Target,
  Sparkles,
  Aperture
} from 'lucide-react';

import { GlassCard } from '@/components/GlassCard';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { FloatingShapes } from '@/components/FloatingShapes';
import { Helmet } from 'react-helmet-async';

const features = [
  {
    icon: BookOpen,
    title: 'Interactive Exams',
    description: 'Engage with dynamic questions and real-time feedback',
    color: 'from-blue-400 to-cyan-400'
  },
  {
    icon: Trophy,
    title: 'Gamification',
    description: 'Earn XP, badges, and climb leaderboards',
    color: 'from-yellow-400 to-orange-400'
  },
  {
    icon: Users,
    title: 'Social Learning',
    description: 'Study with friends and join collaborative sessions',
    color: 'from-green-400 to-emerald-400'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Instant notifications and live progress tracking',
    color: 'from-purple-400 to-pink-400'
  }
];

const stats = [
  { number: '10K+', label: 'Active Students', icon: Users },
  { number: '500+', label: 'Exams Available', icon: BookOpen },
  { number: '95%', label: 'Success Rate', icon: Target },
  { number: '24/7', label: 'Support Available', icon: Shield }
];

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Helmet>
        <title>Butterflies</title>
      </Helmet>
      <AnimatedBackground />
      <FloatingShapes />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-brand-400 to-purple-400 rounded-lg flex items-center justify-center">
            <Aperture className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Butterflies
          </span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center space-x-4"
        >
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-white hover:text-brand-200 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-gradient-to-r from-brand-400 to-purple-400 rounded-full text-white font-medium hover:shadow-lg hover:shadow-brand-400/25 transition-all duration-300"
          >
            Get Started
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center px-4 py-2 bg-glass-100 backdrop-blur-md rounded-full border border-glass-200 mb-8"
          >
            <Sparkles className="w-4 h-4 text-brand-400 mr-2" />
            <span className="text-sm font-medium">Next-Gen Learning Experience</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-brand-100 to-purple-200 bg-clip-text text-transparent">
              Master Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Butterflies?
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the future of education with our immersive, gamified exam platform. 
            Learn smarter, achieve more, and have fun while doing it.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link
              to="/register"
              className="group px-8 py-4 bg-gradient-to-r from-brand-400 to-purple-400 rounded-full text-white font-semibold text-lg hover:shadow-xl hover:shadow-brand-400/25 transition-all duration-300 flex items-center"
            >
              Start Learning
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="group px-8 py-4 bg-glass-100 backdrop-blur-md rounded-full border border-glass-200 text-white font-semibold text-lg hover:bg-glass-200 transition-all duration-300 flex items-center">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <GlassCard className="p-6">
                <stat.icon className="w-8 h-8 text-brand-400 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Why Choose
              </span>
              <br />
              <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
                Butterflies?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We've reimagined the exam experience with cutting-edge technology and engaging features
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <GlassCard className="p-6 h-full hover:bg-glass-200 transition-all duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <GlassCard className="p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <br />
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Your Learning?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already experiencing the future of education
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-brand-400 to-purple-400 rounded-full text-white font-semibold text-lg hover:shadow-xl hover:shadow-brand-400/25 transition-all duration-300 group"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </GlassCard>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-glass-200">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-brand-400 to-purple-400 rounded flex items-center justify-center">
              <Aperture className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Butterflies
            </span>
          </div>
          <p className="text-gray-400">
            © 2024 Butterflies. All rights reserved. Built with ❤️ for modern education.
          </p>
        </div>
      </footer>
    </div>
  );
}; 