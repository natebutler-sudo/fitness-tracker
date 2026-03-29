/**
 * Schedule Page
 * Main page for viewing and managing weekly workout schedules
 * Includes week navigation, calendar view, and randomization controls
 */

import React, { useEffect, useState } from 'react';
import { useWorkouts } from '../hooks/useWorkouts';
import { useNotifications } from '../components/NotificationCenter';
import LogWorkoutModal from '../components/LogWorkoutModal';
import WeekNavigator from '../components/WeekNavigator';
import WeeklyCalendar from '../components/WeeklyCalendar';
import { getMonday, formatDateISO } from '../utils/advancedRandomizer';
import { getWeekNumber } from '../utils/workoutRandomizer';
import './SchedulePage.css';

function SchedulePage({ userId }) {
  const {
    currentWorkout,
    viewingWorkout,
    currentWeekNumber,
    loading,
    error,
    loadCurrentWeek,
    navigateToPrevWeek,
    navigateToNextWeek,
    navigateToCurrentWeek,
    randomizeDayBalanced,
    generateNewWeek,
    initializeMonthlySchedules,
  } = useWorkouts(userId);

  const { addNotification } = useNotifications();

  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Load current week and initialize monthly schedules on mount
  useEffect(() => {
    const initializeSchedules = async () => {
      try {
        // Initialize monthly schedules (current + next month)
        await initializeMonthlySchedules();
      } catch (err) {
        console.warn('Failed to initialize monthly schedules:', err);
      }

      // Load current week
      await loadCurrentWeek();
    };

    initializeSchedules();
  }, [loadCurrentWeek, initializeMonthlySchedules]);

  // Determine which workout to display (viewing or current)
  const displayedWorkout = viewingWorkout || currentWorkout;
  const isCurrentWeek = !viewingWorkout;

  // Calculate week info
  const getWeekInfo = () => {
    if (!displayedWorkout) {
      return {
        weekNumber: currentWeekNumber,
        weekStartDate: formatDateISO(getMonday(new Date())),
        isCurrentWeek: true,
      };
    }

    return {
      weekNumber: displayedWorkout.weekNumber || currentWeekNumber,
      weekStartDate: displayedWorkout.weekStartDate || formatDateISO(getMonday(new Date())),
      isCurrentWeek,
    };
  };

  const weekInfo = getWeekInfo();
  const weekEndDate = new Date(weekInfo.weekStartDate + 'T00:00:00Z');
  weekEndDate.setUTCDate(weekEndDate.getUTCDate() + 6);
  const weekEndISO = weekEndDate.toISOString().split('T')[0];

  // Handlers
  const handleShuffleDay = async (day) => {
    try {
      const newWorkout = await randomizeDayBalanced(day);
      if (newWorkout) {
        addNotification(`✓ ${day.charAt(0).toUpperCase() + day.slice(1)} randomized!`, 'success');
      } else {
        addNotification('Could not randomize while maintaining balance', 'warning');
      }
    } catch (err) {
      addNotification(`Error: ${err.message}`, 'error');
    }
  };

  const handleShuffleWeek = async () => {
    try {
      const newWorkout = await generateNewWeek();
      if (newWorkout) {
        addNotification('✓ Week randomized!', 'success');
      }
    } catch (err) {
      addNotification(`Error: ${err.message}`, 'error');
    }
  };

  const handleLogWorkout = (day, workout) => {
    setSelectedDay(day);
    setSelectedWorkout(workout);
    setLogModalOpen(true);
  };

  const handlePrevWeek = async () => {
    try {
      const workout = await navigateToPrevWeek();
      if (!workout) {
        addNotification('No schedule found for previous week', 'info');
      }
    } catch (err) {
      addNotification(`Error loading previous week: ${err.message}`, 'error');
    }
  };

  const handleNextWeek = async () => {
    try {
      const workout = await navigateToNextWeek();
      if (!workout) {
        addNotification('No schedule found for next week', 'info');
      }
    } catch (err) {
      addNotification(`Error loading next week: ${err.message}`, 'error');
    }
  };

  const handleThisWeek = async () => {
    try {
      await navigateToCurrentWeek();
      addNotification('✓ Back to current week', 'success');
    } catch (err) {
      addNotification(`Error: ${err.message}`, 'error');
    }
  };

  if (loading && !displayedWorkout) {
    return (
      <div className="schedule-page">
        <div className="loading">Loading your schedule...</div>
      </div>
    );
  }

  if (error && !displayedWorkout) {
    return (
      <div className="schedule-page">
        <div className="error">Error loading schedule: {error}</div>
      </div>
    );
  }

  return (
    <div className="schedule-page">
      {/* Week Navigator */}
      <WeekNavigator
        weekNumber={weekInfo.weekNumber}
        currentWeekNumber={currentWeekNumber}
        weekStartDate={weekInfo.weekStartDate}
        weekEndDate={weekEndISO}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onThisWeek={!isCurrentWeek ? handleThisWeek : null}
      />

      {/* Weekly Calendar */}
      {displayedWorkout ? (
        <WeeklyCalendar
          schedule={displayedWorkout.schedule}
          weekNumber={weekInfo.weekNumber}
          weekStartDate={weekInfo.weekStartDate}
          onShuffleDay={handleShuffleDay}
          onShuffleWeek={handleShuffleWeek}
          onLogWorkout={handleLogWorkout}
          isCurrentWeek={isCurrentWeek}
        />
      ) : (
        <div className="no-schedule">
          <p>No schedule found for this week</p>
          <button className="btn btn-primary" onClick={handleShuffleWeek}>
            Generate Schedule
          </button>
        </div>
      )}

      {/* Log Workout Modal */}
      {logModalOpen && selectedWorkout && (
        <LogWorkoutModal
          day={selectedDay}
          workout={selectedWorkout}
          userId={userId}
          onClose={() => setLogModalOpen(false)}
        />
      )}
    </div>
  );
}

export default SchedulePage;
