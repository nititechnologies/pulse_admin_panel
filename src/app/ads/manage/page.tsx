'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { Search, Filter, Edit, Trash2, Eye, MoreVertical, Play, Pause } from 'lucide-react';

export default function ManageAdsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const campaigns = [
    {
      id: 1,
      title: 'Summer Sale 2024',
      type: 'Banner Ad',
      status: 'active',
      impressions: 125000,
      clicks: 3750,
      ctr: 3.0,
      budget: 5000,
      spent: 3200,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      imageUrl: 'https://via.placeholder.com/300x200',
    },
    {
      id: 2,
      title: 'Tech Product Launch',
      type: 'Video Ad',
      status: 'active',
      impressions: 89000,
      clicks: 2670,
      ctr: 3.0,
      budget: 8000,
      spent: 5600,
      startDate: '2024-01-05',
      endDate: '2024-02-05',
      imageUrl: 'https://via.placeholder.com/300x200',
    },
    {
      id: 3,
      title: 'Holiday Promotion',
      type: 'Display Ad',
      status: 'paused',
      impressions: 45000,
      clicks: 1350,
      ctr: 3.0,
      budget: 3000,
      spent: 1800,
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      imageUrl: 'https://via.placeholder.com/300x200',
    },
    {
      id: 4,
      title: 'Brand Awareness',
      type: 'Native Ad',
      status: 'draft',
      impressions: 0,
      clicks: 0,
      ctr: 0,
      budget: 2000,
      spent: 0,
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      imageUrl: 'https://via.placeholder.com/300x200',
    },
  ];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || campaign.type.toLowerCase() === selectedType;
    const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Layout title="Manage Ads">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Ad Campaigns</h1>
              <p className="text-gray-600">Edit, pause, and organize your advertising campaigns</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 inline mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="banner">Banner Ad</option>
                <option value="video">Video Ad</option>
                <option value="display">Display Ad</option>
                <option value="native">Native Ad</option>
                <option value="social">Social Media Ad</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Campaigns ({filteredCampaigns.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => console.log('Edit campaign:', campaign.id)}>
                <div className="flex items-start space-x-4">
                  {/* Campaign Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  {/* Campaign Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {campaign.title}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(campaign.status)}`}>
                            {getStatusIcon(campaign.status)}
                            <span>{campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}</span>
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Type:</span> {campaign.type}
                          </div>
                          <div>
                            <span className="font-medium">Impressions:</span> {campaign.impressions.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Clicks:</span> {campaign.clicks.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">CTR:</span> {campaign.ctr}%
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Budget:</span> ${campaign.budget.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Spent:</span> ${campaign.spent.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Start:</span> {campaign.startDate}
                          </div>
                          <div>
                            <span className="font-medium">End:</span> {campaign.endDate}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing 1 to {filteredCampaigns.length} of {filteredCampaigns.length} results
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-[#5E8BA8] text-white rounded text-sm hover:bg-[#4A6F8C] transition-colors">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
