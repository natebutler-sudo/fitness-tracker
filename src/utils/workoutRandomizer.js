// Workout Randomizer - Generate weekly workout schedules
import { exercisesByCategory } from '../data/exercises';

// Shuffle array (Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get random exercises from a category
const getRandomExercises = (category, count = 5) => {
  const categoryExercises = exercisesByCategory[category];
  if (!categoryExercises) return [];

  const shuffled = shuffleArray(categoryExercises);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Generate a single workout (5 exercises + warmup/cooldown/core)
const generateWorkout = (type) => {
  let exercises = [];

  switch (type) {
    case 'upper':
      exercises = getRandomExercises('upper', 5);
      break;
    case 'lower':
      exercises = getRandomExercises('lower', 5);
      break;
    case 'cardio':
      exercises = getRandomExercises('cardio', 3);
      break;
    default:
      return [];
  }

  // Format exercises for workout
  return exercises.map(ex => ({
    exerciseId: ex.id,
    exerciseName: ex.name,
    category: type,
    sets: 3,
    reps: 10,
    notes: '',
  }));
};

// Generate a weekly randomized schedule
export const generateWeeklySchedule = () => {
  // Define the workout types for each day
  // Pattern: Upper, Lower, Cardio, Upper, Lower (Mon-Fri), Rest, Rest
  const workoutTypes = ['upper', 'lower', 'cardio', 'upper', 'lower'];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Shuffle the workout types to randomize the order
  const shuffledWorkoutTypes = shuffleArray(workoutTypes);

  // Build the weekly schedule
  const schedule = {};

  // Assign workouts to Mon-Fri
  for (let i = 0; i < 5; i++) {
    const day = days[i];
    const workoutType = shuffledWorkoutTypes[i];

    schedule[day] = {
      type: workoutType,
      exercises: generateWorkout(workoutType),
    };
  }

  // Rest days (Sat-Sun)
  schedule['saturday'] = { type: 'rest', exercises: [] };
  schedule['sunday'] = { type: 'rest', exercises: [] };

  return schedule;
};

// Generate multiple weeks (for previewing)
export const generateMultipleWeeks = (numberOfWeeks = 4) => {
  const weeks = [];
  for (let i = 0; i < numberOfWeeks; i++) {
    weeks.push({
      weekNumber: i + 1,
      schedule: generateWeeklySchedule(),
    });
  }
  return weeks;
};

// Get current week number of the year
export const getWeekNumber = (date = new Date()) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Get week start date (Monday)
export const getWeekStartDate = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const weekStart = new Date(d.setDate(diff));
  return weekStart.toISOString().split('T')[0];
};

// Format schedule for display
export const formatScheduleForDisplay = (schedule) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const displayDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return days.map((day, index) => ({
    day: displayDays[index],
    fullDay: day,
    workout: schedule[day],
    exerciseCount: schedule[day].exercises.length,
  }));
};

// Estimate total workout time (in minutes)
export const estimateWorkoutTime = (exercises) => {
  // Rough estimate: 3-4 min per exercise + 10 min warmup + 5 min cooldown/core
  const exerciseTime = exercises.length * 8;
  return 15 + exerciseTime; // 10 min warmup + exercise time + 5 min cooldown
};
