import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ExerciseLibrary from './components/ExerciseLibrary';
import WeeklySchedule from './components/WeeklySchedule';
import './App.css';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('schedule');
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

  // Authenticated - show main app
  return (
    <div className="App">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="App-main">
        {activeTab === 'schedule' && <WeeklySchedule userId={user.uid} />}
        {activeTab === 'exercises' && <ExerciseLibrary />}
      </main>
    </div>
  );
}

export default App;
