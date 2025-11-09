'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { User, Mail, Phone, Save, Edit, LogOut, Shield, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getJournalistByUid, updateJournalist } from '@/lib/journalists';
import { Timestamp } from 'firebase/firestore';

interface ProfileData {
  name: string;
  email: string;
  role: string;
  phone: string;
  joinDate: string;
  bio: string;
  specialization?: string;
  profilePicture: string | null;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    role: '',
    phone: '',
    joinDate: '',
    bio: '',
    specialization: '',
    profilePicture: null as string | null
  });
  const [journalistId, setJournalistId] = useState<string | null>(null);
  const { user, logout, isAdministrator } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      if (isAdministrator) {
        // Admin profile
        setProfileData({
          name: 'Admin',
          email: user?.email || 'admin',
          role: 'Administrator',
          phone: '',
          joinDate: new Date().toLocaleDateString(),
          bio: 'System Administrator with full access to manage content, users, and platform operations.',
          profilePicture: null,
        });
      } else if (user?.uid) {
        // Journalist profile - fetch from Firestore
        const journalist = await getJournalistByUid(user.uid);
        if (journalist) {
          setJournalistId(journalist.id || null);
          setProfileData({
            name: journalist.name,
            email: journalist.email,
            role: 'Journalist',
            phone: journalist.phone || '',
            joinDate: journalist.createdAt instanceof Timestamp 
              ? journalist.createdAt.toDate().toLocaleDateString()
              : journalist.createdAt 
              ? new Date(journalist.createdAt).toLocaleDateString()
              : 'Unknown',
            bio: journalist.bio || '',
            specialization: journalist.specialization || '',
            profilePicture: journalist.profileImage || null,
          });
        } else {
          // Journalist not found in Firestore, use auth data
          setProfileData({
            name: user.displayName || 'Journalist',
            email: user.email || '',
            role: 'Journalist',
            phone: '',
            joinDate: user.metadata.creationTime 
              ? new Date(user.metadata.creationTime).toLocaleDateString()
              : 'Unknown',
            bio: '',
            profilePicture: null,
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (field: string, value: string | null) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (isAdministrator) {
      // Admin profile is read-only (or you can implement admin profile updates if needed)
      setIsEditing(false);
      return;
    }

    if (!journalistId) {
      alert('Unable to update profile. Please contact support.');
      return;
    }

    try {
      setSaving(true);
      await updateJournalist(journalistId, {
        name: profileData.name,
        phone: profileData.phone || undefined,
        bio: profileData.bio || undefined,
        specialization: profileData.specialization || undefined,
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout title="Profile">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout title="Profile">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-6 shadow-lg text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] opacity-40"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-20 h-20 ${isAdministrator ? 'bg-purple-500/20' : 'bg-blue-500/20'} backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg`}>
                    {isAdministrator ? (
                      <Shield className="w-10 h-10 text-white" />
                    ) : (
                      <User className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">{profileData.name}</h1>
                    <p className="text-blue-100 flex items-center mt-1">
                      {isAdministrator ? (
                        <>
                          <Shield className="w-4 h-4 mr-1" />
                          Administrator
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-1" />
                          Journalist
                        </>
                      )}
                    </p>
                    <p className="text-sm text-blue-200 mt-1">Joined {profileData.joinDate}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {!isAdministrator && (
                    !isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            loadProfileData(); // Reload to reset changes
                          }}
                          className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors"
                          disabled={saving}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                      </div>
                    )
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500/20 backdrop-blur-md border border-red-300/30 text-white rounded-lg hover:bg-red-500/30 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleProfileUpdate('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <p className="text-gray-900 py-3">{profileData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  Email Address
                </label>
                <p className="text-gray-900 py-3">{profileData.email}</p>
                {!isAdministrator && (
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <p className="text-gray-900 py-3">{profileData.phone}</p>
                )}
              </div>

              {!isAdministrator && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.specialization || ''}
                      onChange={(e) => handleProfileUpdate('specialization', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., Technology, Politics, Sports"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{profileData.specialization || 'Not specified'}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bio Section */}
          {!isAdministrator && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">About</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900 py-3 leading-relaxed">{profileData.bio || 'No bio available'}</p>
                )}
              </div>
            </div>
          )}

          {/* Admin Info Section */}
          {isAdministrator && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-600" />
                Administrator Information
              </h3>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800">
                  As an administrator, you have full access to manage all content, users, and platform settings.
                  Your profile information is managed at the system level.
                </p>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
