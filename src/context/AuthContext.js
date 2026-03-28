// Auth Context - Global user authentication state
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile, createUserProfile, updateUserProfile } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);

          // Load user profile from Firestore
          let profile = await getUserProfile(firebaseUser.uid);

          // Create profile if it doesn't exist
          if (!profile) {
            profile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'User',
              goal: 'tone up and burn fat',
              experience: 'intermediate',
              availableEquipment: ['dumbbells'],
              restDays: ['saturday', 'sunday'],
              preferences: {
                workoutDuration: 60,
                daysPerWeek: 5,
                randomizeWeekly: true,
              },
            };
            await createUserProfile(firebaseUser.uid, profile);
          }

          setUserProfile(profile);
          setError(null);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      const updated = await updateUserProfile(user.uid, updates);
      setUserProfile(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated: !!user,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
