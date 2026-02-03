/**
 * API base URL. Use NEXT_PUBLIC_API_URL for full origin (e.g. https://api.example.com/api/v1)
 * or leave unset to use same-origin /api/v1.
 */
const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (url) return url.replace(/\/$/, "");
    return `${window.location.origin}/api/v1`;
  }
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url.replace(/\/$/, "");
  return "/api/v1";
};

export const API_BASE = getBaseUrl();

export interface RequestOptions extends RequestInit {
  /** If set, adds Authorization: Bearer <token> */
  token?: string | null;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers: optHeaders, ...rest } = options;
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(optHeaders as HeadersInit),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...rest, headers });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      typeof json?.message === "string" ? json.message : res.statusText;
    const err = new Error(message) as Error & {
      status: number;
      errorCode?: string;
    };
    err.status = res.status;
    err.errorCode = json?.errorCode;
    throw err;
  }

  return json as T;
}
