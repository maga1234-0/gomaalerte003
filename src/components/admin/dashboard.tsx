"use client";

import { useEffect, useState, useMemo } from "react";
import type { Alert } from "@/lib/types";
import { getAllAlerts } from "@/lib/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingReportCard } from "./pending-report-card";
import { AlertCard } from "../alert-card";
import { Skeleton } from "../ui/skeleton";

export function AdminDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      setLoading(true);
      const allAlerts = await getAllAlerts();
      setAlerts(allAlerts);
      setLoading(false);
    }
    loadAlerts();
  }, []);

  const pendingAlerts = useMemo(() => alerts.filter((a) => a.status === 'pending'), [alerts]);
  const verifiedAlerts = useMemo(() => alerts.filter((a) => a.status === 'verified'), [alerts]);
  const archivedAlerts = useMemo(() => alerts.filter((a) => a.status === 'archived'), [alerts]);

  const renderAlertList = (list: Alert[], isPending = false) => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      );
    }
    if (list.length === 0) {
      return <div className="text-center text-muted-foreground py-10">No alerts in this category.</div>;
    }
    return (
      <div className="space-y-4">
        {list.map((alert) =>
          isPending ? (
            <PendingReportCard key={alert.id} alert={alert} />
          ) : (
            <AlertCard key={alert.id} alert={alert} />
          )
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline text-primary">Admin Dashboard</h1>
      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({pendingAlerts.length})</TabsTrigger>
          <TabsTrigger value="verified">Verified ({verifiedAlerts.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedAlerts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-6">
          {renderAlertList(pendingAlerts, true)}
        </TabsContent>
        <TabsContent value="verified" className="mt-6">
          {renderAlertList(verifiedAlerts)}
        </TabsContent>
        <TabsContent value="archived" className="mt-6">
          {renderAlertList(archivedAlerts)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
