"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, PlusCircle } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const { isAuthenticated, isAuthLoading, login, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Bell className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline-block font-bold font-headline text-lg">Goma Alerte</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center gap-2">
            {isAuthLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : isAuthenticated ? (
              <>
                <Link href="/report">
                  <Button>
                    <PlusCircle />
                    <span className="hidden sm:inline">Nouvelle Alerte</span>
                  </Button>
                </Link>
                <Button onClick={logout} variant="secondary">
                  <LogOut />
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              </>
            ) : (
              <>
                {/* Login and signup buttons removed as requested */}
              </>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
