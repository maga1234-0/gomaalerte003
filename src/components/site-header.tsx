"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, PlusCircle } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const { isAuthenticated, isAuthLoading, login, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold font-headline text-lg">Goma Alert</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {isAuthLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : isAuthenticated ? (
              <>
                <Link href="/report">
                  <Button>
                    <PlusCircle />
                    <span className="hidden sm:inline">Report</span>
                  </Button>
                </Link>
                <Button onClick={logout} variant="secondary">
                  <LogOut />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                 <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
