"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTicket, useCloseTicket } from "@/lib/tickets-queries";
import { getStatusLabel, getStatusColorClass } from "@/lib/ticket-status";
import { toastError, toastSuccess } from "@/lib/toast";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function BackIcon({ className }: { className?: string }) {
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
      <path d="M19 12H5" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function CloseTicketIcon({ className }: { className?: string }) {
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
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export default function UserTicketDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? parseInt(params.id, 10) : NaN;

  const {
    data: ticket,
    isLoading: loading,
    isError: isQueryError,
    error: queryError,
  } = useTicket(id);

  const closeTicketMutation = useCloseTicket(id, {
    onSuccess: () => {
      toastSuccess("Ticket closed");
    },
    onError: (err) => {
      toastError(err instanceof Error ? err.message : "Failed to close ticket");
    },
  });

  const err = queryError as Error & { status?: number; errorCode?: string } | undefined;
  const notAvailable =
    isQueryError && err && (err.status === 404 || (err as { status?: number }).status === 404);
  const errorMessage =
    isQueryError && err ? err.message ?? "Failed to load ticket" : null;

  const handleClose = () => {
    if (Number.isNaN(id)) return;
    closeTicketMutation.mutate();
  };

  const showResponse =
    ticket &&
    (ticket.status === "RESOLVED" || ticket.status === "CLOSED");
  const showCloseButton =
    ticket && ticket.status !== "CLOSED" && !closeTicketMutation.isSuccess;

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-muted">Loading ticket…</p>
      </main>
    );
  }

  if (notAvailable) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <h1 className="text-xl font-semibold text-foreground">
            Ticket in progress
          </h1>
          <p className="mt-2 text-muted">
            Full detail is available once this ticket is resolved or closed.
          </p>
          <Link
            href="/tickets"
            className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <BackIcon className="h-5 w-5" />
            Back to my tickets
          </Link>
        </div>
      </main>
    );
  }

  if (errorMessage && !ticket) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-destructive" role="alert">
          {errorMessage}
        </p>
        <Link
          href="/tickets"
          className="mt-4 inline-block cursor-pointer text-sm text-primary transition-colors duration-200 hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          Back to my tickets
        </Link>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-muted">Ticket not found.</p>
        <Link
          href="/tickets"
          className="mt-4 inline-block cursor-pointer text-sm text-primary transition-colors duration-200 hover:text-primary-hover"
        >
          Back to my tickets
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/tickets"
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <BackIcon className="h-5 w-5" />
          My tickets
        </Link>
        {showCloseButton && (
          <button
            type="button"
            onClick={handleClose}
            disabled={closeTicketMutation.isPending}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <CloseTicketIcon className="h-5 w-5" />
            {closeTicketMutation.isPending ? "Closing…" : "Close ticket"}
          </button>
        )}
      </div>

      {closeTicketMutation.isError && (
        <p
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200"
          role="alert"
        >
          {closeTicketMutation.error?.message}
        </p>
      )}

      <article className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="text-2xl font-semibold text-foreground">
            {ticket.title}
          </h1>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${getStatusColorClass(ticket.status)}`}
          >
            {getStatusLabel(ticket.status)}
          </span>
        </div>
        <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground/80">
          Created {formatDate(ticket.createdAt)} · Updated{" "}
          {formatDate(ticket.updatedAt)}
        </p>
        {ticket.urgency && (
          <p className="mt-1 text-sm text-muted">
            Urgency:{" "}
            <span className="font-medium text-foreground">{ticket.urgency}</span>
          </p>
        )}

        <section className="mt-6">
          <h2 className="text-lg font-medium text-foreground">Your message</h2>
          <div className="mt-2 rounded-lg border border-border bg-background/50 p-4 text-sm text-muted">
            {ticket.content}
          </div>
        </section>

        {showResponse && ticket.response != null && ticket.response.trim() !== "" && (
          <section className="mt-6 border-t border-border pt-6">
            <h2 className="text-lg font-medium text-foreground">
              Support response
            </h2>
            <div className="mt-2 rounded-lg border border-border bg-muted/30 p-4 text-sm text-foreground">
              {ticket.response}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
