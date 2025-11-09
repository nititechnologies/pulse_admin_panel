'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdministrator: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ user: User } | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock admin user object
const createAdminUser = (): User => {
  return {
    uid: 'admin-uid',
    email: 'admin',
    displayName: 'Admin',
    emailVerified: true,
    isAnonymous: false,
    phoneNumber: null,
    photoURL: null,
    providerId: 'firebase',
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
    providerData: [],
    refreshToken: 'admin-token',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'admin-token',
    getIdTokenResult: async () => ({
      token: 'admin-token',
      authTime: '',
      issuedAtTime: '',
      expirationTime: '',
      signInProvider: null,
      signInSecondFactor: null,
      claims: {},
    }),
    reload: async () => {},
    toJSON: () => ({}),
  } as User;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  // Check if user is administrator
  const isAdministrator = isAdminUser || (user?.email?.toLowerCase() === 'admin');

  useEffect(() => {
    // Check for admin in localStorage on mount
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession === 'true') {
      setUser(createAdminUser());
      setIsAdminUser(true);
      setLoading(false);
      return;
    }

    // For non-admin users, use Firebase auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAdminUser(false);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const loginEmail = email.toLowerCase().trim();
      const loginPassword = password.trim();

      // Check for admin credentials - bypass Firebase entirely
      if (loginEmail === 'admin' && loginPassword === 'admin') {
        const adminUser = createAdminUser();
        setUser(adminUser);
        setIsAdminUser(true);
        localStorage.setItem('admin_session', 'true');
        return; // Don't call Firebase
      }

      // For regular users, use Firebase authentication
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string): Promise<{ user: User } | null> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // If admin user, clear admin session
      if (isAdminUser) {
        setUser(null);
        setIsAdminUser(false);
        localStorage.removeItem('admin_session');
        return;
      }
      // For regular users, sign out from Firebase
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAdministrator,
    signIn,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
