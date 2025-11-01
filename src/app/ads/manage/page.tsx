'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Search, Trash2, Eye, Play, Pause, ChevronDown, Check } from 'lucide-react';

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
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'banner', label: 'Banner Ad' },
    { value: 'video', label: 'Video Ad' },
    { value: 'display', label: 'Display Ad' },
    { value: 'native', label: 'Native Ad' },
    { value: 'social', label: 'Social Media Ad' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'removed', label: 'Removed' },
    { value: 'scheduled', label: 'Scheduled' },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTypeSelect = (value: string) => {
    setSelectedType(value);
    setIsTypeDropdownOpen(false);
  };

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value);
    setIsStatusDropdownOpen(false);
  };

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
    const matchesType = selectedType === 'all' || campaign.type.toLowerCase() === selectedType.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'removed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'paused':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'draft':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
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
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Ad Campaigns</h1>
            <p className="text-blue-100">Edit, pause, and organize your advertising campaigns</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
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
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <div className="relative" ref={typeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between text-sm"
                >
                  <span className="text-slate-900 truncate">
                    {typeOptions.find(option => option.value === selectedType)?.label || 'All Types'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isTypeDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                    {typeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleTypeSelect(option.value)}
                        className="w-full px-3 py-2 text-left text-white hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between text-sm"
                      >
                        <span>{option.label}</span>
                        {selectedType === option.value && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <div className="relative" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between text-sm"
                >
                  <span className="text-slate-900 truncate">
                    {statusOptions.find(option => option.value === selectedStatus)?.label || 'All Status'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isStatusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusSelect(option.value)}
                        className="w-full px-3 py-2 text-left text-white hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between text-sm"
                      >
                        <span>{option.label}</span>
                        {selectedStatus === option.value && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="text-lg font-semibold text-slate-800">
              Campaigns ({filteredCampaigns.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Impressions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    CTR
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                  {filteredCampaigns.map((campaign) => (
                    <tr 
                      key={campaign.id} 
                      onClick={() => handleViewCampaign(campaign)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg object-cover ring-2 ring-blue-200"
                            src={campaign.imageUrl}
                            alt={campaign.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-800 max-w-xs truncate">
                            {campaign.title}
                          </div>
                          <div className="text-sm text-slate-500">
                            ${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      {campaign.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      {campaign.impressions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                      {campaign.ctr}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
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
                              ? 'bg-emerald-500 focus:ring-emerald-500' 
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
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete action
                            }}
                            className="text-red-600 hover:text-red-700 transition-colors"
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
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-700">
                Showing 1 to {filteredCampaigns.length} of {filteredCampaigns.length} results
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm hover:from-blue-600 hover:to-purple-700 transition-colors shadow-md">
                  1
                </button>
                <button className="px-3 py-1 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors">
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
