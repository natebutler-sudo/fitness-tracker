// Dashboard Calculations - Prepare data for charts and insights
import {
  getWeeklyStats,
  getWorkoutFrequency,
  getExerciseHistory,
} from './progressCalculations';

// Get last N weeks of data
export const getLast4WeeksData = (sessions) => {
  const weeks = [];
  const today = new Date();

  for (let i = 3; i >= 0; i--) {
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() - i * 7);

    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6);

    const weekSessions = sessions.filter(s => {
      const sessionDate = new Date(s.date);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });

    const weekNumber = weekStart.getDate();
    weeks.push({
      week: `Week ${4 - i}`,
      workouts: weekSessions.length,
      time: weekSessions.reduce((sum, s) => sum + (s.totalTime || s.duration || 0), 0),
      date: weekStart.toLocaleDateString(),
    });
  }

  return weeks;
};

// Get workout type distribution
export const getWorkoutDistribution = (sessions) => {
  const distribution = {
    upper: 0,
    lower: 0,
    cardio: 0,
    core: 0,
  };

  sessions.forEach(session => {
    if (session.workoutType && distribution.hasOwnProperty(session.workoutType)) {
      distribution[session.workoutType]++;
    }
  });

  const total = Object.values(distribution).reduce((a, b) => a + b, 0);

  return [
    { name: 'Upper Body', value: distribution.upper, percent: total ? ((distribution.upper / total) * 100).toFixed(1) : 0 },
    { name: 'Lower Body', value: distribution.lower, percent: total ? ((distribution.lower / total) * 100).toFixed(1) : 0 },
    { name: 'Cardio', value: distribution.cardio, percent: total ? ((distribution.cardio / total) * 100).toFixed(1) : 0 },
    { name: 'Core', value: distribution.core, percent: total ? ((distribution.core / total) * 100).toFixed(1) : 0 },
  ].filter(d => d.value > 0);
};

// Get PR trend data for top exercises
export const getPRTrendData = (sessions, exerciseIds = []) => {
  if (exerciseIds.length === 0) {
    // Get all exercises with history
    const uniqueIds = new Set();
    sessions.forEach(s => {
      if (s.exercises) {
        s.exercises.forEach(ex => uniqueIds.add(ex.exerciseId));
      }
    });
    exerciseIds = Array.from(uniqueIds);
  }

  // Get top 3 exercises by frequency
  const exerciseFreq = {};
  sessions.forEach(s => {
    if (s.exercises) {
      s.exercises.forEach(ex => {
        exerciseFreq[ex.exerciseId] = (exerciseFreq[ex.exerciseId] || 0) + 1;
      });
    }
  });

  const topExercises = Object.entries(exerciseFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);

  // Build trend data
  const trends = {};
  topExercises.forEach(exerciseId => {
    const history = getExerciseHistory(sessions, exerciseId);
    const exerciseName = sessions
      .flatMap(s => s.exercises || [])
      .find(e => e.exerciseId === exerciseId)?.exerciseName || exerciseId;

    trends[exerciseName] = history.map(h => ({
      date: h.date,
      reps: h.reps,
      weight: h.weight,
    }));
  });

  return trends;
};

// Get calendar heatmap data
export const getCalendarHeatmap = (sessions) => {
  const heatmap = {};
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  sessions
    .filter(s => new Date(s.date) >= thirtyDaysAgo)
    .forEach(session => {
      const date = session.date;
      heatmap[date] = (heatmap[date] || 0) + 1;
    });

  return heatmap;
};

// Get insights and recommendations
export const getInsights = (sessions, userProfile) => {
  const insights = [];

  if (sessions.length === 0) {
    insights.push({
      type: 'info',
      message: '🎯 Get started by logging your first workout!',
    });
    return insights;
  }

  // Streak insight
  const streakDates = sessions
    .map(s => new Date(s.date))
    .sort((a, b) => b - a);

  let currentStreak = 1;
  for (let i = 1; i < streakDates.length; i++) {
    const diff = (streakDates[i - 1] - streakDates[i]) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  if (currentStreak >= 5) {
    insights.push({
      type: 'success',
      message: `🔥 Amazing! ${currentStreak}-day streak! You're crushing it!`,
    });
  } else if (currentStreak >= 3) {
    insights.push({
      type: 'success',
      message: `💪 Great consistency! ${currentStreak}-day streak going.`,
    });
  }

  // Workout balance
  const frequency = {};
  sessions.forEach(s => {
    frequency[s.workoutType] = (frequency[s.workoutType] || 0) + 1;
  });

  const types = Object.keys(frequency);
  const hasBalance = types.length >= 2;

  if (hasBalance) {
    insights.push({
      type: 'success',
      message: '⚖️ Nice balance! You\'re hitting all muscle groups.',
    });
  } else if (types.length === 1) {
    insights.push({
      type: 'warning',
      message: `📝 Mix it up! Add some ${types[0] === 'upper' ? 'lower body' : 'upper body'} work.`,
    });
  }

  // Volume tracking
  const thisWeekSessions = sessions.filter(s => {
    const date = new Date(s.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  });

  if (thisWeekSessions.length >= 5) {
    insights.push({
      type: 'info',
      message: '📈 Great volume this week! You\'re on track with your routine.',
    });
  }

  // Recent activity
  const lastSession = sessions[0];
  if (lastSession) {
    const daysAgo = Math.floor(
      (new Date() - new Date(lastSession.date)) / (1000 * 60 * 60 * 24)
    );

    if (daysAgo === 0) {
      insights.push({
        type: 'success',
        message: '✅ You completed a workout today! Great job.',
      });
    } else if (daysAgo <= 2) {
      insights.push({
        type: 'info',
        message: `⏰ Last workout was ${daysAgo} day${daysAgo > 1 ? 's' : ''} ago. Ready for another?`,
      });
    } else if (daysAgo > 7) {
      insights.push({
        type: 'warning',
        message: `⚠️ It's been ${daysAgo} days since your last workout. Time to get back at it!`,
      });
    }
  }

  return insights;
};

// Get most frequently done exercise
export const getMostFrequentExercise = (sessions) => {
  const frequency = {};

  sessions.forEach(s => {
    if (s.exercises) {
      s.exercises.forEach(ex => {
        frequency[ex.exerciseName] = (frequency[ex.exerciseName] || 0) + 1;
      });
    }
  });

  const sorted = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0] : null;
};

// Get average workout duration trend
export const getAvgDurationTrend = (sessions) => {
  const last4Weeks = getLast4WeeksData(sessions);

  return last4Weeks.map(week => {
    const weekSessions = sessions.filter(s => {
      const date = new Date(s.date);
      const weekStart = new Date();
      weekStart.setDate(new Date().getDate() - 28);
      return date >= weekStart;
    });

    const avgDuration = weekSessions.length > 0
      ? Math.round(
          weekSessions.reduce((sum, s) => sum + (s.totalTime || s.duration || 0), 0) /
          weekSessions.length
        )
      : 0;

    return {
      ...week,
      avgDuration,
    };
  });
};

// Calculate consistency score (% of planned workouts completed)
export const getConsistencyScore = (sessions, plannedWorkoutsPerWeek = 5) => {
  if (sessions.length === 0) return 0;

  // Last 4 weeks
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

  const recentSessions = sessions.filter(s => new Date(s.date) >= fourWeeksAgo);
  const weeksOfData = 4;
  const totalPlanned = plannedWorkoutsPerWeek * weeksOfData;
  const score = Math.min(100, (recentSessions.length / totalPlanned) * 100);

  return Math.round(score);
};
