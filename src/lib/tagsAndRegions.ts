import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Tag {
  id?: string;
  name: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Region {
  id?: string;
  name: string;
  priority?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Tags Functions
export const getTags = async (): Promise<Tag[]> => {
  try {
    const q = query(collection(db, 'tags'), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Tag[];
  } catch (error) {
    console.error('Error getting tags:', error);
    throw error;
  }
};

export const addTag = async (name: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'tags'), {
      name: name.trim(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding tag:', error);
    throw error;
  }
};

export const updateTag = async (id: string, name: string): Promise<void> => {
  try {
    const tagRef = doc(db, 'tags', id);
    await updateDoc(tagRef, {
      name: name.trim(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating tag:', error);
    throw error;
  }
};

export const deleteTag = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'tags', id));
  } catch (error) {
    console.error('Error deleting tag:', error);
    throw error;
  }
};

// Regions Functions
export const getRegions = async (): Promise<Region[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'regions'));
    const regions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Region[];
    
    // Sort by priority (ascending, lower priority first), then by name
    return regions.sort((a, b) => {
      const priorityA = a.priority ?? 0;
      const priorityB = b.priority ?? 0;
      if (priorityA !== priorityB) {
        return priorityA - priorityB; // Lower priority first (0, 1, 2, ...)
      }
      return (a.name || '').localeCompare(b.name || '');
    });
  } catch (error) {
    console.error('Error getting regions:', error);
    throw error;
  }
};

export const addRegion = async (name: string, priority: number = 0): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'regions'), {
      name: name.trim(),
      priority: priority,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding region:', error);
    throw error;
  }
};

export const updateRegion = async (id: string, name: string, priority?: number): Promise<void> => {
  try {
    const regionRef = doc(db, 'regions', id);
    const updateData: { name: string; updatedAt: Timestamp; priority?: number } = {
      name: name.trim(),
      updatedAt: Timestamp.now(),
    };
    if (priority !== undefined) {
      updateData.priority = priority;
    }
    await updateDoc(regionRef, updateData);
  } catch (error) {
    console.error('Error updating region:', error);
    throw error;
  }
};

export const deleteRegion = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'regions', id));
  } catch (error) {
    console.error('Error deleting region:', error);
    throw error;
  }
};

