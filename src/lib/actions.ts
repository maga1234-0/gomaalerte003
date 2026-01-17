'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { mockAlerts } from './data';
import type { Alert } from './types';

// In a real app, this would be a database connection.
let alerts: Alert[] = mockAlerts;

const reportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['Security', 'Road', 'Power', 'Water', 'Health', 'Other']),
  location: z.string().min(3, 'Location is required'),
  userId: z.string(),
});

export async function getVerifiedAlerts() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Since there are no admins, all alerts are considered "verified" for the feed.
  return alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function submitReport(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  const validatedFields = reportSchema.safeParse({
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location,
    userId: data.userId,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      error: 'Validation failed'
    };
  }

  const newAlert: Alert = {
    id: String(Date.now()),
    ...validatedFields.data,
    status: 'verified', // All reports are automatically verified
    createdAt: new Date(),
  };

  alerts.unshift(newAlert);

  revalidatePath('/');

  return { success: true };
}
