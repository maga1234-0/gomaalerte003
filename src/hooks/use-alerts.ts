'use client';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Alert } from '@/lib/types';

export function useAlerts() {
  const firestore = useFirestore();
  const alertsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'alerts'), orderBy('createdAt', 'desc'))
        : null,
    [firestore]
  );
  return useCollection<Alert>(alertsQuery);
}
