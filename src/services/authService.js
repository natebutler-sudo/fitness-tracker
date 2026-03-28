// Auth Service - Firebase authentication operations
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const USERS_COLLECTION = 'users';

// Sign up with email and password
export const signup = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Firebase profile
    await firebaseUpdateProfile(user, {
      displayName: displayName || email.split('@')[0],
    });

    // Create user document in Firestore
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || email.split('@')[0],
      goal: 'tone up and burn fat',
      experience: 'intermediate',
      availableEquipment: ['dumbbells'],
      restDays: ['saturday', 'sunday'],
      preferences: {
        workoutDuration: 60,
        daysPerWeek: 5,
        randomizeWeekly: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, USERS_COLLECTION, user.uid), userProfile);

    return { uid: user.uid, email: user.email, displayName: user.displayName };
  } catch (error) {
    console.error('Signup error:', error);
    throw new Error(error.message);
  }
};

// Sign in with email and password
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return { uid: user.uid, email: user.email, displayName: user.displayName };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message);
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user profile exists, if not create one
    const existingProfile = await getUserProfile(user.uid);
    if (!existingProfile) {
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'User',
        goal: 'tone up and burn fat',
        experience: 'intermediate',
        availableEquipment: ['dumbbells'],
        restDays: ['saturday', 'sunday'],
        preferences: {
          workoutDuration: 60,
          daysPerWeek: 5,
          randomizeWeekly: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await setDoc(doc(db, 'users', user.uid), userProfile);
    }

    return { uid: user.uid, email: user.email, displayName: user.displayName };
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw new Error(error.message);
  }
};

// Sign out
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error(error.message);
  }
};

// Get user profile from Firestore
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { uid: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Create user profile in Firestore
export const createUserProfile = async (uid, profileData) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(docRef, {
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { uid, ...profileData };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Update user profile in Firestore
export const updateUserProfile = async (uid, updates) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    // Return updated profile
    const updated = await getUserProfile(uid);
    return updated;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update user preferences
export const updateUserPreferences = async (uid, preferences) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(docRef, {
      preferences,
      updatedAt: new Date(),
    });
    return await getUserProfile(uid);
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};
