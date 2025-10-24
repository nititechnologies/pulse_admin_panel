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
  category: string;
  region: string;
  source: string;
  imageUrl: string;
  readTime: number;
  tags: string[];
  publishedAt: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  status?: 'draft' | 'published' | 'archived' | 'removed';
  views?: number;
  likes?: number;
}

// Add a new article to Firestore
export const addArticle = async (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    console.log('Starting to add article to Firebase...');
    console.log('Article data:', articleData);
    console.log('Firebase db object:', db);
    
    const docRef = await addDoc(collection(db, 'articles'), {
      ...articleData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'published',
      views: 0,
      likes: 0,
    });
    
    console.log('Article successfully added to Firebase with ID:', docRef.id);
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
