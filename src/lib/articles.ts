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

export interface Article {
  id?: string;
  title: string;
  summary: string;
  content: string;
  journalistName: string;
  category?: string; // Optional, kept for backward compatibility
  region?: string; // Optional, kept for backward compatibility
  regions?: string[]; // New field for multiple regions
  source?: string; // Optional
  imageUrl: string;
  readTime?: number; // Optional
  tags: string[];
  publishedAt: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  status?: 'draft' | 'published' | 'archived' | 'removed' | 'scheduled';
  scheduledAt?: Timestamp;
  views?: number;
  likes?: number;
}

// Add a new article to Firestore
export const addArticle = async (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    console.log('Starting to add article to Firebase...');
    console.log('Article data:', articleData);
    console.log('Firebase db object:', db);
    
    // Determine status based on scheduledAt
    // If scheduledAt exists and is in the future, set status to 'scheduled'
    // Otherwise, set to 'published'
    const isScheduled = articleData.scheduledAt && articleData.scheduledAt.toMillis() > Date.now();
    const status = isScheduled ? 'scheduled' : 'published';
    
    console.log(`Article will be created with status: ${status}, isScheduled: ${isScheduled}`);
    if (articleData.scheduledAt) {
      console.log(`ScheduledAt timestamp: ${articleData.scheduledAt.toMillis()}, Current time: ${Date.now()}`);
    }
    
    const docRef = await addDoc(collection(db, 'articles'), {
      ...articleData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: status, // Ensure status is set correctly
      views: 0,
      likes: 0,
    });
    
    console.log(`Article successfully added to Firebase with ID: ${docRef.id}, status: ${status}`);
    return docRef.id;
  } catch (error) {
    console.error('Error adding article to Firebase:', error);
    const errorObj = error as { code?: string; message: string; stack?: string };
    console.error('Error details:', {
      code: errorObj.code,
      message: errorObj.message,
      stack: errorObj.stack
    });
    throw error;
  }
};

// Publish scheduled articles
export const publishScheduledArticles = async (): Promise<number> => {
  try {
    const now = Timestamp.now();
    const q = query(
      collection(db, 'articles'),
      where('status', '==', 'scheduled'),
      where('scheduledAt', '<=', now)
    );
    
    const querySnapshot = await getDocs(q);
    let publishedCount = 0;
    
    for (const docSnapshot of querySnapshot.docs) {
      const articleRef = doc(db, 'articles', docSnapshot.id);
      await updateDoc(articleRef, {
        status: 'published',
        publishedAt: now.toDate().toISOString(),
        updatedAt: Timestamp.now(),
      });
      publishedCount++;
    }
    
    return publishedCount;
  } catch (error) {
    console.error('Error publishing scheduled articles:', error);
    throw error;
  }
};

// Get all articles
export const getArticles = async (): Promise<Article[]> => {
  try {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Article[];
  } catch (error) {
    console.error('Error getting articles:', error);
    throw error;
  }
};

// Get articles by category
export const getArticlesByCategory = async (category: string): Promise<Article[]> => {
  try {
    const q = query(
      collection(db, 'articles'), 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Article[];
  } catch (error) {
    console.error('Error getting articles by category:', error);
    throw error;
  }
};

// Update an article
export const updateArticle = async (id: string, articleData: Partial<Article>): Promise<void> => {
  try {
    const articleRef = doc(db, 'articles', id);
    await updateDoc(articleRef, {
      ...articleData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

// Delete an article
export const deleteArticle = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'articles', id));
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};

// Get article by ID
export const getArticleById = async (id: string): Promise<Article | null> => {
  try {
    const q = query(collection(db, 'articles'), where('__name__', '==', id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Article;
  } catch (error) {
    console.error('Error getting article by ID:', error);
    throw error;
  }
};
