"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUser as useFirebaseUser, useAuth as useFirebaseAuthService } from '@/firebase';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  isAdmin: boolean;
  isAuthLoading: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isUserLoading } = useFirebaseUser();
  const auth = useFirebaseAuthService();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // For now, we'll consider any logged-in user an admin.
    // In a real app, you'd check for a custom claim or a role in the database.
    setIsAdmin(!!user);
  }, [user]);

  const login = useCallback(() => {
    router.push('/login');
  }, [router]);

  const logout = useCallback(() => {
    if (auth) {
      auth.signOut();
      router.push('/');
    }
  }, [auth, router]);

  return (
    <AuthContext.Provider value={{ isAdmin, isAuthLoading: isUserLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
