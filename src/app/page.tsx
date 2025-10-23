'use client';

import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { Users, Newspaper, Megaphone, TrendingUp, Activity, Eye } from 'lucide-react';

export default function Home() {
  const stats = [
    {
      title: 'Total News Articles',
      value: '1,247',
      change: '+12%',
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
      title: 'Monthly Views',
      value: '2.4M',
      change: '+8%',
      changeType: 'positive',
      icon: Eye,
    },
    {
      title: 'Engagement Rate',
      value: '68.5%',
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp,
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
      type: 'analytics',
      title: 'Analytics report generated',
      time: '6 hours ago',
      status: 'completed',
    },
    {
      id: 4,
      type: 'engagement',
      title: 'User engagement increased by 12%',
      time: '8 hours ago',
      status: 'positive',
    },
  ];

  const topCategories = [
    { name: 'Tech', value: 85 },
    { name: 'Business', value: 78 },
    { name: 'Sports', value: 45 },
    { name: 'Health', value: 52 },
    { name: 'Entertainment', value: 68 },
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
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-[#DCDCDC] hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-[#323232]">{stat.value}</p>
                    </div>
                    <div className="p-4 bg-[#F0F0F0] rounded-xl">
                      <Icon className="w-7 h-7 text-[#323232]" />
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


          {/* Recent Activity and Top Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#DCDCDC]">
              <h3 className="text-lg font-semibold text-[#323232] mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'news' ? 'bg-[#323232]' :
                      activity.type === 'ad' ? 'bg-green-500' :
                      activity.type === 'analytics' ? 'bg-gray-600' :
                      'bg-orange-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#323232]">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#DCDCDC]">
              <h3 className="text-lg font-semibold text-[#323232] mb-4">Top Categories</h3>
              <div className="space-y-4">
                {topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#323232]">{category.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-[#F0F0F0] rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#323232] to-black h-2 rounded-full" 
                          style={{ width: `${category.value}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-8 text-right">{category.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}