import React, { useState, Suspense, lazy } from 'react';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ExerciseLibrary from './components/ExerciseLibrary';
import SchedulePage from './pages/SchedulePage';
import ProgressStats from './components/ProgressStats';
import WorkoutHistory from './components/WorkoutHistory';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import NotificationCenter from './components/NotificationCenter';
import './styles/dark-mode.css';
import './App.css';

// Lazy load TrainerAvatar - only loads when user is logged in
const TrainerAvatar = lazy(() => import('./components/TrainerAvatar'));

function AppContent() {
  const { user, loading, userProfile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  if (loading) {
    return (
      <div className="App loading-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show auth pages
  if (!user) {
    return (
      <div className="App">
        {authMode === 'login' ? (
          <LoginPage onSwitchToSignup={() => setAuthMode('signup')} />
        ) : (
          <SignupPage onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </div>
    );
  }

  // First-time user - show onboarding
  if (!userProfile?.onboardingComplete) {
    return (
      <Onboarding
        onComplete={() => {
          updateProfile({ onboardingComplete: true });
        }}
      />
    );
  }

  // Authenticated - show main app
  return (
    <div className="App">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="App-main">
        {activeTab === 'dashboard' && <Dashboard userId={user.uid} />}
        {activeTab === 'schedule' && <SchedulePage userId={user.uid} />}
        {activeTab === 'exercises' && <ExerciseLibrary />}
        {activeTab === 'progress' && (
          <div className="progress-container">
            <ProgressStats userId={user.uid} />
            <WorkoutHistory userId={user.uid} />
          </div>
        )}
      </main>

      {/* Notification Center */}
      <NotificationCenter />

      {/* Trainer Avatar - Lazy loaded for better initial performance */}
      <Suspense fallback={null}>
        <TrainerAvatar />
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
