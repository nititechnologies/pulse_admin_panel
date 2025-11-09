'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { getAdById, Ad } from '@/lib/ads';
import { ArrowLeft, Eye, MousePointerClick, BarChart3, TrendingUp, ExternalLink, Megaphone } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';

export default function AdDetailPage() {
  const params = useParams();
  const adId = params.id as string;
  
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (adId) {
      fetchAd();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adId]);

  const fetchAd = async () => {
    try {
      setLoading(true);
      const adData = await getAdById(adId);
      if (adData) {
        setAd(adData);
      } else {
        setError('Ad not found');
      }
    } catch (error) {
      console.error('Error fetching ad:', error);
      setError('Failed to load ad');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Timestamp | string | undefined): string => {
    if (!date) return 'N/A';
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateCTR = (impressions: number = 0, clicks: number = 0): number => {
    if (impressions === 0) return 0;
    return Number(((clicks / impressions) * 100).toFixed(2));
  };

  if (loading) {
    return (
      <Layout title="Ad Details">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (error || !ad) {
    return (
      <Layout title="Ad Not Found">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-800">{error || 'Ad not found'}</p>
            <Link href="/ads/manage" className="mt-4 inline-block text-blue-600 hover:underline">
              ← Back to Manage Ads
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const views = ad.views || ad.impressions || 0;
  const clicks = ad.clicks || 0;
  const ctr = calculateCTR(views, clicks);

  return (
    <Layout title={ad.title}>
      <div className="max-w-7xl mx-auto pb-8 px-4 sm:px-6">
        {/* Back Button */}
        <Link 
          href="/ads/manage"
          className="inline-flex items-center text-sm text-slate-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Manage Ads
        </Link>

        {/* Ad Header */}
        <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 rounded-xl p-6 sm:p-8 shadow-lg text-white relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-40"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <Megaphone className="w-6 h-6 mr-3" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {ad.title}
                  </h1>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    ad.status === 'published' ? 'bg-green-500/20 text-green-100 border border-green-300/30' :
                    ad.status === 'scheduled' ? 'bg-blue-500/20 text-blue-100 border border-blue-300/30' :
                    'bg-slate-500/20 text-slate-100 border border-slate-300/30'
                  }`}>
                    {ad.status || 'draft'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ad Image */}
            {ad.imageUrl && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="w-full h-64 sm:h-96 bg-slate-200 overflow-hidden">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Ad+Image';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Redirect Link */}
            {ad.redirectLink && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
                  Redirect Link
                </h3>
                <a 
                  href={ad.redirectLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-700 hover:underline break-all flex items-center"
                >
                  <span>{ad.redirectLink}</span>
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metrics Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-center text-slate-700">
                    <Eye className="w-5 h-5 mr-3 text-purple-600" />
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Views</div>
                      <div className="text-2xl font-bold text-purple-600 mt-1">
                        {views.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center text-slate-700">
                    <MousePointerClick className="w-5 h-5 mr-3 text-green-600" />
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Clicks</div>
                      <div className="text-2xl font-bold text-green-600 mt-1">
                        {clicks.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="flex items-center text-slate-700">
                    <TrendingUp className="w-5 h-5 mr-3 text-orange-600" />
                    <div>
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">CTR</div>
                      <div className="text-2xl font-bold text-orange-600 mt-1">
                        {ctr}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ad Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Ad Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                    ad.status === 'published' ? 'bg-green-100 text-green-800' :
                    ad.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {ad.status || 'draft'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Created:</span>
                  <span className="ml-2 text-slate-700">{formatDate(ad.createdAt)}</span>
                </div>
                {ad.updatedAt && (
                  <div>
                    <span className="text-slate-500 font-medium">Updated:</span>
                    <span className="ml-2 text-slate-700">{formatDate(ad.updatedAt)}</span>
                  </div>
                )}
                {ad.scheduledAt && (
                  <div>
                    <span className="text-slate-500 font-medium">Scheduled For:</span>
                    <span className="ml-2 text-slate-700">{formatDate(ad.scheduledAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

