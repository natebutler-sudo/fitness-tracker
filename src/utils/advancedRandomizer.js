/**
 * Advanced Workout Randomizer
 * Generates balanced weekly schedules that hit all major body groups
 * and prevents adjacent days from having similar patterns
 */

import {
  getAvailablePatterns,
  getWorkoutPattern,
  getComplementaryPatterns,
  validateWeeklyBalance,
  labelWorkoutDay,
} from './workoutClassifier';
import { exercisesByCategory } from '../data/exercises';

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array (creates new array)
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random exercises from a category
 * @param {string} category - Exercise category (upper, lower, cardio, core)
 * @param {number} count - Number of exercises to select
 * @returns {Array} Array of random exercise objects
 */
export function getRandomExercises(category, count = 5) {
  const exercises = exercisesByCategory[category] || [];

  if (exercises.length === 0) {
    return [];
  }

  const shuffled = shuffleArray(exercises);
  return shuffled.slice(0, Math.min(count, exercises.length));
}

/**
 * Create a workout object for a pattern
 * @param {string} patternId - Pattern identifier
 * @returns {Object} Workout object with exercises
 */
export function createPatternWorkout(patternId) {
  const pattern = getWorkoutPattern(patternId);
  if (!pattern) return null;

  // Map patterns to exercise categories
  const categoryMap = {
    chest_triceps: 'upper',
    back_biceps: 'upper',
    leg_focus: 'lower',
    shoulders_accessories: 'upper',
    cardio_conditioning: 'cardio',
    active_recovery: 'core',
  };

  const category = categoryMap[patternId];
  const exercises = getRandomExercises(category, 5);

  return {
    pattern: patternId,
    type: category,
    label: pattern.name,
    icon: pattern.icon,
    color: pattern.color,
    exercises: exercises.map(ex => ({
      exerciseId: ex.id,
      exerciseName: ex.name,
      category: ex.category,
      sets: 3,
      reps: 10,
      notes: '',
    })),
  };
}

/**
 * Generate a balanced weekly schedule
 * Each week uses all 5 patterns in randomized order (Mon-Fri)
 * Sat/Sun are rest days or optional active recovery
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeActiveRecovery - Add active recovery on Saturday (default: false)
 * @returns {Object} Weekly schedule with days and pattern order
 */
export function generateBalancedWeek(options = {}) {
  const { includeActiveRecovery = false } = options;

  // Get all available patterns and shuffle
  const patterns = getAvailablePatterns();
  const shuffledPatterns = shuffleArray(patterns);

  // Ensure no adjacent days have too-similar patterns
  let validSchedule = false;
  let attempts = 0;
  let finalPatterns = [...shuffledPatterns];

  while (!validSchedule && attempts < 10) {
    validSchedule = true;

    // Check adjacent days
    for (let i = 0; i < finalPatterns.length - 1; i++) {
      const pattern1 = finalPatterns[i];
      const pattern2 = finalPatterns[i + 1];

      // Check if patterns are too similar (same body group focus)
      const complementary = getComplementaryPatterns(pattern1, i > 0 ? finalPatterns[i - 1] : null);

      if (!complementary.includes(pattern2)) {
        // Swap with a better pattern
        for (let j = i + 2; j < finalPatterns.length; j++) {
          if (complementary.includes(finalPatterns[j])) {
            [finalPatterns[i + 1], finalPatterns[j]] = [finalPatterns[j], finalPatterns[i + 1]];
            break;
          }
        }
      }
    }

    // Validate the schedule
    const tempSchedule = finalPatterns.map((pattern, idx) => ({
      dayIndex: idx,
      day: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'][idx],
      pattern,
    }));

    const validation = validateWeeklyBalance(tempSchedule, true);
    if (validation.isValid) {
      validSchedule = true;
    } else {
      finalPatterns = shuffleArray(patterns);
      attempts++;
    }
  }

  // Build the weekly schedule
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const schedule = {};

  // Weekdays (Mon-Fri): Assigned patterns
  finalPatterns.forEach((pattern, idx) => {
    const dayName = days[idx];
    schedule[dayName] = createPatternWorkout(pattern);
  });

  // Saturday: Optional active recovery or rest
  if (includeActiveRecovery) {
    schedule.saturday = createPatternWorkout('active_recovery');
  } else {
    schedule.saturday = { type: 'rest', pattern: 'rest', label: 'Rest Day', icon: '😌' };
  }

  // Sunday: Rest day
  schedule.sunday = { type: 'rest', pattern: 'rest', label: 'Rest Day', icon: '😌' };

  return schedule;
}

/**
 * Randomize a single day while maintaining weekly balance
 * @param {string} dayName - Day to randomize (monday, tuesday, etc.)
 * @param {Object} currentSchedule - Current week's schedule
 * @returns {Object} New workout for the day, or null if can't maintain balance
 */
