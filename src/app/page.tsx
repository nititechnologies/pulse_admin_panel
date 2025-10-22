'use client';

import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { BarChart3, Users, Newspaper, Megaphone, TrendingUp, Activity } from 'lucide-react';

export default function Home() {
  const stats = [
    {
      title: 'Total Users',
      value: '12,543',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'News Articles',
      value: '1,234',
      change: '+8%',
      changeType: 'positive',
      icon: Newspaper,
    },
    {
      title: 'Active Ads',
      value: '89',
      change: '+23%',
      changeType: 'positive',
      icon: Megaphone,
    },
    {
      title: 'Support Tickets',
      value: '45',
      change: '-5%',
      changeType: 'negative',
      icon: Activity,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'news',
      title: 'New article published: "Tech Trends 2024"',
      time: '2 hours ago',
      status: 'published',
    },
    {
      id: 2,
      type: 'ad',
      title: 'Ad campaign "Summer Sale" launched',
      time: '4 hours ago',
      status: 'active',
    },
    {
      id: 3,
      type: 'support',
      title: 'New support ticket #1234 received',
      time: '6 hours ago',
      status: 'open',
    },
    {
      id: 4,
      type: 'user',
      title: 'New user registration: john.doe@email.com',
      time: '8 hours ago',
      status: 'verified',
    },
  ];

  return (
    <ProtectedRoute>
      <Layout title="Dashboard">
        <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Placeholder */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart will be implemented here</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'news' ? 'bg-blue-500' :
                    activity.type === 'ad' ? 'bg-green-500' :
                    activity.type === 'support' ? 'bg-red-500' :
                    'bg-purple-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    activity.status === 'published' || activity.status === 'active' || activity.status === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/news/upload" className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
              <Newspaper className="w-8 h-8 text-gray-400 mb-2" />
              <p className="font-medium text-gray-900">Upload News</p>
              <p className="text-sm text-gray-500">Create a new article</p>
            </Link>
            <Link href="/ads/create" className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left">
              <Megaphone className="w-8 h-8 text-gray-400 mb-2" />
              <p className="font-medium text-gray-900">Create Ad</p>
              <p className="text-sm text-gray-500">Launch new campaign</p>
            </Link>
          </div>
        </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}