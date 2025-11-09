'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { getAds, updateAd, deleteAd, type Ad } from '@/lib/ads';
import { Search, Trash2, Eye, ChevronDown, Check, Megaphone, TrendingUp, MousePointerClick, BarChart3, Plus, X, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { Timestamp } from 'firebase/firestore';

export default function ManageAdsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'removed', label: 'Removed' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
  ];

  // Fetch ads from Firebase
  useEffect(() => {
    fetchAds();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const adsData = await getAds();
      setAds(adsData);
    } catch (error) {
      console.error('Error fetching ads:', error);
      setError('Failed to load ads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value);
    setIsStatusDropdownOpen(false);
  };

  // Calculate CTR (Click Through Rate)
  const calculateCTR = (impressions: number = 0, clicks: number = 0): number => {
    if (impressions === 0) return 0;
    return Number(((clicks / impressions) * 100).toFixed(2));
  };


  const filteredCampaigns = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || ad.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Sorting function
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Apply sorting
  const sortedAds = [...filteredCampaigns].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let aValue: string | number;
    let bValue: string | number;
    
    switch (sortColumn) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'impressions':
        aValue = a.views || a.impressions || 0;
        bValue = b.views || b.impressions || 0;
        break;
      case 'clicks':
        aValue = a.clicks || 0;
        bValue = b.clicks || 0;
        break;
      case 'ctr':
        const aViews = a.views || a.impressions || 0;
        const bViews = b.views || b.impressions || 0;
        aValue = calculateCTR(aViews, a.clicks || 0);
        bValue = calculateCTR(bViews, b.clicks || 0);
        break;
      case 'status':
        aValue = (a.status || 'draft').toLowerCase();
        bValue = (b.status || 'draft').toLowerCase();
        break;
      case 'created':
        try {
          const aCreatedAt = a.createdAt as Timestamp | string | number | undefined;
          const bCreatedAt = b.createdAt as Timestamp | string | number | undefined;
          
          if (aCreatedAt && typeof aCreatedAt === 'object' && 'toDate' in aCreatedAt) {
            aValue = (aCreatedAt as Timestamp).toDate().getTime();
          } else if (aCreatedAt && typeof aCreatedAt === 'object' && 'toMillis' in aCreatedAt) {
            aValue = (aCreatedAt as Timestamp).toMillis();
          } else if (aCreatedAt) {
            aValue = new Date(aCreatedAt as string | number).getTime();
          } else {
            aValue = 0;
          }
          
          if (bCreatedAt && typeof bCreatedAt === 'object' && 'toDate' in bCreatedAt) {
            bValue = (bCreatedAt as Timestamp).toDate().getTime();
          } else if (bCreatedAt && typeof bCreatedAt === 'object' && 'toMillis' in bCreatedAt) {
            bValue = (bCreatedAt as Timestamp).toMillis();
          } else if (bCreatedAt) {
            bValue = new Date(bCreatedAt as string | number).getTime();
          } else {
            bValue = 0;
          }
        } catch {
          aValue = 0;
          bValue = 0;
        }
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3 h-3 ml-1 text-slate-400" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-3 h-3 ml-1 text-blue-600" />
      : <ArrowDown className="w-3 h-3 ml-1 text-blue-600" />;
  };

  const getStatusColor = (status: string = 'draft') => {
    switch (status) {
      case 'published':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'removed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'archived':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };


  const handleViewCampaign = (ad: Ad) => {
    if (ad.id) {
      router.push(`/ads/${ad.id}`);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string = 'draft') => {
    const newStatus: 'published' | 'removed' = currentStatus === 'published' ? 'removed' : 'published';
    try {
      await updateAd(id, { status: newStatus });
      setAds(prevAds => 
        prevAds.map(ad => 
          ad.id === id 
            ? { ...ad, status: newStatus }
            : ad
        )
      );
    } catch (error) {
      console.error('Error updating ad status:', error);
      alert('Failed to update ad status');
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;
    
    try {
      await deleteAd(id);
      setAds(prevAds => prevAds.filter(ad => ad.id !== id));
      alert('Ad deleted successfully');
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('Failed to delete ad');
    }
  };

  // Calculate total stats
  const totalStats = ads.reduce((acc, ad) => ({
    impressions: acc.impressions + (ad.views || ad.impressions || 0),
    clicks: acc.clicks + (ad.clicks || 0),
    published: acc.published + (ad.status === 'published' ? 1 : 0),
  }), { impressions: 0, clicks: 0, published: 0 });

  const overallCTR = totalStats.impressions > 0 
    ? ((totalStats.clicks / totalStats.impressions) * 100).toFixed(2) 
    : '0.00';

  return (
    <Layout title="Manage Ads">
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-5 shadow-lg text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-40"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg shadow-md border border-white/30">
                <Megaphone className="w-5 h-5 text-white" />
              </div>
          <div>
                <h1 className="text-2xl font-bold text-white">Manage Ads</h1>
                <p className="text-blue-100 text-xs">Manage and monitor your advertising campaigns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Total Ads</p>
                <p className="text-2xl font-bold text-slate-800">{ads.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Megaphone className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Impressions</p>
                <p className="text-2xl font-bold text-slate-800">{totalStats.impressions.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Total Clicks</p>
                <p className="text-2xl font-bold text-slate-800">{totalStats.clicks.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <MousePointerClick className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Overall CTR</p>
                <p className="text-2xl font-bold text-slate-800">{overallCTR}%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Ads Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header with Filters */}
          <div className="p-4 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <Megaphone className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Ads</h2>
                  <p className="text-xs text-slate-500">
                    {sortedAds.length} {sortedAds.length === 1 ? 'ad' : 'ads'}
                  </p>
                  </div>
              </div>
            </div>
            
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search ads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm text-slate-800 bg-white"
                  />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <div className="relative" ref={statusDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between text-xs transition-all duration-200"
                >
                    <span className="text-slate-800 truncate">
                    {statusOptions.find(option => option.value === selectedStatus)?.label || 'All Status'}
                  </span>
                    <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform flex-shrink-0 ml-1 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isStatusDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusSelect(option.value)}
                          className="w-full px-3 py-2 text-left text-slate-800 hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-slate-100 last:border-b-0 text-xs"
                      >
                        <span>{option.label}</span>
                          {selectedStatus === option.value && <Check className="w-3 h-3 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-slate-600 font-medium">Loading ads...</p>
              <p className="text-xs text-slate-400 mt-1">Please wait while we fetch your campaigns</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-sm text-red-600 font-medium mb-2">{error}</p>
              <button 
                onClick={fetchAds}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md hover:shadow-lg mt-4"
              >
                Try Again
              </button>
            </div>
          ) : sortedAds.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Megaphone className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-sm text-slate-600 font-medium mb-2">No ads found</p>
              <p className="text-xs text-slate-500 mb-6">Create your first ad to get started</p>
              <Link 
                href="/ads/create"
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Ad
              </Link>
          </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th 
                      className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">
                        Ad
                        {getSortIcon('title')}
                      </div>
                  </th>
                    <th 
                      className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('created')}
                    >
                      <div className="flex items-center">
                        Created
                        {getSortIcon('created')}
                      </div>
                  </th>
                    <th 
                      className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('impressions')}
                    >
                      <div className="flex items-center">
                    Impressions
                        {getSortIcon('impressions')}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('clicks')}
                    >
                      <div className="flex items-center">
                        Clicks
                        {getSortIcon('clicks')}
                      </div>
                  </th>
                    <th 
                      className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('ctr')}
                    >
                      <div className="flex items-center">
                        CTR
                        {getSortIcon('ctr')}
                      </div>
                  </th>
                    <th 
                      className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                    Status
                        {getSortIcon('status')}
                      </div>
                  </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                    {sortedAds.map((ad) => {
                      const views = ad.views || ad.impressions || 0;
                      const ctr = calculateCTR(views, ad.clicks || 0);
                      return (
                      <tr 
                        key={ad.id} 
                        onClick={() => handleViewCampaign(ad)}
                        className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                      >
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="flex-shrink-0 h-9 w-9">
                            <img
                              className="h-9 w-9 rounded-lg object-cover ring-1 ring-slate-200"
                              src={ad.imageUrl}
                              alt={ad.title}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200';
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1 max-w-[200px]">
                            <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                              {ad.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-xs text-slate-700">
                          {(() => {
                            try {
                              if (!ad.createdAt) return '—';
                              let date: Date;
                              const createdAt = ad.createdAt as Timestamp | string | number | undefined;
                              if (createdAt && typeof createdAt === 'object' && 'toDate' in createdAt) {
                                date = (createdAt as Timestamp).toDate();
                              } else if (createdAt && typeof createdAt === 'object' && 'toMillis' in createdAt) {
                                date = new Date((createdAt as Timestamp).toMillis());
                              } else if (createdAt) {
                                date = new Date(createdAt as string | number);
                              } else {
                                date = new Date();
                              }
                              if (isNaN(date.getTime())) return '—';
                              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                            } catch {
                              return '—';
                            }
                          })()}
                      </div>
                    </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-xs font-medium text-slate-700">
                          {(ad.views || ad.impressions || 0).toLocaleString()}
                        </div>
                    </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="text-xs font-medium text-slate-700">
                          {(ad.clicks || 0).toLocaleString()}
                        </div>
                    </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-slate-700">{ctr}%</span>
                          {ctr > 2 && (
                            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                              Good
                            </span>
                          )}
                        </div>
                    </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(ad.status)}`}>
                            {ad.status ? ad.status.charAt(0).toUpperCase() + ad.status.slice(1) : 'Draft'}
                          </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                              if (ad.id) {
                                handleToggleStatus(ad.id, ad.status);
                              }
                          }}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white ${
                              ad.status === 'published' 
                              ? 'bg-emerald-500 focus:ring-emerald-500' 
                                : 'bg-slate-300 focus:ring-slate-400'
                          }`}
                        >
                          <span
                              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                                ad.status === 'published' ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                                handleViewCampaign(ad);
                            }}
                              className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              title="View"
                          >
                              <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                                if (ad.id) {
                                  handleDeleteAd(ad.id);
                                }
                            }}
                              className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Delete"
                          >
                              <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                  </tr>
                  );
                  })}
              </tbody>
            </table>
          </div>
          )}

          {sortedAds.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">
                  Showing <span className="font-semibold">{sortedAds.length}</span> of <span className="font-semibold">{ads.length}</span> ads
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
