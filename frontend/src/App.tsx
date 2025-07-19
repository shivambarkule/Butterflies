import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import your existing pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClassesPage } from './pages/ClassesPage';
import { ExamListPage } from './pages/ExamListPage';
import { ExamPage } from './pages/ExamPage';
import { ResultsPage } from './pages/ResultsPage';
import { ProfilePage } from './pages/ProfilePage';
import { StudyMaterialsPage } from './pages/StudyMaterialsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { RecentAchievementsPage } from './pages/RecentAchievementsPage';
import { UpcomingExamsPage } from './pages/UpcomingExamsPage';
import { TotalExamsPage } from './pages/TotalExamsPage';
import { SmartStudyToolsPage } from './pages/SmartStudyToolsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Import your animated components
import { AnimatedBackground } from './components/AnimatedBackground';
import { FloatingShapes } from './components/FloatingShapes';
import Snowfall from './components/Snowfall';
import { EasterEggs } from './components/EasterEggs';
import { ThemeControls } from './components/ThemeControls';
import { WeatherEffects } from './components/WeatherEffects';
import { SoundProvider } from './contexts/SoundContext';
import { SoundControls } from './components/SoundControls';

import { LoadingControls } from './components/LoadingControls';
import { GamificationSystem } from './components/GamificationSystem';
import { SocialSystem } from './components/SocialSystem';
import { InteractiveBackgrounds } from './components/InteractiveBackgrounds';

function App() {
  const { user, loading } = useAuth();
  const [loadingControlsOpen, setLoadingControlsOpen] = useState(false);
  const [gamificationOpen, setGamificationOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [interactiveBackgroundsActive, setInteractiveBackgroundsActive] = useState(false);
  const [backgroundIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [backgroundTheme] = useState<'study' | 'creative' | 'nature' | 'space' | 'ocean' | 'forest' | 'desert' | 'arctic'>('study');

  // Event listeners for modal controls
  useEffect(() => {
    const handleLoadingToggle = () => setLoadingControlsOpen(prev => !prev);
    const handleGamificationToggle = () => setGamificationOpen(prev => !prev);
    const handleSocialToggle = () => setSocialOpen(prev => !prev);
    const handleInteractiveBackgroundsToggle = () => setInteractiveBackgroundsActive(prev => !prev);

    window.addEventListener('loading-controls-toggle', handleLoadingToggle);
    window.addEventListener('gamification-toggle', handleGamificationToggle);
    window.addEventListener('social-features-toggle', handleSocialToggle);
    window.addEventListener('interactive-backgrounds-toggle', handleInteractiveBackgroundsToggle);

    return () => {
      window.removeEventListener('loading-controls-toggle', handleLoadingToggle);
      window.removeEventListener('gamification-toggle', handleGamificationToggle);
      window.removeEventListener('social-features-toggle', handleSocialToggle);
      window.removeEventListener('interactive-backgrounds-toggle', handleInteractiveBackgroundsToggle);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <SoundProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Interactive Backgrounds */}
        <InteractiveBackgrounds 
          isActive={interactiveBackgroundsActive}
          intensity={backgroundIntensity}
          theme={backgroundTheme}
        />
        
        {/* Animated Background */}
        <AnimatedBackground />
        <FloatingShapes />
        <Snowfall />
        
        {/* Easter Eggs */}
        <EasterEggs />
        
        {/* Theme Controls */}
        <ThemeControls />
        
        {/* Sound Controls */}
        <SoundControls />
        

        
        {/* Loading Controls */}
        <LoadingControls 
          isOpen={loadingControlsOpen} 
          onClose={() => setLoadingControlsOpen(false)} 
        />
        
        {/* Gamification System */}
        <GamificationSystem 
          isOpen={gamificationOpen} 
          onClose={() => setGamificationOpen(false)} 
        />
        
        {/* Social System */}
        <SocialSystem 
          isOpen={socialOpen} 
          onClose={() => setSocialOpen(false)} 
        />
        
        {/* Weather Effects */}
        <WeatherEffects />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/classes" element={
            <ProtectedRoute>
              <ClassesPage />
            </ProtectedRoute>
          } />
          <Route path="/exams" element={
            <ProtectedRoute>
              <ExamListPage />
            </ProtectedRoute>
          } />
          <Route path="/exam/:id" element={
            <ProtectedRoute>
              <ExamPage />
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/study-materials" element={
            <ProtectedRoute>
              <StudyMaterialsPage />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          <Route path="/achievements" element={
            <ProtectedRoute>
              <RecentAchievementsPage />
            </ProtectedRoute>
          } />
          <Route path="/upcoming-exams" element={
            <ProtectedRoute>
              <UpcomingExamsPage />
            </ProtectedRoute>
          } />
          <Route path="/total-exams" element={
            <ProtectedRoute>
              <TotalExamsPage />
            </ProtectedRoute>
          } />
          <Route path="/study-tools" element={
            <ProtectedRoute>
              <SmartStudyToolsPage />
            </ProtectedRoute>
          } />
          
          {/* Redirect authenticated users to dashboard */}
          <Route path="/home" element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
          } />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </SoundProvider>
  );
}

export default App; 