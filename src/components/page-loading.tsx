/**
 * Generic loading UI for route segments. Used by loading.tsx across the app.
 * Shown automatically by Next.js during navigation and while segment data loads.
 *
 * @param variant - "fullscreen" for root/auth (min-h-screen, centered); "content" for protected pages (inside main with standard padding).
 */
export function PageLoading({
  variant = "content",
}: {
  variant?: "fullscreen" | "content";
}) {
  const spinner = (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted"
      aria-busy="true"
      aria-label="Loading"
    >
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-current border-t-transparent"
        aria-hidden
      />
      <span className="text-sm font-medium">Loading…</span>
    </div>
  );

  if (variant === "fullscreen") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        {spinner}
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{spinner}</main>
  );
}
