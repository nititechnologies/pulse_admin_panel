'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { getArticleById, Article } from '@/lib/articles';
import { ArrowLeft, Eye, Calendar, User, Tag, Globe, Heart, ThumbsDown, Bookmark } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';

export default function NewsDetailPage() {
  const params = useParams();
  const articleId = params.id as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const articleData = await getArticleById(articleId);
      if (articleData) {
        setArticle(articleData);
      } else {
        setError('Article not found');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Failed to load article');
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

  if (loading) {
    return (
      <Layout title="Article Details">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout title="Article Not Found">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-800">{error || 'Article not found'}</p>
            <Link href="/news/manage" className="mt-4 inline-block text-blue-600 hover:underline">
              ← Back to Manage News
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={article.title}>
      <div className="max-w-7xl mx-auto pb-8 px-4 sm:px-6">
        {/* Back Button */}
        <Link 
          href="/news/manage"
          className="inline-flex items-center text-sm text-slate-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Manage News
        </Link>

        {/* Article Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-6 sm:p-8 shadow-lg text-white relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-40"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                  {article.title}
                </h1>
                {article.summary && (
                  <p className="text-blue-100 text-base sm:text-lg leading-relaxed mb-4">
                    {article.summary}
                  </p>
                )}
              </div>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
              {article.journalistName && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>{article.journalistName}</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(article.publishedAt as Timestamp | string)}</span>
              </div>
              {(article.regions && article.regions.length > 0) && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  <span>{article.regions.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Image or Video */}
            {article.imageUrl && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="w-full h-64 sm:h-96 bg-slate-200 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {article.youtubeVideoUrl && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden p-4">
                <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
                  <iframe
                    src={(() => {
                      let videoId = '';
                      const url = article.youtubeVideoUrl;
                      // Handle different YouTube URL formats
                      if (url.includes('youtu.be/')) {
                        videoId = url.split('youtu.be/')[1].split('?')[0];
                      } else if (url.includes('watch?v=')) {
                        videoId = url.split('watch?v=')[1].split('&')[0];
                      } else if (url.includes('embed/')) {
                        videoId = url.split('embed/')[1].split('?')[0];
                      }
                      return `https://www.youtube.com/embed/${videoId}`;
                    })()}
                    title="YouTube video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Article Content */}
            {article.content && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600 prose-strong:text-slate-900 prose-img:rounded-xl"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metrics Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-slate-700">
                    <Eye className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Views</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {(article.views || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center text-slate-700">
                    <Heart className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm font-medium">Likes</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {(article.likes || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center text-slate-700">
                    <ThumbsDown className="w-4 h-4 mr-2 text-red-600" />
                    <span className="text-sm font-medium">Dislikes</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">
                    {(article.dislikes || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center text-slate-700">
                    <Bookmark className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="text-sm font-medium">Bookmarks</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {(article.bookmarkCount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags & Regions */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-blue-600" />
                Categories
              </h3>
              {article.tags && article.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium border border-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No categories</p>
              )}

              {article.regions && article.regions.length > 0 && (
                <>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 mt-6 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-green-600" />
                    Regions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.regions.map((region, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium border border-green-200"
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Article Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Article Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                    article.status === 'published' ? 'bg-green-100 text-green-800' :
                    article.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {article.status || 'published'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Created:</span>
                  <span className="ml-2 text-slate-700">{formatDate(article.createdAt)}</span>
                </div>
                {article.updatedAt && (
                  <div>
                    <span className="text-slate-500 font-medium">Updated:</span>
                    <span className="ml-2 text-slate-700">{formatDate(article.updatedAt)}</span>
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

