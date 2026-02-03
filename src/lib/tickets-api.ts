import { apiRequest } from "./api";

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
}

export interface Ticket {
  id: number;
  title: string;
  content: string;
  status: string;
  category: string | null;
  tag: string | null;
  sentiment: number | null;
  urgency: string | null;
  replyMadeBy: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Ticket detail from GET /tickets/:id (includes AI draft) */
export interface TicketDetail extends Ticket {
  responseDraft: string | null;
}

export interface TicketsListResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchMyTickets(
  token: string | null,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }
): Promise<TicketsListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", String(params.page));
  if (params?.limit != null) searchParams.set("limit", String(params.limit));
  if (params?.status) searchParams.set("status", params.status);
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  const query = searchParams.toString();
  const path = query ? `/tickets/mine?${query}` : "/tickets/mine";

  const res = await apiRequest<ApiResponse<TicketsListResponse>>(path, {
    method: "GET",
    token,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "Failed to fetch tickets");
  }
  return res.data;
}

export async function createTicket(
  body: { title: string; content: string },
  token: string | null
): Promise<Ticket> {
  const res = await apiRequest<ApiResponse<Ticket>>("/tickets", {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "Failed to create ticket");
  }
  return res.data;
}

/** List all tickets (admin or agent only). Same query params as fetchMyTickets. */
export async function fetchAllTickets(
  token: string | null,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    sentiment?: number;
    urgency?: string;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
  }
): Promise<TicketsListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", String(params.page));
  if (params?.limit != null) searchParams.set("limit", String(params.limit));
  if (params?.status) searchParams.set("status", params.status);
  if (params?.category) searchParams.set("category", params.category);
  if (params?.sentiment != null) searchParams.set("sentiment", String(params.sentiment));
  if (params?.urgency) searchParams.set("urgency", params.urgency);
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  if (params?.search) searchParams.set("search", params.search);
  const query = searchParams.toString();
  const path = query ? `/tickets?${query}` : "/tickets";

  const res = await apiRequest<ApiResponse<TicketsListResponse>>(path, {
    method: "GET",
    token,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "Failed to fetch tickets");
  }
  return res.data;
}

/** Get one ticket by ID (includes responseDraft for detail view). */
export async function getTicket(
  id: number,
  token: string | null
): Promise<TicketDetail> {
  const res = await apiRequest<ApiResponse<TicketDetail>>(`/tickets/${id}`, {
    method: "GET",
    token,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "Failed to fetch ticket");
  }
  return res.data;
}

/** Update AI draft (ai_reply_message) for the ticket. */
export async function updateDraft(
  id: number,
  draftReplyMessage: string,
  token: string | null
): Promise<{ id: number; ticketId: number; aiReplyMessage: string }> {
  const res = await apiRequest<
    ApiResponse<{ id: number; ticketId: number; aiReplyMessage: string }>
  >(`/tickets/${id}/draft`, {
    method: "PATCH",
    body: JSON.stringify({ draftReplyMessage }),
    token,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "Failed to update draft");
  }
  return res.data;
}

/** Resolve ticket: copies draft into response and marks RESOLVED (POST /tickets/:id/resolve). */
export async function resolveTicket(
  id: number,
  token: string | null
): Promise<TicketDetail> {
  const res = await apiRequest<ApiResponse<TicketDetail>>(`/tickets/${id}/resolve`, {
    method: "POST",
    token,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "Failed to resolve ticket");
  }
  return res.data;
}
