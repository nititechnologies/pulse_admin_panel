import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBCBZVbN63x5Lf_7f_TTlDAqulLZGGbWn0",
  authDomain: "pulse-c6df9.firebaseapp.com",
  projectId: "pulse-c6df9",
  storageBucket: "pulse-c6df9.firebasestorage.app",
  messagingSenderId: "240600042189",
  appId: "1:240600042189:web:10e61afadcb249135df784",
  measurementId: "G-L6TTG45YV1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
