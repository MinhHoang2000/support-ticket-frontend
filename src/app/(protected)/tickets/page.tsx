"use client";

import Link from "next/link";
import { useEffect, useReducer, useRef, useState } from "react";
import { TicketCard } from "@/components/ticket-card";
import {
  AppInput,
  AppPagination,
  AppSelect,
} from "@/components/ui";
import { useAuth } from "@/contexts/auth-context";
import { useMyTickets } from "@/lib/tickets-queries";
import type { Ticket } from "@/lib/tickets-api";
import { TicketStatus, STATUS_LABELS } from "@/lib/ticket-status";
import {
  SORT_OPTIONS,
  paramsToSortOption,
  sortOptionToParams,
} from "@/lib/ticket-list-filters";
import type { TicketListParams } from "@/lib/tickets-api";
import {
  ticketListFilterReducer,
  initialFilterState,
  stateToUserListParams,
  hasActiveUserFilters,
} from "@/lib/ticket-list-filter-reducer";

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

const LIMIT_OPTIONS = [10, 20, 50, 100] as const;
const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  ...Object.values(TicketStatus).map((s) => ({
    value: s,
    label: STATUS_LABELS[s],
  })),
];

export default function TicketsPage() {
  const { token, isReady } = useAuth();
  const [state, dispatch] = useReducer(ticketListFilterReducer, initialFilterState);
  const [appliedParams, setAppliedParams] = useState<TicketListParams>(() =>
    stateToUserListParams(initialFilterState)
  );

  const { data, isLoading, isError, error } = useMyTickets(appliedParams);

  const tickets: Ticket[] = data?.tickets ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const errorMessage =
    isError && error
      ? error instanceof Error
        ? error.message
        : "Failed to load tickets"
      : null;

  const hasActiveFilters = hasActiveUserFilters(state);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setAppliedParams(stateToUserListParams(state));
      debounceRef.current = null;
    }, 100);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [state]);

  const handleClear = () => {
    dispatch({ type: "CLEAR_FILTERS" });
    setAppliedParams(stateToUserListParams(initialFilterState));
  };

  if (!isReady) {
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
        </div>
        <p className="mt-6 text-muted">Loading…</p>
      </main>
    );
  }

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

      {!token && (
        <p className="mt-6 text-muted">Sign in to view your tickets.</p>
      )}

      {token && (
        <>
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
        </>
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
        <p className="mt-6 text-muted">You have no tickets yet.</p>
      )}

      {token && !isLoading && !errorMessage && tickets.length > 0 && (
        <>
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
                  const newLimit = pageSize ?? (appliedParams.limit ?? 10);
                  setAppliedParams((p) => ({
                    ...p,
                    page,
                    limit: newLimit,
                  }));
                  dispatch({ type: "SET_PAGE", payload: page });
                  if (pageSize != null && pageSize !== (appliedParams.limit ?? 10)) {
                    dispatch({ type: "SET_LIMIT", payload: pageSize });
                  }
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
