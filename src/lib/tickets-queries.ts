"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import {
  fetchMyTickets,
  fetchAllTickets,
  getTicket,
  createTicket,
  updateDraft,
  resolveTicket,
  type Ticket,
  type TicketDetail,
} from "./tickets-api";

/** Query key factory for tickets */
export const ticketsKeys = {
  all: ["tickets"] as const,
  my: (params?: { page?: number; limit?: number; status?: string }) =>
    [...ticketsKeys.all, "mine", params] as const,
  list: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
  }) => [...ticketsKeys.all, "list", params] as const,
  detail: (id: number) => [...ticketsKeys.all, "detail", id] as const,
};

/** Fetch "My tickets" (user's own). */
export function useMyTickets(params?: {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ticketsKeys.my(params),
    queryFn: () => fetchMyTickets(token!, params),
    enabled: !!token,
  });
}

/** Fetch all tickets (agent/admin list) with pagination. */
export function useAllTickets(params?: {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ticketsKeys.list(params),
    queryFn: () => fetchAllTickets(token!, params),
    enabled: !!token,
  });
}

/** Fetch a single ticket by ID (detail view with draft). */
export function useTicket(
  id: number,
  options?: Omit<
    UseQueryOptions<TicketDetail, Error, TicketDetail, ReturnType<typeof ticketsKeys.detail>>,
    "queryKey" | "queryFn"
  >
) {
  const { token } = useAuth();
  const validId = Number.isFinite(id) && id > 0;
  return useQuery({
    queryKey: ticketsKeys.detail(id),
    queryFn: () => getTicket(id, token!),
    enabled: !!token && validId,
    ...options,
  });
}

/** Create a new ticket. Invalidates "my tickets" list. */
export function useCreateTicket(
  options?: UseMutationOptions<
    Ticket,
    Error,
    { title: string; content: string }
  >
) {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (body: { title: string; content: string }) =>
      createTicket(body, token),
    onSuccess: (_data, _variables, context) => {
      queryClient.invalidateQueries({ queryKey: ticketsKeys.my() });
    },
    ...options,
  });
}

/** Update AI draft for a ticket. Invalidates that ticket detail and list. */
export function useUpdateDraft(
  ticketId: number,
  options?: UseMutationOptions<
    { id: number; ticketId: number; aiReplyMessage: string },
    Error,
    string
  >
) {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: (draftReplyMessage: string) =>
      updateDraft(ticketId, draftReplyMessage, token),
    onSuccess: (_data, _variables, context) => {
      queryClient.invalidateQueries({ queryKey: ticketsKeys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketsKeys.list() });
    },
    ...options,
  });
}

/** Resolve ticket. Invalidates that ticket detail and lists. */
export function useResolveTicket(
  ticketId: number,
  options?: UseMutationOptions<TicketDetail, Error, void>
) {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: () => resolveTicket(ticketId, token),
    onSuccess: (_data, _variables, context) => {
      queryClient.invalidateQueries({ queryKey: ticketsKeys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketsKeys.list() });
      queryClient.invalidateQueries({ queryKey: ticketsKeys.my() });
    },
    ...options,
  });
}
