/**
 * Weekly Calendar Component
 * Mobile-optimized weekly workout schedule view with navigation
 * Shows all 7 days in a single-column layout with day labels, workouts, and actions
 */

import React, { useState } from 'react';
import { getWorkoutPattern, getBodyGroupClass } from '../utils/workoutClassifier';
import './WeeklyCalendar.css';

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Format date as "Mon 24" style
 */
function formatDayDate(dateString) {
  const date = new Date(dateString + 'T00:00:00Z');
  const dayName = DAY_LABELS[date.getUTCDay()];
  const dayNum = date.getUTCDate();
  return `${dayName} ${dayNum}`;
}

/**
 * Calculate estimated workout time based on exercises
 */
function estimateWorkoutTime(exercises) {
  if (!Array.isArray(exercises) || exercises.length === 0) {
    return 0;
  }

  // Average 8-10 minutes per exercise including rest
  const timePerExercise = 9;
  return Math.round(exercises.length * timePerExercise);
}

/**
 * WeeklyCalendar Component
 */
export function WeeklyCalendar({
  schedule = {},
  weekNumber = 1,
  weekStartDate = new Date().toISOString().split('T')[0],
  onShuffleDay = null,
  onShuffleWeek = null,
  onLogWorkout = null,
  isCurrentWeek = false,
}) {
  const [expandedDays, setExpandedDays] = useState(new Set());

  // Toggle exercise list expansion
  const toggleExpanded = (day) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  // Calculate week end date
  const weekStartObj = new Date(weekStartDate + 'T00:00:00Z');
  const weekEndDate = new Date(weekStartObj.getTime() + 6 * 24 * 60 * 60 * 1000);
  const weekEndISO = weekEndDate.toISOString().split('T')[0];

  // Format dates for display
  const startMonth = weekStartObj.getUTCMonth() + 1;
  const startDay = weekStartObj.getUTCDate();
  const endMonth = weekEndDate.getUTCMonth() + 1;
  const endDay = weekEndDate.getUTCDate();

  const dateRangeLabel =
    startMonth === endMonth
      ? `${startMonth}/${startDay} - ${endDay}`
      : `${startMonth}/${startDay} - ${endMonth}/${endDay}`;

  return (
    <div className="weekly-calendar">
      {/* Header */}
      <div className={`week-header ${isCurrentWeek ? 'is-current' : ''}`}>
        <div className="week-title">
          <span className="week-number">Week {weekNumber}</span>
          <span className="date-range">{dateRangeLabel}</span>
        </div>
        {isCurrentWeek && <span className="badge-current">Current Week</span>}
      </div>

      {/* Day Cards */}
      <div className="days-container">
        {DAYS_OF_WEEK.map((dayName, dayIndex) => {
          const workout = schedule[dayName];
          const isRest = !workout || workout.pattern === 'rest';
          const isExpanded = expandedDays.has(dayName);

          // Calculate date for this day
          const dayDate = new Date(weekStartObj);
          dayDate.setUTCDate(dayDate.getUTCDate() + dayIndex);
          const dayDateISO = dayDate.toISOString().split('T')[0];
          const dayDateLabel = formatDayDate(dayDateISO);

          // Get workout details
          const pattern = workout ? getWorkoutPattern(workout.pattern) : null;
          const patternClass = workout ? getBodyGroupClass(workout.pattern) : '';
          const estimatedTime = !isRest ? estimateWorkoutTime(workout.exercises) : 0;
          const exerciseCount = !isRest ? (workout.exercises || []).length : 0;

          return (
            <div
              key={dayName}
              className={`day-card ${patternClass} ${isRest ? 'is-rest' : ''} ${isExpanded ? 'is-expanded' : ''}`}
            >
              {/* Day Header */}
              <div className="day-header">
                <div className="day-date">
                  <span className="day-name">{dayDateLabel}</span>
                </div>

                {!isRest && (
                  <div className="day-pattern">
                    <span className="pattern-icon">{pattern?.icon}</span>
                    <span className="pattern-name">{pattern?.name}</span>
                  </div>
                )}

                {isRest && (
                  <div className="day-pattern rest">
                    <span className="pattern-icon">😌</span>
                    <span className="pattern-name">Rest Day</span>
                  </div>
                )}
              </div>

              {/* Workout Info */}
              {!isRest && (
                <>
                  <div className="day-summary">
                    <span className="exercise-count">{exerciseCount} exercises</span>
                    <span className="dot">•</span>
                    <span className="duration">
                      <span className="clock">⏱️</span> {estimatedTime} min
                    </span>
                  </div>

                  {/* Exercises List */}
                  <div className="day-exercises">
                    <button className="toggle-exercises" onClick={() => toggleExpanded(dayName)}>
                      <span className="toggle-label">
                        {isExpanded ? '▼ Hide' : '▶ Show'} exercises
                      </span>
                    </button>

                    {isExpanded && workout.exercises && workout.exercises.length > 0 && (
                      <ul className="exercise-list">
                        {workout.exercises.map((exercise, idx) => (
                          <li key={idx} className="exercise-item">
                            <span className="exercise-name">{exercise.exerciseName}</span>
                            <span className="exercise-sets">
                              {exercise.sets}×{exercise.reps}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="day-actions">
                    {onShuffleDay && (
                      <button
                        className="btn btn-shuffle-day"
                        onClick={() => onShuffleDay(dayName)}
                        title="Randomize this day's workout"
                      >
                        🔄 Shuffle
                      </button>
                    )}
                    {onLogWorkout && (
                      <button
                        className="btn btn-log"
                        onClick={() => onLogWorkout(dayName, workout)}
                        title="Log this workout"
                      >
                        ✓ Log
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Rest Day */}
              {isRest && (
                <div className="rest-content">
                  <p>No scheduled workout</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="week-actions">
        {onShuffleWeek && (
          <button className="btn btn-primary btn-shuffle-week" onClick={onShuffleWeek}>
            🔄 Randomize Entire Week
          </button>
        )}
      </div>
    </div>
  );
}

export default WeeklyCalendar;
