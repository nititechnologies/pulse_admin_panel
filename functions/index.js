/**
 * Firebase Cloud Functions for scheduled content publishing
 * 
 * To deploy:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Login: firebase login
 * 3. Initialize: firebase init functions
 * 4. Deploy: firebase deploy --only functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Cloud Function that runs every minute to publish scheduled content
 * This is an alternative to Vercel Cron Jobs
 */
exports.publishScheduledContent = functions.pubsub
  .schedule('every 1 minutes')
  .timeZone('UTC')
  .onRun(async (context) => {
    console.log('[FIREBASE FUNCTION] Starting scheduled content publication check...');
    console.log('[FIREBASE FUNCTION] Current time:', new Date().toISOString());
    const startTime = Date.now();
    
    try {
      const now = admin.firestore.Timestamp.now();
      console.log('[FIREBASE FUNCTION] Timestamp now:', now.toDate().toISOString());
      
      let articlesCount = 0;
      let adsCount = 0;
      
      // Publish scheduled articles
      // First, find all articles with scheduledAt in the past, regardless of status
      // This handles cases where status might not be set correctly
      console.log('[FIREBASE FUNCTION] Checking for scheduled articles...');
      const allArticlesQuery = db.collection('articles')
        .where('scheduledAt', '<=', now);
      
      const allArticlesSnapshot = await allArticlesQuery.get();
      console.log(`[FIREBASE FUNCTION] Found ${allArticlesSnapshot.docs.length} article(s) with scheduledAt in the past`);
      
      // Filter for articles that should be published
      // - status is 'scheduled', OR
      // - has scheduledAt but status is not 'published' yet
      const articlesToPublish = allArticlesSnapshot.docs.filter(doc => {
        const data = doc.data();
        const status = (data.status || '').trim().toLowerCase(); // Trim and normalize
        const hasScheduledAt = !!data.scheduledAt;
        const isScheduled = status === 'scheduled';
        const isNotPublished = status !== 'published';
        
        // Publish if: has scheduledAt AND (status is scheduled OR status is not published)
        return hasScheduledAt && (isScheduled || isNotPublished);
      });
      
      console.log(`[FIREBASE FUNCTION] Found ${articlesToPublish.length} scheduled article(s) to publish`);
      
      const articlePromises = articlesToPublish.map(async (doc) => {
        const data = doc.data();
        console.log(`[FIREBASE FUNCTION] Processing article ${doc.id}: scheduledAt=${data.scheduledAt?.toDate().toISOString()}, currentStatus=${data.status}`);
        await doc.ref.update({
          status: 'published',
          publishedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        articlesCount++;
        console.log(`[FIREBASE FUNCTION] ✅ Published article: ${doc.id}`);
      });
      
      await Promise.all(articlePromises);
      
      // Publish scheduled ads
      // First, find all ads with scheduledAt in the past, regardless of status
      console.log('[FIREBASE FUNCTION] Checking for scheduled ads...');
      const allAdsQuery = db.collection('ads')
        .where('scheduledAt', '<=', now);
      
      const allAdsSnapshot = await allAdsQuery.get();
      console.log(`[FIREBASE FUNCTION] Found ${allAdsSnapshot.docs.length} ad(s) with scheduledAt in the past`);
      
      // Filter for ads that should be published
      // - status is 'scheduled' (even with whitespace), OR
      // - has scheduledAt but status is not 'published' yet
      const adsToPublish = allAdsSnapshot.docs.filter(doc => {
        const data = doc.data();
        const status = (data.status || '').trim().toLowerCase(); // Trim and normalize
        const hasScheduledAt = !!data.scheduledAt;
        const isScheduled = status === 'scheduled' || status.includes('scheduled');
        const isNotPublished = status !== 'published';
        
        // Publish if: has scheduledAt AND (status is scheduled OR status is not published)
        return hasScheduledAt && (isScheduled || isNotPublished);
      });
      
      console.log(`[FIREBASE FUNCTION] Found ${adsToPublish.length} scheduled ad(s) to publish`);
      
      const adPromises = adsToPublish.map(async (doc) => {
        const data = doc.data();
        console.log(`[FIREBASE FUNCTION] Processing ad ${doc.id}: scheduledAt=${data.scheduledAt?.toDate().toISOString()}, currentStatus=${data.status}`);
        await doc.ref.update({
          status: 'published',
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        adsCount++;
        console.log(`[FIREBASE FUNCTION] ✅ Published ad: ${doc.id}`);
      });
      
      await Promise.all(adPromises);
      
      const duration = Date.now() - startTime;
      console.log(`[FIREBASE FUNCTION] ✅ Published ${articlesCount} article(s) and ${adsCount} ad(s) in ${duration}ms`);
      
      return {
        success: true,
        articlesCount,
        adsCount,
        totalPublished: articlesCount + adsCount,
        duration,
      };
    } catch (error) {
      console.error('[FIREBASE FUNCTION] ❌ Error publishing scheduled content:', error);
      console.error('[FIREBASE FUNCTION] Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      throw error;
    }
  });

/**
 * Diagnostic function to check what scheduled content exists
 */
exports.checkScheduledContent = functions.https.onRequest(async (req, res) => {
  console.log('[DIAGNOSTIC] Checking scheduled content...');
  const now = admin.firestore.Timestamp.now();
  
  try {
    // Check all ads
    const allAdsSnapshot = await db.collection('ads').get();
    const allAds = allAdsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Check scheduled ads
    const scheduledAdsQuery = db.collection('ads')
      .where('status', '==', 'scheduled');
    const scheduledAdsSnapshot = await scheduledAdsQuery.get();
    const scheduledAds = scheduledAdsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Check all articles
    const allArticlesSnapshot = await db.collection('articles').get();
    const allArticles = allArticlesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Check scheduled articles
    const scheduledArticlesQuery = db.collection('articles')
      .where('status', '==', 'scheduled');
    const scheduledArticlesSnapshot = await scheduledArticlesQuery.get();
    const scheduledArticles = scheduledArticlesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    res.json({
      currentTime: now.toDate().toISOString(),
      currentTimestamp: now.toMillis(),
      stats: {
        totalAds: allAds.length,
        scheduledAds: scheduledAds.length,
        totalArticles: allArticles.length,
        scheduledArticles: scheduledArticles.length,
      },
      allAds: allAds.map(ad => ({
        id: ad.id,
        title: ad.title,
        status: ad.status,
        scheduledAt: ad.scheduledAt ? {
          timestamp: ad.scheduledAt.toMillis(),
          date: ad.scheduledAt.toDate().toISOString(),
          isPast: ad.scheduledAt.toMillis() <= now.toMillis(),
        } : null,
        hasScheduledAt: !!ad.scheduledAt,
      })),
      scheduledAds: scheduledAds.map(ad => ({
        id: ad.id,
        title: ad.title,
        status: ad.status,
        scheduledAt: ad.scheduledAt ? {
          timestamp: ad.scheduledAt.toMillis(),
          date: ad.scheduledAt.toDate().toISOString(),
          isPast: ad.scheduledAt.toMillis() <= now.toMillis(),
        } : null,
      })),
      allArticles: allArticles.map(article => ({
        id: article.id,
        title: article.title,
        status: article.status,
        scheduledAt: article.scheduledAt ? {
          timestamp: article.scheduledAt.toMillis(),
          date: article.scheduledAt.toDate().toISOString(),
          isPast: article.scheduledAt.toMillis() <= now.toMillis(),
        } : null,
        hasScheduledAt: !!article.scheduledAt,
      })),
      scheduledArticles: scheduledArticles.map(article => ({
        id: article.id,
        title: article.title,
        status: article.status,
        scheduledAt: article.scheduledAt ? {
          timestamp: article.scheduledAt.toMillis(),
          date: article.scheduledAt.toDate().toISOString(),
          isPast: article.scheduledAt.toMillis() <= now.toMillis(),
        } : null,
      })),
    });
  } catch (error) {
    console.error('[DIAGNOSTIC] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * HTTP-triggered function as backup (can be called manually or by external cron)
 */
exports.publishScheduledContentHTTP = functions.https.onRequest(async (req, res) => {
  // Optional: Add authentication
  // const authHeader = req.headers.authorization;
  // if (authHeader !== `Bearer ${functions.config().cron.secret}`) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }
  
  console.log('[FIREBASE FUNCTION HTTP] Starting scheduled content publication check...');
  const startTime = Date.now();
  
  try {
    const now = admin.firestore.Timestamp.now();
    let articlesCount = 0;
    let adsCount = 0;
    
    // Publish scheduled articles
    const articlesQuery = db.collection('articles')
      .where('status', '==', 'scheduled')
      .where('scheduledAt', '<=', now);
    
    const articlesSnapshot = await articlesQuery.get();
    
    const articlePromises = articlesSnapshot.docs.map(async (doc) => {
      await doc.ref.update({
        status: 'published',
        publishedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      articlesCount++;
    });
    
    await Promise.all(articlePromises);
    
    // Publish scheduled ads
    const adsQuery = db.collection('ads')
      .where('status', '==', 'scheduled')
      .where('scheduledAt', '<=', now);
    
    const adsSnapshot = await adsQuery.get();
    
    const adPromises = adsSnapshot.docs.map(async (doc) => {
      await doc.ref.update({
        status: 'published',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      adsCount++;
    });
    
    await Promise.all(adPromises);
    
    const duration = Date.now() - startTime;
    const result = {
      success: true,
      articlesCount,
      adsCount,
      totalPublished: articlesCount + adsCount,
      duration,
      message: `Published ${articlesCount} scheduled article(s) and ${adsCount} scheduled ad(s)`,
    };
    
    console.log(`[FIREBASE FUNCTION HTTP] ${result.message} in ${duration}ms`);
    res.json(result);
  } catch (error) {
    console.error('[FIREBASE FUNCTION HTTP] Error publishing scheduled content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish scheduled content',
    });
  }
});

