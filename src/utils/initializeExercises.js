// Initialize exercises in Firestore (one-time setup)
import { exercises } from '../data/exercises';
import { getAllExercises, addExercisesBatch } from '../services/exerciseService';

export const initializeExercises = async () => {
  try {
    // Check if exercises already exist
    const existingExercises = await getAllExercises();

    if (existingExercises.length > 0) {
      console.log('Exercises already initialized in Firestore');
      return {
        success: true,
        message: 'Exercises already exist',
        count: existingExercises.length,
      };
    }

    // Add all exercises to Firestore
    console.log('Initializing exercises in Firestore...');
    const results = await addExercisesBatch(exercises);

    console.log(`Successfully added ${results.length} exercises`);
    return {
      success: true,
      message: `Added ${results.length} exercises`,
      count: results.length,
    };
  } catch (error) {
    console.error('Error initializing exercises:', error);
    return {
      success: false,
      message: error.message,
      count: 0,
    };
  }
};
