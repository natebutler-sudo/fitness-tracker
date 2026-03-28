// Workout Type Chart - Distribution of workout types
import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { getWorkoutDistribution } from '../../utils/dashboardCalculations';

function WorkoutTypeChart({ sessions }) {
  const data = getWorkoutDistribution(sessions);

  const COLORS = {
    'Upper Body': '#ff6b6b',
    'Lower Body': '#4ecdc4',
    'Cardio': '#ffd93d',
    'Core': '#6bcf7f',
  };

  return (
    <div className="chart-container">
      <h3>Workout Type Distribution</h3>
      {data.length === 0 ? (
        <p className="no-data">No workouts logged yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} workouts`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default WorkoutTypeChart;
