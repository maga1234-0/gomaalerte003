'use client';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';

export function useUsers() {
  const firestore = useFirestore();
  const usersQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'users'), orderBy('createdAt', 'desc'))
        : null,
    [firestore]
  );
  return useCollection<UserProfile>(usersQuery);
}
