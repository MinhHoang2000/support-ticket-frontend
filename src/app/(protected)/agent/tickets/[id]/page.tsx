/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppTextArea } from "@/components/ui";
import {
  useAgentTicket,
  useUpdateDraft,
  useResolveTicket,
} from "@/lib/tickets-queries";
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

function CheckIcon({ className }: { className?: string }) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function AgentTicketDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? parseInt(params.id, 10) : NaN;
  const [draft, setDraft] = useState("");
  const [saveDraftSuccess, setSaveDraftSuccess] = useState(false);
  const [resolveSuccess, setResolveSuccess] = useState(false);

  const {
    data: ticket,
    isLoading: loading,
    isError: isQueryError,
    error: queryError,
  } = useAgentTicket(id);

  const updateDraftMutation = useUpdateDraft(id, {
    onSuccess: () => {
      setSaveDraftSuccess(true);
      setTimeout(() => setSaveDraftSuccess(false), 3000);
    },
    onError: (err) => {
      toastError(err instanceof Error ? err.message : "Failed to save draft");
    },
  });

  const resolveTicketMutation = useResolveTicket(id, {
    onSuccess: () => {
      setResolveSuccess(true);
      toastSuccess("Ticket resolved");
    },
    onError: (err) => {
      const msg =
        err instanceof Error ? err.message : "Failed to resolve ticket";
      toastError(msg);
    },
  });

  useEffect(() => {
    if (ticket?.responseDraft != null) setDraft(ticket.responseDraft);
    else if (ticket) setDraft("");
  }, [ticket?.id, ticket?.responseDraft]);

  const err = queryError as Error & { status?: number; errorCode?: string } | undefined;
  const accessDenied =
    isQueryError && err && (err.status === 403 || err.errorCode === "FORBIDDEN");
  const error =
    isQueryError && !accessDenied && err
      ? err.message ?? "Failed to load ticket"
      : null;

  const handleSaveDraft = () => {
    if (Number.isNaN(id)) return;
    updateDraftMutation.mutate(draft);
  };

  const handleResolve = () => {
    if (Number.isNaN(id)) return;
    resolveTicketMutation.mutate();
  };

  const isResolved =
    ticket?.status === "RESOLVED" ||
    ticket?.status === "CLOSED" ||
    resolveSuccess;
  const canEditDraft =
    (ticket?.status === "OPEN" || ticket?.status === "IN_PROGRESS") &&
    !resolveSuccess;
  const savingDraft = updateDraftMutation.isPending;
  const resolving = resolveTicketMutation.isPending;

  if (accessDenied) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <h1 className="text-xl font-semibold text-foreground">
            Access denied
          </h1>
          <p className="mt-2 text-muted">
            Only agents and admins can view this ticket.
          </p>
          <Link
            href="/agent/tickets/dashboard"
            className="mt-4 inline-block cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Back to Agent Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-muted">Loading ticket…</p>
      </main>
    );
  }

  if (error && !ticket) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-destructive" role="alert">
          {error}
        </p>
        <Link
          href="/agent/tickets/dashboard"
          className="mt-4 inline-block cursor-pointer text-sm text-primary transition-colors duration-200 hover:text-primary-hover"
        >
          Back to Agent Dashboard
        </Link>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-muted">Ticket not found.</p>
        <Link
          href="/agent/tickets/dashboard"
          className="mt-4 inline-block cursor-pointer text-sm text-primary transition-colors duration-200 hover:text-primary-hover"
        >
          Back to Agent Dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/agent/tickets/dashboard"
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <BackIcon className="h-5 w-5" />
          Agent Dashboard
        </Link>
      </div>

      {(updateDraftMutation.isError || resolveTicketMutation.isError) && (
        <p
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200"
          role="alert"
        >
          {updateDraftMutation.error?.message ??
            resolveTicketMutation.error?.message}
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
        {ticket.sentiment != null && (
          <p className="mt-1 text-sm text-muted">
            Sentiment:{" "}
            <span className="font-medium text-foreground">
              {ticket.sentiment}
            </span>
          </p>
        )}

        <section className="mt-6">
          <h2 className="text-lg font-medium text-foreground">
            Customer message
          </h2>
          <div className="mt-2 rounded-lg border border-border bg-background/50 p-4 text-sm text-muted">
            {ticket.content}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-medium text-foreground">
            AI draft (editable)
          </h2>
          <p className="mt-1 text-sm text-muted">
            Edit the draft below and save. When ready, click Resolve to mark the
            ticket resolved.
          </p>
          <AppTextArea
            id="agent-draft"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={!canEditDraft}
            rows={12}
            className="mt-2 w-full px-4 py-3 text-sm disabled:opacity-60"
            placeholder="AI-generated reply draft…"
            aria-label="AI reply draft"
          />
          {canEditDraft && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={savingDraft}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {savingDraft ? "Saving…" : "Save draft"}
              </button>
              {saveDraftSuccess && (
                <span className="text-sm text-cta">Draft saved.</span>
              )}
            </div>
          )}
        </section>

        <section className="mt-6 border-t border-border pt-6">
          <h2 className="text-lg font-medium text-foreground">
            Resolve ticket
          </h2>
          <p className="mt-1 text-sm text-muted">
            Mark this ticket as resolved.
          </p>
          {!isResolved ? (
            <button
              type="button"
              onClick={handleResolve}
              disabled={resolving}
              className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cta/20"
            >
              <CheckIcon className="h-5 w-5" />
              {resolving ? "Resolving…" : "Resolve"}
            </button>
          ) : (
            <span className="mt-3 inline-block text-sm text-cta">
              Ticket resolved.
            </span>
          )}
        </section>
      </article>
    </main>
  );
}
