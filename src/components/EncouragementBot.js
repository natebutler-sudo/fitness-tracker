// Encouragement Bot Component - Shows motivational messages with animation
import React, { useState, useEffect } from 'react';
import './EncouragementBot.css';

function EncouragementBot({ userProfile, sessions, streak }) {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [botMood, setBotMood] = useState('happy');

  const messages = {
    great: [
      '🔥 You\'re crushing it! Keep the momentum going!',
      '💪 That\'s the spirit! Every rep counts!',
      '🎯 You\'re a beast! This is what commitment looks like!',
      '⚡ Amazing work! Your future self is grateful!',
      '🏆 Champion energy! You\'re on fire!',
    ],
    good: [
      '👏 Great session! You\'re building strength!',
      '💯 Nice effort! You\'re making progress!',
      '🌟 That was solid! Keep it up!',
      '✨ Good work today! You should be proud!',
      '🎉 Another day, another step forward!',
    ],
    motivate: [
      '💭 Ready to get moving? Your goals are waiting!',
      '🚀 Let\'s do this! Today is YOUR day!',
      '⏰ Time to shine! Show up for yourself!',
      '🎯 You got this! Just one step at a time!',
      '💪 Get up and show up! No excuses!',
    ],
    streak: [
      `🔥 ${streak} day streak! You\'re unstoppable!`,
      `🏅 ${streak} consecutive days! That\'s dedication!`,
      `⭐ Look at that ${streak}-day streak! Legendary!`,
      `🎊 ${streak} days in a row! You\'re a warrior!`,
    ],
  };

  useEffect(() => {
    const showEncouragement = () => {
      let category = 'motivate';
      let mood = 'happy';

      // Determine message based on data
      if (sessions && sessions.length > 0) {
        const lastWeekSessions = sessions.filter(s => {
          const sessionDate = new Date(s.date);
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return sessionDate > oneWeekAgo;
        });

        if (lastWeekSessions.length >= 5) {
          category = 'great';
          mood = 'excited';
        } else if (lastWeekSessions.length >= 3) {
          category = 'good';
          mood = 'happy';
        }
      }

      // Boost for streaks
      if (streak && streak > 3) {
        category = 'streak';
        mood = 'excited';
      }

      // Select random message from category
      const categoryMessages = messages[category];
      const selectedMessage = categoryMessages[Math.floor(Math.random() * categoryMessages.length)];

      setMessage(selectedMessage);
      setBotMood(mood);
      setIsVisible(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    };

    // Show encouragement on mount
    const timer = setTimeout(showEncouragement, 500);
    return () => clearTimeout(timer);
  }, [sessions, streak]);

  if (!isVisible) return null;

  return (
    <div className={`encouragement-bot ${botMood} animate-in`}>
      <div className="bot-container">
        <div className="bot-character">
          {botMood === 'excited' ? '🤩' : '😊'}
        </div>
        <div className="bot-message">
          <p>{message}</p>
        </div>
        <button
          className="bot-close"
          onClick={() => setIsVisible(false)}
          aria-label="Close encouragement message"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default EncouragementBot;
