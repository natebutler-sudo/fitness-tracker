// Workout History - Display past workouts
import React, { useEffect, useState } from 'react';
import { useSessions } from '../hooks/useSessions';
import { getSessionsThisWeek } from '../utils/progressCalculations';
import './WorkoutHistory.css';

function WorkoutHistory({ userId }) {
  const { sessions, loading, error, loadSessions } = useSessions(userId);
  const [filter, setFilter] = useState('all'); // 'all', 'week', 'upper', 'lower', 'cardio'
  const [displayedSessions, setDisplayedSessions] = useState([]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Filter sessions based on selected filter
  useEffect(() => {
    let filtered = sessions;

    if (filter === 'week') {
      filtered = getSessionsThisWeek(sessions);
    } else if (filter !== 'all') {
      filtered = sessions.filter(s => s.workoutType === filter);
    }

    setDisplayedSessions(filtered);
  }, [sessions, filter]);

  if (loading) {
    return <div className="workout-history loading">Loading history...</div>;
  }

  if (error) {
    return <div className="workout-history error">Error: {error}</div>;
  }

  return (
    <div className="workout-history">
      <h2>Workout History</h2>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
          onClick={() => setFilter('week')}
        >
          This Week
        </button>
        <button
          className={`filter-btn ${filter === 'upper' ? 'active' : ''}`}
          onClick={() => setFilter('upper')}
        >
          Upper
        </button>
        <button
          className={`filter-btn ${filter === 'lower' ? 'active' : ''}`}
          onClick={() => setFilter('lower')}
        >
          Lower
        </button>
        <button
          className={`filter-btn ${filter === 'cardio' ? 'active' : ''}`}
          onClick={() => setFilter('cardio')}
        >
          Cardio
        </button>
      </div>

      {displayedSessions.length === 0 ? (
        <div className="no-sessions">
          <p>No workouts logged yet</p>
          <p className="hint">Complete a workout and log it to see your history!</p>
        </div>
      ) : (
        <div className="sessions-list">
          {displayedSessions.map(session => (
            <div key={session.id} className={`session-card ${session.workoutType}`}>
              <div className="session-header">
                <div>
                  <h3>{session.workoutType.charAt(0).toUpperCase() + session.workoutType.slice(1)}</h3>
                  <p className="session-date">
                    {new Date(session.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="session-meta">
                  <span className="duration">⏱️ {session.duration || session.totalTime || 0} min</span>
                </div>
              </div>

              {session.exercises && session.exercises.length > 0 && (
                <div className="session-exercises">
                  {session.exercises.map((exercise, idx) => (
                    <div key={idx} className="exercise-item">
                      <span className="exercise-name">{exercise.exerciseName}</span>
                      {exercise.completedSets && exercise.completedSets.length > 0 ? (
                        <span className="exercise-stats">
                          {exercise.completedSets.length}×
                          {Math.max(...exercise.completedSets.map(s => s.reps || 0)) || '-'}
                          {exercise.completedSets.some(s => s.weight) &&
                            ` @ ${Math.max(
                              ...exercise.completedSets.map(s => s.weight || 0)
                            )}lbs`}
                        </span>
                      ) : (
                        <span className="exercise-stats">No data</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {session.notes && (
                <div className="session-notes">
                  <p>{session.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkoutHistory;
