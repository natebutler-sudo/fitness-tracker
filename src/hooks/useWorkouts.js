// Custom hook for managing workouts
import { useState, useCallback } from 'react';
import {
  createWeeklyWorkout,
  getCurrentWeekWorkout,
  getUserWorkouts,
  updateWeeklyWorkout,
  updateDayWorkout,
  getDayWorkout,
  getOrCreateMonthlySchedules,
  getWeekByDate,
  getWeeksByDateRange,
  randomizeDayWithBalance,
} from '../services/workoutService';
import {
  generateBalancedWeek,
  generateMonthlySchedules,
  randomizeSingleDay,
  getMonday,
  formatDateISO,
} from '../utils/advancedRandomizer';
import { getWeekNumber, getWeekStartDate } from '../utils/workoutRandomizer';

export const useWorkouts = (userId) => {
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [viewingWorkout, setViewingWorkout] = useState(null); // Currently viewed week (may differ from current)
  const [currentWeekNumber, setCurrentWeekNumber] = useState(getWeekNumber());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate and save a new weekly workout
  const generateNewWeek = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const weekNumber = getWeekNumber();
      const weekStartDate = getWeekStartDate();
      const schedule = generateBalancedWeek();

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
    const workout = viewingWorkout || currentWorkout;
    if (!workout) return null;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return workout.schedule[today] || null;
  }, [currentWorkout, viewingWorkout]);

  // Get or create monthly schedules for current and next month
  const getOrCreateMonth = useCallback(
    async (year, month) => {
      try {
        setLoading(true);
        setError(null);

        const weeks = await getOrCreateMonthlySchedules(
          userId,
          year,
          month,
          generateMonthlySchedules
        );

        return weeks;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Auto-generate current and next month on first load
  const initializeMonthlySchedules = useCallback(async () => {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      // Generate current month
      await getOrCreateMonth(currentYear, currentMonth);

      // Generate next month
      const nextMonth = currentMonth + 1;
      const nextYear = nextMonth > 11 ? currentYear + 1 : currentYear;
      const nextMonthZeroBased = nextMonth > 11 ? 0 : nextMonth;

      await getOrCreateMonth(nextYear, nextMonthZeroBased);
    } catch (err) {
      console.error('Error initializing monthly schedules:', err);
    }
  }, [getOrCreateMonth]);

  // Navigate to a specific week number
  const navigateToWeek = useCallback(
    async (weekNumber) => {
      try {
        setLoading(true);
        setError(null);

        const workout = await getCurrentWeekWorkout(userId, weekNumber);

        if (workout) {
          setViewingWorkout(workout);
          return workout;
        }

        return null;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Navigate to the week containing a specific date
  const navigateToDate = useCallback(
    async (dateISO) => {
      try {
        setLoading(true);
        setError(null);

        const workout = await getWeekByDate(userId, dateISO);

        if (workout) {
          setViewingWorkout(workout);
          return workout;
        }

        return null;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Navigate to the current week
  const navigateToCurrentWeek = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const weekNumber = getWeekNumber();
      const workout = await getCurrentWeekWorkout(userId, weekNumber);

      if (workout) {
        setCurrentWorkout(workout);
        setViewingWorkout(null); // Clear viewing, use current
        return workout;
      }

      return null;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Randomize a single day while maintaining balance
  const randomizeDayBalanced = useCallback(
    async (day) => {
      const workout = viewingWorkout || currentWorkout;
      if (!workout) return null;

      try {
        setLoading(true);
        setError(null);

        const newDayWorkout = await randomizeDayWithBalance(
          workout.id,
          day,
          randomizeSingleDay
        );

        if (newDayWorkout) {
          // Update local state
          const updated = {
            ...workout,
            schedule: {
              ...workout.schedule,
              [day]: newDayWorkout,
            },
          };

          if (viewingWorkout) {
            setViewingWorkout(updated);
          } else {
            setCurrentWorkout(updated);
          }

          return newDayWorkout;
        }

        return null;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentWorkout, viewingWorkout]
  );

  // Navigate to previous week
  const navigateToPrevWeek = useCallback(async () => {
    const workout = viewingWorkout || currentWorkout;
    if (!workout) return null;

    try {
      const currentDate = new Date(workout.weekStartDate + 'T00:00:00Z');
      const prevWeekDate = new Date(currentDate);
      prevWeekDate.setUTCDate(prevWeekDate.getUTCDate() - 7);
      const prevWeekISO = formatDateISO(prevWeekDate);

      return await navigateToDate(prevWeekISO);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [currentWorkout, viewingWorkout, navigateToDate]);

  // Navigate to next week
  const navigateToNextWeek = useCallback(async () => {
    const workout = viewingWorkout || currentWorkout;
    if (!workout) return null;

    try {
      const currentDate = new Date(workout.weekStartDate + 'T00:00:00Z');
      const nextWeekDate = new Date(currentDate);
      nextWeekDate.setUTCDate(nextWeekDate.getUTCDate() + 7);
      const nextWeekISO = formatDateISO(nextWeekDate);

      return await navigateToDate(nextWeekISO);
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [currentWorkout, viewingWorkout, navigateToDate]);

  return {
    currentWorkout,
    viewingWorkout,
    allWorkouts,
    currentWeekNumber,
    loading,
    error,
    generateNewWeek,
    loadCurrentWeek,
    loadAllWorkouts,
    updateDay,
    getTodayWorkout,
    getOrCreateMonth,
    initializeMonthlySchedules,
    navigateToWeek,
    navigateToDate,
    navigateToCurrentWeek,
    navigateToPrevWeek,
    navigateToNextWeek,
    randomizeDayBalanced,
  };
};
