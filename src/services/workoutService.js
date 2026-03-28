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
