import React, { useState } from 'react';
import ExerciseLibrary from './components/ExerciseLibrary';
import WeeklySchedule from './components/WeeklySchedule';
import './App.css';

function App() {
  // TODO: Replace with actual Firebase auth
  const [userId] = useState('test-user-001');
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fitness Tracker</h1>
        <p>Track your workouts, build your routine, monitor progress</p>
      </header>

      <nav className="App-nav">
        <button
          className={`nav-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          📅 Weekly Schedule
        </button>
        <button
          className={`nav-btn ${activeTab === 'exercises' ? 'active' : ''}`}
          onClick={() => setActiveTab('exercises')}
        >
          💪 Exercise Library
        </button>
      </nav>

      <main className="App-main">
        {activeTab === 'schedule' && <WeeklySchedule userId={userId} />}
        {activeTab === 'exercises' && <ExerciseLibrary />}
      </main>
    </div>
  );
}

export default App;
