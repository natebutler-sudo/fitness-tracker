# Firebase Setup Guide

This guide walks through setting up Firebase for the Fitness Tracker project.

## Prerequisites

- Google account
- Firebase CLI installed: `npm install -g firebase-tools`
- Project cloned locally

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Enter project name: `fitness-tracker`
4. Follow the setup wizard
5. Enable Google Analytics (optional)
6. Project will be created in ~1 minute

## Step 2: Create a Web App

1. In the Firebase Console, click the **Web** icon (</> symbol)
2. Enter app name: `fitness-tracker-web`
3. Check "Also set up Firebase Hosting"
4. Copy the Firebase config object (you'll need this)

## Step 3: Configure Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create Database"**
3. Start in **production mode** (or test mode for development)
4. Choose region closest to you
5. Click **"Create"**

### Firestore Security Rules

Replace the default rules with (for development):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users full access
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**For production**, implement stricter rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    match /workouts/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }

    match /sessions/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## Step 4: Enable Authentication

1. Go to **Authentication** in Firebase Console
2. Click **"Get Started"**
3. Enable authentication methods:
   - **Email/Password** (required)
   - **Google** (optional but recommended)
4. Configure settings as needed

## Step 5: Set Up Environment Variables

Copy the Firebase config from Step 2 and create `.env.local`:

```bash
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

**Never commit `.env.local`** — it's in `.gitignore` for security.

## Step 6: Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
2. Click **"Create API Key"**
3. Copy the API key
4. Add to `.env.local` as `REACT_APP_GEMINI_API_KEY`

## Step 7: Firebase Hosting Setup

1. In Firebase Console, go to **Hosting**
2. Click **"Get Started"**
3. Login to Firebase CLI:
   ```bash
   firebase login
   ```
4. Initialize Firebase hosting:
   ```bash
   firebase init hosting
   ```
5. When prompted:
   - Project: Select `fitness-tracker`
   - Public directory: `build`
   - Configure single-page app: `y` (yes)

## Step 8: Test Locally

```bash
npm install
npm start
```

You should be able to:
- Create an account
- Log in
- Access Firestore data

## Deployment

### Development Deploy

```bash
npm run build
firebase deploy --only hosting:development
```

### Production Deploy

Commits to `master` trigger automatic deployment via GitHub Actions.

## Database Collections

Set up these collections in Firestore:

### `users/{userId}`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "timestamp",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

### `workouts/{workoutId}`
```json
{
  "name": "Upper Body",
  "category": "upper_body",
  "exercises": ["exercise_id_1", "exercise_id_2"],
  "ownerId": "user_id",
  "createdAt": "timestamp"
}
```

### `sessions/{sessionId}`
```json
{
  "userId": "user_id",
  "workoutId": "workout_id",
  "date": "timestamp",
  "exercises": [
    {
      "exerciseId": "exercise_id",
      "reps": 10,
      "weight": 25,
      "notes": "felt good"
    }
  ]
}
```

### `exercises/{exerciseId}`
```json
{
  "name": "Push-ups",
  "category": "chest",
  "description": "Upper body push exercise",
  "instructions": ["Start in plank position", "Lower body", "Push back up"]
}
```

## Troubleshooting

### "Permission denied" errors
- Check Firestore security rules
- Ensure user is authenticated
- Verify `.env.local` has correct credentials

### Build fails with missing env vars
- Ensure `.env.local` exists
- All `REACT_APP_*` variables must be present
- Restart dev server after adding env vars

### Firebase CLI not found
```bash
npm install -g firebase-tools
firebase --version  # Verify installation
```

## References

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Google Generative AI](https://ai.google.dev/)
