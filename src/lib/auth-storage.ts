import type { User } from "@/types/auth";

const STORAGE_KEY = "tickets_auth";

export interface StoredAuth {
  user: User;
  token: string;
}

/** Read stored auth from localStorage (client-only). */
export function getStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredAuth;
    if (data?.token && data?.user) return data;
  } catch {
    // ignore
  }
  return null;
}

/** Get only the token (for API layer). */
export function getToken(): string | null {
  const auth = getStoredAuth();
  return auth?.token ?? null;
}

/** Persist user and token to localStorage. */
export function setAuth(user: User, token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
}

/** Clear stored auth (e.g. on logout). */
export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
