'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Newspaper, Megaphone, TrendingUp, Eye } from 'lucide-react';
import { getArticles } from '@/lib/articles';
import { getAds } from '@/lib/ads';
import { Article } from '@/lib/articles';
import { Ad } from '@/lib/ads';
import { Timestamp } from 'firebase/firestore';

interface Activity {
  id: string;
  type: 'news' | 'ad';
  title: string;
  time: string;
  status: string;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [articlesData, adsData] = await Promise.all([
        getArticles(),
        getAds(),
      ]);
      setArticles(articlesData);
      setAds(adsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Timestamp | string | undefined): string => {
    if (!date) return 'Unknown';
    
    let dateObj: Date;
    if (date instanceof Timestamp) {
      dateObj = date.toDate();
    } else {
      dateObj = new Date(date);
    }

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return dateObj.toLocaleDateString();
  };

  // Calculate stats
  const totalArticles = articles.length;
  const publishedArticles = articles.filter(a => a.status === 'published').length;
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalLikes = articles.reduce((sum, a) => sum + (a.likes || 0), 0);
  const totalDislikes = articles.reduce((sum, a) => sum + (a.dislikes || 0), 0);
  const engagementRate = totalViews > 0 
    ? (((totalLikes + totalDislikes) / totalViews) * 100).toFixed(1)
    : '0';

  const activeAds = ads.filter(a => a.status === 'published').length;

  const stats = [
    {
      title: 'Total News Articles',
      value: totalArticles.toLocaleString(),
      change: `${publishedArticles} published`,
      changeType: 'positive' as const,
      icon: Newspaper,
    },
    {
      title: 'Active Ads',
      value: activeAds.toString(),
      change: `${ads.length} total`,
      changeType: 'positive' as const,
      icon: Megaphone,
    },
    {
      title: 'Total Views',
      value: totalViews.toLocaleString(),
      change: `${totalLikes} likes`,
      changeType: 'positive' as const,
      icon: Eye,
    },
    {
      title: 'Engagement Rate',
      value: `${engagementRate}%`,
      change: `${totalLikes} likes, ${totalDislikes} dislikes`,
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
  ];

  // Get recent activities from articles and ads
  const recentActivities: Activity[] = [
    ...articles
      .filter(a => a.status === 'published')
      .sort((a, b) => {
        const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return bDate - aDate;
      })
      .slice(0, 3)
      .map(article => ({
        id: article.id || '',
        type: 'news' as const,
        title: `New article published: "${article.title}"`,
        time: formatTimeAgo(article.publishedAt),
        status: article.status || 'published',
      })),
    ...ads
      .filter(a => a.status === 'published')
      .sort((a, b) => {
        const aDate = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 
                     a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 
                     b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      })
      .slice(0, 2)
      .map(ad => ({
        id: ad.id || '',
        type: 'ad' as const,
        title: `Ad campaign "${ad.title}" launched`,
        time: formatTimeAgo(ad.createdAt),
        status: ad.status || 'published',
      })),
  ]
    .slice(0, 5);

  // Calculate top categories from article tags
  const categoryCounts: Record<string, number> = {};
  articles.forEach(article => {
    if (article.tags && article.tags.length > 0) {
      article.tags.forEach(tag => {
        categoryCounts[tag] = (categoryCounts[tag] || 0) + 1;
      });
    }
  });

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      value: totalArticles > 0 ? Math.round((count / totalArticles) * 100) : 0,
    }));

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout title="Dashboard">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout title="Dashboard">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = [
                { bg: 'from-blue-500 to-cyan-500', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
                { bg: 'from-purple-500 to-pink-500', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
                { bg: 'from-cyan-500 to-teal-500', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600' },
                { bg: 'from-emerald-500 to-green-500', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
              ];
              const colorScheme = colors[index % colors.length];
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-4 ${colorScheme.iconBg} rounded-xl`}>
                      <Icon className={`w-7 h-7 ${colorScheme.iconColor}`} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>


          {/* Recent Activity and Top Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => {
                    const colorMap: Record<string, string> = {
                      'news': 'bg-blue-500',
                      'ad': 'bg-emerald-500',
                    };
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-2 ${colorMap[activity.type] || 'bg-slate-400'} shadow-sm`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                          <p className="text-sm text-slate-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500">No recent activity</p>
                )}
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Categories</h3>
              <div className="space-y-4">
                {topCategories.length > 0 ? (
                  topCategories.map((category, index) => {
                    const gradients = [
                      'from-blue-500 to-cyan-500',
                      'from-purple-500 to-pink-500',
                      'from-emerald-500 to-teal-500',
                      'from-amber-500 to-orange-500',
                      'from-indigo-500 to-purple-500'
                    ];
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-800">{category.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-slate-100 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${gradients[index % gradients.length]} h-2 rounded-full transition-all`} 
                              style={{ width: `${category.value}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-slate-600 w-8 text-right font-medium">{category.value}%</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500">No categories available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}