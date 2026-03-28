// Session Service - Firestore operations for workout sessions
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
  deleteDoc,
} from 'firebase/firestore';

const SESSIONS_COLLECTION = 'sessions';

// Create a new workout session
export const createSession = async (userId, sessionData) => {
  try {
    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), {
      userId,
      ...sessionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, userId, ...sessionData };
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

// Get all sessions for a user
export const getUserSessions = async (userId) => {
  try {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting user sessions:', error);
    throw error;
  }
};

// Get sessions for a date range
export const getSessionsByDateRange = async (userId, startDate, endDate) => {
  try {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('userId', '==', userId),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting sessions by date range:', error);
    throw error;
  }
};

// Get sessions by workout type
export const getSessionsByType = async (userId, workoutType) => {
  try {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('userId', '==', userId),
      where('workoutType', '==', workoutType),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting sessions by type:', error);
    throw error;
  }
};

// Get single session by ID
export const getSessionById = async (sessionId) => {
  try {
    const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting session:', error);
    throw error;
  }
};

// Update session
export const updateSession = async (sessionId, updates) => {
  try {
    const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
    return { id: sessionId, ...updates };
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
};

// Delete session
export const deleteSession = async (sessionId) => {
  try {
    await deleteDoc(doc(db, SESSIONS_COLLECTION, sessionId));
    return true;
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

// Get sessions for today
export const getTodaySessions = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('userId', '==', userId),
      where('date', '==', today)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting today sessions:', error);
    throw error;
  }
};

// Get latest session for an exercise
export const getLatestExerciseSession = async (userId, exerciseId) => {
  try {
    const q = query(
      collection(db, SESSIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);

    // Find first session containing this exercise
    for (const doc of querySnapshot.docs) {
      const session = doc.data();
      const exercise = session.exercises?.find(e => e.exerciseId === exerciseId);
      if (exercise) {
        return {
          id: doc.id,
          ...session,
          exercise,
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting latest exercise session:', error);
    throw error;
  }
};
