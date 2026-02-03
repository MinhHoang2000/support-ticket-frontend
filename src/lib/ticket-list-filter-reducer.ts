import type { TicketListParams } from "./tickets-api";

export interface TicketListFilterState {
  page: number;
  limit: number;
  status: string;
  search: string;
  searchInput: string;
  sortBy: NonNullable<TicketListParams["sortBy"]>;
  sortOrder: NonNullable<TicketListParams["sortOrder"]>;
  category: string;
  categoryInput: string;
  sentiment: string;
  urgency: string;
}

export type TicketListFilterAction =
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_LIMIT"; payload: number }
  | { type: "SET_STATUS"; payload: string }
  | { type: "SET_SEARCH_INPUT"; payload: string }
  | { type: "APPLY_SEARCH" }
  | { type: "SET_SORT"; payload: Partial<Pick<TicketListFilterState, "sortBy" | "sortOrder">> }
  | { type: "SET_CATEGORY_INPUT"; payload: string }
  | { type: "APPLY_CATEGORY" }
  | { type: "SET_SENTIMENT"; payload: string }
  | { type: "SET_URGENCY"; payload: string }
  | { type: "CLEAR_FILTERS" };

const defaultState: TicketListFilterState = {
  page: 1,
  limit: 10,
  status: "",
  search: "",
  searchInput: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  category: "",
  categoryInput: "",
  sentiment: "",
  urgency: "",
};

export function ticketListFilterReducer(
  state: TicketListFilterState,
  action: TicketListFilterAction
): TicketListFilterState {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_LIMIT":
      return { ...state, limit: action.payload, page: 1 };
    case "SET_STATUS":
      return { ...state, status: action.payload, page: 1 };
    case "SET_SEARCH_INPUT":
      return { ...state, searchInput: action.payload };
    case "APPLY_SEARCH":
      return {
        ...state,
        search: state.searchInput.trim(),
        searchInput: state.searchInput.trim(),
        page: 1,
      };
    case "SET_SORT":
      return {
        ...state,
        ...action.payload,
        page: 1,
      };
    case "SET_CATEGORY_INPUT":
      return { ...state, categoryInput: action.payload };
    case "APPLY_CATEGORY":
      return {
        ...state,
        category: state.categoryInput.trim(),
        categoryInput: state.categoryInput.trim(),
        page: 1,
      };
    case "SET_SENTIMENT":
      return { ...state, sentiment: action.payload, page: 1 };
    case "SET_URGENCY":
      return { ...state, urgency: action.payload, page: 1 };
    case "CLEAR_FILTERS":
      return { ...defaultState, limit: state.limit };
    default:
      return state;
  }
}

export const initialFilterState = defaultState;

/** Build API params from filter state (user list: no category/sentiment/urgency). */
export function stateToUserListParams(state: TicketListFilterState): TicketListParams {
  return {
    page: state.page,
    limit: state.limit,
    ...(state.status ? { status: state.status } : {}),
    ...(state.search ? { search: state.search.slice(0, 500) } : {}),
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
  };
}

/** Build API params from filter state (agent list: full). */
export function stateToAgentListParams(state: TicketListFilterState): TicketListParams {
  return {
    page: state.page,
    limit: state.limit,
    ...(state.status ? { status: state.status } : {}),
    ...(state.category ? { category: state.category.slice(0, 200) } : {}),
    ...(state.sentiment !== "" && !Number.isNaN(Number(state.sentiment))
      ? { sentiment: Number(state.sentiment) }
      : {}),
    ...(state.urgency ? { urgency: state.urgency } : {}),
    ...(state.search ? { search: state.search.slice(0, 500) } : {}),
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
  };
}

export function hasActiveUserFilters(state: TicketListFilterState): boolean {
  return (
    !!state.status ||
    !!state.search ||
    state.sortBy !== "createdAt" ||
    state.sortOrder !== "desc"
  );
}

export function hasActiveAgentFilters(state: TicketListFilterState): boolean {
  return (
    !!state.status ||
    !!state.category ||
    state.sentiment !== "" ||
    !!state.urgency ||
    !!state.search ||
    state.sortBy !== "createdAt" ||
    state.sortOrder !== "desc"
  );
}
