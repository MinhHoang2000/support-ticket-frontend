"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Where to send unauthenticated users (default: /sign-in with redirect) */
  signInPath?: string;
}

/**
 * Wraps content that requires authentication. Redirects to sign-in if not logged in.
 * Use in a layout for routes that require auth (e.g. /tickets).
 */
export function ProtectedRoute({
  children,
  signInPath = "/sign-in",
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      const redirect = `${signInPath}?redirect=${encodeURIComponent(pathname ?? "/tickets")}`;
      router.replace(redirect);
    }
  }, [isReady, isAuthenticated, router, pathname, signInPath]);

  if (!isReady || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted">Loading…</div>
      </div>
    );
  }

  return <>{children}</>;
}
