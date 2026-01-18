export type AlertCategory = 'Sécurité' | 'Route' | 'Électricité' | 'Eau' | 'Santé' | 'Autre';
export type AlertStatus = 'pending' | 'verified' | 'archived';

export type Alert = {
  id: string;
  title?: string;
  description?: string;
  category?: AlertCategory;
  location?: string;
  status: AlertStatus;
  userId: string;
  createdAt: any;
  audioUrl?: string;
};

export type UserProfile = {
  id: string;
  email: string;
  createdAt: any; // Firestore Timestamp
};
