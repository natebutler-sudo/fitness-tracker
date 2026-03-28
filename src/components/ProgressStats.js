// Progress Stats - Show PRs, streaks, and stats
import React, { useEffect, useState } from 'react';
import { useSessions } from '../hooks/useSessions';
import {
  getAllPRs,
  calculateStreak,
  getWeeklyStats,
  getMonthlyStats,
  getWorkoutFrequency,
} from '../utils/progressCalculations';
import './ProgressStats.css';

function ProgressStats({ userId }) {
  const { sessions, loading, error, loadSessions } = useSessions(userId);
  const [prs, setPrs] = useState([]);
  const [streak, setStreak] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [frequency, setFrequency] = useState(null);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (sessions.length > 0) {
      setPrs(getAllPRs(sessions));
      setStreak(calculateStreak(sessions));
      setWeeklyStats(getWeeklyStats(sessions));
      setMonthlyStats(getMonthlyStats(sessions));
      setFrequency(getWorkoutFrequency(sessions));
    }
  }, [sessions]);

  if (loading) {
    return <div className="progress-stats loading">Loading stats...</div>;
  }

  if (error) {
    return <div className="progress-stats error">Error: {error}</div>;
  }

  return (
    <div className="progress-stats">
      <h2>Your Progress</h2>

      {/* Top Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <span className="stat-label">Workout Streak</span>
            <span className="stat-value">{streak}</span>
            <span className="stat-subtext">days</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">This Week</span>
            <span className="stat-value">{weeklyStats?.totalWorkouts || 0}</span>
            <span className="stat-subtext">workouts</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <span className="stat-label">Total Time</span>
            <span className="stat-value">{monthlyStats?.totalTime || 0}</span>
            <span className="stat-subtext">minutes this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💪</div>
          <div className="stat-content">
            <span className="stat-label">Total Sessions</span>
            <span className="stat-value">{sessions.length}</span>
            <span className="stat-subtext">all time</span>
          </div>
        </div>
      </div>

      {/* Weekly Breakdown */}
      {weeklyStats && (
        <div className="section">
          <h3>This Week's Breakdown</h3>
          <div className="frequency-chart">
            {['upper', 'lower', 'cardio', 'core'].map(type => (
              <div key={type} className="frequency-bar">
                <div className="bar-label">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div className="bar-container">
                  <div
                    className={`bar bar-${type}`}
                    style={{
                      width: `${((frequency?.[type] || 0) / 5) * 100}%`,
                    }}
                  >
                    <span className="bar-count">{frequency?.[type] || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personal Records */}
      <div className="section">
        <h3>Personal Records</h3>
        {prs.length === 0 ? (
          <p className="no-data">No PRs yet. Start logging workouts to track your records!</p>
        ) : (
          <div className="prs-list">
            {prs.slice(0, 10).map((pr, idx) => (
              <div key={pr.exerciseId} className="pr-item">
                <div className="pr-rank">#{idx + 1}</div>
                <div className="pr-info">
                  <h4>{pr.exerciseName}</h4>
                  <p className="pr-date">{pr.prDate}</p>
                </div>
                <div className="pr-value">
                  {pr.maxReps > 0 && <span>{pr.maxReps} reps</span>}
                  {pr.maxWeight > 0 && <span>{pr.maxWeight} lbs</span>}
                </div>
              </div>
            ))}
            {prs.length > 10 && <p className="more-prs">+{prs.length - 10} more exercises tracked</p>}
          </div>
        )}
      </div>

      {/* Activity Summary */}
      {monthlyStats && (
        <div className="section activity-summary">
          <h3>Monthly Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total Workouts</span>
              <span className="summary-value">{monthlyStats.totalWorkouts}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Time</span>
              <span className="summary-value">{monthlyStats.totalTime}m</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Avg per Week</span>
              <span className="summary-value">{monthlyStats.avgWorkoutsPerWeek}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgressStats;
