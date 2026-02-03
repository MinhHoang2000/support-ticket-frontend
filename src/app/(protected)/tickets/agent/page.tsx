"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TicketCard } from "@/components/ticket-card";
import { useAuth } from "@/contexts/auth-context";
import { toastError } from "@/lib/toast";
import {
  fetchAllTickets,
  type Ticket,
} from "@/lib/tickets-api";

export default function AgentDashboardPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!token) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    let cancelled = false;
    queueMicrotask(() => {
      setLoading(true);
      setError(null);
      setAccessDenied(false);
    });
    fetchAllTickets(token, { page, limit: 20 })
      .then((data) => {
        if (!cancelled) {
          setTickets(data.tickets);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        }
      })
      .catch((err: Error & { status?: number; errorCode?: string }) => {
        if (!cancelled) {
          if (err.status === 403 || err.errorCode === "FORBIDDEN") {
            setAccessDenied(true);
            setTickets([]);
          } else {
            const msg = err.message ?? "Failed to load tickets";
            setError(msg);
            toastError(msg);
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, page]);

  if (accessDenied) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <h1 className="text-xl font-semibold text-foreground">
            Access denied
          </h1>
          <p className="mt-2 text-muted">
            Only agents and admins can view the Agent Dashboard.
          </p>
          <Link
            href="/tickets"
            className="mt-4 inline-block cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Back to My tickets
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Agent Dashboard
          </h1>
          <p className="mt-1 text-muted">
            All tickets, color-coded by urgency. Red = high, yellow = medium, green = low.
          </p>
        </div>
        <Link
          href="/tickets"
          className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          My tickets
        </Link>
      </div>

      {loading && (
        <p className="mt-6 text-muted">Loading tickets…</p>
      )}

      {error && (
        <p className="mt-6 text-destructive" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && tickets.length === 0 && (
        <p className="mt-6 text-muted">No tickets yet.</p>
      )}

      {!loading && !error && tickets.length > 0 && (
        <>
          <ul className="mt-6 grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <TicketCard
                  ticket={ticket}
                  href={`/tickets/agent/${ticket.id}`}
                  variant="agent"
                />
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <nav
              className="mt-6 flex flex-wrap items-center gap-2"
              aria-label="Pagination"
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="cursor-pointer rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Previous
              </button>
              <span className="text-sm text-muted">
                Page {page} of {totalPages} ({total} total)
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="cursor-pointer rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
