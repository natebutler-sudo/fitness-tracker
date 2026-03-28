// Achievement Badges Component - Display user achievements and badges
import React, { useMemo } from 'react';
import { calculateStreak } from '../utils/progressCalculations';
import './AchievementBadges.css';

function AchievementBadges({ sessions }) {
  const badges = useMemo(() => {
    const streak = calculateStreak(sessions);
    const workoutCount = sessions.length;
    const weekCount = Math.floor(workoutCount / 5);
    const totalVolume = sessions.reduce((sum, session) => {
      const sessionVolume = session.exercises?.reduce((exSum, exercise) => {
        const weight = exercise.weight || 0;
        const reps = exercise.reps || 0;
        const sets = exercise.sets || 1;
        return exSum + (weight * reps * sets);
      }, 0) || 0;
      return sum + sessionVolume;
    }, 0);

    const achievedBadges = [];

    // Streak Badges
    if (streak >= 3) {
      achievedBadges.push({
        id: 'streak-3',
        name: 'Week Warrior',
        emoji: '🔥',
        description: '3-day workout streak',
        achieved: true,
        progress: 100,
        category: 'streak',
      });
    }
    if (streak >= 7) {
      achievedBadges.push({
        id: 'streak-7',
        name: 'Week Crusher',
        emoji: '⚡',
        description: '7-day workout streak',
        achieved: true,
        progress: 100,
        category: 'streak',
      });
    }
    if (streak >= 14) {
      achievedBadges.push({
        id: 'streak-14',
        name: 'Unstoppable',
        emoji: '💪',
        description: '14-day streak',
        achieved: true,
        progress: 100,
        category: 'streak',
      });
    }
    if (streak >= 30) {
      achievedBadges.push({
        id: 'streak-30',
        name: 'Month Master',
        emoji: '🏆',
        description: '30-day streak',
        achieved: true,
        progress: 100,
        category: 'streak',
      });
    }
    if (streak >= 90) {
      achievedBadges.push({
        id: 'streak-90',
        name: 'Legend',
        emoji: '👑',
        description: '90-day streak',
        achieved: true,
        progress: 100,
        category: 'streak',
      });
    }

    // Volume Badges
    if (workoutCount >= 5) {
      achievedBadges.push({
        id: 'workouts-5',
        name: 'Getting Started',
        emoji: '🚀',
        description: 'Complete 5 workouts',
        achieved: true,
        progress: 100,
        category: 'volume',
      });
    }
    if (workoutCount >= 25) {
      achievedBadges.push({
        id: 'workouts-25',
        name: 'Dedication',
        emoji: '⭐',
        description: 'Complete 25 workouts',
        achieved: true,
        progress: 100,
        category: 'volume',
      });
    }
    if (workoutCount >= 50) {
      achievedBadges.push({
        id: 'workouts-50',
        name: 'Committed',
        emoji: '🎯',
        description: 'Complete 50 workouts',
        achieved: true,
        progress: 100,
        category: 'volume',
      });
    }
    if (workoutCount >= 100) {
      achievedBadges.push({
        id: 'workouts-100',
        name: 'Centurion',
        emoji: '🥇',
        description: 'Complete 100 workouts',
        achieved: true,
        progress: 100,
        category: 'volume',
      });
    }

    // Locked badges (future goals)
    const allBadges = [
      ...achievedBadges,
      ...(streak < 3
        ? [
            {
              id: 'streak-3-locked',
              name: 'Week Warrior',
              emoji: '🔒',
              description: `${3 - streak} more days`,
              achieved: false,
              progress: (streak / 3) * 100,
              category: 'streak',
            },
          ]
        : []),
      ...(streak < 7
        ? [
            {
              id: 'streak-7-locked',
              name: 'Week Crusher',
              emoji: '🔒',
              description: `${7 - streak} more days`,
              achieved: false,
              progress: (streak / 7) * 100,
              category: 'streak',
            },
          ]
        : []),
      ...(workoutCount < 25
        ? [
            {
              id: 'workouts-25-locked',
              name: 'Dedication',
              emoji: '🔒',
              description: `${25 - workoutCount} more workouts`,
              achieved: false,
              progress: (workoutCount / 25) * 100,
              category: 'volume',
            },
          ]
        : []),
    ];

    return allBadges;
  }, [sessions]);

  const streakBadges = badges.filter((b) => b.category === 'streak');
  const volumeBadges = badges.filter((b) => b.category === 'volume');

  return (
    <div className="achievement-badges">
      {streakBadges.length > 0 && (
        <div className="badge-section">
          <h3 className="badge-section-title">🔥 Streak Badges</h3>
          <div className="badges-grid">
            {streakBadges.map((badge) => (
              <div
                key={badge.id}
                className={`badge ${badge.achieved ? 'unlocked' : 'locked'}`}
                title={badge.name}
              >
                <div className="badge-emoji">{badge.emoji}</div>
                <div className="badge-name">{badge.name}</div>
                <div className="badge-description">{badge.description}</div>
                {!badge.achieved && <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${badge.progress}%` }} />
                </div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {volumeBadges.length > 0 && (
        <div className="badge-section">
          <h3 className="badge-section-title">💪 Workout Badges</h3>
          <div className="badges-grid">
            {volumeBadges.map((badge) => (
              <div
                key={badge.id}
                className={`badge ${badge.achieved ? 'unlocked' : 'locked'}`}
                title={badge.name}
              >
                <div className="badge-emoji">{badge.emoji}</div>
                <div className="badge-name">{badge.name}</div>
                <div className="badge-description">{badge.description}</div>
                {!badge.achieved && <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${badge.progress}%` }} />
                </div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {badges.length === 0 && (
        <div className="no-badges">
          <p>Start working out to unlock badges!</p>
        </div>
      )}
    </div>
  );
}

export default AchievementBadges;
