// Trends & Insights - Display insights and trends
import React, { useMemo } from 'react';
import {
  getInsights,
  getMostFrequentExercise,
  getConsistencyScore,
} from '../utils/dashboardCalculations';
import './TrendsInsights.css';

function TrendsInsights({ sessions, userProfile }) {
  const insights = useMemo(() => getInsights(sessions, userProfile), [sessions, userProfile]);
  const mostFrequent = useMemo(() => getMostFrequentExercise(sessions), [sessions]);
  const consistencyScore = useMemo(() => getConsistencyScore(sessions), [sessions]);

  return (
    <div className="trends-insights">
      <h2>Insights & Trends</h2>

      {/* Consistency Score */}
      <div className="insight-section consistency-section">
        <h3>Consistency Score</h3>
        <div className="consistency-display">
          <div className="score-circle">
            <span className="score-value">{consistencyScore}%</span>
          </div>
          <div className="score-info">
            <p className="score-description">
              {consistencyScore >= 80
                ? '🎯 Excellent consistency! You\'re a workout machine.'
                : consistencyScore >= 60
                ? '💪 Good consistency. Keep building the habit!'
                : consistencyScore >= 40
                ? '📈 Making progress. Every workout counts!'
                : '🚀 Getting started. You\'ve got this!'}
            </p>
          </div>
        </div>
      </div>

      {/* Most Frequent Exercise */}
      {mostFrequent && (
        <div className="insight-section">
          <h3>Favorite Exercise</h3>
          <div className="favorite-exercise">
            <span className="exercise-name">{mostFrequent[0]}</span>
            <span className="exercise-count">{mostFrequent[1]} times</span>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="insight-section">
        <h3>Your Progress</h3>
        <div className="insights-list">
          {insights.length === 0 ? (
            <p className="no-insights">No insights yet. Keep logging workouts!</p>
          ) : (
            insights.map((insight, idx) => (
              <div key={idx} className={`insight-card insight-${insight.type}`}>
                <span className="insight-message">{insight.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="insight-section tips-section">
        <h3>💡 Tips</h3>
        <ul className="tips-list">
          <li>Log every workout to track your progress accurately</li>
          <li>Aim for consistent workouts 4-5 days per week</li>
          <li>Mix up upper, lower, and cardio for balanced fitness</li>
          <li>Challenge yourself with heavier weight or more reps each week</li>
          <li>Rest days are important for recovery - use weekends wisely</li>
        </ul>
      </div>

      {/* Goal Reminder */}
      {userProfile && (
        <div className="insight-section goal-section">
          <h3>🎯 Your Goal</h3>
          <p className="goal-text">{userProfile.goal}</p>
          <div className="goal-tips">
            <p><strong>How you're doing:</strong></p>
            <ul>
              <li>✓ Consistent workouts burn fat and build lean muscle</li>
              <li>✓ Mix of cardio and strength training is ideal for toning</li>
              <li>✓ Keep up the momentum - visible results come in 4-8 weeks</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrendsInsights;
