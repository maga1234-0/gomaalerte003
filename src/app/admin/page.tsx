"use client";

import { AdminDashboard } from "@/components/admin/dashboard";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const { isAdmin, isAuthLoading, login } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center py-12">
        <Skeleton className="h-48 w-full max-w-md" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto flex items-center justify-center py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You must be an administrator to view this page.</p>
            <Button onClick={login}>Login as Admin</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminDashboard />
    </div>
  );
}
