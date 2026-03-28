// Custom hook for managing exercises
import { useState, useEffect } from 'react';
import { getAllExercises, getExercisesByCategory, getExercisesByMuscle } from '../services/exerciseService';

export const useExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all exercises on mount
  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        const data = await getAllExercises();
        setExercises(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  // Get exercises by category
  const getByCategory = async (category) => {
    try {
      setLoading(true);
      const data = await getExercisesByCategory(category);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get exercises by muscle group
  const getByMuscle = async (muscle) => {
    try {
      setLoading(true);
      const data = await getExercisesByMuscle(muscle);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Group exercises by category
  const groupedByCategory = {
    upper: exercises.filter(e => e.category === 'upper'),
    lower: exercises.filter(e => e.category === 'lower'),
    cardio: exercises.filter(e => e.category === 'cardio'),
    core: exercises.filter(e => e.category === 'core'),
  };

  return {
    exercises,
    loading,
    error,
    getByCategory,
    getByMuscle,
    groupedByCategory,
  };
};
