"use client";

import { AlertFeed } from "@/components/alert-feed";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Alert } from "@/lib/types";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

export default function Home() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();
  const firestore = useFirestore();

  const alertsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'alerts'), orderBy('createdAt', 'desc'))
        : null,
    [firestore]
  );
  
  const { data: alerts, isLoading: alertsLoading } = useCollection<Alert>(alertsQuery);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const loading = isAuthLoading || alertsLoading;

  if (loading || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <Skeleton className="h-10 w-48" />
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Skeleton className="h-10 w-full sm:w-[180px]" />
                <Skeleton className="h-10 w-full sm:w-[180px]" />
                <Skeleton className="h-10 w-20" />
            </div>
        </div>
        <div className="grid gap-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AlertFeed initialAlerts={alerts || []} />
    </div>
  );
}
