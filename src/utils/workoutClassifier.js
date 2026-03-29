/**
 * Workout Classifier
 * Categorizes exercises by body group focus and provides utilities
 * for labeling and validating workout patterns
 */

export const BODY_GROUP_PATTERNS = {
  chest_triceps: {
    id: 'chest_triceps',
    name: 'Chest & Triceps Day',
    shortName: 'Chest & Triceps',
    icon: '💪',
    color: '#FF6B6B',
    primaryGroups: ['chest', 'triceps'],
    secondaryGroups: ['shoulders'],
    description: 'Upper body pushing focus with triceps isolation',
  },
  back_biceps: {
    id: 'back_biceps',
    name: 'Back & Biceps Day',
    shortName: 'Back & Biceps',
    icon: '💪',
    color: '#4ECDC4',
    primaryGroups: ['back', 'biceps', 'lats'],
    secondaryGroups: ['shoulders'],
    description: 'Upper body pulling focus with biceps isolation',
  },
  leg_focus: {
    id: 'leg_focus',
    name: 'Leg Focus Day',
    shortName: 'Leg Focus',
    icon: '🦵',
    color: '#95E1D3',
    primaryGroups: ['quads', 'glutes', 'hamstrings'],
    secondaryGroups: ['calves', 'lower-back'],
    description: 'Lower body strength and hypertrophy focus',
  },
  shoulders_accessories: {
    id: 'shoulders_accessories',
    name: 'Shoulders & Accessories',
    shortName: 'Shoulders & Acc.',
    icon: '🎯',
    color: '#FFE66D',
    primaryGroups: ['shoulders', 'arms'],
    secondaryGroups: ['chest', 'back'],
    description: 'Shoulder development and arm isolation work',
  },
  cardio_conditioning: {
    id: 'cardio_conditioning',
    name: 'Cardio & Conditioning',
    shortName: 'Cardio',
    icon: '🏃',
    color: '#FF8C42',
    primaryGroups: ['cardio', 'endurance'],
    secondaryGroups: ['core'],
    description: 'Cardiovascular fitness and metabolic conditioning',
  },
  active_recovery: {
    id: 'active_recovery',
    name: 'Active Recovery',
    shortName: 'Recovery',
    icon: '🧘',
    color: '#95A5A6',
    primaryGroups: ['mobility', 'core'],
    secondaryGroups: ['stretching'],
    description: 'Light activity and recovery work',
  },
};

/**
 * Get available body group patterns for the week
 * @returns {Array} Array of pattern IDs
 */
export function getAvailablePatterns() {
  return [
    'chest_triceps',
    'back_biceps',
    'leg_focus',
    'shoulders_accessories',
    'cardio_conditioning',
  ];
}

/**
 * Get pattern details by ID
 * @param {string} patternId - Pattern identifier
 * @returns {Object} Pattern details or null
 */
export function getWorkoutPattern(patternId) {
  return BODY_GROUP_PATTERNS[patternId] || null;
}

/**
 * Get all patterns as an object map
 * @returns {Object} Map of all patterns
 */
export function getAllPatterns() {
  return BODY_GROUP_PATTERNS;
}

/**
 * Get display name for a pattern
 * @param {string} patternId - Pattern identifier
 * @returns {string} Display name
 */
export function getPatternName(patternId) {
  const pattern = BODY_GROUP_PATTERNS[patternId];
  return pattern ? pattern.name : patternId;
}

/**
 * Get color for a pattern
 * @param {string} patternId - Pattern identifier
 * @returns {string} Color hex code
 */
export function getPatternColor(patternId) {
  const pattern = BODY_GROUP_PATTERNS[patternId];
  return pattern ? pattern.color : '#999999';
}

/**
 * Get icon for a pattern
 * @param {string} patternId - Pattern identifier
 * @returns {string} Emoji icon
 */
export function getPatternIcon(patternId) {
  const pattern = BODY_GROUP_PATTERNS[patternId];
  return pattern ? pattern.icon : '🏋️';
}

/**
 * Validate if a week schedule covers all required body groups
 * @param {Array} schedule - Array of day objects with pattern property
 * @param {boolean} strict - If true, must have all patterns; if false, must have at least 3 major groups
 * @returns {Object} { isValid: boolean, missingPatterns: Array, message: string }
 */
