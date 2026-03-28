// Data Export Utilities - Export workout data in various formats

export const exportToCSV = (data, filename = 'fitness-tracker-data.csv') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Convert data to CSV
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const value = row[header];
          // Escape commas and quotes in values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    ),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportSessionsToCSV = (sessions) => {
  const data = sessions.map(session => ({
    Date: new Date(session.date).toLocaleDateString(),
    'Workout Type': session.workoutType,
    'Exercises Completed': session.exercises?.length || 0,
    'Total Sets': session.exercises?.reduce((sum, ex) => sum + (ex.sets || 0), 0) || 0,
    'Total Reps': session.exercises?.reduce((sum, ex) => sum + (ex.reps || 0), 0) || 0,
    'Total Weight': `${session.exercises?.reduce((sum, ex) => sum + (ex.weight || 0) * (ex.sets || 1), 0) || 0} lbs`,
    Duration: `${session.duration || 0} min`,
    Notes: session.notes || '',
  }));

  exportToCSV(data, `fitness-tracker-workouts-${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportExercisesToCSV = (exercises) => {
  const data = exercises.map(exercise => ({
    'Exercise Name': exercise.exerciseName,
    'Workout Type': exercise.workoutType,
    'Sets': exercise.sets || 0,
    'Reps': exercise.reps || 0,
    'Weight (lbs)': exercise.weight || 0,
    'Date': new Date(exercise.date).toLocaleDateString(),
  }));

  exportToCSV(data, `fitness-tracker-exercises-${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportProgressToJSON = (userData) => {
  const data = {
    exportDate: new Date().toISOString(),
    user: {
      email: userData.email,
      displayName: userData.displayName,
      goal: userData.goal,
      experience: userData.experience,
    },
    sessions: userData.sessions,
    workouts: userData.workouts,
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `fitness-tracker-backup-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateProgressReport = (sessions, userProfile) => {
  const totalWorkouts = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  const workoutTypeBreakdown = {};
  sessions.forEach(session => {
    const type = session.workoutType || 'Unknown';
    workoutTypeBreakdown[type] = (workoutTypeBreakdown[type] || 0) + 1;
  });

  const report = {
    generatedDate: new Date().toLocaleDateString(),
    user: userProfile?.displayName || 'User',
    summaryPeriod: {
      startDate: sessions.length > 0 ? new Date(sessions[sessions.length - 1].date).toLocaleDateString() : 'N/A',
      endDate: sessions.length > 0 ? new Date(sessions[0].date).toLocaleDateString() : 'N/A',
      totalDays: Math.ceil(
        (new Date(sessions[0]?.date) - new Date(sessions[sessions.length - 1]?.date)) / (1000 * 60 * 60 * 24)
      ),
    },
    statistics: {
      totalWorkouts,
      totalMinutes,
      averageMinutesPerWorkout: totalWorkouts > 0 ? (totalMinutes / totalWorkouts).toFixed(1) : 0,
      workoutBreakdown: workoutTypeBreakdown,
    },
  };

  return report;
};

export const downloadProgressReport = (sessions, userProfile) => {
  const report = generateProgressReport(sessions, userProfile);
  const text = `
FITNESS TRACKER PROGRESS REPORT
==============================
Generated: ${report.generatedDate}
User: ${report.user}

SUMMARY PERIOD
--------------
From: ${report.summaryPeriod.startDate}
To: ${report.summaryPeriod.endDate}
Duration: ${report.summaryPeriod.totalDays} days

STATISTICS
----------
Total Workouts: ${report.statistics.totalWorkouts}
Total Minutes: ${report.statistics.totalMinutes} min
Avg per Workout: ${report.statistics.averageMinutesPerWorkout} min

Workout Breakdown:
${Object.entries(report.statistics.workoutBreakdown)
  .map(([type, count]) => `  ${type}: ${count}`)
  .join('\n')}

==============================
Downloaded from Fitness Tracker
`;

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `fitness-report-${new Date().toISOString().split('T')[0]}.txt`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
