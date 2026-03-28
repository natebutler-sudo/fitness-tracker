// Weekly Schedule Component - Display and manage weekly workout
import React, { useEffect } from 'react';
import { useWorkouts } from '../hooks/useWorkouts';
import { formatScheduleForDisplay, estimateWorkoutTime } from '../utils/workoutRandomizer';
import './WeeklySchedule.css';

function WeeklySchedule({ userId }) {
  const {
    currentWorkout,
    loading,
    error,
    loadCurrentWeek,
    generateNewWeek,
  } = useWorkouts(userId);

  useEffect(() => {
    loadCurrentWeek();
  }, [loadCurrentWeek]);

  const handleGenerateNewWeek = async () => {
    await generateNewWeek();
  };

  if (loading && !currentWorkout) {
    return <div className="weekly-schedule loading">Loading your weekly schedule...</div>;
  }

  if (error) {
    return <div className="weekly-schedule error">Error: {error}</div>;
  }

  if (!currentWorkout || !currentWorkout.schedule) {
    return <div className="weekly-schedule error">No workout schedule found</div>;
  }

  const displayDays = formatScheduleForDisplay(currentWorkout.schedule);

  return (
    <div className="weekly-schedule">
      <div className="schedule-header">
        <div>
          <h2>Your Weekly Routine</h2>
          <p className="week-info">
            Week {currentWorkout.weekNumber} • Starting {currentWorkout.weekStartDate}
          </p>
        </div>
        <button onClick={handleGenerateNewWeek} className="btn-regenerate" title="Randomize new week">
          🔄 New Week
        </button>
      </div>

      <div className="schedule-grid">
        {displayDays.map((dayData) => (
          <div
            key={dayData.fullDay}
            className={`day-card ${dayData.workout.type} ${dayData.workout.type === 'rest' ? 'rest' : ''}`}
          >
            <h3 className="day-name">{dayData.day}</h3>

            {dayData.workout.type === 'rest' ? (
              <div className="rest-day">
                <div className="rest-icon">😌</div>
                <p>Rest Day</p>
              </div>
            ) : (
              <>
                <div className="workout-type">
                  {dayData.workout.type === 'upper' && '💪 Upper'}
                  {dayData.workout.type === 'lower' && '🦵 Lower'}
                  {dayData.workout.type === 'cardio' && '🏃 Cardio'}
                  {dayData.workout.type === 'core' && '🫀 Core'}
                </div>

                <div className="exercises-list">
                  {dayData.workout.exercises.length > 0 ? (
                    <>
                      <h4>Exercises:</h4>
                      <ul>
                        {dayData.workout.exercises.map((ex, index) => (
                          <li key={index}>
                            <span className="ex-name">{ex.exerciseName}</span>
                            <span className="ex-sets">
                              {ex.sets}×{ex.reps}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="no-exercises">No exercises planned</p>
                  )}
                </div>

                <div className="workout-footer">
                  <span className="duration">
                    ⏱️ ~{estimateWorkoutTime(dayData.workout.exercises)} min
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="schedule-summary">
        <h3>Weekly Summary</h3>
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-label">Workout Days</span>
            <span className="stat-value">
              {displayDays.filter(d => d.workout.type !== 'rest').length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Rest Days</span>
            <span className="stat-value">
              {displayDays.filter(d => d.workout.type === 'rest').length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Estimated Time</span>
            <span className="stat-value">
              {displayDays
                .filter(d => d.workout.type !== 'rest')
                .reduce((total, d) => total + estimateWorkoutTime(d.workout.exercises), 0)}
              m
            </span>
          </div>
        </div>
      </div>

      <div className="schedule-note">
        <p>
          💡 Each workout includes: 10-min warmup + exercises + 5-min cooldown/core. Click "New Week"
          to randomize next week's schedule.
        </p>
      </div>
    </div>
  );
}

export default WeeklySchedule;
