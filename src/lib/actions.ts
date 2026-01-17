'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { mockAlerts } from './data';
import type { Alert } from './types';
import { analyzeReport } from '@/ai/flows/alert-verification-tool';

// In a real app, this would be a database connection.
let alerts: Alert[] = mockAlerts;

const reportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['Security', 'Road', 'Power', 'Water', 'Health', 'Other']),
  location: z.string().min(3, 'Location is required'),
  isAnonymous: z.boolean(),
});

export async function getVerifiedAlerts() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return alerts.filter(alert => alert.status === 'verified').sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getAllAlerts() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function submitReport(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  const validatedFields = reportSchema.safeParse({
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location,
    isAnonymous: data.isAnonymous === 'on',
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const newAlert: Alert = {
    id: String(Date.now()),
    ...validatedFields.data,
    status: 'pending',
    createdAt: new Date(),
  };

  alerts.unshift(newAlert);

  revalidatePath('/');
  revalidatePath('/admin');

  return { success: true };
}

export async function approveReport(id: string) {
  const alertIndex = alerts.findIndex(a => a.id === id);
  if (alertIndex > -1) {
    alerts[alertIndex].status = 'verified';
    alerts[alertIndex].verifiedAt = new Date();
    alerts[alertIndex].verifiedBy = 'admin_user_id'; // In real app, get from auth session
  }
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function rejectReport(id: string) {
  const alertIndex = alerts.findIndex(a => a.id === id);
  if (alertIndex > -1) {
    alerts[alertIndex].status = 'archived';
  }
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function runReportAnalysis(title: string, description: string) {
  try {
    const result = await analyzeReport({ title, description });
    return { data: result };
  } catch (error) {
    console.error('AI analysis failed:', error);
    return { error: 'Failed to analyze report.' };
  }
}
