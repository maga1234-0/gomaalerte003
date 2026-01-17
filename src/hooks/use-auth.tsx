"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';

type AuthContextType = {
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const login = useCallback(() => setIsAdmin(true), []);
  const logout = useCallback(() => setIsAdmin(false), []);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
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
