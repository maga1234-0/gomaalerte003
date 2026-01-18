'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useUsers } from '@/hooks/use-users';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminPage() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();
  
  const { data: users, isLoading: usersLoading } = useUsers(isAuthenticated);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const loading = isAuthLoading || usersLoading;

  if (loading || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full md:hidden" />
              <Skeleton className="h-24 w-full md:hidden" />
              <Skeleton className="h-24 w-full md:hidden" />
              <Skeleton className="h-12 w-full hidden md:block" />
              <Skeleton className="h-12 w-full hidden md:block" />
              <Skeleton className="h-12 w-full hidden md:block" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'PPP', { locale: fr });
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl md:text-3xl">Tableau de bord administrateur</CardTitle>
          <CardDescription>Gérez les utilisateurs de la plateforme Goma Alerte.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Table for medium screens and up */}
          <Table className="hidden md:table">
            <TableHeader>
              <TableRow>
                <TableHead>E-mail</TableHead>
                <TableHead>Inscrit le</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    Aucun utilisateur trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Cards for small screens */}
          <div className="grid gap-4 md:hidden">
            {users && users.length > 0 ? (
                users.map((user) => (
                  <Card key={user.id} className="w-full">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                        <p className="font-semibold break-all">{user.email}</p>
                      </div>
                       <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Inscrit le</p>
                        <p>{formatDate(user.createdAt)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                 <div className="h-24 text-center flex items-center justify-center">
                    <p>Aucun utilisateur trouvé.</p>
                  </div>
              )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
