// Streak Heatmap - Last 30 days activity
import React from 'react';
import { getCalendarHeatmap } from '../../utils/dashboardCalculations';
import './StreakHeatmap.css';

function StreakHeatmap({ sessions }) {
  const heatmap = getCalendarHeatmap(sessions);
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Build calendar grid
  const days = [];
  for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = new Date(d).toISOString().split('T')[0];
    const count = heatmap[dateStr] || 0;
    days.push({
      date: dateStr,
      day: new Date(d).toLocaleDateString('en-US', { weekday: 'short' }),
      count,
    });
  }

  // Organize by weeks
  const weeks = [];
  let currentWeek = [];
  days.forEach((day, idx) => {
    currentWeek.push(day);
    if ((idx + 1) % 7 === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getColor = (count) => {
    if (count === 0) return '#ebedf0';
    if (count === 1) return '#c6e48b';
    if (count === 2) return '#7bc96f';
    if (count === 3) return '#239a3b';
    return '#196127';
  };

  const getIntensity = (count) => {
    if (count === 0) return 'none';
    if (count === 1) return 'light';
    if (count === 2) return 'medium';
    if (count >= 3) return 'dark';
  };

  return (
    <div className="streak-heatmap">
      <h3>Last 30 Days Activity</h3>
      <div className="heatmap-container">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="heatmap-week">
            {week.map((day, dayIdx) => (
              <div
                key={`${weekIdx}-${dayIdx}`}
                className={`heatmap-day intensity-${getIntensity(day.count)}`}
                style={{ backgroundColor: getColor(day.count) }}
                title={`${day.date}: ${day.count} workout${day.count !== 1 ? 's' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="heatmap-legend">
        <span className="legend-label">Less</span>
        <div className="legend-box" style={{ backgroundColor: '#ebedf0' }}></div>
        <div className="legend-box" style={{ backgroundColor: '#c6e48b' }}></div>
        <div className="legend-box" style={{ backgroundColor: '#7bc96f' }}></div>
        <div className="legend-box" style={{ backgroundColor: '#239a3b' }}></div>
        <div className="legend-box" style={{ backgroundColor: '#196127' }}></div>
        <span className="legend-label">More</span>
      </div>
    </div>
  );
}

export default StreakHeatmap;
