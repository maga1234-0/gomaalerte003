export type AlertCategory = 'Security' | 'Road' | 'Power' | 'Water' | 'Health' | 'Other';
export type AlertStatus = 'pending' | 'verified' | 'archived';

export type Alert = {
  id: string;
  title: string;
  description: string;
  category: AlertCategory;
  location: string;
  status: AlertStatus;
  isAnonymous: boolean;
  createdAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string; // admin_uid
};
