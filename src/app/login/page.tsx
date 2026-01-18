"use client";

import { LoginForm } from "@/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import QRCode from "react-qr-code";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function LoginPage() {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [isLocalhost, setIsLocalhost] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
      setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    }
  }, []);

  if (isAuthLoading || isAuthenticated) {
    return (
        <div className="container mx-auto flex items-center justify-center py-12">
            <Skeleton className="h-[550px] w-full max-w-md" />
        </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center py-12">
      <Card className={cn("w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-300")}>
        <CardHeader className="text-center animate-in fade-in-0 slide-in-from-top-5 duration-500" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
          <CardTitle className="font-headline text-2xl">Bienvenue sur Goma Alerte</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte pour signaler des incidents et voir les alertes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-4 text-center text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-top-5 duration-500" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
            Vous n'avez pas de compte ?{' '}
            <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
              Inscrivez-vous
            </Link>
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-4 pt-6 border-t animate-in fade-in-0 slide-in-from-bottom-5 duration-500" style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}>
          <p className="text-sm text-muted-foreground">Scannez pour ouvrir sur votre téléphone</p>
          
          {isLocalhost ? (
             <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Avis au développeur</AlertTitle>
                <AlertDescription>
                  Le code QR est masqué sur localhost. Il sera affiché et fonctionnel lorsque votre application sera déployée sur une URL publique.
                </AlertDescription>
              </Alert>
          ) : url ? (
            <div className="p-2 bg-white rounded-md">
              <QRCode value={url} size={128} />
            </div>
          ) : (
            <Skeleton className="h-36 w-36" />
          )}

        </CardFooter>
      </Card>
    </div>
  );
}
