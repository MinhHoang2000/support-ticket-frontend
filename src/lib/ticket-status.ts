/** Ticket status enum (matches API). */
export enum TicketStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: "Open",
  [TicketStatus.IN_PROGRESS]: "In progress",
  [TicketStatus.RESOLVED]: "Resolved",
  [TicketStatus.CLOSED]: "Closed",
};

/** Tailwind classes for status badge (bg + text, light and dark). */
export const STATUS_COLORS: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]:
    "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200",
  [TicketStatus.IN_PROGRESS]:
    "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200",
  [TicketStatus.RESOLVED]:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200",
  [TicketStatus.CLOSED]:
    "bg-muted text-muted-foreground",
};

/** Get label for a status string (e.g. from API). */
export function getStatusLabel(status: string): string {
  return STATUS_LABELS[status as TicketStatus] ?? status;
}

/** Get badge class for a status string. Falls back to muted for unknown. */
export function getStatusColorClass(status: string): string {
  return (
    STATUS_COLORS[status as TicketStatus] ??
    "bg-muted text-muted-foreground"
  );
}
