import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Ad {
  id?: string;
  title: string;
  imageUrl: string;
  redirectLink: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  status?: 'draft' | 'published' | 'archived' | 'removed' | 'scheduled';
  scheduledAt?: Timestamp;
  views?: number;
  impressions?: number; // Alias for views, used in UI
  clicks?: number;
}

// Add a new ad to Firestore
export const addAd = async (adData: Omit<Ad, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    console.log('Starting to add ad to Firebase...');
    console.log('Ad data:', adData);
    
    // Determine status based on scheduledAt
    const isScheduled = adData.scheduledAt && adData.scheduledAt.toMillis() > Date.now();
    const status = isScheduled ? 'scheduled' : 'published';
    
    const docRef = await addDoc(collection(db, 'ads'), {
      ...adData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: status,
      views: 0,
      clicks: 0,
    });
    
    console.log('Ad successfully added to Firebase with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding ad to Firebase:', error);
    throw error;
  }
};

// Publish scheduled ads
export const publishScheduledAds = async (): Promise<number> => {
  try {
    const now = Timestamp.now();
    const q = query(
      collection(db, 'ads'),
      where('status', '==', 'scheduled'),
      where('scheduledAt', '<=', now)
    );
    
    const querySnapshot = await getDocs(q);
    let publishedCount = 0;
    
    for (const docSnapshot of querySnapshot.docs) {
      const adRef = doc(db, 'ads', docSnapshot.id);
      await updateDoc(adRef, {
        status: 'published',
        updatedAt: Timestamp.now(),
      });
      publishedCount++;
    }
    
    return publishedCount;
  } catch (error) {
    console.error('Error publishing scheduled ads:', error);
    throw error;
  }
};

// Get all ads
export const getAds = async (): Promise<Ad[]> => {
  try {
    const q = query(collection(db, 'ads'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Ad[];
  } catch (error) {
    console.error('Error getting ads:', error);
    throw error;
  }
};

// Update an ad
export const updateAd = async (id: string, adData: Partial<Ad>): Promise<void> => {
  try {
    const adRef = doc(db, 'ads', id);
    await updateDoc(adRef, {
      ...adData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating ad:', error);
    throw error;
  }
};

// Delete an ad
export const deleteAd = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'ads', id));
  } catch (error) {
    console.error('Error deleting ad:', error);
    throw error;
  }
};

