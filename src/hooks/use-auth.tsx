"use client";
import React, { createContext, useContext, useCallback } from 'react';
import { useUser as useFirebaseUser, useAuth as useFirebaseAuthService } from '@/firebase';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isUserLoading: isAuthLoading } = useFirebaseUser();
  const auth = useFirebaseAuthService();
  const router = useRouter();

  const isAuthenticated = !!user && !isAuthLoading;

  const login = useCallback(() => {
    router.push('/login');
  }, [router]);

  const logout = useCallback(() => {
    if (auth) {
      auth.signOut().then(() => {
        router.push('/login');
      });
    }
  }, [auth, router]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAuthLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
