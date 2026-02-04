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
  getAgentTicket,
  createTicket,
  updateDraft,
  resolveTicket,
  closeTicket,
  type Ticket,
  type TicketDetail,
  type UserTicketDetail,
  type TicketListParams,
} from "./tickets-api";

/** Query key factory for tickets */
export const ticketsKeys = {
  all: ["tickets"] as const,
  my: (params?: TicketListParams) =>
    [...ticketsKeys.all, "mine", params] as const,
  list: (params?: TicketListParams) =>
    [...ticketsKeys.all, "list", params] as const,
  detail: (id: number) => [...ticketsKeys.all, "detail", id] as const,
};

/** Fetch "My tickets" (user's own). */
export function useMyTickets(params?: TicketListParams) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ticketsKeys.my(params),
    queryFn: () => fetchMyTickets(token!, params),
    enabled: !!token,
  });
}

/** Fetch all tickets (agent/admin list) with pagination. */
export function useAllTickets(params?: TicketListParams) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ticketsKeys.list(params),
    queryFn: () => fetchAllTickets(token!, params),
    enabled: !!token,
  });
}

/** Fetch a single ticket by ID (creator view; limited fields). GET /tickets/:id */
export function useTicket(
  id: number,
  options?: Omit<
    UseQueryOptions<UserTicketDetail, Error, UserTicketDetail, ReturnType<typeof ticketsKeys.detail>>,
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

/** Fetch full ticket by ID (admin/agent). GET /agent/tickets/:id */
export function useAgentTicket(
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
    queryFn: () => getAgentTicket(id, token!),
    enabled: !!token && validId,
    ...options,
  });
}

/** Create a new ticket. Invalidates "my tickets" list. */
export function useCreateTicket(
  options?: UseMutationOptions<
    UserTicketDetail,
    Error,
    { title: string; content: string }
  >
) {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { onSuccess: userOnSuccess, ...restOptions } = options ?? {};

  return useMutation({
    mutationFn: (body: { title: string; content: string }) =>
      createTicket(body, token),
    onSuccess: (data, variables, onMutateResult, context) => {
      // Invalidate all "my tickets" queries (any params) so list refetches after create
      queryClient.invalidateQueries({ queryKey: [...ticketsKeys.all, "mine"] });
      userOnSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}

/** Update AI draft for a ticket. Invalidates that ticket detail and list. */
export function useUpdateDraft(
  ticketId: number,
  options?: UseMutationOptions<TicketDetail, Error, string>
) {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { onSuccess: userOnSuccess, ...restOptions } = options ?? {};

  return useMutation({
    mutationFn: (draftReplyMessage: string) =>
      updateDraft(ticketId, draftReplyMessage, token),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ticketsKeys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketsKeys.list() });
      userOnSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}

/** Resolve ticket. Invalidates that ticket detail and lists. */
export function useResolveTicket(
  ticketId: number,
  options?: UseMutationOptions<TicketDetail, Error, void>
) {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { onSuccess: userOnSuccess, ...restOptions } = options ?? {};

  return useMutation({
    mutationFn: () => resolveTicket(ticketId, token),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ticketsKeys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketsKeys.list() });
      queryClient.invalidateQueries({ queryKey: ticketsKeys.my() });
      userOnSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}

/** Close ticket (creator only). Invalidates that ticket detail and lists. */
export function useCloseTicket(
  ticketId: number,
  options?: UseMutationOptions<UserTicketDetail, Error, void>
) {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { onSuccess: userOnSuccess, ...restOptions } = options ?? {};

  return useMutation({
    mutationFn: () => closeTicket(ticketId, token),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ticketsKeys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketsKeys.list() });
      queryClient.invalidateQueries({ queryKey: ticketsKeys.my() });
      userOnSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}