export function validateWeeklyBalance(schedule, strict = true) {
  const patternsInWeek = new Set(
    schedule
      .filter(day => day && day.pattern && day.pattern !== 'rest')
      .map(day => day.pattern)
  );

  const requiredPatterns = getAvailablePatterns();
  const missingPatterns = requiredPatterns.filter(p => !patternsInWeek.has(p));

  if (strict) {
    const isValid = missingPatterns.length === 0;
    return {
      isValid,
      missingPatterns,
      message: isValid
        ? 'Week covers all body groups ✅'
        : `Week is missing: ${missingPatterns.map(p => BODY_GROUP_PATTERNS[p].shortName).join(', ')}`,
    };
  } else {
    // Flexible: check for major body groups (chest, back, legs, cardio)
    const majorGroups = new Set([
      'chest_triceps',
      'back_biceps',
      'leg_focus',
      'cardio_conditioning',
    ]);
    const majorsInWeek = Array.from(patternsInWeek).filter(p => majorGroups.has(p));
    const isValid = majorsInWeek.length >= 3;

    return {
      isValid,
      missingPatterns: missingPatterns.filter(p => majorGroups.has(p)),
      message: isValid
        ? `Week covers ${majorsInWeek.length} major body groups ✅`
        : `Week needs at least 3 major body groups, has ${majorsInWeek.length}`,
    };
  }
}

/**
 * Analyze which body groups are targeted by exercises
 * @param {Array} exercises - Array of exercise objects
 * @returns {Object} { primaryGroups: Set, secondaryGroups: Set }
 */
export function getBodyGroupsFocused(exercises) {
  const primaryGroups = new Set();
  const secondaryGroups = new Set();

  if (!Array.isArray(exercises)) return { primaryGroups, secondaryGroups };

  exercises.forEach(exercise => {
    if (exercise.category) {
      primaryGroups.add(exercise.category);
    }
    if (exercise.muscleGroups && Array.isArray(exercise.muscleGroups)) {
      exercise.muscleGroups.forEach(group => primaryGroups.add(group));
    }
  });

  return { primaryGroups, secondaryGroups };
}

/**
 * Generate a descriptive label for a workout day based on exercises
 * @param {string} patternId - Pattern identifier
 * @param {Array} exercises - Array of exercise objects (optional)
 * @returns {string} Descriptive label
 */
export function labelWorkoutDay(patternId, exercises = null) {
  const pattern = BODY_GROUP_PATTERNS[patternId];

  if (!pattern) {
    return 'Unknown Workout';
  }

  // Use pattern name if available
  if (pattern.name) {
    return pattern.name;
  }

  // Fallback to analyzed exercises
  if (exercises && Array.isArray(exercises) && exercises.length > 0) {
    const { primaryGroups } = getBodyGroupsFocused(exercises);
    const groups = Array.from(primaryGroups).join(' & ');
    return groups ? `${groups} Focus` : 'Mixed Workout';
  }

  return patternId.replace(/_/g, ' ').charAt(0).toUpperCase() + patternId.slice(1);
}

/**
 * Get CSS class name for body group styling
 * @param {string} patternId - Pattern identifier
 * @returns {string} CSS class name
 */
export function getBodyGroupClass(patternId) {
  const classMap = {
    chest_triceps: 'body-group-chest',
    back_biceps: 'body-group-back',
    leg_focus: 'body-group-legs',
    shoulders_accessories: 'body-group-shoulders',
    cardio_conditioning: 'body-group-cardio',
    active_recovery: 'body-group-recovery',
  };

  return classMap[patternId] || 'body-group-default';
}

/**
 * Check if two patterns would create unbalanced adjacent days
 * @param {string} pattern1 - First pattern ID
 * @param {string} pattern2 - Second pattern ID
 * @returns {boolean} True if patterns are too similar (same body group focus)
 */
export function arePatternsTooSimilar(pattern1, pattern2) {
  // Define groups of similar patterns
  const similarGroups = [
    new Set(['chest_triceps', 'shoulders_accessories']), // Upper body pushing
    new Set(['back_biceps']), // Pulling
    new Set(['leg_focus']), // Lower body
    new Set(['cardio_conditioning', 'active_recovery']), // Conditioning
  ];

  for (const group of similarGroups) {
    if (group.has(pattern1) && group.has(pattern2)) {
      return true;
    }
  }

  return false;
}

/**
 * Get patterns that complement a given pattern
 * (useful for avoiding adjacent day imbalance)
 * @param {string} pattern1 - First pattern ID
 * @param {string} pattern2 - Second pattern ID (if checking a 3-day sequence)
 * @returns {Array} Array of complementary pattern IDs
 */
export function getComplementaryPatterns(pattern1, pattern2 = null) {
  const all = getAvailablePatterns();
  const similar1 = all.filter(p => !arePatternsTooSimilar(p, pattern1));

  if (!pattern2) {
    return similar1;
  }

  const similar2 = all.filter(p => !arePatternsTooSimilar(p, pattern2));
  return similar1.filter(p => similar2.includes(p));
}
