"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TicketCard } from "@/components/ticket-card";
import { useAuth } from "@/contexts/auth-context";
import { toastError } from "@/lib/toast";
import { fetchMyTickets, type Ticket } from "@/lib/tickets-api";

function PlusIcon({ className }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export default function TicketsPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    let cancelled = false;
    queueMicrotask(() => {
      setLoading(true);
      setError(null);
    });
    fetchMyTickets(token)
      .then((data) => {
        if (!cancelled) {
          setTickets(data.tickets);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Failed to load tickets";
          setError(msg);
          toastError(msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Support tickets
          </h1>
          <p className="mt-1 text-muted">
            Your support tickets and requests.
          </p>
        </div>
        <Link
          href="/tickets/create-ticket"
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-cta-hover focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5" />
          Create ticket
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
        <p className="mt-6 text-muted">You have no tickets yet.</p>
      )}

      {!loading && !error && tickets.length > 0 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <TicketCard
                ticket={ticket}
                href={`/tickets/${ticket.id}`}
                variant="user"
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
