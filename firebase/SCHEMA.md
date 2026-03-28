# Firestore Database Schema

## Collections

### 1. `exercises` Collection
Stores all available exercises in the app.

**Document Structure:**
```json
{
  "id": "pull-ups",
  "name": "Pull-ups",
  "category": "upper",
  "muscleGroups": ["back", "lats", "biceps"],
  "equipment": ["pull-up bar"],
  "variations": ["assisted", "resistance band", "regular"],
  "description": "Upper body pulling exercise",
  "trainerExample": {
    "date": "2/10/26",
    "reps": [10, 10, 10],
    "weight": [160, 145, 130]
  },
  "createdAt": "2026-03-28T12:00:00Z",
  "updatedAt": "2026-03-28T12:00:00Z"
}
```

**Fields:**
- `id` (string): Unique exercise identifier
- `name` (string): Display name
- `category` (string): "upper", "lower", "cardio", "core"
- `muscleGroups` (array): List of targeted muscle groups
- `equipment` (array): Required equipment
- `variations` (array): Available exercise variations
- `description` (string): Brief description
- `trainerExample` (object): Data from trainer sessions
  - `date`: Session date
  - `reps`: Array of rep counts per set
  - `weight`: Array of weights per set
- `createdAt` (timestamp): Creation timestamp
- `updatedAt` (timestamp): Last update timestamp

---

### 2. `workouts` Collection
Stores user-created workout routines.

**Document Structure:**
```json
{
  "userId": "user123",
  "weekNumber": 1,
  "weekStartDate": "2026-03-24",
  "schedule": {
    "monday": {
      "type": "upper",
      "exercises": [
        {
          "exerciseId": "pull-ups",
          "sets": 3,
          "reps": 10,
          "weight": null,
          "notes": ""
        }
      ]
    },
    "tuesday": { "type": "lower", "exercises": [...] },
    "wednesday": { "type": "cardio", "exercises": [...] },
    "thursday": { "type": "upper", "exercises": [...] },
    "friday": { "type": "lower", "exercises": [...] },
    "saturday": { "type": "rest" },
    "sunday": { "type": "rest" }
  },
  "createdAt": "2026-03-28T12:00:00Z",
  "updatedAt": "2026-03-28T12:00:00Z"
}
```

**Fields:**
- `userId` (string): Reference to user
- `weekNumber` (number): Which week this schedule is for
- `weekStartDate` (string): Start date of the week
- `schedule` (object): Day-by-day workout plan
  - Keys: "monday", "tuesday", ..., "sunday"
  - `type`: "upper", "lower", "cardio", "core", "rest"
  - `exercises`: Array of exercises for that day
- `createdAt` (timestamp): Creation timestamp
- `updatedAt` (timestamp): Last update timestamp

---

### 3. `sessions` Collection
Records of completed workout sessions.

**Document Structure:**
```json
{
  "userId": "user123",
  "date": "2026-03-28",
  "workoutType": "upper",
  "duration": 60,
  "exercises": [
    {
      "exerciseId": "pull-ups",
      "exerciseName": "Pull-ups",
      "plannedSets": 3,
      "plannedReps": 10,
      "completedSets": [
        {
          "reps": 10,
          "weight": 0,
          "notes": "assisted"
        },
        {
          "reps": 9,
          "weight": 0,
          "notes": ""
        },
        {
          "reps": 8,
          "weight": 0,
          "notes": "harder than last time"
        }
      ]
    }
  ],
  "totalTime": 55,
  "notes": "Good session",
  "completed": true,
  "createdAt": "2026-03-28T18:00:00Z",
  "updatedAt": "2026-03-28T19:00:00Z"
}
```

**Fields:**
- `userId` (string): Reference to user
- `date` (string): Session date (YYYY-MM-DD)
- `workoutType` (string): Type of workout ("upper", "lower", etc.)
- `duration` (number): Planned duration in minutes
- `exercises` (array): Completed exercises
  - `exerciseId`: Reference to exercise
  - `exerciseName`: Display name
  - `plannedSets`: Expected sets
  - `plannedReps`: Expected reps
  - `completedSets`: Array of actual set data
- `totalTime` (number): Actual time spent
- `notes` (string): Session notes
- `completed` (boolean): Whether session was finished
- `createdAt` (timestamp): Session start time
- `updatedAt` (timestamp): Last updated time

---

### 4. `users` Collection
User profile and settings.

**Document Structure:**
```json
{
  "uid": "user123",
  "email": "user@example.com",
  "displayName": "Nate Butler",
  "goal": "tone up and burn fat",
  "experience": "intermediate",
  "availableEquipment": ["dumbbells"],
  "restDays": ["saturday", "sunday"],
  "preferences": {
    "workoutDuration": 60,
    "daysPerWeek": 5,
    "randomizeWeekly": true
  },
  "createdAt": "2026-03-28T12:00:00Z",
  "updatedAt": "2026-03-28T12:00:00Z"
}
```

**Fields:**
- `uid` (string): Firebase Auth UID
- `email` (string): User email
- `displayName` (string): Display name
- `goal` (string): Fitness goal
- `experience` (string): Experience level
- `availableEquipment` (array): Equipment user has
- `restDays` (array): Days off (e.g., "saturday", "sunday")
- `preferences` (object): User preferences
  - `workoutDuration`: Target session length in minutes
  - `daysPerWeek`: Number of workout days per week
  - `randomizeWeekly`: Whether to randomize each week
- `createdAt` (timestamp): Account creation time
- `updatedAt` (timestamp): Last profile update

---

## Indexes

### Recommended Firestore Indexes

1. **exercises**:
   - Collection: exercises
   - Filter: category (Ascending)
   - Sort: createdAt (Descending)

2. **workouts**:
   - Collection: workouts
   - Filter: userId (Ascending)
   - Sort: weekStartDate (Descending)

3. **sessions**:
   - Collection: sessions
   - Filter: userId (Ascending), date (Ascending)
   - Sort: createdAt (Descending)

---

## Data Initialization

The app initializes exercises automatically on first load using `initializeExercises()` from the data file. Subsequent loads check if exercises exist and skip initialization if they do.
