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
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
            <Skeleton className="h-96 w-full max-w-md" />
        </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl md:text-3xl">Créer un compte</CardTitle>
          <CardDescription>
            Rejoignez Goma Alerte pour rester informé et signaler des incidents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
          <p className="mt-4 text-center text-sm text-muted-foreground">
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
