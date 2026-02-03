"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

function TicketIcon({ className }: { className?: string }) {
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
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
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
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
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
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, isReady } = useAuth();
  const showAgentDashboard =
    user?.role === "admin" || user?.role === "agent";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuId = "site-header-mobile-menu";

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const authName = isAuthenticated
    ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
    : "";

  return (
    <header
      className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur dark:bg-foreground/10"
      role="banner"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link
            href={isReady && isAuthenticated ? "/tickets" : "/"}
            className="flex cursor-pointer items-center gap-2 rounded-md text-lg font-semibold text-foreground transition-colors duration-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
            aria-label="Tickets home"
          >
            <TicketIcon className="h-6 w-6" />
            Tickets
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
            {isReady && isAuthenticated && showAgentDashboard && (
              <Link
                href="/agent/tickets/dashboard"
                className={`cursor-pointer rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  pathname?.startsWith("/agent")
                    ? "text-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Agent Dashboard
              </Link>
            )}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {!isReady ? (
              <span className="text-sm text-muted" aria-hidden>
                …
              </span>
            ) : isAuthenticated ? (
              <>
                <span className="max-w-[180px] truncate text-sm text-muted">
                  {authName}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition-colors duration-200 hover:bg-border hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label="Sign out"
                >
                  <LogoutIcon className="h-5 w-5" />
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:bg-border hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="cursor-pointer rounded-lg bg-cta px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-cta-hover focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && isReady && (
              <span className="max-w-[120px] truncate text-sm text-muted">
                {authName}
              </span>
            )}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors duration-200 hover:bg-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-controls={mobileMenuId}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div
          id={mobileMenuId}
          className={`md:hidden ${isMobileMenuOpen ? "grid" : "hidden"} gap-4 rounded-2xl border border-border bg-background/95 p-4 text-sm shadow-lg`}
        >
          {isReady && isAuthenticated && showAgentDashboard && (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                Navigation
              </span>
              <Link
                href="/agent/tickets/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block rounded-lg px-3 py-2 font-medium transition-colors duration-200 ${
                  pathname?.startsWith("/agent")
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-border"
                }`}
              >
                Agent Dashboard
              </Link>
            </div>
          )}
          <div className="flex flex-col gap-2">
            {!isReady ? (
              <span className="text-muted">Checking authentication…</span>
            ) : isAuthenticated ? (
              <>
                <span className="text-muted">{authName || "Signed in"}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 font-medium text-foreground transition-colors duration-200 hover:bg-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <LogoutIcon className="h-5 w-5" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-border px-3 py-2 font-medium text-foreground transition-colors duration-200 hover:bg-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-cta px-3 py-2 font-medium text-white transition-colors duration-200 hover:bg-cta-hover focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
