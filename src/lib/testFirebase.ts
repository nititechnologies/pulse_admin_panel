// Test Firebase connection
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    console.log('Firebase db object:', db);
    
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Firebase connection test',
      timestamp: Timestamp.now(),
      testId: Math.random().toString(36).substr(2, 9)
    });
    
    console.log('Firebase test successful! Document ID:', testDoc.id);
    return true;
  } catch (error) {
    console.error('Firebase test failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return false;
  }
};
