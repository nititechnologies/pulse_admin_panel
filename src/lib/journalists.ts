import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Journalist {
  id?: string;
  uid: string; // Firebase Auth UID
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastActive?: Timestamp;
  profileImage?: string;
  bio?: string;
  specialization?: string;
}

// Add a new journalist to Firestore
export const addJournalist = async (journalistData: Omit<Journalist, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'journalists'), {
      ...journalistData,
      status: 'inactive', // New journalists start as inactive
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding journalist:', error);
    throw error;
  }
};

// Get all journalists
export const getJournalists = async (): Promise<Journalist[]> => {
  try {
    const q = query(collection(db, 'journalists'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Journalist[];
  } catch (error) {
    console.error('Error getting journalists:', error);
    throw error;
  }
};

// Get journalist by ID
export const getJournalistById = async (id: string): Promise<Journalist | null> => {
  try {
    const journalistRef = doc(db, 'journalists', id);
    const journalistDoc = await getDoc(journalistRef);
    if (!journalistDoc.exists()) {
      return null;
    }
    return {
      id: journalistDoc.id,
      ...journalistDoc.data()
    } as Journalist;
  } catch (error) {
    console.error('Error getting journalist by ID:', error);
    throw error;
  }
};

// Get journalist by UID
export const getJournalistByUid = async (uid: string): Promise<Journalist | null> => {
  try {
    const q = query(collection(db, 'journalists'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Journalist;
  } catch (error) {
    console.error('Error getting journalist by UID:', error);
    throw error;
  }
};

// Update journalist status
export const updateJournalistStatus = async (id: string, status: 'active' | 'inactive'): Promise<void> => {
  try {
    const journalistRef = doc(db, 'journalists', id);
    await updateDoc(journalistRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating journalist status:', error);
    throw error;
  }
};

// Update journalist
export const updateJournalist = async (id: string, journalistData: Partial<Journalist>): Promise<void> => {
  try {
    const journalistRef = doc(db, 'journalists', id);
    await updateDoc(journalistRef, {
      ...journalistData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating journalist:', error);
    throw error;
  }
};

