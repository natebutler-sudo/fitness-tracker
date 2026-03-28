// Progress Calculations - Calculate PRs, streaks, stats
import exercises from '../data/exercises';

// Get personal record for an exercise
export const getExercisePR = (sessions, exerciseId) => {
  let maxReps = 0;
  let maxWeight = 0;
  let prSession = null;

  sessions.forEach(session => {
    if (session.exercises) {
      session.exercises.forEach(ex => {
        if (ex.exerciseId === exerciseId && ex.completedSets) {
          ex.completedSets.forEach(set => {
            if (set.reps > maxReps) {
              maxReps = set.reps;
              maxWeight = set.weight;
              prSession = session;
            } else if (set.reps === maxReps && set.weight > maxWeight) {
              maxWeight = set.weight;
              prSession = session;
            }
          });
        }
      });
    }
  });

  return {
    exerciseId,
    exerciseName: exercises.find(e => e.id === exerciseId)?.name || exerciseId,
    maxReps,
    maxWeight,
    prDate: prSession?.date,
    hasData: maxReps > 0 || maxWeight > 0,
  };
};

// Get all PRs for user
export const getAllPRs = (sessions) => {
  const exerciseIds = new Set();

  sessions.forEach(session => {
    if (session.exercises) {
      session.exercises.forEach(ex => {
        exerciseIds.add(ex.exerciseId);
      });
    }
  });

  return Array.from(exerciseIds)
    .map(id => getExercisePR(sessions, id))
    .filter(pr => pr.hasData)
    .sort((a, b) => b.maxReps - a.maxReps || b.maxWeight - a.maxWeight);
};

// Calculate workout streak
export const calculateStreak = (sessions) => {
  if (sessions.length === 0) return 0;

  const sortedDates = sessions
    .map(s => new Date(s.date))
    .sort((a, b) => b - a);

  let streak = 1;
  let currentDate = sortedDates[0];

  for (let i = 1; i < sortedDates.length; i++) {
    const nextDate = sortedDates[i];
    const diffTime = currentDate - nextDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      streak++;
      currentDate = nextDate;
    } else {
      break;
    }
  }

  return streak;
};

// Get weekly stats
export const getWeeklyStats = (sessions) => {
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const weekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= oneWeekAgo && sessionDate <= today;
  });

  const totalTime = weekSessions.reduce((sum, s) => sum + (s.totalTime || s.duration || 0), 0);
  const workoutsByType = {};

  weekSessions.forEach(s => {
    workoutsByType[s.workoutType] = (workoutsByType[s.workoutType] || 0) + 1;
  });

  return {
    totalWorkouts: weekSessions.length,
    totalTime,
    byType: workoutsByType,
    avgDuration: weekSessions.length > 0 ? totalTime / weekSessions.length : 0,
  };
};

// Get monthly stats
export const getMonthlyStats = (sessions) => {
  const today = new Date();
  const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  const monthSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= oneMonthAgo && sessionDate <= today;
  });

  const totalTime = monthSessions.reduce((sum, s) => sum + (s.totalTime || s.duration || 0), 0);

  return {
    totalWorkouts: monthSessions.length,
    totalTime,
    avgWorkoutsPerWeek: (monthSessions.length / 4.33).toFixed(1),
  };
};

// Get exercise history (progression over time)
export const getExerciseHistory = (sessions, exerciseId) => {
  const history = [];

  sessions
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach(session => {
      if (session.exercises) {
        session.exercises.forEach(ex => {
          if (ex.exerciseId === exerciseId && ex.completedSets) {
            const maxReps = Math.max(...ex.completedSets.map(s => s.reps || 0));
            const maxWeight = Math.max(...ex.completedSets.map(s => s.weight || 0));

            history.push({
              date: session.date,
              reps: maxReps,
              weight: maxWeight,
              totalSets: ex.completedSets.length,
            });
          }
        });
      }
    });

  return history;
};

// Check if new PR
export const isNewPR = (sessions, exerciseId, reps, weight) => {
  const currentPR = getExercisePR(sessions, exerciseId);
  return reps > currentPR.maxReps || (reps === currentPR.maxReps && weight > currentPR.maxWeight);
};

// Get calendar heatmap data (for visualization)
export const getCalendarHeatmap = (sessions) => {
  const heatmap = {};

  sessions.forEach(session => {
    const date = session.date;
    heatmap[date] = (heatmap[date] || 0) + 1;
  });

  return heatmap;
};

// Get workout frequency distribution
export const getWorkoutFrequency = (sessions) => {
  const frequency = {
    upper: 0,
    lower: 0,
    cardio: 0,
    core: 0,
  };

  sessions.forEach(session => {
    if (session.workoutType && frequency.hasOwnProperty(session.workoutType)) {
      frequency[session.workoutType]++;
    }
  });

  return frequency;
};

// Get sessions this week
export const getSessionsThisWeek = (sessions) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Monday
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
  });
};
