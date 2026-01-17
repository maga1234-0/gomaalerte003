'use client';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';

export function useUsers(enabled: boolean = true) {
  const firestore = useFirestore();
  const usersQuery = useMemoFirebase(
    () =>
      firestore && enabled
        ? query(collection(firestore, 'users'), orderBy('createdAt', 'desc'))
        : null,
    [firestore, enabled]
  );
  return useCollection<UserProfile>(usersQuery);
}
