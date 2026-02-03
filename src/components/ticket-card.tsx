"use client";

import Link from "next/link";
import type { Ticket } from "@/lib/tickets-api";
import { getStatusLabel, getStatusColorClass } from "@/lib/ticket-status";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function urgencyColorClass(urgency: string | null): string {
  if (!urgency) return "text-muted-foreground";
  const u = urgency.toLowerCase();
  if (u === "low") return "text-green-600 dark:text-green-400";
  if (u === "high") return "text-red-600 dark:text-red-400";
  if (u === "medium") return "text-yellow-600 dark:text-yellow-400";
  return "text-muted-foreground";
}

/** Left border color matches urgency: low=green, high=red, medium=yellow. */
function urgencyBorderClass(urgency: string | null): string {
  const base = "border-l-4 ";
  if (!urgency) return `${base}border-l-border`;
  const u = urgency.toLowerCase();
  if (u === "low") return `${base}border-l-green-600 dark:border-l-green-400`;
  if (u === "high") return `${base}border-l-red-600 dark:border-l-red-400`;
  if (u === "medium") return `${base}border-l-yellow-600 dark:border-l-yellow-400`;
  return `${base}border-l-border`;
}

function SentimentBadge({ sentiment }: { sentiment: number | null }) {
  if (sentiment == null) {
    return (
      <span className="rounded-full bg-muted/50 px-2 py-0.5 text-xs text-muted">
        —
      </span>
    );
  }
  const label = String(sentiment);
  const isNegative = sentiment < 0;
  return (
    <span
      className={
        isNegative
          ? "rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800 dark:bg-red-950/50 dark:text-red-200"
          : "rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200"
      }
      title="Sentiment score"
    >
      {label}
    </span>
  );
}

export interface TicketCardProps {
  ticket: Ticket;
  href: string;
  variant: "user" | "agent";
}

export function TicketCard({ ticket, href, variant }: TicketCardProps) {
  const isAgent = variant === "agent";

  return (
    <Link
      href={href}
      className={`block rounded-lg border border-border bg-card p-4 transition-colors duration-200 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 ${urgencyBorderClass(ticket.urgency)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-medium text-foreground line-clamp-1">
          {ticket.title}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColorClass(ticket.status)}`}
        >
          {getStatusLabel(ticket.status)}
        </span>
      </div>

      {isAgent && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">Sentiment</span>
          <SentimentBadge sentiment={ticket.sentiment} />
          {ticket.urgency && (
            <span className="text-xs text-muted">
              Urgency:{" "}
              <span
                className={`font-medium capitalize ${urgencyColorClass(ticket.urgency)}`}
              >
                {ticket.urgency.toLowerCase()}
              </span>
            </span>
          )}
        </div>
      )}

      <p className="mt-2 min-h-15 line-clamp-3 text-sm text-muted">
        {ticket.content}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground/80">
        {!isAgent && ticket.urgency && (
          <span>
            Urgency:{" "}
            <span
              className={`font-medium capitalize ${urgencyColorClass(ticket.urgency)}`}
            >
              {ticket.urgency.toLowerCase()}
            </span>
          </span>
        )}
        <span className="uppercase tracking-wider">
          {formatDate(ticket.createdAt)}
        </span>
      </div>
    </Link>
  );
}
