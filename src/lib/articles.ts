import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// API Key for Article One API
const ARTICLE_ONE_API_KEY = '30f10zj6hcrjizc04w3j3b8j5mgg11ks3kq0r50wqd580024';
const ARTICLE_ONE_API_BASE_URL = 'https://api.articleone.com'; // Update with actual API base URL

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
  imageUrl?: string; // Optional - either image or video is required
  youtubeVideoUrl?: string; // Optional YouTube video URL
  readTime?: number; // Optional
  tags: string[];
  publishedAt: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  status?: 'draft' | 'published' | 'archived' | 'removed' | 'scheduled';
  scheduledAt?: Timestamp;
  views?: number;
  likes?: number;
  dislikes?: number;
  bookmarkCount?: number;
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
    const articleRef = doc(db, 'articles', id);
    const articleDoc = await getDoc(articleRef);
    if (!articleDoc.exists()) {
      return null;
    }
    return {
      id: articleDoc.id,
      ...articleDoc.data()
    } as Article;
  } catch (error) {
    console.error('Error getting article by ID:', error);
    throw error;
  }
};

// Fetch articles from Article One API
export interface ArticleOneResponse {
  articles?: Array<{
    id?: string;
    title?: string;
    description?: string;
    content?: string;
    author?: string;
    source?: string;
    url?: string;
    urlToImage?: string;
    publishedAt?: string;
    category?: string;
    tags?: string[];
  }>;
  data?: Array<{
    id?: string;
    title?: string;
    description?: string;
    content?: string;
    author?: string;
    source?: string;
    url?: string;
    urlToImage?: string;
    publishedAt?: string;
    category?: string;
    tags?: string[];
  }>;
  results?: Array<{
    id?: string;
    title?: string;
    description?: string;
    content?: string;
    author?: string;
    source?: string;
    url?: string;
    urlToImage?: string;
    publishedAt?: string;
    category?: string;
    tags?: string[];
  }>;
}

// Transform API response to Article format
const transformApiArticle = (apiArticle: {
  title?: string;
  description?: string;
  summary?: string;
  content?: string;
  author?: string;
  journalistName?: string;
  category?: string;
  region?: string;
  regions?: string[];
  source?: string;
  url?: string;
  urlToImage?: string;
  imageUrl?: string;
  publishedAt?: string;
  tags?: string[];
}, index: number): Omit<Article, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    title: apiArticle.title || `Article ${index + 1}`,
    summary: apiArticle.description || apiArticle.summary || '',
    content: apiArticle.content || apiArticle.description || '',
    journalistName: apiArticle.author || apiArticle.journalistName || 'API Source',
    category: apiArticle.category,
    region: apiArticle.region,
    regions: apiArticle.regions || (apiArticle.region ? [apiArticle.region] : []),
    source: apiArticle.source || apiArticle.url || 'Article One API',
    imageUrl: apiArticle.urlToImage || apiArticle.imageUrl,
    tags: apiArticle.tags?.filter((tag): tag is string => Boolean(tag)) || (apiArticle.category ? [apiArticle.category] : []),
    publishedAt: apiArticle.publishedAt || new Date().toISOString(),
    status: 'published',
    views: 0,
    likes: 0,
  };
};

// Fetch articles from Article One API
export const fetchArticlesFromAPI = async (params?: {
  query?: string;
  category?: string;
  limit?: number;
  page?: number;
}): Promise<Article[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.query) {
      queryParams.append('q', params.query);
    }
    if (params?.category) {
      queryParams.append('category', params.category);
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    
    // Add API key to headers or query params (adjust based on API requirements)
    const url = `${ARTICLE_ONE_API_BASE_URL}/articles?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ARTICLE_ONE_API_KEY}`,
        'X-API-Key': ARTICLE_ONE_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data: ArticleOneResponse = await response.json();
    
    // Handle different possible response structures
    const articles = data.articles || data.data || data.results || [];
    
    // Transform API articles to our Article format
    return articles.map((article, index) => transformApiArticle(article, index)) as Article[];
  } catch (error) {
    console.error('Error fetching articles from API:', error);
    throw error;
  }
};

// Import articles from API and save to Firestore
export const importArticlesFromAPI = async (params?: {
  query?: string;
  category?: string;
  limit?: number;
}): Promise<{ imported: number; failed: number }> => {
  try {
    const apiArticles = await fetchArticlesFromAPI(params);
    let imported = 0;
    let failed = 0;

    for (const articleData of apiArticles) {
      try {
        await addArticle(articleData);
        imported++;
      } catch (error) {
        console.error('Error importing article:', error);
        failed++;
      }
    }

    return { imported, failed };
  } catch (error) {
    console.error('Error importing articles from API:', error);
    throw error;
  }
};
