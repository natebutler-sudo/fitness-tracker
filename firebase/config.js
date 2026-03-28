// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBB5umZ2t4TX7V2WXhktjzByCvokO4cHFE",
  authDomain: "fitness-tracker573.firebaseapp.com",
  projectId: "fitness-tracker573",
  storageBucket: "fitness-tracker573.firebasestorage.app",
  messagingSenderId: "499444085969",
  appId: "1:499444085969:web:475b1a8a452fa4688281f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

export default app;
