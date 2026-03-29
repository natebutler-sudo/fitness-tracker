// Workout Service - Firestore operations for weekly schedules
import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  writeBatch,
} from 'firebase/firestore';

const WORKOUTS_COLLECTION = 'workouts';

// Create a new weekly workout
export const createWeeklyWorkout = async (userId, weekNumber, weekStartDate, schedule) => {
  try {
    const docRef = await addDoc(collection(db, WORKOUTS_COLLECTION), {
      userId,
      weekNumber,
      weekStartDate,
      schedule,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, userId, weekNumber, weekStartDate, schedule };
  } catch (error) {
    console.error('Error creating weekly workout:', error);
    throw error;
  }
};

// Get current week's workout
export const getCurrentWeekWorkout = async (userId, weekNumber) => {
  try {
    const q = query(
      collection(db, WORKOUTS_COLLECTION),
      where('userId', '==', userId),
      where('weekNumber', '==', weekNumber)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting current week workout:', error);
    throw error;
  }
};

// Get all workouts for a user
export const getUserWorkouts = async (userId) => {
  try {
    const q = query(
      collection(db, WORKOUTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('weekNumber', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting user workouts:', error);
    throw error;
  }
};

// Get workout by ID
export const getWorkoutById = async (workoutId) => {
  try {
    const docRef = doc(db, WORKOUTS_COLLECTION, workoutId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting workout:', error);
    throw error;
  }
};

// Update a weekly workout
export const updateWeeklyWorkout = async (workoutId, updates) => {
  try {
    const docRef = doc(db, WORKOUTS_COLLECTION, workoutId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
    return { id: workoutId, ...updates };
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};

// Update a specific day's workout
export const updateDayWorkout = async (workoutId, day, dayWorkout) => {
  try {
    const docRef = doc(db, WORKOUTS_COLLECTION, workoutId);
    await updateDoc(docRef, {
      [`schedule.${day}`]: dayWorkout,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error updating day workout:', error);
    throw error;
  }
};

// Get workout for a specific day
export const getDayWorkout = async (workoutId, day) => {
  try {
    const workout = await getWorkoutById(workoutId);
    if (workout && workout.schedule && workout.schedule[day]) {
      return workout.schedule[day];
    }
    return null;
  } catch (error) {
    console.error('Error getting day workout:', error);
    throw error;
  }
};

/**
 * Get or create monthly schedules for a given month
 * Checks if schedules exist; if not, generates and bulk creates them
 * @param {string} userId - User ID
 * @param {number} year - Year (e.g., 2024)
 * @param {number} month - Month (0-11, where 0 = January)
 * @param {Function} generateMonthlySchedules - Function to generate schedules
 * @returns {Array} Array of created/existing week objects
 */
export const getOrCreateMonthlySchedules = async (userId, year, month, generateMonthlySchedules) => {
  try {
    // Get first and last day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Query for existing schedules in this month
    const q = query(
      collection(db, WORKOUTS_COLLECTION),
      where('userId', '==', userId),
      where('year', '==', year),
      where('month', '==', month + 1) // Store as 1-12 for readability
    );
    const querySnapshot = await getDocs(q);

    // If schedules already exist, return them
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    // Generate new schedules
    const generatedWeeks = generateMonthlySchedules(year, month);

    if (generatedWeeks.length === 0) {
      return [];
    }

    // Bulk create all weeks using a batch write
    const batch = writeBatch(db);

    const createdWeeks = generatedWeeks.map(week => {
      const docRef = doc(collection(db, WORKOUTS_COLLECTION));
      const workoutData = {
        userId,
        weekNumber: week.weekNumber,
        weekStartDate: week.weekStartDate,
        weekEndDate: week.weekEndDate,
        schedule: week.schedule,
        month: week.month,
        year: week.year,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      batch.set(docRef, workoutData);

      return {
        id: docRef.id,
        ...workoutData,
      };
    });

    // Commit the batch
    await batch.commit();

    return createdWeeks;
  } catch (error) {
    console.error('Error getting or creating monthly schedules:', error);
    throw error;
  }
};

/**
 * Get week schedule for a specific date
 * @param {string} userId - User ID
 * @param {string} dateISO - Date as ISO string (YYYY-MM-DD)
 * @returns {Object} Week object or null
 */
export const getWeekByDate = async (userId, dateISO) => {
  try {
    const date = new Date(dateISO + 'T00:00:00Z');

    // Calculate the Monday of the week containing this date
    const day = date.getUTCDay();
    const diff = date.getUTCDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date);
    monday.setUTCDate(diff);

    const mondayISO = monday.toISOString().split('T')[0];

    // Query for a workout with this week start date
    const q = query(
      collection(db, WORKOUTS_COLLECTION),
      where('userId', '==', userId),
      where('weekStartDate', '==', mondayISO)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }

    return null;
  } catch (error) {
    console.error('Error getting week by date:', error);
    throw error;
  }
};

/**
 * Get multiple weeks by date range
 * @param {string} userId - User ID
 * @param {string} startDateISO - Start date as ISO string (YYYY-MM-DD)
 * @param {string} endDateISO - End date as ISO string (YYYY-MM-DD)
 * @returns {Array} Array of week objects
 */
export const getWeeksByDateRange = async (userId, startDateISO, endDateISO) => {
  try {
    const q = query(
      collection(db, WORKOUTS_COLLECTION),
      where('userId', '==', userId),
      where('weekStartDate', '>=', startDateISO),
      where('weekStartDate', '<=', endDateISO),
      orderBy('weekStartDate', 'asc')
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting weeks by date range:', error);
    throw error;
  }
};

/**
 * Randomize a single day with balance checking
 * @param {string} workoutId - Workout document ID
 * @param {string} day - Day name (e.g., 'monday')
 * @param {Function} randomizeSingleDay - Function to randomize while checking balance
 * @returns {Object} Updated day workout or null if balance can't be maintained
 */
export const randomizeDayWithBalance = async (workoutId, day, randomizeSingleDay) => {
  try {
    // Get current workout
    const workout = await getWorkoutById(workoutId);
    if (!workout) {
      throw new Error('Workout not found');
    }

    // Randomize the day while respecting balance
    const newDayWorkout = randomizeSingleDay(day, workout.schedule);

    if (!newDayWorkout) {
      console.warn('Could not randomize day while maintaining balance');
      return null;
    }

    // Update the specific day in Firestore
    await updateDayWorkout(workoutId, day, newDayWorkout);

    return newDayWorkout;
  } catch (error) {
    console.error('Error randomizing day with balance:', error);
    throw error;
  }
};
