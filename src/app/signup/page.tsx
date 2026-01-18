"use client";

import { SignupForm } from "@/components/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function SignupPage() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  if (isAuthLoading || isAuthenticated) {
    return (
        <div className="container mx-auto flex items-center justify-center py-12">
            <Skeleton className="h-96 w-full max-w-md" />
        </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center py-12">
      <Card className="w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="text-center animate-in fade-in-0 slide-in-from-top-5 duration-500" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
          <CardTitle className="font-headline text-2xl">Créer un compte</CardTitle>
          <CardDescription>
            Rejoignez Goma Alerte pour rester informé et signaler des incidents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
          <p className="mt-4 text-center text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-top-5 duration-500" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
              Connectez-vous
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
