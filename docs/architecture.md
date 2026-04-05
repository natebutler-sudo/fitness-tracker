# Architecture Overview

This document describes the system architecture of Fitness Tracker.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Web Browser                          │
│                    (React Application)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
    ┌─────▼────┐   ┌─────▼────┐   ┌────▼──────┐
    │ Firebase │   │ Firestore│   │  Gemini   │
    │   Auth   │   │ Database │   │    API    │
    └──────────┘   └──────────┘   └───────────┘
          │              │              │
          └──────────────┼──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │   Firebase Hosting & CDN    │
          └────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework:** React 18
- **Charting:** Recharts
- **State Management:** React Hooks & Context API
- **Styling:** CSS (no CSS-in-JS framework currently)
- **Build Tool:** Create React App (react-scripts)

### Backend
- **Authentication:** Firebase Authentication
- **Database:** Cloud Firestore
- **Hosting:** Firebase Hosting
- **AI/ML:** Google Generative AI (Gemini)

### Development
- **Package Manager:** npm
- **Node Version:** 18+
- **Testing:** Jest (via react-scripts)
- **Linting:** ESLint (via react-app config)
- **CI/CD:** GitHub Actions

## Project Structure

```
fitness-tracker/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
│
├── src/
│   ├── components/         # Reusable React components
│   │   ├── WorkoutCard.js
│   │   ├── ProgressChart.js
│   │   ├── TrainerChat.js
│   │   └── ...
│   │
│   ├── pages/             # Page-level components
│   │   ├── HomePage.js
│   │   ├── WorkoutPage.js
│   │   ├── ProgressPage.js
│   │   └── ...
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js     # Authentication state
│   │   ├── useFirestore.js # Firestore queries
│   │   └── ...
│   │
│   ├── utils/             # Utility functions
│   │   ├── firebase.js    # Firebase config & helpers
│   │   ├── randomizer.js  # Workout randomization logic
│   │   └── ...
│   │
│   ├── styles/            # Global styles
│   │   └── index.css
│   │
│   ├── App.js             # Main app component
│   └── index.js           # Entry point
│
├── .github/
│   ├── workflows/         # CI/CD workflows
│   └── ISSUE_TEMPLATE/    # Issue templates
│
├── docs/                  # Documentation
│   ├── firebase-setup.md
│   ├── architecture.md
│   └── ...
│
├── build/                 # Production build (generated)
├── node_modules/          # Dependencies (git-ignored)
├── .env.local             # Environment variables (git-ignored)
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE
└── CHANGELOG.md
```

## Data Flow

### User Authentication

```
1. User enters email/password
   ↓
2. React component calls Firebase Auth
   ↓
3. Firebase validates credentials
   ↓
4. Auth token issued (stored in browser)
   ↓
5. useAuth hook updates app state
   ↓
6. User redirected to dashboard
```

### Workout Data Flow

```
1. User selects workout category
   ↓
2. App queries Firestore for workouts
   ↓
3. Firestore returns workout templates
   ↓
4. Randomizer shuffles exercises (client-side)
   ↓
5. UI renders workout session
   ↓
6. User logs reps/weights
   ↓
7. Session saved to Firestore (sessions collection)
   ↓
8. Progress dashboard updates
```

### Trainer Chat Flow

```
1. User opens chat interface
   ↓
2. User sends message via React component
   ↓
3. Message sent to Gemini API
   ↓
4. Gemini returns AI response
   ↓
5. Messages displayed in UI
   ↓
6. Chat history stored in Firestore
```

## Firestore Data Structure

### Collections Overview

```
firestore/
├── users/
│   └── {userId}/
│       ├── name: string
│       ├── email: string
│       ├── createdAt: timestamp
│       └── preferences: object
│
├── workouts/
│   └── {workoutId}/
│       ├── name: string
│       ├── category: string (upper_body, lower_body, cardio)
│       ├── exercises: array (exercise IDs)
│       ├── ownerId: string
│       └── createdAt: timestamp
│
├── sessions/
│   └── {sessionId}/
│       ├── userId: string
│       ├── workoutId: string
│       ├── date: timestamp
│       └── exercises: array
│
└── exercises/
    └── {exerciseId}/
        ├── name: string
        ├── category: string
        ├── description: string
        └── instructions: array
```

