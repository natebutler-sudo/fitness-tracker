// Weekly Activity Chart - Last 4 weeks of workouts
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getLast4WeeksData } from '../../utils/dashboardCalculations';

function WeeklyActivityChart({ sessions }) {
  const data = getLast4WeeksData(sessions);

  return (
    <div className="chart-container">
      <h3>Activity Last 4 Weeks</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis yAxisId="left" label={{ value: 'Workouts', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Minutes', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="workouts" fill="#667eea" name="Workouts" />
          <Bar yAxisId="right" dataKey="time" fill="#ffd93d" name="Minutes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeeklyActivityChart;
