'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { getJournalists, updateJournalistStatus, Journalist } from '@/lib/journalists';
import { Search, UserCheck, UserX, Mail, Phone, Calendar, ArrowLeft } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export default function UsersPage() {
  const router = useRouter();
  const { isAdministrator } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [journalists, setJournalists] = useState<Journalist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdministrator) {
      router.push('/');
      return;
    }
    fetchJournalists();
  }, [isAdministrator, router]);

  const fetchJournalists = async () => {
    try {
      setLoading(true);
      const data = await getJournalists();
      setJournalists(data);
    } catch (error) {
      console.error('Error fetching journalists:', error);
      setError('Failed to load journalists');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await updateJournalistStatus(id, newStatus);
      setJournalists(prev => 
        prev.map(j => j.id === id ? { ...j, status: newStatus } : j)
      );
    } catch (error) {
      console.error('Error updating journalist status:', error);
      alert('Failed to update status');
    }
  };

  const handleViewJournalist = (journalist: Journalist) => {
    if (journalist.id) {
      router.push(`/users/${journalist.id}`);
    }
  };

  const formatDate = (date: Timestamp | string | undefined): string => {
    if (!date) return 'N/A';
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const filteredJournalists = journalists.filter(journalist => {
    const matchesSearch = 
      journalist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journalist.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (journalist.phone && journalist.phone.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const activeCount = journalists.filter(j => j.status === 'active').length;
  const inactiveCount = journalists.filter(j => j.status === 'inactive').length;

  if (!isAdministrator) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <Layout title="Manage Users">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Manage Users">
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-6 shadow-lg text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-40"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Manage Journalists</h1>
                <p className="text-blue-100 text-sm">Manage journalist accounts and permissions</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{journalists.length}</div>
                  <div className="text-xs text-blue-100 font-medium">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-200">{activeCount}</div>
                  <div className="text-xs text-blue-100 font-medium">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-200">{inactiveCount}</div>
                  <div className="text-xs text-blue-100 font-medium">Inactive</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Journalists Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : filteredJournalists.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              {searchQuery ? 'No journalists found matching your search' : 'No journalists found'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Journalist
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredJournalists.map((journalist) => (
                    <tr 
                      key={journalist.id}
                      onClick={() => handleViewJournalist(journalist)}
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {journalist.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-slate-900">{journalist.name}</div>
                            {journalist.specialization && (
                              <div className="text-xs text-slate-500">{journalist.specialization}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-700">
                          <div className="flex items-center mb-1">
                            <Mail className="w-4 h-4 mr-2 text-slate-400" />
                            {journalist.email}
                          </div>
                          {journalist.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-slate-400" />
                              {journalist.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-700">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            {formatDate(journalist.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          journalist.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {journalist.status === 'active' ? (
                            <UserCheck className="w-3 h-3 mr-1" />
                          ) : (
                            <UserX className="w-3 h-3 mr-1" />
                          )}
                          {journalist.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => journalist.id && handleToggleStatus(journalist.id, journalist.status)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            journalist.status === 'active'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {journalist.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
