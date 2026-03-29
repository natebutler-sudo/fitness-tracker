/**
 * Week Navigator Component
 * Simple arrow-based navigation with "This Week" button
 * Shows week number and date range
 */

import React from 'react';
import './WeekNavigator.css';

/**
 * Format date range as readable string
 */
function formatDateRange(startDateISO, endDateISO) {
  const start = new Date(startDateISO + 'T00:00:00Z');
  const end = new Date(endDateISO + 'T00:00:00Z');

  const startMonth = start.getUTCMonth() + 1;
  const startDay = start.getUTCDate();
  const endMonth = end.getUTCMonth() + 1;
  const endDay = end.getUTCDate();

  if (startMonth === endMonth) {
    return `${startMonth}/${startDay} - ${endDay}`;
  } else {
    return `${startMonth}/${startDay} - ${endMonth}/${endDay}`;
  }
}

/**
 * Get status message based on which week is being viewed
 */
function getWeekStatus(weekNumber, currentWeekNumber) {
  if (weekNumber === currentWeekNumber) {
    return 'Viewing Current Week';
  } else if (weekNumber < currentWeekNumber) {
    return 'Viewing Past Week';
  } else {
    return 'Viewing Upcoming Week';
  }
}

/**
 * WeekNavigator Component
 */
export function WeekNavigator({
  weekNumber = 1,
  currentWeekNumber = 1,
  weekStartDate = new Date().toISOString().split('T')[0],
  weekEndDate = new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  onPrevWeek = null,
  onNextWeek = null,
  onThisWeek = null,
}) {
  const isCurrentWeek = weekNumber === currentWeekNumber;
  const status = getWeekStatus(weekNumber, currentWeekNumber);
  const dateRange = formatDateRange(weekStartDate, weekEndDate);

  return (
    <div className="week-navigator">
      {/* Left Navigation */}
      <div className="nav-group nav-left">
        {onPrevWeek && (
          <button className="btn btn-nav btn-prev" onClick={onPrevWeek} title="Previous week">
            ◀
          </button>
        )}
      </div>

      {/* Center Info */}
      <div className="nav-center">
        <div className="week-info">
          <div className="week-number">Week {weekNumber}</div>
          <div className="date-range">{dateRange}</div>
          <div className={`week-status ${isCurrentWeek ? 'is-current' : ''}`}>{status}</div>
        </div>
      </div>

      {/* Right Navigation */}
      <div className="nav-group nav-right">
        {onNextWeek && (
          <button className="btn btn-nav btn-next" onClick={onNextWeek} title="Next week">
            ▶
          </button>
        )}
      </div>

      {/* This Week Button - Only show if not on current week */}
      {!isCurrentWeek && onThisWeek && (
        <button className="btn btn-this-week" onClick={onThisWeek}>
          ⏰ This Week
        </button>
      )}
    </div>
  );
}

export default WeekNavigator;
