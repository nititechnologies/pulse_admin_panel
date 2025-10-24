'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { Search, Trash2, Eye, Play, Pause } from 'lucide-react';

interface Campaign {
  id: number;
  title: string;
  type: string;
  status: string;
  impressions: number;
  clicks: number;
  ctr: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  imageUrl: string;
}

export default function ManageAdsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
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
      status: 'removed',
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
      status: 'removed',
      impressions: 0,
      clicks: 0,
      ctr: 0,
      budget: 2000,
      spent: 0,
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      imageUrl: 'https://via.placeholder.com/300x200',
    },
  ]);

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
      case 'removed':
        return 'bg-red-100 text-red-800';
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

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedCampaign(null);
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'removed' : 'active';
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(campaign => 
        campaign.id === id 
          ? { ...campaign, status: newStatus }
          : campaign
      )
    );
    console.log(`Campaign ${id} status updated to ${newStatus}`);
  };

  return (
    <Layout title="Manage Ads">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#DCDCDC]">
          <div>
            <h1 className="text-2xl font-bold text-[#323232]">Manage Ad Campaigns</h1>
            <p className="text-gray-600">Edit, pause, and organize your advertising campaigns</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-[#DCDCDC]">
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
                <option value="removed">Removed</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-lg shadow-sm border border-[#DCDCDC]">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#323232]">
              Campaigns ({filteredCampaigns.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Impressions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CTR
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCampaigns.map((campaign) => (
                    <tr 
                      key={campaign.id} 
                      onClick={() => handleViewCampaign(campaign)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={campaign.imageUrl}
                            alt={campaign.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#323232] max-w-xs truncate">
                            {campaign.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.impressions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.ctr}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(campaign.status)}`}>
                          {getStatusIcon(campaign.status)}
                          <span>{campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}</span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(campaign.id, campaign.status);
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
                            campaign.status === 'active' 
                              ? 'bg-green-500 focus:ring-green-500' 
                              : 'bg-red-500 focus:ring-red-500'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                              campaign.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewCampaign(campaign);
                            }}
                            className="text-[#323232] hover:text-gray-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete action
                            }}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing 1 to {filteredCampaigns.length} of {filteredCampaigns.length} results
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-[#DCDCDC] rounded text-sm text-[#323232] hover:bg-[#F0F0F0] transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 bg-gradient-to-r from-[#323232] to-black text-white rounded text-sm hover:from-black hover:to-[#323232] transition-colors">
                  1
                </button>
                <button className="px-3 py-1 border border-[#DCDCDC] rounded text-sm text-[#323232] hover:bg-[#F0F0F0] transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Details Modal */}
        {showDetailsModal && selectedCampaign && (
          <div className="fixed inset-0 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          <div className="bg-gray-50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#323232]">Campaign Details</h2>
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
                  {/* Campaign Header */}
                  <div className="border border-[#DCDCDC] rounded-xl overflow-hidden bg-white">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-[#323232] mb-3 leading-tight">
                            {selectedCampaign.title}
                          </h3>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(selectedCampaign.status)}`}>
                              {getStatusIcon(selectedCampaign.status)}
                              <span>{selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}</span>
                            </span>
                            <span className="text-sm text-gray-600">{selectedCampaign.type}</span>
                          </div>
                        </div>
                        {selectedCampaign.imageUrl && (
                          <div className="ml-6 flex-shrink-0">
                            <img
                              src={selectedCampaign.imageUrl}
                              alt="Campaign preview"
                              className="w-40 h-32 object-cover rounded-lg shadow-sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Campaign Stats */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Impressions</div>
                          <div className="text-lg font-semibold text-[#323232]">{selectedCampaign.impressions.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Clicks</div>
                          <div className="text-lg font-semibold text-[#323232]">{selectedCampaign.clicks.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">CTR</div>
                          <div className="text-lg font-semibold text-[#323232]">{selectedCampaign.ctr}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Budget</div>
                          <div className="text-lg font-semibold text-[#323232]">${selectedCampaign.budget.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>

                    {/* Campaign Timeline */}
                    <div className="p-6 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 mb-1">Start Date</div>
                          <div className="text-[#323232] font-medium">{selectedCampaign.startDate}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">End Date</div>
                          <div className="text-[#323232] font-medium">{selectedCampaign.endDate}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Spent</div>
                          <div className="text-[#323232] font-medium">${selectedCampaign.spent.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Remaining</div>
                          <div className="text-[#323232] font-medium">${(selectedCampaign.budget - selectedCampaign.spent).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 border border-[#DCDCDC] rounded-lg text-[#323232] hover:bg-[#F0F0F0] transition-colors font-medium"
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
