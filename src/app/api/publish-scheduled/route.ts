import { NextRequest, NextResponse } from 'next/server';
import { publishScheduledArticles } from '@/lib/articles';
import { publishScheduledAds } from '@/lib/ads';

// Verify cron secret for security (optional but recommended)
function verifyCronSecret(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // If CRON_SECRET is not set, allow all requests (for development)
  if (!cronSecret) {
    return true;
  }
  
  // Verify the authorization header matches the cron secret
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  // Verify cron secret if provided
  if (!verifyCronSecret(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    console.log('[CRON] Starting scheduled content publication check...');
    const startTime = Date.now();
    
    const [articlesCount, adsCount] = await Promise.all([
      publishScheduledArticles(),
      publishScheduledAds()
    ]);
    
    const totalPublished = articlesCount + adsCount;
    const duration = Date.now() - startTime;
    
    console.log(`[CRON] Published ${articlesCount} article(s) and ${adsCount} ad(s) in ${duration}ms`);
    
    return NextResponse.json({ 
      success: true, 
      articlesCount,
      adsCount,
      totalPublished,
      duration,
      message: `Published ${articlesCount} scheduled article(s) and ${adsCount} scheduled ad(s)` 
    });
  } catch (error) {
    console.error('[CRON] Error publishing scheduled content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish scheduled content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Verify cron secret if provided
  if (!verifyCronSecret(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    console.log('[CRON] Starting scheduled content publication check...');
    const startTime = Date.now();
    
    const [articlesCount, adsCount] = await Promise.all([
      publishScheduledArticles(),
      publishScheduledAds()
    ]);
    
    const totalPublished = articlesCount + adsCount;
    const duration = Date.now() - startTime;
    
    console.log(`[CRON] Published ${articlesCount} article(s) and ${adsCount} ad(s) in ${duration}ms`);
    
    return NextResponse.json({ 
      success: true, 
      articlesCount,
      adsCount,
      totalPublished,
      duration,
      message: `Published ${articlesCount} scheduled article(s) and ${adsCount} scheduled ad(s)` 
    });
  } catch (error) {
    console.error('[CRON] Error publishing scheduled content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish scheduled content' },
      { status: 500 }
    );
  }
}

