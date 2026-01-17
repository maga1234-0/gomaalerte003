"use client";

import { LoginForm } from "@/components/login-form";
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
import { cn } from "@/lib/utils";

export default function LoginPage() {
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
          <CardTitle className="font-headline text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-4 text-center text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-top-5 duration-500" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
