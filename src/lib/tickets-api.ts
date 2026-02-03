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

/** User ticket from GET /tickets/:id (creator only; limited fields; response only when RESOLVED or CLOSED) */
export interface UserTicketDetail {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  urgency?: string | null;
  response?: string | null;
}

/** Full ticket from GET /agent/tickets/:id (admin/agent; all fields) */
export interface TicketDetail extends Ticket {
  userId?: number | null;
  responseDraft: string | null;
  response: string | null;
}

export interface TicketsListResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Query params for list endpoints (mine + agent/tickets). API default: sortBy=createdAt, sortOrder=desc. */
export interface TicketListParams {
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

export async function fetchMyTickets(
  token: string | null,
  params?: TicketListParams
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
): Promise<UserTicketDetail> {
  const res = await apiRequest<ApiResponse<UserTicketDetail>>("/tickets", {
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
  params?: TicketListParams
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
  const path = query ? `/agent/tickets?${query}` : "/agent/tickets";

  const res = await apiRequest<ApiResponse<TicketsListResponse>>(path, {
    method: "GET",
    token,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "Failed to fetch tickets");
  }
  return res.data;
}

/** Get one ticket by ID (creator only; limited fields). GET /tickets/:id */
export async function getTicket(
  id: number,
  token: string | null
): Promise<UserTicketDetail> {
  const res = await apiRequest<ApiResponse<UserTicketDetail>>(`/tickets/${id}`, {
    method: "GET",
    token,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "Failed to fetch ticket");
  }
  return res.data;
}

/** Get full ticket by ID (admin/agent). GET /agent/tickets/:id */
export async function getAgentTicket(
  id: number,
  token: string | null
): Promise<TicketDetail> {
  const res = await apiRequest<ApiResponse<TicketDetail>>(`/agent/tickets/${id}`, {
    method: "GET",
    token,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "Failed to fetch ticket");
  }
  return res.data;
}

/** Update AI draft. PATCH /agent/tickets/:id/draft (admin/agent only). */
export async function updateDraft(
  id: number,
  draftReplyMessage: string,
  token: string | null
): Promise<TicketDetail> {
  const res = await apiRequest<ApiResponse<TicketDetail>>(
    `/agent/tickets/${id}/draft`,
    {
      method: "PATCH",
      body: JSON.stringify({ draftReplyMessage }),
      token,
    }
  );
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "Failed to update draft");
  }
  return res.data;
}

/** Resolve ticket: copy draft into response and mark RESOLVED. POST /agent/tickets/:id/resolve */
export async function resolveTicket(
  id: number,
  token: string | null
): Promise<TicketDetail> {
  const res = await apiRequest<ApiResponse<TicketDetail>>(
    `/agent/tickets/${id}/resolve`,
    {
      method: "POST",
      token,
    }
  );
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "Failed to resolve ticket");
  }
  return res.data;
}

/** Close ticket (creator only). POST /tickets/:id/close */
export async function closeTicket(
  id: number,
  token: string | null
): Promise<UserTicketDetail> {
  const res = await apiRequest<ApiResponse<UserTicketDetail>>(
    `/tickets/${id}/close`,
    {
      method: "POST",
      token,
    }
  );
  if (!res.success || !res.data) {
    throw new Error(res.message ?? "Failed to close ticket");
  }
  return res.data;
}
