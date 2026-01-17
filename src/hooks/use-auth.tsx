"use client";
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useUser as useFirebaseUser, useAuth as useFirebaseAuthService, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  isAdmin: boolean;
  isAuthLoading: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isUserLoading: isFirebaseUserLoading } = useFirebaseUser();
  const auth = useFirebaseAuthService();
  const firestore = useFirestore();
  const router = useRouter();

  const adminUserRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'admin_users', user.uid);
  }, [firestore, user]);

  const { data: adminUser, isLoading: isAdminUserLoading } = useDoc(adminUserRef);

  const isAdmin = !!adminUser;
  const isAuthLoading = isFirebaseUserLoading || (!!user && isAdminUserLoading);


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
    <AuthContext.Provider value={{ isAdmin, isAuthLoading, login, logout }}>
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
