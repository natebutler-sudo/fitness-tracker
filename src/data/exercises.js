// Exercise Library
// Based on trainer workouts + home-friendly variations

export const exercises = [
  // ========== UPPER BODY ==========

  // BACK & LATS
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    category: 'upper',
    muscleGroups: ['back', 'lats', 'biceps'],
    equipment: ['pull-up bar'],
    variations: ['assisted', 'resistance band', 'regular'],
    description: 'Upper body pulling exercise',
    trainerExample: {
      date: '2/10/26',
      reps: [10, 10, 10],
      weight: [160, 145, 130], // assisted machine weight
    },
  },
  {
    id: 'rows-dumbbell',
    name: 'Dumbbell Rows',
    category: 'upper',
    muscleGroups: ['back', 'lats', 'core'],
    equipment: ['dumbbells'],
    variations: ['single-arm', 'double-arm', 'tripod'],
    description: 'Single or double arm rowing motion',
    trainerExample: {
      date: '2/10/26',
      reps: [8, 8, 8, 8],
      weight: [25, 25, 30, 30],
    },
  },
  {
    id: 'rows-bodyweight',
    name: 'Bodyweight Rows',
    category: 'upper',
    muscleGroups: ['back', 'lats', 'core'],
    equipment: ['table or bar'],
    variations: ['inclined', 'horizontal'],
    description: 'Inverted row using table or low bar',
  },

  // SHOULDERS
  {
    id: 'shoulder-press-db',
    name: 'Dumbbell Shoulder Press',
    category: 'upper',
    muscleGroups: ['shoulders', 'triceps', 'chest'],
    equipment: ['dumbbells'],
    variations: ['seated', 'standing', 'alternating'],
    description: 'Pressing dumbbells overhead',
    trainerExample: {
      date: '2/10/26',
      reps: [8, 8, 8, 8],
      weight: [15, 20, 20, 20],
    },
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    category: 'upper',
    muscleGroups: ['shoulders'],
    equipment: ['dumbbells', 'resistance band'],
    variations: ['dumbbell', 'band', 'cable'],
    description: 'Raise arms out to sides to shoulder height',
    trainerExample: {
      date: '2/10/26',
      reps: [12, 12, 12],
      weight: [10, 10, 10],
    },
  },
  {
    id: 'pike-pushups',
    name: 'Pike Push-ups',
    category: 'upper',
    muscleGroups: ['shoulders', 'chest', 'triceps'],
    equipment: [],
    variations: ['regular', 'decline'],
    description: 'Bodyweight shoulder press variation',
  },

  // ARMS
  {
    id: 'tricep-extension',
    name: 'Tricep Overhead Extension',
    category: 'upper',
    muscleGroups: ['triceps'],
    equipment: ['dumbbells', 'resistance band'],
    variations: ['single-arm', 'double-arm', 'band'],
    description: 'Extension movement targeting triceps',
    trainerExample: {
      date: '2/10/26',
      reps: [10, 10, 10],
      weight: [10, 10, 10],
    },
  },
  {
    id: 'tricep-dips',
    name: 'Tricep Dips',
    category: 'upper',
    muscleGroups: ['triceps', 'chest'],
    equipment: ['chair', 'bench'],
    variations: ['chair', 'bench', 'assisted'],
    description: 'Bodyweight tricep exercise using furniture',
  },
  {
    id: 'bicep-curls',
    name: 'Dumbbell Bicep Curls',
    category: 'upper',
    muscleGroups: ['biceps'],
    equipment: ['dumbbells', 'resistance band'],
    variations: ['dumbbell', 'band', 'alternating'],
    description: 'Curl motion targeting biceps',
    trainerExample: {
      date: '2/10/26',
      reps: [10, 10, 10],
      weight: [27, 27, 27],
    },
  },
  {
    id: 'push-ups',
    name: 'Push-ups',
    category: 'upper',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: [],
    variations: ['regular', 'wide', 'close-grip', 'incline'],
    description: 'Classic bodyweight pressing exercise',
  },

  // ========== LOWER BODY ==========

  // QUADS
  {
    id: 'squats',
    name: 'Squats',
    category: 'lower',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    equipment: ['barbell', 'dumbbells', 'bodyweight'],
    variations: ['bodyweight', 'dumbbell', 'pistol'],
    description: 'Lower body compound movement',
    trainerExample: {
      date: '2/12/26',
      reps: [8, 8, 8, 8],
      weight: [0, 0, 0, 0], // barbell only
    },
  },
  {
    id: 'bulgarian-split-squats',
    name: 'Bulgarian Split Squats',
    category: 'lower',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    equipment: ['bench', 'dumbbells'],
    variations: ['bodyweight', 'dumbbell', 'goblet'],
    description: 'Single-leg split squat using elevated surface',
    trainerExample: {
      date: '2/12/26',
      reps: [10, 10, 10],
      weight: [0, 0, 0],
    },
  },
  {
    id: 'lunges',
    name: 'Lunges',
    category: 'lower',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    equipment: ['dumbbells'],
    variations: ['walking', 'stationary', 'reverse', 'dumbbell'],
    description: 'Single-leg stepping movement',
    trainerExample: {
      date: '2/12/26',
      reps: [10, 10, 10],
      weight: [0, 0, 0],
    },
  },

  // GLUTES & HAMSTRINGS
  {
    id: 'rdl',
    name: 'Romanian Deadlift (RDL)',
    category: 'lower',
    muscleGroups: ['hamstrings', 'glutes', 'lower-back'],
    equipment: ['dumbbells', 'barbell'],
    variations: ['dumbbell', 'barbell', 'single-leg'],
    description: 'Hip hinge movement targeting posterior chain',
    trainerExample: {
      date: '2/12/26',
      reps: [8, 8, 8, 8],
      weight: [0, 65, 85, 95],
    },
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    category: 'lower',
    muscleGroups: ['glutes', 'hamstrings', 'lower-back'],
    equipment: ['dumbbells', 'resistance band'],
    variations: ['bodyweight', 'dumbbell', 'band', 'single-leg'],
    description: 'Hip extension movement targeting glutes',
    trainerExample: {
      date: '2/12/26',
      reps: [10, 10, 10],
      weight: [0, 20, 20],
    },
  },
  {
    id: 'hip-thrusts',
    name: 'Hip Thrusts',
    category: 'lower',
    muscleGroups: ['glutes', 'hamstrings'],
    equipment: ['bench', 'dumbbells'],
    variations: ['bodyweight', 'dumbbell', 'barbell'],
    description: 'Elevated glute bridge variation',
  },

  // ========== CARDIO ==========
  {
    id: 'cardio-walk',
    name: 'Walking/Jogging',
    category: 'cardio',
    muscleGroups: ['full-body'],
    equipment: [],
    variations: ['walking', 'jogging', 'sprinting'],
    description: 'Low to high intensity cardio',
    trainerExample: {
      date: '2/12/26',
      reps: [20],
      weight: [0],
      note: '20 min',
    },
  },
  {
    id: 'cardio-jump-rope',
    name: 'Jump Rope',
    category: 'cardio',
    muscleGroups: ['full-body'],
    equipment: ['jump rope'],
    variations: ['regular', 'double-unders', 'high-knees'],
    description: 'High intensity cardio exercise',
  },
  {
    id: 'cardio-burpees',
    name: 'Burpees',
    category: 'cardio',
    muscleGroups: ['full-body'],
    equipment: [],
    variations: ['regular', 'modified'],
    description: 'Full body cardio + strength',
  },

  // ========== CORE ==========
  {
    id: 'planks',
    name: 'Planks',
    category: 'core',
    muscleGroups: ['core', 'shoulders'],
    equipment: [],
    variations: ['front', 'side', 'moving'],
    description: 'Isometric core strengthening',
  },
  {
    id: 'dead-bugs',
    name: 'Dead Bugs',
    category: 'core',
    muscleGroups: ['core'],
    equipment: [],
    variations: ['regular', 'weighted'],
    description: 'Controlled core movement',
  },
];

// Export exercises by category
export const exercisesByCategory = {
  upper: exercises.filter(e => e.category === 'upper'),
  lower: exercises.filter(e => e.category === 'lower'),
  cardio: exercises.filter(e => e.category === 'cardio'),
  core: exercises.filter(e => e.category === 'core'),
};

// Export exercises by muscle group
export const exercisesByMuscle = (muscle) => {
  return exercises.filter(e => e.muscleGroups.includes(muscle));
};
