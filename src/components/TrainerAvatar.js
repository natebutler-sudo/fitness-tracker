/**
 * Trainer Avatar Component
 * Floating button with trainer avatar (emoji from onboarding)
 * Always visible on screen, tappable to open chat
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TrainerChat from './TrainerChat';
import './TrainerAvatar.css';

export default function TrainerAvatar() {
  const { userProfile } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);

  // Don't show if no avatar selected yet
  if (!userProfile?.trainer?.avatar) {
    return null;
  }

  return (
    <>
      {/* Floating avatar button */}
      <button
        className="trainer-avatar-button"
        onClick={() => setChatOpen(true)}
        aria-label="Open trainer chat"
        title="Ask your trainer"
      >
        <span className="avatar-emoji">{userProfile.trainer.avatar}</span>
      </button>

      {/* Chat modal - only render when open */}
      {chatOpen && (
        <TrainerChat
          avatar={userProfile.trainer.avatar}
          onClose={() => setChatOpen(false)}
        />
      )}
    </>
  );
}
