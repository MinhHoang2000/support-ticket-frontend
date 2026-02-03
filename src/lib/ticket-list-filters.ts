/** Single sort dropdown: field + order combined. */
export const SORT_OPTIONS = [
  { value: "title_asc", label: "Title (A–Z)" },
  { value: "title_desc", label: "Title (Z–A)" },
  { value: "createdAt_desc", label: "Created Date (newest)" },
  { value: "createdAt_asc", label: "Created Date (oldest)" },
] as const;

export type SortOptionValue = (typeof SORT_OPTIONS)[number]["value"];

export function sortOptionToParams(
  value: SortOptionValue
): { sortBy: "title" | "createdAt"; sortOrder: "asc" | "desc" } {
  const [sortBy, sortOrder] = value.split("_") as ["title" | "createdAt", "asc" | "desc"];
  return { sortBy, sortOrder };
}

export function paramsToSortOption(
  sortBy: string,
  sortOrder: string
): SortOptionValue {
  const by = sortBy === "title" ? "title" : "createdAt";
  const order = sortOrder === "asc" ? "asc" : "desc";
  const value = `${by}_${order}` as SortOptionValue;
  return SORT_OPTIONS.some((o) => o.value === value) ? value : "createdAt_desc";
}

/** Urgency filter values (API: string, max 200 chars) */
export const URGENCY_FILTER_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export type UrgencyFilterOption = (typeof URGENCY_FILTER_OPTIONS)[number]["value"];
