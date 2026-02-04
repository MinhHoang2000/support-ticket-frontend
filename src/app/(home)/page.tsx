"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

function TicketIcon({ className }: { className?: string }) {
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
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}

function InboxIcon({ className }: { className?: string }) {
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
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
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
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  );
}

const features = [
  {
    title: "One place for tickets",
    description: "Create, track, and respond to support requests from a single dashboard.",
    icon: InboxIcon,
  },
  {
    title: "Fast responses",
    description: "Stay on top of new tickets and reply quickly so nothing slips through.",
    icon: ZapIcon,
  },
  {
    title: "Simple & reliable",
    description: "No clutter. Just the tools your team needs to manage support efficiently.",
    icon: ShieldIcon,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuth();

  if (isReady && isAuthenticated) {
    router.replace("/tickets");
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 pt-16 pb-24 sm:px-6 sm:pt-24 sm:pb-32"
        aria-label="Hero"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          aria-hidden
        >
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-1/2 -left-32 h-64 w-64 rounded-full bg-cta/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex cursor-default items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 text-sm text-muted shadow-sm backdrop-blur-sm dark:bg-foreground/10 dark:border-white/10">
            <TicketIcon className="h-5 w-5 text-primary" />
            <span>Support made simple</span>
          </div>
          <h1 className="mt-8 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Manage support tickets in one place
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl">
            Create tickets, track status, and respond to customers from a clean,
            fast dashboard. No bloat—just what you need.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-cta px-6 py-3.5 text-base font-medium text-white shadow-sm transition-colors duration-200 hover:bg-cta-hover focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2"
            >
              Get started
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-border bg-white/80 px-6 py-3.5 text-base font-medium text-foreground backdrop-blur-sm transition-colors duration-200 hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 dark:bg-foreground/10 dark:border-white/10 dark:hover:bg-primary/10"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Value prop */}
      <section
        className="border-y border-border bg-white/60 px-4 py-12 backdrop-blur-sm dark:bg-foreground/5 dark:border-white/10 sm:px-6 sm:py-16"
        aria-label="Value proposition"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-heading text-xl font-medium text-foreground sm:text-2xl">
            Less noise. Fewer missed messages. One clear view of every request.
          </p>
        </div>
      </section>

      {/* Features */}
      <section
        className="px-4 py-16 sm:px-6 sm:py-24"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="features-heading"
            className="font-heading text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Why Tickets
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted">
            Built for small teams who want support done right.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="group cursor-default rounded-2xl border border-border bg-white/80 p-6 shadow-sm backdrop-blur-md transition-colors duration-200 dark:border-white/10 dark:bg-foreground/5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary/15">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="px-4 py-16 sm:px-6 sm:py-24"
        aria-label="Call to action"
      >
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-white/80 px-6 py-12 text-center shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-foreground/5 sm:px-12 sm:py-16">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Ready to get started?
          </h2>
          <p className="mt-3 text-muted">
            Create an account and start managing support tickets in minutes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-cta px-6 py-3.5 text-base font-medium text-white shadow-sm transition-colors duration-200 hover:bg-cta-hover focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2"
            >
              Sign up free
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-border bg-transparent px-6 py-3.5 text-base font-medium text-foreground transition-colors duration-200 hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
