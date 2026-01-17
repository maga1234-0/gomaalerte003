"use client";

import { AlertFeed } from "@/components/alert-feed";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlerts } from "@/hooks/use-alerts";

export default function Home() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();
  
  const { data: alerts, isLoading: alertsLoading } = useAlerts();

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
