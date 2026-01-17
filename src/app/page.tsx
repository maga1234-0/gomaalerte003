"use client";

import { AlertFeed } from "@/components/alert-feed";
import { getVerifiedAlerts } from "@/lib/actions";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Alert } from "@/lib/types";

export default function Home() {
  const { isAdmin, isAuthLoading } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAdmin) {
      router.push('/login');
    }
  }, [isAuthLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      getVerifiedAlerts().then(data => {
        setAlerts(data);
        setLoading(false);
      });
    }
  }, [isAdmin]);

  if (isAuthLoading || !isAdmin) {
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

  if (loading && isAdmin) {
     return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <h1 className="text-3xl font-bold font-headline text-primary">
              Verified Alerts
            </h1>
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
      <AlertFeed initialAlerts={alerts} />
    </div>
  );
}
