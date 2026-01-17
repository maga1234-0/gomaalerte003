import type { Alert } from './types';

const now = new Date();

export const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Power Outage in Katindo',
    description: 'There has been a widespread power outage in the Katindo area since this morning. The local power company has been notified.',
    category: 'Power',
    location: 'Katindo',
    status: 'verified',
    userId: 'user1',
    createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    title: 'Security Incident near Mapendo Market',
    description: 'Reports of increased security presence and cordoned off areas around Mapendo Market. Advise to avoid the area.',
    category: 'Security',
    location: 'Mapendo',
    status: 'verified',
    userId: 'user2',
    createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: '3',
    title: 'Water pipe burst on Boulevard Kanyamuhanga',
    description: 'A major water pipe has burst, causing flooding and water shortages in the Mabanga Sud district. Repair crews are on their way.',
    category: 'Water',
    location: 'Mabanga Sud',
    status: 'verified',
    userId: 'user1',
    createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '4',
    title: 'Roadblock on the main road to Sake',
    description: 'A temporary roadblock has been set up by authorities for security checks on the road leading to Sake. Expect delays.',
    category: 'Road',
    location: 'Virunga',
    status: 'verified',
    userId: 'user3',
    createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
  },
  {
    id: '5',
    title: 'Free health clinic at Ndosho General Hospital',
    description: 'A mobile health clinic is offering free check-ups and basic medical care today at Ndosho General Hospital until 5 PM.',
    category: 'Health',
    location: 'Ndosho',
    status: 'verified',
    userId: 'user4',
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
   {
    id: '6',
    title: 'Community meeting about waste management',
    description: 'All residents of Kyeshero are invited to a community meeting tonight at 6 PM to discuss new waste management initiatives.',
    category: 'Other',
    location: 'Kyeshero',
    status: 'verified',
    userId: 'user5',
    createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: '7',
    title: 'Suspicious activity reported in Les Volcans',
    description: 'A user reported hearing strange noises and seeing unfamiliar people in the alley behind the main street. Requesting verification.',
    category: 'Security',
    location: 'Les Volcans',
    status: 'verified',
    userId: 'user2',
    createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
];
