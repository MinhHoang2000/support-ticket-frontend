"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  if (isReady && isAuthenticated) {
    router.replace("/tickets");
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Tickets
        </h1>
        <p className="mt-3 text-muted">
          Manage support tickets and responses in one place.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/sign-in"
            className="flex cursor-pointer items-center justify-center rounded-lg bg-cta px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-cta-hover focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="flex cursor-pointer items-center justify-center rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 dark:bg-foreground/5 dark:hover:bg-primary/10"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
