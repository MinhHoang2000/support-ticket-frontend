"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { toastError, toastSuccess } from "@/lib/toast";
import { createTicket } from "@/lib/tickets-api";

const TITLE_MAX = 255;
const CONTENT_MAX = 50_000;

export default function CreateTicketPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }
    if (trimmedTitle.length > TITLE_MAX) {
      setError(`Title must be at most ${TITLE_MAX} characters.`);
      return;
    }
    if (!trimmedContent) {
      setError("Content is required.");
      return;
    }
    if (trimmedContent.length > CONTENT_MAX) {
      setError(`Content must be at most ${CONTENT_MAX} characters.`);
      return;
    }
    setLoading(true);
    try {
      await createTicket(
        { title: trimmedTitle, content: trimmedContent },
        token
      );
      toastSuccess("Ticket created successfully");
      router.push("/tickets");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create ticket";
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link
            href="/tickets"
            className="inline-flex cursor-pointer items-center text-sm text-muted transition-colors duration-200 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded"
          >
            ← Back to tickets
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm dark:border-border dark:bg-foreground/5 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Create ticket
          </h1>
          <p className="mt-1 text-sm text-muted">
            Describe your issue. A draft reply will be prepared for you.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200"
              >
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="create-ticket-title"
                className="block text-sm font-medium text-foreground"
              >
                Title
              </label>
              <input
                id="create-ticket-title"
                type="text"
                required
                maxLength={TITLE_MAX}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground transition-colors duration-200 placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border"
                placeholder="Brief summary of your issue"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-muted">
                {title.length} / {TITLE_MAX}
              </p>
            </div>
            <div>
              <label
                htmlFor="create-ticket-content"
                className="block text-sm font-medium text-foreground"
              >
                Content
              </label>
              <textarea
                id="create-ticket-content"
                required
                maxLength={CONTENT_MAX}
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-foreground transition-colors duration-200 placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border"
                placeholder="Describe your complaint or request in detail..."
                disabled={loading}
              />
              <p className="mt-1 text-xs text-muted">
                {content.length} / {CONTENT_MAX}
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer rounded-lg bg-cta px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-cta-hover focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2 disabled:opacity-60"
              >
                {loading ? "Creating…" : "Create ticket"}
              </button>
              <Link
                href="/tickets"
                className="inline-flex cursor-pointer items-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
    </main>
  );
}
