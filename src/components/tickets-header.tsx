"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

export function TicketsHeader() {
  const { user, logout } = useAuth();
  const showAgentDashboard =
    user?.role === "admin" || user?.role === "agent";

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-white/90 backdrop-blur dark:bg-foreground/5">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <nav className="flex items-center gap-6" aria-label="Main">
          <Link
            href="/tickets"
            className="text-lg font-semibold text-foreground transition-colors duration-200 hover:text-primary"
          >
            Tickets
          </Link>
          {showAgentDashboard && (
            <Link
              href="/agent/tickets/dashboard"
              className="text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Agent Dashboard
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">
            {user?.firstName} {user?.lastName}
          </span>
          <button
            type="button"
            onClick={() => logout()}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors duration-200 hover:bg-border hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Sign out"
          >
            <LogoutIcon className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
