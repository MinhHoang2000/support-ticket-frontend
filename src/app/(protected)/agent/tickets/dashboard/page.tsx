"use client";

import Link from "next/link";
import { useEffect, useReducer, useRef, useState } from "react";
import { TicketCard } from "@/components/ticket-card";
import { AppPagination, AppSelect } from "@/components/ui";
import { useAuth } from "@/contexts/auth-context";
import { useAllTickets } from "@/lib/tickets-queries";
import type { Ticket, TicketListParams } from "@/lib/tickets-api";
import { TicketStatus, STATUS_LABELS } from "@/lib/ticket-status";
import {
  SORT_OPTIONS,
  paramsToSortOption,
  sortOptionToParams,
  URGENCY_FILTER_OPTIONS,
} from "@/lib/ticket-list-filters";
import {
  ticketListFilterReducer,
  initialFilterState,
  stateToAgentListParams,
  hasActiveAgentFilters,
} from "@/lib/ticket-list-filter-reducer";

const LIMIT_OPTIONS = [10, 20, 50, 100] as const;
const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  ...Object.values(TicketStatus).map((s) => ({
    value: s,
    label: STATUS_LABELS[s],
  })),
];

// API: sentiment 1 (very negative) to 10 (very positive)
const SENTIMENT_OPTIONS = [
  { value: "", label: "Any" },
  ...Array.from({ length: 10 }, (_, i) => {
    const n = i + 1;
    const label =
      n <= 2 ? `${n} - Very negative` : n <= 4 ? `${n} - Negative` : n <= 6 ? `${n} - Neutral` : n <= 8 ? `${n} - Positive` : `${n} - Very positive`;
    return { value: String(n), label };
  }),
];

// API: category filter — Billing | Technical | Feature Request
const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  { value: "Billing", label: "Billing" },
  { value: "Technical", label: "Technical" },
  { value: "Feature Request", label: "Feature Request" },
];

export default function AgentDashboardPage() {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(ticketListFilterReducer, initialFilterState);
  const [appliedParams, setAppliedParams] = useState<TicketListParams>(() =>
    stateToAgentListParams(initialFilterState)
  );

  const { data, isLoading, isError, error } = useAllTickets(appliedParams);

  const tickets: Ticket[] = data?.tickets ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const err = error as Error & { status?: number; errorCode?: string } | undefined;
  const accessDenied =
    isError && err && (err.status === 403 || err.errorCode === "FORBIDDEN");
  const errorMessage =
    isError && !accessDenied && err
      ? err.message ?? "Failed to load tickets"
      : null;

  const hasActiveFilters = hasActiveAgentFilters(state);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch({ type: "APPLY_SEARCH" });
      dispatch({ type: "APPLY_CATEGORY" });
      const synced = {
        ...state,
        search: state.searchInput.trim(),
        searchInput: state.searchInput.trim(),
        category: state.categoryInput.trim(),
        categoryInput: state.categoryInput.trim(),
      };
      setAppliedParams(stateToAgentListParams(synced));
      debounceRef.current = null;
    }, 100);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [state]);

  const handleClear = () => {
    dispatch({ type: "CLEAR_FILTERS" });
    setAppliedParams(stateToAgentListParams(initialFilterState));
  };

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

      {!token && (
        <p className="mt-6 text-muted">Sign in to view the dashboard.</p>
      )}

      {token && (
        <div className="mt-6 flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end">
          <label className="flex flex-col gap-1 sm:w-40">
            <span className="text-xs font-medium text-muted">Status</span>
            <AppSelect
              value={state.status}
              onChange={(v) => dispatch({ type: "SET_STATUS", payload: v ?? "" })}
              options={STATUS_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              aria-label="Filter by status"
              className="w-full"
            />
          </label>
          <label className="flex flex-col gap-1 sm:w-36">
            <span className="text-xs font-medium text-muted">Urgency</span>
            <AppSelect
              value={state.urgency}
              onChange={(v) => dispatch({ type: "SET_URGENCY", payload: v ?? "" })}
              options={[
                { value: "", label: "All" },
                ...URGENCY_FILTER_OPTIONS.map((opt) => ({
                  value: opt.value,
                  label: opt.label,
                })),
              ]}
              aria-label="Filter by urgency"
              className="w-full"
            />
          </label>
          <label className="flex flex-col gap-1 sm:w-36">
            <span className="text-xs font-medium text-muted">Sentiment</span>
            <AppSelect
              value={state.sentiment}
              onChange={(v) => dispatch({ type: "SET_SENTIMENT", payload: v ?? "" })}
              options={SENTIMENT_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              aria-label="Filter by sentiment"
              className="w-full"
            />
          </label>
          <label className="flex flex-col gap-1 sm:w-40">
            <span className="text-xs font-medium text-muted">Category</span>
            <AppSelect
              value={state.categoryInput}
              onChange={(v) => dispatch({ type: "SET_CATEGORY_INPUT", payload: v ?? "" })}
              options={CATEGORY_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              aria-label="Filter by category"
              className="w-full"
            />
          </label>
          <label className="flex flex-col gap-1 sm:w-48">
            <span className="text-xs font-medium text-muted">Sort</span>
            <AppSelect
              value={paramsToSortOption(state.sortBy, state.sortOrder)}
              onChange={(v) => {
                if (!v) return;
                const { sortBy, sortOrder } = sortOptionToParams(v);
                dispatch({
                  type: "SET_SORT",
                  payload: {
                    sortBy: sortBy as TicketListParams["sortBy"],
                    sortOrder: sortOrder as TicketListParams["sortOrder"],
                  },
                });
              }}
              options={SORT_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
              aria-label="Sort"
              className="w-full"
            />
          </label>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="cursor-pointer rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-muted hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {token && isLoading && (
        <p className="mt-6 text-muted">Loading tickets…</p>
      )}

      {token && errorMessage && (
        <p className="mt-6 text-destructive" role="alert">
          {errorMessage}
        </p>
      )}

      {token && !isLoading && !errorMessage && tickets.length === 0 && (
        <p className="mt-6 text-muted">No tickets yet.</p>
      )}

      {token && !isLoading && !errorMessage && tickets.length > 0 && (
        <>
          <ul className="mt-6 grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <TicketCard
                  ticket={ticket}
                  href={`/agent/tickets/${ticket.id}`}
                  variant="agent"
                />
              </li>
            ))}
          </ul>
          {(appliedParams.limit ?? 10) < total && (
            <nav
              className="mt-6 flex flex-wrap items-center gap-2"
              aria-label="Pagination"
            >
              <AppPagination
                current={appliedParams.page ?? 1}
                total={total}
                pageSize={appliedParams.limit ?? 10}
                pageSizeOptions={[...LIMIT_OPTIONS]}
                onChange={(page, pageSize) => {
                  setAppliedParams((p) => ({
                    ...p,
                    page,
                    limit: pageSize ?? (appliedParams.limit ?? 10),
                  }));
                  dispatch({ type: "SET_PAGE", payload: page });
                  if (pageSize != null) dispatch({ type: "SET_LIMIT", payload: pageSize });
                }}
                showTotal={(t) => `${t} total`}
              />
            </nav>
          )}
        </>
      )}
    </main>
  );
}
