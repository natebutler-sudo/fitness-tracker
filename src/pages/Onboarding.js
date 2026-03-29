// Onboarding Page - First-time user experience
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Onboarding.css';

function Onboarding({ onComplete }) {
  const { userProfile, updateProfile } = useAuth();
  const [step, setStep] = useState(1); // 1: trainer name, 2: avatar selection, 3: tour, 4: photos
  const [trainerName, setTrainerName] = useState(userProfile?.trainer?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile?.trainer?.avatar || '💪');
  const [photoStep, setPhotoStep] = useState(0);
  const [tourStep, setTourStep] = useState(0);

  // Trainer avatar options
  const avatarOptions = [
    { emoji: '💪', name: 'Strong Trainer' },
    { emoji: '🏋️', name: 'Gym Master' },
    { emoji: '🤸', name: 'Flexible Trainer' },
    { emoji: '🏃', name: 'Runner Coach' },
    { emoji: '🧘', name: 'Zen Master' },
    { emoji: '👨‍🏫', name: 'Coach' },
    { emoji: '👩‍🏫', name: 'Coach (Female)' },
    { emoji: '🦸', name: 'Superhero' },
  ];

  const photoTypes = [
    { id: 'front', label: 'Front View', emoji: '📸', description: 'Stand straight, arms at sides' },
    { id: 'side', label: 'Side View', emoji: '📸', description: 'Stand sideways to camera' },
    { id: 'back', label: 'Back View', emoji: '📸', description: 'Show your back' },
  ];

  const tourFeatures = [
    {
      icon: '🏠',
      title: 'Dashboard',
      description: 'Your fitness hub! See your progress, achievements, streaks, and get personalized insights.',
      hint: 'Check your badges and progress charts here',
    },
    {
      icon: '📅',
      title: 'Weekly Schedule',
      description: 'Your personalized workout plan. Shuffle for new routines, log your completed workouts.',
      hint: 'We mix upper, lower, cardio, and core workouts',
    },
    {
      icon: '💪',
      title: 'Exercise Library',
      description: 'Browse all 30+ exercises with descriptions, variations, and trainer examples.',
      hint: 'Find exercises that match your equipment',
    },
    {
      icon: '📊',
      title: 'Progress Tracker',
      description: 'Track your personal records, stats, and workout history. Export your data anytime.',
      hint: 'Watch your strength grow over time',
    },
    {
      icon: '🌙',
      title: 'Customize',
      description: 'Toggle dark mode, export your data, and manage your preferences.',
      hint: 'Found in the top right corner',
    },
  ];

  const handleTrainerNameSubmit = async () => {
    if (trainerName.trim()) {
      await updateProfile({
        trainer: {
          name: trainerName,
          avatar: selectedAvatar,
          createdAt: new Date().toISOString(),
        },
      });
      setStep(2);
    }
  };

  const handleAvatarSelect = async (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleAvatarConfirm = async () => {
    await updateProfile({
      trainer: {
        name: trainerName,
        avatar: selectedAvatar,
        createdAt: new Date().toISOString(),
      },
    });
    setStep(3); // Go to tour
  };

  const handleTourNext = () => {
    if (tourStep < tourFeatures.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setStep(4); // Go to photos
    }
  };

  const handleTourPrev = () => {
    if (tourStep > 0) {
      setTourStep(tourStep - 1);
    }
  };

  const handlePhotoCapture = async (photoType) => {
    // In production, would handle actual photo upload
    // For now, just move to next step
    setPhotoStep(photoStep + 1);
  };

  const handleSkipPhotos = async () => {
    await updateProfile({ onboardingComplete: true });
    onComplete();
  };

  const handleFinish = async () => {
    await updateProfile({ onboardingComplete: true });
    onComplete();
  };

  return (
    <div className="onboarding">
      {/* Step 1: Trainer Name */}
      {step === 1 && (
        <div className="onboarding-step step-1">
          <div className="onboarding-content">
            <div className="step-icon">👋</div>
            <h1>Meet Your Personal Trainer</h1>
            <p className="step-subtitle">Give your trainer a name to get started!</p>

            <div className="trainer-input-group">
              <input
                type="text"
                placeholder="e.g., Coach Mike, Trainer Jane"
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                maxLength="30"
                className="trainer-input"
                autoFocus
              />
              <p className="char-count">{trainerName.length}/30</p>
            </div>

            <button
              onClick={handleTrainerNameSubmit}
              disabled={!trainerName.trim()}
              className="btn-primary btn-large"
            >
              Continue
            </button>

            <button onClick={onComplete} className="btn-skip">
              Skip Onboarding
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Avatar Selection */}
      {step === 2 && (
        <div className="onboarding-step step-2">
          <div className="onboarding-content">
            <div className="step-header">
              <h1>Pick an Avatar for {trainerName}</h1>
              <p className="step-subtitle">Choose how your trainer looks in the app</p>
            </div>

            <div className="avatar-grid">
              {avatarOptions.map((option) => (
                <button
                  key={option.emoji}
                  className={`avatar-option ${selectedAvatar === option.emoji ? 'selected' : ''}`}
                  onClick={() => handleAvatarSelect(option.emoji)}
                  title={option.name}
                >
                  <span className="avatar-emoji">{option.emoji}</span>
                  <span className="avatar-name">{option.name}</span>
                </button>
              ))}
            </div>

            <div className="avatar-preview">
              <p>Your trainer will look like:</p>
              <div className="preview-circle">{selectedAvatar}</div>
              <p className="preview-name">{trainerName}</p>
            </div>

            <button onClick={handleAvatarConfirm} className="btn-primary btn-large">
              Confirm Avatar
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Guided Tour */}
      {step === 3 && (
        <div className="onboarding-step step-3">
          <div className="onboarding-content">
            <div className="tour-welcome">
              <div className="tour-trainer">
                <div className="tour-avatar">{selectedAvatar}</div>
                <div className="tour-greeting">
                  <h2>Welcome! I'm {trainerName}</h2>
                  <p>Let me show you around the app and where you'll spend most of your time.</p>
                </div>
              </div>
            </div>

            <div className="tour-feature">
              <div className="feature-icon">{tourFeatures[tourStep].icon}</div>
              <h3>{tourFeatures[tourStep].title}</h3>
              <p className="feature-description">{tourFeatures[tourStep].description}</p>
              <div className="feature-hint">💡 {tourFeatures[tourStep].hint}</div>
            </div>

            <div className="tour-progress">
              <div className="progress-dots">
                {tourFeatures.map((_, index) => (
                  <div
                    key={index}
                    className={`dot ${index === tourStep ? 'active' : ''}`}
                  />
                ))}
              </div>
              <p className="progress-text">
                {tourStep + 1} of {tourFeatures.length}
              </p>
            </div>

            <div className="tour-buttons">
              {tourStep > 0 && (
                <button onClick={handleTourPrev} className="btn-secondary">
                  ← Back
                </button>
              )}
              <button
                onClick={handleTourNext}
                className="btn-primary"
              >
                {tourStep === tourFeatures.length - 1 ? 'Next' : 'Next'} →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Progress Photos */}
      {step === 4 && (
        <div className="onboarding-step step-3">
          <div className="onboarding-content">
            <div className="step-header">
              <h1>Take Progress Photos</h1>
              <p className="step-subtitle">
                {photoStep === 0
                  ? 'Capture your baseline for tracking progress'
                  : `${photoStep} of ${photoTypes.length} photos taken`}
              </p>
            </div>

            {photoStep < photoTypes.length ? (
              <div className="photo-capture">
                <div className="photo-instruction">
                  <div className="photo-emoji">{photoTypes[photoStep].emoji}</div>
                  <h2>{photoTypes[photoStep].label}</h2>
                  <p className="instruction-text">{photoTypes[photoStep].description}</p>
                </div>

                <div className="camera-placeholder">
                  <p>📱 Camera would open here</p>
                  <p className="placeholder-text">In production, this would use device camera</p>
                </div>

                <div className="photo-buttons">
                  <button
                    onClick={() => handlePhotoCapture(photoTypes[photoStep].id)}
                    className="btn-primary btn-large"
                  >
                    Simulate Photo Capture
                  </button>
                  {photoStep > 0 && (
                    <button
                      onClick={() => setPhotoStep(photoStep - 1)}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="photos-complete">
                <div className="success-icon">✅</div>
                <h2>Photos Captured!</h2>
                <p>Great start! You can upload more photos anytime from the Progress section.</p>

                <button onClick={handleFinish} className="btn-primary btn-large">
                  Get Started
                </button>
              </div>
            )}

            <button onClick={handleSkipPhotos} className="btn-skip">
              Skip Photos
            </button>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="onboarding-progress">
        <div className={`progress-dot ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className={`progress-line ${step >= 2 ? 'active' : ''}`} />
        <div className={`progress-dot ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className={`progress-line ${step >= 3 ? 'active' : ''}`} />
        <div className={`progress-dot ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>
    </div>
  );
}

export default Onboarding;
