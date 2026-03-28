// Dashboard Page - Complete dashboard with charts and insights
import React, { useEffect, useMemo } from 'react';
import { useSessions } from '../hooks/useSessions';
import { useAuth } from '../context/AuthContext';
import WeeklyActivityChart from '../components/charts/WeeklyActivityChart';
import WorkoutTypeChart from '../components/charts/WorkoutTypeChart';
import StreakHeatmap from '../components/charts/StreakHeatmap';
import TrendsInsights from '../components/TrendsInsights';
import EncouragementBot from '../components/EncouragementBot';
import { calculateStreak } from '../utils/progressCalculations';
import './Dashboard.css';

function Dashboard({ userId }) {
  const { sessions, loading, error, loadSessions } = useSessions(userId);
  const { userProfile } = useAuth();

  const streak = useMemo(() => calculateStreak(sessions), [sessions]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  if (loading) {
    return <div className="dashboard loading">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard error">Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Charts Section */}
        <div className="charts-section">
          <h1>Your Fitness Dashboard</h1>

          <div className="charts-grid">
            <div className="chart-card">
              <WeeklyActivityChart sessions={sessions} />
            </div>

            <div className="chart-card">
              <WorkoutTypeChart sessions={sessions} />
            </div>
          </div>

          <div className="chart-card full-width">
            <StreakHeatmap sessions={sessions} />
          </div>
        </div>

        {/* Insights Section */}
        <div className="insights-section">
          <TrendsInsights sessions={sessions} userProfile={userProfile} />
        </div>
      </div>

      {/* Encouragement Bot */}
      <EncouragementBot sessions={sessions} userProfile={userProfile} streak={streak} />
    </div>
  );
}

export default Dashboard;
