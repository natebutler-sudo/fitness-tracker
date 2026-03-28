// Custom hook for managing workouts
import { useState, useCallback } from 'react';
import {
  createWeeklyWorkout,
  getCurrentWeekWorkout,
  getUserWorkouts,
  updateWeeklyWorkout,
  updateDayWorkout,
  getDayWorkout,
} from '../services/workoutService';
import { generateWeeklySchedule, getWeekNumber, getWeekStartDate } from '../utils/workoutRandomizer';

export const useWorkouts = (userId) => {
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate and save a new weekly workout
  const generateNewWeek = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const weekNumber = getWeekNumber();
      const weekStartDate = getWeekStartDate();
      const schedule = generateWeeklySchedule();

      // Check if this week already exists
      const existingWorkout = await getCurrentWeekWorkout(userId, weekNumber);

      let workout;
      if (existingWorkout) {
        // Update existing week
        await updateWeeklyWorkout(existingWorkout.id, { schedule });
        workout = { id: existingWorkout.id, ...existingWorkout, schedule };
      } else {
        // Create new week
        workout = await createWeeklyWorkout(userId, weekNumber, weekStartDate, schedule);
      }

      setCurrentWorkout(workout);
      return workout;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load current week's workout
  const loadCurrentWeek = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const weekNumber = getWeekNumber();
      let workout = await getCurrentWeekWorkout(userId, weekNumber);

      if (!workout) {
        // Generate if doesn't exist
        workout = await generateNewWeek();
      }

      setCurrentWorkout(workout);
      return workout;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, generateNewWeek]);

  // Load all user workouts
  const loadAllWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const workouts = await getUserWorkouts(userId);
      setAllWorkouts(workouts);
      return workouts;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update a specific day's workout
  const updateDay = useCallback(
    async (day, dayWorkout) => {
      if (!currentWorkout) return null;

      try {
        setLoading(true);
        setError(null);
        await updateDayWorkout(currentWorkout.id, day, dayWorkout);

        // Update local state
        const updated = {
          ...currentWorkout,
          schedule: {
            ...currentWorkout.schedule,
            [day]: dayWorkout,
          },
        };
        setCurrentWorkout(updated);
        return updated;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentWorkout]
  );

  // Get today's workout
  const getTodayWorkout = useCallback(() => {
    if (!currentWorkout) return null;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return currentWorkout.schedule[today] || null;
  }, [currentWorkout]);

  return {
    currentWorkout,
    allWorkouts,
    loading,
    error,
    generateNewWeek,
    loadCurrentWeek,
    loadAllWorkouts,
    updateDay,
    getTodayWorkout,
  };
};