export function randomizeSingleDay(dayName, currentSchedule) {
  if (!currentSchedule || !currentSchedule[dayName]) {
    return null;
  }

  // Get current patterns in the week
  const currentPatterns = Object.entries(currentSchedule)
    .filter(([day, workout]) => workout && workout.pattern && workout.pattern !== 'rest')
    .map(([day, workout]) => workout.pattern);

  // Get the pattern currently on this day
  const currentPattern = currentSchedule[dayName].pattern;

  // Find adjacent days
  const dayIndex = Object.keys(currentSchedule).indexOf(dayName);
  const adjacentPatterns = [];

  if (dayIndex > 0) {
    const prevDay = Object.keys(currentSchedule)[dayIndex - 1];
    if (currentSchedule[prevDay] && currentSchedule[prevDay].pattern !== 'rest') {
      adjacentPatterns.push(currentSchedule[prevDay].pattern);
    }
  }

  if (dayIndex < 6) {
    const nextDay = Object.keys(currentSchedule)[dayIndex + 1];
    if (currentSchedule[nextDay] && currentSchedule[nextDay].pattern !== 'rest') {
      adjacentPatterns.push(currentSchedule[nextDay].pattern);
    }
  }

  // Get patterns that would work for this day
  const allPatterns = getAvailablePatterns();
  const availablePatterns = allPatterns.filter(pattern => {
    // Can't use a pattern that's already used this week (except the current one)
    if (pattern !== currentPattern && currentPatterns.includes(pattern)) {
      return false;
    }

    // Can't use patterns too similar to adjacent days
    for (const adjPattern of adjacentPatterns) {
      const complementary = getComplementaryPatterns(adjPattern);
      if (!complementary.includes(pattern)) {
        return false;
      }
    }

    return true;
  });

  // If no patterns available, fall back to any non-adjacent-conflicting pattern
  if (availablePatterns.length === 0) {
    const nonConflicting = allPatterns.filter(pattern => {
      for (const adjPattern of adjacentPatterns) {
        const complementary = getComplementaryPatterns(adjPattern);
        if (!complementary.includes(pattern)) {
          return false;
        }
      }
      return true;
    });

    if (nonConflicting.length === 0) {
      return null;
    }

    // Pick one at random from non-conflicting
    const randomIdx = Math.floor(Math.random() * nonConflicting.length);
    const newPattern = nonConflicting[randomIdx];
    return createPatternWorkout(newPattern);
  }

  // Pick a random pattern from available
  const randomIdx = Math.floor(Math.random() * availablePatterns.length);
  const newPattern = availablePatterns[randomIdx];

  return createPatternWorkout(newPattern);
}

/**
 * Generate monthly schedules for a given month
 * Pre-generates 4-5 weeks ensuring variety and balance
 * @param {number} year - Year (e.g., 2024)
 * @param {number} month - Month (0-11, where 0 = January)
 * @returns {Array} Array of week objects with schedules
 */
export function generateMonthlySchedules(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Find the week number of the first day
  const startWeekNumber = getWeekNumber(firstDay);

  // Generate weeks for this month
  const weeks = [];
  let currentDate = new Date(firstDay);

  while (currentDate <= lastDay) {
    const weekNumber = getWeekNumber(currentDate);
    const weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start from Sunday

    // Check if we already have this week
    if (!weeks.find(w => w.weekNumber === weekNumber)) {
      const schedule = generateBalancedWeek({ includeActiveRecovery: false });

      weeks.push({
        weekNumber,
        weekStartDate: formatDateISO(weekStart),
        weekEndDate: formatDateISO(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)),
        schedule,
        month: month + 1, // 1-12 for readability
        year,
        generatedAt: new Date().toISOString(),
      });
    }

    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weeks;
}

/**
 * Get week number for a given date (ISO 8601)
 * @param {Date} date - Date object
 * @returns {number} Week number (1-53)
 */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 * @param {Date} date - Date object
 * @returns {string} ISO date string
 */
function formatDateISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get week number from a date string
 * @param {string} dateString - Date as ISO string (YYYY-MM-DD)
 * @returns {number} Week number
 */
export function getWeekNumberFromDateString(dateString) {
  const date = new Date(dateString + 'T00:00:00Z');
  return getWeekNumber(date);
}

/**
 * Get the Monday of the week containing a given date
 * @param {Date} date - Date object
 * @returns {Date} Monday of that week
 */
export function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get date range for a week number in a given year
 * @param {number} weekNumber - Week number (1-53)
 * @param {number} year - Year
 * @returns {Object} { startDate, endDate } as ISO strings
 */
export function getWeekDateRange(weekNumber, year) {
  const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  const monday = getMonday(simple);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);

  return {
    startDate: formatDateISO(monday),
    endDate: formatDateISO(sunday),
    weekNumber,
    year,
  };
}
