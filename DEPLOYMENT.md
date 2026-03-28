# Fitness Tracker Deployment Guide

This guide walks you through deploying your fitness tracker app to Firebase Hosting. Everything is configured and ready—you just need to follow these steps.

## Prerequisites

- ✅ Firebase project created: `fitness-tracker` (project ID: `fitness-tracker573`)
- ✅ Firebase CLI installed globally: `npm install -g firebase-tools`
- ✅ You're logged into Firebase CLI with your Google account
- ✅ All code committed to GitHub

## Deployment Steps

### Step 1: Enable Google Sign-In in Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your **fitness-tracker** project
3. Go to **Authentication** (left sidebar)
4. Click the **Sign-in method** tab
5. Click **Google** and toggle it **ON**
6. Select your **Support email** from the dropdown
7. Click **Save**

This enables Google OAuth2 for your app. Users can now sign in with their Google accounts.

### Step 2: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Select region closest to you (default is fine)
5. Click **Create**

Firestore is now active and ready to store user data.

### Step 3: Deploy Firestore Security Rules

Your app includes security rules that protect user data. Deploy them now:

```bash
cd ~/Projects/fitness-tracker
firebase deploy --only firestore:rules
```

This command:
- Reads `firebase/firestore.rules`
- Deploys security rules to your Firestore database
- Rules ensure users can only access their own data

**What the rules do:**
- Users can read/write only their own user document
- Exercises are readable by all authenticated users (admin-only to write)
- Workouts & Sessions are only readable/writable by their owner
- All other data is denied by default

### Step 4: Build the React App

```bash
cd ~/Projects/fitness-tracker
npm run build
```

This creates an optimized production build in the `build/` folder. The process may take 1-2 minutes.

### Step 5: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

This uploads your app to Firebase Hosting. You'll see:
- ✅ Deployment successful message
- ✅ Your live URL: `https://fitness-tracker573.web.app`

### Step 6: Test Your Live App

1. Open your live URL in a browser
2. Test the **Sign Up** flow:
   - Create account with email/password
   - Try **Google Sign-In** button
   - Verify you're logged in
3. Test the **Log In** flow with your test account
4. Check that the **Dashboard** loads with charts
5. Log a workout and verify data saves

## Troubleshooting

### "Firebase CLI not found"
```bash
npm install -g firebase-tools
firebase login
```

### "Not logged into Firebase"
```bash
firebase login
```

### "Project not found"
Make sure you're in the `~/Projects/fitness-tracker` directory and your `firebase.json` exists:
```bash
ls -la | grep firebase
```

### "Firestore rules deployment failed"
Check for syntax errors in `firebase/firestore.rules`. The file is validated automatically. View errors:
```bash
firebase deploy --only firestore:rules --debug
```

### "Google Sign-In not working"
Verify Google provider is enabled in [Firebase Console → Authentication → Sign-in method](https://console.firebase.google.com/u/0/project/fitness-tracker573/authentication/providers)

### "Can't log in after deployment"
Check:
1. Firestore Database is created and active
2. Security rules are deployed
3. Firebase config in `src/firebase/config.js` has correct credentials
4. AuthContext is loading (check browser console for errors)

## What Gets Deployed

| Component | Location |
|-----------|----------|
| **React App** | `build/` folder uploaded to Hosting |
| **Firestore Rules** | `firebase/firestore.rules` deployed to database |
| **Firebase Config** | Already in `src/firebase/config.js` |
| **Auth Pages** | LoginPage.js, SignupPage.js, AuthPages.css |
| **Dashboard** | All charts, insights, and analytics |
| **Data** | Stored in Firestore (users, exercises, workouts, sessions) |

## Your Live App Features

✅ **Authentication**
- Email/password signup and login
- Google Sign-In
- Secure logout
- Persistent sessions

✅ **Workout Tracking**
- Log exercises with reps, weight, notes
- Track workout sessions
- View personal records (PRs)
- Filter by date and workout type

✅ **Analytics Dashboard**
- Weekly activity chart (workouts & minutes)
- Workout type distribution (upper/lower/cardio/core)
- 30-day activity heatmap
- Consistency score
- Fitness insights and tips

✅ **Data Security**
- Firestore security rules protect all data
- Users can only access their own information
- Exercises curated by admin, readable by all users

## Next Steps (Optional Enhancements)

After deployment, you can:

1. **Test with Real Users** — Share your app URL with others
2. **Add Custom Domain** — Point a custom domain to your app
3. **Set Up CI/CD** — Auto-deploy on GitHub push
4. **Monitor Performance** — Check Firebase Console → Analytics
5. **Add More Exercises** — Edit `src/data/exercises.js` and redeploy

## Production Notes

- **Firestore Costs**: Currently in test mode. When ready for production, switch to pay-as-you-go pricing in Firebase Console.
- **Backups**: Firestore auto-backs up daily. Data is safe.
- **CDN**: Firebase Hosting uses Google's global CDN—your app loads fast worldwide.
- **HTTPS**: Automatically enabled. Data is encrypted in transit.

## Support

If you hit issues:
1. Check browser console for errors: `F12` → **Console** tab
2. Check Firebase Console logs: **Functions** → **Logs**
3. View deployment logs: `firebase deploy --debug`

Your app is now live! 🚀
