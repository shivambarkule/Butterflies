import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExamListPage } from './pages/ExamListPage';
import { ClassesPage } from './pages/ClassesPage';
import { ResultsPage } from './pages/ResultsPage';
import TotalExamsPage from './pages/TotalExamsPage';
import UpcomingExamsPage from './pages/UpcomingExamsPage';
import RecentAchievementsPage from './pages/RecentAchievementsPage';
import NotificationsPage from './pages/NotificationsPage';
import StudyMaterialsPage from './pages/StudyMaterialsPage';
import ProfilePage from './pages/ProfilePage';

// Components
import { ProtectedRoute } from './components/ProtectedRoute';
import ShootingStar from './components/ShootingStar';
import GoldenPointer from './components/GoldenPointer';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './hooks/useTheme';

// Styles
import './styles/globals.css';

function App() {
  const { isDark } = useTheme();
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          <GoldenPointer isDark={isDark} />
          <ShootingStar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/exams" element={
              <ProtectedRoute>
                <ExamListPage />
              </ProtectedRoute>
            } />
            <Route path="/classes" element={
              <ProtectedRoute>
                <ClassesPage />
              </ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            } />
            <Route path="/total-exams" element={
              <ProtectedRoute>
                <TotalExamsPage />
              </ProtectedRoute>
            } />
            <Route path="/upcoming-exams" element={
              <ProtectedRoute>
                <UpcomingExamsPage />
              </ProtectedRoute>
            } />
            <Route path="/recent-achievements" element={
              <ProtectedRoute>
                <RecentAchievementsPage />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } />
            <Route path="/study-materials" element={
              <ProtectedRoute>
                <StudyMaterialsPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 