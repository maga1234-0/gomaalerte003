export type AlertCategory = 'Security' | 'Road' | 'Power' | 'Water' | 'Health' | 'Other';
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
