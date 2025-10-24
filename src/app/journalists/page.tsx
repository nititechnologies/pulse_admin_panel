'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Search, UserCheck, UserX, Eye, Calendar, TrendingUp, Clock } from 'lucide-react';

interface Journalist {
  id: number;
  name: string;
  email: string;
  status: string;
  joinDate: string;
  lastActive: string;
  articlesCount: number;
  totalViews: number;
  avgEngagement: number;
  profileImage?: string;
  recentActivity: Array<{
    type: string;
    title: string;
    date: string;
    views: number;
  }>;
}

export default function JournalistsPage() {
  const auth = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJournalist, setSelectedJournalist] = useState<Journalist | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Safely get isAdministrator with fallback
  const isAdministrator = auth?.isAdministrator || false;

  // Check if user has administrator access
  if (!isAdministrator) {
    return (
      <Layout title="Access Denied">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You don&apos;t have permission to access this page.</p>
            <p className="text-sm text-gray-500">Only administrators can manage journalists.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const journalists = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@pulse.com',
      status: 'active',
      joinDate: '2023-01-15',
      lastActive: '2024-01-20',
      articlesCount: 45,
      totalViews: 125000,
      avgEngagement: 4.2,
      recentActivity: [
        { type: 'article', title: 'Tech Innovation Trends', date: '2024-01-20', views: 2500 },
        { type: 'article', title: 'Climate Change Report', date: '2024-01-18', views: 3200 },
        { type: 'login', title: 'Logged in', date: '2024-01-20', views: 0 },
      ],
      profileImage: 'https://via.placeholder.com/100x100',
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@pulse.com',
      status: 'active',
      joinDate: '2023-03-22',
      lastActive: '2024-01-19',
      articlesCount: 32,
      totalViews: 89000,
      avgEngagement: 3.8,
      recentActivity: [
        { type: 'article', title: 'Economic Analysis', date: '2024-01-19', views: 1800 },
        { type: 'article', title: 'Market Trends', date: '2024-01-17', views: 2100 },
        { type: 'login', title: 'Logged in', date: '2024-01-19', views: 0 },
      ],
      profileImage: 'https://via.placeholder.com/100x100',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@pulse.com',
      status: 'inactive',
      joinDate: '2023-06-10',
      lastActive: '2024-01-05',
      articlesCount: 18,
      totalViews: 45000,
      avgEngagement: 2.9,
      recentActivity: [
        { type: 'article', title: 'Health & Wellness', date: '2024-01-05', views: 1200 },
        { type: 'login', title: 'Logged in', date: '2024-01-05', views: 0 },
      ],
      profileImage: 'https://via.placeholder.com/100x100',
    },
    {
      id: 4,
      name: 'David Thompson',
      email: 'david.thompson@pulse.com',
      status: 'active',
      joinDate: '2023-09-05',
      lastActive: '2024-01-21',
      articlesCount: 28,
      totalViews: 67000,
      avgEngagement: 3.5,
      recentActivity: [
        { type: 'article', title: 'Sports Update', date: '2024-01-21', views: 1900 },
        { type: 'article', title: 'Team Analysis', date: '2024-01-19', views: 1600 },
        { type: 'login', title: 'Logged in', date: '2024-01-21', views: 0 },
      ],
      profileImage: 'https://via.placeholder.com/100x100',
    },
  ];

  const filteredJournalists = journalists.filter(journalist => {
    const matchesSearch = journalist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         journalist.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleStatusToggle = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    console.log(`Toggle journalist ${id} status to ${newStatus}`);
    alert(`Journalist status updated to ${newStatus}`);
  };

  const handleViewDetails = (journalist: Journalist) => {
    setSelectedJournalist(journalist);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedJournalist(null);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'login':
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Layout title="Journalists">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Journalists Management</h1>
              <p className="text-gray-600">Manage journalist accounts and monitor their activity</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{journalists.length}</div>
                <div className="text-sm text-gray-500">Total Journalists</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {journalists.filter(j => j.status === 'active').length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search journalists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Journalists List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Journalists ({filteredJournalists.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredJournalists.map((journalist) => (
              <div key={journalist.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={journalist.profileImage}
                      alt={journalist.name}
                      className="w-16 h-16 object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTMyIDIwQzM2LjQxODMgMjAgNDAgMjMuNTgxNyA0MCAyOEM0MCAzMi40MTgzIDM2LjQxODMgMzYgMzIgMzZDMjcuNTgxNyAzNiAyNCAzMi40MTgzIDI0IDI4QzI0IDIzLjU4MTcgMjcuNTgxNyAyMCAzMiAyMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTQ4IDQ0QzQ4IDM2LjI2ODcgNDAuNzMxMyAyOSAzMyAyOUgyM0MxNS4yNjg3IDI5IDggMzYuMjY4NyA4IDQ0VjQ4SDQ4VjQ0WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                      }}
                    />
                  </div>

                  {/* Journalist Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {journalist.name}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(journalist.status)}`}>
                            {getStatusIcon(journalist.status)}
                            <span>{journalist.status.charAt(0).toUpperCase() + journalist.status.slice(1)}</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Email:</span> {journalist.email}
                          </div>
                          <div>
                            <span className="font-medium">Articles:</span> {journalist.articlesCount}
                          </div>
                          <div>
                            <span className="font-medium">Total Views:</span> {journalist.totalViews.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Avg Engagement:</span> {journalist.avgEngagement}/5
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Join Date:</span> {journalist.joinDate}
                          </div>
                          <div>
                            <span className="font-medium">Last Active:</span> {journalist.lastActive}
                          </div>
                          <div>
                            <span className="font-medium">Activity Score:</span> 
                            <span className={`ml-1 ${journalist.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                              {journalist.status === 'active' ? 'High' : 'Low'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(journalist)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusToggle(journalist.id, journalist.status)}
                          className={`p-2 transition-colors ${
                            journalist.status === 'active' 
                              ? 'text-gray-400 hover:text-red-600' 
                              : 'text-gray-400 hover:text-green-600'
                          }`}
                          title={journalist.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {journalist.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journalist Details Modal */}
        {showDetailsModal && selectedJournalist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Journalist Details</h2>
                <button
                  onClick={closeDetailsModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Profile Section */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedJournalist.profileImage}
                      alt={selectedJournalist.name}
                      className="w-20 h-20 object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTQwIDI1QzQ1LjUyMjggMjUgNTAgMjkuNDc3MiA1MCAzNUM1MCA0MC41MjI4IDQ1LjUyMjggNDUgNDAgNDVDMzQuNDc3MiA0NSAzMCA0MC41MjI4IDMwIDM1QzMwIDI5LjQ3NzIgMzQuNDc3MiAyNSA0MCAyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTU2IDU1QzU2IDQ1LjMzNTYgNDkuNjY0NCAzOSA0MCAzOUgzMEMyMC4zMzU2IDM5IDE0IDQ1LjMzNTYgMTQgNTVWNTlINjBWNTUiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==';
                      }}
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedJournalist.name}</h3>
                      <p className="text-gray-600">{selectedJournalist.email}</p>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(selectedJournalist.status)}`}>
                        {getStatusIcon(selectedJournalist.status)}
                        <span className="ml-1">{selectedJournalist.status.charAt(0).toUpperCase() + selectedJournalist.status.slice(1)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedJournalist.articlesCount}</div>
                        <div className="text-sm text-gray-600">Articles Published</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedJournalist.totalViews.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Total Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedJournalist.avgEngagement}</div>
                        <div className="text-sm text-gray-600">Avg Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {Math.round((selectedJournalist.totalViews / selectedJournalist.articlesCount) / 100) * 100}
                        </div>
                        <div className="text-sm text-gray-600">Avg Views/Article</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      {selectedJournalist.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{activity.title}</div>
                            <div className="text-sm text-gray-600">{activity.date}</div>
                          </div>
                          {activity.views > 0 && (
                            <div className="text-sm text-gray-500">
                              {activity.views.toLocaleString()} views
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Join Date:</span>
                        <span className="ml-2">{selectedJournalist.joinDate}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Last Active:</span>
                        <span className="ml-2">{selectedJournalist.lastActive}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Account Status:</span>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedJournalist.status)}`}>
                          {selectedJournalist.status.charAt(0).toUpperCase() + selectedJournalist.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Activity Level:</span>
                        <span className={`ml-2 ${selectedJournalist.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedJournalist.status === 'active' ? 'High' : 'Low'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => handleStatusToggle(selectedJournalist.id, selectedJournalist.status)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedJournalist.status === 'active'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedJournalist.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                </button>
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
