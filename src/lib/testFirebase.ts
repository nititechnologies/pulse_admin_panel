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
    const errorObj = error as { code?: string; message: string; stack?: string };
    console.error('Error details:', {
      code: errorObj.code,
      message: errorObj.message,
      stack: errorObj.stack
    });
    return false;
  }
};
