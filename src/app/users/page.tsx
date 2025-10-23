'use client';

import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Search, UserCheck, UserX, Mail, Phone, Calendar, TrendingUp, Clock, ChevronDown, Check } from 'lucide-react';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [joinDateFrom, setJoinDateFrom] = useState('');
  const [joinDateTo, setJoinDateTo] = useState('');
  const [lastActiveFrom, setLastActiveFrom] = useState('');
  const [lastActiveTo, setLastActiveTo] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filterOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'active', label: 'Active Only' },
    { value: 'inactive', label: 'Inactive Only' }
  ];

  const handleFilterSelect = (value) => {
    setStatusFilter(value);
    setIsDropdownOpen(false);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setJoinDateFrom('');
    setJoinDateTo('');
    setLastActiveFrom('');
    setLastActiveTo('');
  };

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@pulse.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      joinDate: '2023-01-15',
      lastActive: '2024-01-21',
      profileImage: 'https://via.placeholder.com/100x100',
      recentArticles: [
        { title: 'Tech Innovation Trends 2024', date: '2024-01-20', views: 2500 },
        { title: 'AI Revolution in Healthcare', date: '2024-01-18', views: 3200 },
        { title: 'Climate Change Solutions', date: '2024-01-15', views: 1800 },
      ],
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@pulse.com',
      phone: '+1 (555) 234-5678',
      status: 'active',
      joinDate: '2023-03-22',
      lastActive: '2024-01-20',
      profileImage: 'https://via.placeholder.com/100x100',
      recentArticles: [
        { title: 'Economic Analysis Q4 2023', date: '2024-01-19', views: 1800 },
        { title: 'Market Trends Report', date: '2024-01-17', views: 2100 },
        { title: 'Global Trade Updates', date: '2024-01-14', views: 1500 },
      ],
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@pulse.com',
      phone: '+1 (555) 345-6789',
      status: 'active',
      joinDate: '2023-06-10',
      lastActive: '2024-01-19',
      profileImage: 'https://via.placeholder.com/100x100',
      recentArticles: [
        { title: 'Sports Update: Championship', date: '2024-01-21', views: 1900 },
        { title: 'Team Analysis Report', date: '2024-01-19', views: 1600 },
        { title: 'Player Performance Review', date: '2024-01-16', views: 1200 },
      ],
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@pulse.com',
      phone: '+1 (555) 456-7890',
      status: 'inactive',
      joinDate: '2023-09-05',
      lastActive: '2024-01-05',
      profileImage: 'https://via.placeholder.com/100x100',
      recentArticles: [
        { title: 'Health & Wellness Guide', date: '2024-01-05', views: 1200 },
        { title: 'Nutrition Tips', date: '2023-12-28', views: 800 },
      ],
    },
    {
      id: 5,
      name: 'David Thompson',
      email: 'david.thompson@pulse.com',
      phone: '+1 (555) 567-8901',
      status: 'active',
      joinDate: '2023-11-12',
      lastActive: '2024-01-21',
      profileImage: 'https://via.placeholder.com/100x100',
      recentArticles: [
        { title: 'Business Strategy Insights', date: '2024-01-20', views: 2200 },
        { title: 'Leadership Development', date: '2024-01-18', views: 1900 },
        { title: 'Startup Success Stories', date: '2024-01-15', views: 1600 },
      ],
    },
    {
      id: 6,
      name: 'Lisa Wang',
      email: 'lisa.wang@pulse.com',
      phone: '+1 (555) 678-9012',
      status: 'inactive',
      joinDate: '2023-12-01',
      lastActive: '2023-12-15',
      profileImage: 'https://via.placeholder.com/100x100',
      recentArticles: [
        { title: 'Art & Culture Review', date: '2023-12-15', views: 900 },
        { title: 'Music Industry Trends', date: '2023-12-10', views: 1100 },
      ],
    },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    // Date filtering logic
    const userJoinDate = new Date(user.joinDate);
    const userLastActive = new Date(user.lastActive);
    
    const matchesJoinDate = (!joinDateFrom || userJoinDate >= new Date(joinDateFrom)) &&
                           (!joinDateTo || userJoinDate <= new Date(joinDateTo));
    
    const matchesLastActive = (!lastActiveFrom || userLastActive >= new Date(lastActiveFrom)) &&
                             (!lastActiveTo || userLastActive <= new Date(lastActiveTo));
    
    return matchesSearch && matchesStatus && matchesJoinDate && matchesLastActive;
  });

  const handleStatusToggle = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === id 
          ? { ...user, status: newStatus }
          : user
      )
    );
    
    console.log(`User ${id} status updated to ${newStatus}`);
  };

  const handleViewProfile = (user: any) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedUser(null);
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />;
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'administrator':
        return 'bg-purple-100 text-purple-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'journalist':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="Manage Users">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{users.length}</div>
                <div className="text-sm text-gray-500 font-medium">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </div>
                <div className="text-sm text-gray-500 font-medium">Active</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {users.filter(u => u.status === 'inactive').length}
                </div>
                <div className="text-sm text-gray-500 font-medium">Inactive</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="w-40">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between text-sm"
                >
                  <span className="text-gray-900 truncate">
                    {filterOptions.find(option => option.value === statusFilter)?.label}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleFilterSelect(option.value)}
                        className="w-full px-3 py-2 text-left text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between text-sm"
                      >
                        <span>{option.label}</span>
                        {statusFilter === option.value && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Join Date Range */}
            <div className="flex gap-2 items-center">
              <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Join:</label>
              <input
                type="date"
                value={joinDateFrom}
                onChange={(e) => setJoinDateFrom(e.target.value)}
                className="w-32 px-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs text-gray-900"
              />
              <span className="text-gray-400 text-xs">to</span>
              <input
                type="date"
                value={joinDateTo}
                onChange={(e) => setJoinDateTo(e.target.value)}
                className="w-32 px-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs text-gray-900"
              />
            </div>

            {/* Last Active Range */}
            <div className="flex gap-2 items-center">
              <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Active:</label>
              <input
                type="date"
                value={lastActiveFrom}
                onChange={(e) => setLastActiveFrom(e.target.value)}
                className="w-32 px-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs text-gray-900"
              />
              <span className="text-gray-400 text-xs">to</span>
              <input
                type="date"
                value={lastActiveTo}
                onChange={(e) => setLastActiveTo(e.target.value)}
                className="w-32 px-2 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs text-gray-900"
              />
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Users ({filteredUsers.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profileImage}
                            alt={user.name}
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTIwIDEwQzIyLjIwOTEgMTAgMjQgMTEuNzkwOSAyNCAxNEMyNCAxNi4yMDkxIDIyLjIwOTEgMTggMjAgMThDMTcuNzkwOSAxOCAxNiAxNi4yMDkxIDE2IDE0QzE2IDExLjc5MDkgMTcuNzkwOSAxMCAyMCAxMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTMwIDMwQzMwIDI3LjM4NjMgMjcuNjE4IDI1IDIzIDI1SDE3QzEyLjM4MiAyNSAxMCAyNy4zODYzIDEwIDMwVjMySDMwVjMwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status === 'active' ? (
                            <>
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                              Active
                            </>
                          ) : (
                            <>
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></div>
                              Inactive
                            </>
                          )}
                        </span>
                        <button
                          onClick={() => handleStatusToggle(user.id, user.status)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
                            user.status === 'active' 
                              ? 'bg-green-500 focus:ring-green-500' 
                              : 'bg-red-500 focus:ring-red-500'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                              user.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewProfile(user)}
                        className="text-[#5E8BA8] hover:text-[#4A6F8C] transition-colors font-medium"
                      >
                        View Profile
                      </button>
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
                Showing 1 to {filteredUsers.length} of {filteredUsers.length} results
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

        {/* User Details Modal */}
        {showDetailsModal && selectedUser && (
          <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-gray-50 rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#323232]">User Profile</h2>
                <button
                  onClick={closeDetailsModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-8">
                  {/* Profile Section */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <img
                        src={selectedUser.profileImage}
                        alt={selectedUser.name}
                        className="w-20 h-20 object-cover rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTQwIDI1QzQ1LjUyMjggMjUgNTAgMjkuNDc3MiA1MCAzNUM1MCA0MC41MjI4IDQ1LjUyMjggNDUgNDAgNDVDMzQuNDc3MiA0NSAzMCA0MC41MjI4IDMwIDM1QzMwIDI5LjQ3NzIgMzQuNDc3MiAyNSA0MCAyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTU2IDU1QzU2IDQ1LjMzNTYgNDkuNjY0NCAzOSA0MCAzOUgzMEMyMC4zMzU2IDM5IDE0IDQ1LjMzNTYgMTQgNTVWNTlINjBWNTUiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg==';
                        }}
                      />
                    </div>
                    <h3 className="text-3xl font-bold text-[#323232] mb-2">{selectedUser.name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center justify-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedUser.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* User Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-[#323232] mb-4">User Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">Join Date</span>
                        <span className="text-gray-900">{selectedUser.joinDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-600">Last Active</span>
                        <span className="text-gray-900">{selectedUser.lastActive}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium text-gray-600">Status</span>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          selectedUser.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedUser.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Articles */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-[#323232] mb-4">Recent Articles</h4>
                    <div className="space-y-4">
                      {selectedUser.recentArticles.map((article, index) => (
                        <div key={index} className="flex items-center space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                          <TrendingUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[#323232] text-sm">{article.title}</div>
                            <div className="text-xs text-gray-500">{article.date}</div>
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {article.views.toLocaleString()} views
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  onClick={() => handleStatusToggle(selectedUser.id, selectedUser.status)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedUser.status === 'active'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedUser.status === 'active' ? 'Deactivate User' : 'Activate User'}
                </button>
                <button
                  onClick={closeDetailsModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
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
