'use client';

import Layout from '@/components/Layout';
import { BarChart3, TrendingUp, Eye, Users, Calendar } from 'lucide-react';

export default function NewsAnalyticsPage() {
  const analyticsData = {
    totalViews: 45678,
    totalArticles: 1234,
    avgViewsPerArticle: 37,
    topPerformingArticle: 'Tech Trends 2024: What to Expect',
    monthlyGrowth: 12.5,
  };

  const topArticles = [
    {
      title: 'Tech Trends 2024: What to Expect',
      views: 1234,
      author: 'John Doe',
      date: '2024-01-15',
    },
    {
      title: 'AI Revolution in Healthcare',
      views: 987,
      author: 'Jane Smith',
      date: '2024-01-14',
    },
    {
      title: 'The Future of Remote Work',
      views: 756,
      author: 'Sarah Wilson',
      date: '2024-01-12',
    },
    {
      title: 'Sustainable Energy Solutions',
      views: 654,
      author: 'Mike Johnson',
      date: '2024-01-13',
    },
    {
      title: 'Climate Change and Technology',
      views: 543,
      author: 'David Brown',
      date: '2024-01-11',
    },
  ];

  const categoryStats = [
    { category: 'Technology', articles: 456, views: 18900, percentage: 41.4 },
    { category: 'Business', articles: 234, views: 12300, percentage: 26.9 },
    { category: 'Health', articles: 189, views: 8900, percentage: 19.5 },
    { category: 'Sports', articles: 156, views: 3400, percentage: 7.4 },
    { category: 'Entertainment', articles: 199, views: 2178, percentage: 4.8 },
  ];

  return (
    <Layout title="News Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">News Analytics</h1>
              <p className="text-gray-600">Performance metrics and insights for your articles</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">+{analyticsData.monthlyGrowth}%</span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalArticles.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">+8%</span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Views/Article</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.avgViewsPerArticle}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">+15%</span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Article</p>
                <p className="text-lg font-bold text-gray-900 truncate">{analyticsData.topPerformingArticle}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-600">1,234 views</span>
            </div>
          </div>
        </div>

        {/* Charts and Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Placeholder */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart will be implemented here</p>
                <p className="text-sm text-gray-400">Views trend over the last 30 days</p>
              </div>
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
            <div className="space-y-4">
              {categoryStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{stat.category}</span>
                      <span className="text-sm text-gray-500">{stat.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{stat.articles} articles</span>
                      <span className="text-xs text-gray-500">{stat.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Articles */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Articles</h3>
          <div className="space-y-4">
            {topArticles.map((article, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => console.log('View article:', article.title)}>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{article.title}</h4>
                    <p className="text-sm text-gray-600">
                      By {article.author} • {article.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{article.views.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              {
                action: 'Article published',
                title: 'Tech Trends 2024: What to Expect',
                time: '2 hours ago',
                views: '+234 views',
              },
              {
                action: 'Article updated',
                title: 'AI Revolution in Healthcare',
                time: '4 hours ago',
                views: '+156 views',
              },
              {
                action: 'New article created',
                title: 'Sustainable Energy Solutions',
                time: '6 hours ago',
                views: 'Draft',
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}: {activity.title}
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <span className="text-sm text-gray-600">{activity.views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
