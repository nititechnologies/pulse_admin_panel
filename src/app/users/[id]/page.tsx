'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { getJournalistById, Journalist } from '@/lib/journalists';
import { ArrowLeft, Mail, Phone, Calendar, UserCheck, UserX, FileText } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';

export default function JournalistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { isAdministrator } = useAuth();
  const journalistId = params.id as string;
  
  const [journalist, setJournalist] = useState<Journalist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdministrator) {
      router.push('/');
      return;
    }
    if (journalistId) {
      fetchJournalist();
    }
  }, [journalistId, isAdministrator, router]);

  const fetchJournalist = async () => {
    try {
      setLoading(true);
      const data = await getJournalistById(journalistId);
      if (data) {
        setJournalist(data);
      } else {
        setError('Journalist not found');
      }
    } catch (error) {
      console.error('Error fetching journalist:', error);
      setError('Failed to load journalist');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Timestamp | string | undefined): string => {
    if (!date) return 'N/A';
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAdministrator) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <Layout title="Journalist Profile">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (error || !journalist) {
    return (
      <Layout title="Journalist Not Found">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-800">{error || 'Journalist not found'}</p>
            <Link href="/users" className="mt-4 inline-block text-blue-600 hover:underline">
              ← Back to Manage Users
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={journalist.name}>
      <div className="max-w-7xl mx-auto pb-8 px-4 sm:px-6">
        {/* Back Button */}
        <Link 
          href="/users"
          className="inline-flex items-center text-sm text-slate-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Manage Users
        </Link>

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-6 sm:p-8 shadow-lg text-white relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-40"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg border-2 border-white/30">
                  {journalist.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {journalist.name}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      journalist.status === 'active' 
                        ? 'bg-green-500/20 text-green-100 border border-green-300/30' 
                        : 'bg-red-500/20 text-red-100 border border-red-300/30'
                    }`}>
                      {journalist.status === 'active' ? (
                        <><UserCheck className="w-3 h-3 inline mr-1" /> Active</>
                      ) : (
                        <><UserX className="w-3 h-3 inline mr-1" /> Inactive</>
                      )}
                    </span>
                    {journalist.specialization && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium border border-white/30">
                        {journalist.specialization}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {journalist.bio && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Biography
                </h3>
                <p className="text-slate-700 leading-relaxed">{journalist.bio}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email</div>
                    <div className="text-sm font-medium text-slate-800">{journalist.email}</div>
                  </div>
                </div>
                {journalist.phone && (
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 mr-3 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Phone</div>
                      <div className="text-sm font-medium text-slate-800">{journalist.phone}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Account Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                    journalist.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {journalist.status}
                  </span>
                </div>
                <div>
                  <div className="flex items-center text-slate-500 font-medium mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Joined</span>
                  </div>
                  <span className="ml-6 text-slate-700">{formatDate(journalist.createdAt)}</span>
                </div>
                {journalist.updatedAt && (
                  <div>
                    <div className="flex items-center text-slate-500 font-medium mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Last Updated</span>
                    </div>
                    <span className="ml-6 text-slate-700">{formatDate(journalist.updatedAt)}</span>
                  </div>
                )}
                {journalist.lastActive && (
                  <div>
                    <div className="flex items-center text-slate-500 font-medium mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Last Active</span>
                    </div>
                    <span className="ml-6 text-slate-700">{formatDate(journalist.lastActive)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

