# Fitness Tracker

A personalized at-home workout tracking app that recreates your trainer sessions and tracks progress over time.

## Features

- **Workout Library** — Based on your trainer workouts (upper body, lower body, cardio)
- **Weekly Randomizer** — New randomized workout schedule each week (Mon-Fri)
- **Progress Tracker** — Log reps, weights, dates
- **Visual History** — Charts showing progress over time
- **Bodyweight & Dumbbell Friendly** — No gym equipment required

## Goals

- Tone up and burn fat
- Track progress from trainer sessions
- Get consistent at-home workouts tailored to muscle groups

## Tech Stack

- **Frontend:** React
- **Backend:** Firebase (Firestore + Auth)
- **Hosting:** Firebase Hosting

## Getting Started

```bash
npm install
npm start
```

## Project Structure

```
fitness-tracker/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page routes
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── styles/         # CSS/styling
│   └── App.js
├── public/             # Static assets
├── firebase/           # Firebase config & setup
└── package.json
```

## Database Schema (Firebase Firestore)

- `users/{userId}` — User profile & settings
- `workouts/{workoutId}` — Workout templates
- `sessions/{sessionId}` — Completed workout sessions
- `exercises/{exerciseId}` — Exercise library

## Next Steps

1. Firebase project setup
2. User authentication
3. Exercise library build
4. Workout randomizer logic
5. Session tracking UI
6. Progress visualization

---

**Built for:** At-home fitness tracking
**Status:** In development
