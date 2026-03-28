// Exercise Service - Firestore operations
import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';

const EXERCISES_COLLECTION = 'exercises';

// Add a single exercise to Firestore
export const addExercise = async (exerciseData) => {
  try {
    const docRef = await addDoc(collection(db, EXERCISES_COLLECTION), {
      ...exerciseData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...exerciseData };
  } catch (error) {
    console.error('Error adding exercise:', error);
    throw error;
  }
};

// Add multiple exercises (for initialization)
export const addExercisesBatch = async (exercisesData) => {
  try {
    const results = [];
    for (const exercise of exercisesData) {
      const docRef = await addDoc(collection(db, EXERCISES_COLLECTION), {
        ...exercise,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      results.push({ id: docRef.id, ...exercise });
    }
    return results;
  } catch (error) {
    console.error('Error adding exercises batch:', error);
    throw error;
  }
};

// Get all exercises
export const getAllExercises = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, EXERCISES_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting exercises:', error);
    throw error;
  }
};

// Get exercises by category
export const getExercisesByCategory = async (category) => {
  try {
    const q = query(
      collection(db, EXERCISES_COLLECTION),
      where('category', '==', category)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting exercises by category:', error);
    throw error;
  }
};

// Get exercises by muscle group
export const getExercisesByMuscle = async (muscle) => {
  try {
    const q = query(
      collection(db, EXERCISES_COLLECTION),
      where('muscleGroups', 'array-contains', muscle)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting exercises by muscle:', error);
    throw error;
  }
};

// Get single exercise by ID
export const getExerciseById = async (exerciseId) => {
  try {
    const docRef = doc(db, EXERCISES_COLLECTION, exerciseId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting exercise:', error);
    throw error;
  }
};

// Update exercise
export const updateExercise = async (exerciseId, updates) => {
  try {
    const docRef = doc(db, EXERCISES_COLLECTION, exerciseId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
    return { id: exerciseId, ...updates };
  } catch (error) {
    console.error('Error updating exercise:', error);
    throw error;
  }
};

// Delete exercise
export const deleteExercise = async (exerciseId) => {
  try {
    await deleteDoc(doc(db, EXERCISES_COLLECTION, exerciseId));
    return true;
  } catch (error) {
    console.error('Error deleting exercise:', error);
    throw error;
  }
};
