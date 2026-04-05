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

### Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher
- **Firebase project** with Firestore and Auth enabled
- **Google Gemini API** key (for trainer chat feature)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/fitness-tracker.git
   cd fitness-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** — Create a `.env.local` file:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key
   ```

   See [Firebase Setup Guide](docs/firebase-setup.md) for detailed instructions.

4. **Start the development server**:
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Run Tests

```bash
npm test
```

### Linting

```bash
npm run lint
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

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development workflow
- Code style guidelines
- How to submit PRs
- Branch naming conventions

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Security

For security vulnerabilities, please see [SECURITY.md](SECURITY.md) for responsible disclosure guidelines.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE) file for details.

## Roadmap

### Current (v0.1.0)
- ✅ Workout library and templates
- ✅ Weekly randomizer
- ✅ Progress tracking
- ✅ Firebase integration
- ✅ Trainer chat UI

### Next (v0.2.0)
- [ ] Exercise video library
- [ ] Advanced analytics and insights
- [ ] Mobile app (React Native)
- [ ] Export workout data
- [ ] Social features

### Future
- [ ] AI-powered workout recommendations
- [ ] Integration with wearables
- [ ] Nutrition tracking

---

**Built for:** At-home fitness tracking
**Status:** In development
**Live:** https://fitness-tracker573.web.app