## Authentication Flow

### Login/Signup Process

1. **Sign Up:**
   - User submits email/password
   - Firebase Auth creates account
   - User document created in Firestore
   - Auth token stored in browser

2. **Login:**
   - User submits credentials
   - Firebase Auth validates
   - Auth token issued
   - App state updated

3. **Logout:**
   - Firebase Auth signs out
   - Auth token cleared
   - App state reset
   - User redirected to login

### Security

- Firebase handles password hashing
- Auth tokens expire (auto-refresh)
- Firestore security rules enforce data access
- API keys restricted to web domain

## Component Architecture

### Key Components

**App.js** (Root)
- Routing
- Auth state management
- Global error handling

**Pages/**
- HomePage — Dashboard and quick stats
- WorkoutPage — Workout selection and execution
- ProgressPage — Charts and analytics
- SettingsPage — User preferences

**Components/**
- WorkoutCard — Displays individual workouts
- ProgressChart — Visualizes data with Recharts
- TrainerChat — AI-powered chat interface
- ExerciseLogger — Input form for workout data

### State Management

- **Authentication:** `useAuth()` hook
- **Workout Data:** `useFirestore()` hook + Firestore
- **UI State:** Local component state (useState)
- **Global Data:** Context API if needed

## Performance Considerations

### Frontend
- Lazy loading of components
- Optimized Recharts rendering
- CSS optimization via Create React App
- Service Worker via create-react-app

### Database
- Firestore indexes on frequently queried fields
- Document reads minimized
- Batch operations for multi-document updates
- Real-time listeners only when needed

### Network
- Firebase CDN for static assets
- Compression enabled
- Minified JavaScript in production
- Cached API responses where applicable

## Deployment Pipeline

```
Developer Push → GitHub (master branch)
   ↓
GitHub Actions Workflow
   ├── Install dependencies
   ├── Run tests
   ├── Build project
   └── Run linting
   ↓
Build Success?
   ├── YES → Deploy to Firebase Hosting
   │         (fitness-tracker573.web.app)
   │
   └── NO → Notify developer
           (CI/CD failure)
```

## Environment Configuration

### Development (.env.local)
```
REACT_APP_FIREBASE_API_KEY=dev_key
REACT_APP_FIREBASE_PROJECT_ID=fitness-tracker-dev
REACT_APP_GEMINI_API_KEY=dev_gemini_key
```

### Production (GitHub Secrets)
```
Stored securely in GitHub repository settings
- Used only during CI/CD pipeline
- Never committed to version control
```

## Scaling Considerations

### Current Limitations
- Single Firebase project
- No CDN for images/videos
- Real-time sync enabled for all users

### Future Improvements
- Separate staging/prod Firebase projects
- Cloud Storage for media files
- Optimized Firestore queries
- Analytics and monitoring

## Testing Strategy

### Unit Tests
- Component rendering
- Utility functions
- Hook logic

### Integration Tests
- Authentication flows
- Firestore operations
- Firebase interactions

### E2E Tests (Future)
- Full user workflows
- Cross-browser testing
- Performance testing

## Security Measures

1. **Authentication:**
   - Firebase Auth handles password security
   - OAuth for social login

2. **Data Protection:**
   - Firestore security rules restrict access
   - HTTPS enforced
   - API keys restricted to web domains

3. **API Keys:**
   - GitHub Secrets for CI/CD
   - `.env.local` in `.gitignore`
   - No hardcoded credentials

4. **Dependencies:**
   - Regular npm audit checks
   - Automated dependency updates
   - Security scanning in CI/CD

## Monitoring & Logging

### Firebase Monitoring
- Performance monitoring via Firebase SDK
- Error tracking
- Real-time database usage

### Application Logging
- Console logs in development
- Error boundaries in React
- User analytics (if enabled)

## References

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Google Generative AI](https://ai.google.dev/)
