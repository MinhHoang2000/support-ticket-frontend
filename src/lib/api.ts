import axios, { type AxiosRequestConfig } from "axios";
import { getToken } from "./auth-storage";

/**
 * API base URL: /api/v1.
 * Use NEXT_PUBLIC_API_URL for full origin (e.g. https://api.example.com/api/v1)
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

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface RequestOptions extends Omit<AxiosRequestConfig, "url" | "baseURL"> {
  /** If set, adds Authorization: Bearer <token> */
  token?: string | null;
  /** Request body (mapped to axios `data` for compatibility with fetch-style usage) */
  body?: BodyInit | null;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token: optToken, headers: optHeaders, body, ...rest } = options;
  const token = optToken ?? (typeof window !== "undefined" ? getToken() : null);
  const headers = {
    ...optHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const data = body !== undefined ? body : rest.data;

  try {
    const res = await api.request<T>({
      ...rest,
      url: path,
      headers,
      ...(data !== undefined ? { data } : {}),
    });
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      // API error shape: { success: false, message, errorCode, timestamp }; use errorCode for UX (e.g. VALIDATION_ERROR, UNAUTHORIZED, FORBIDDEN, NOT_FOUND).
      const data = err.response.data as {
        message?: string;
        errorCode?: string;
      } | undefined;
      const message =
        typeof data?.message === "string" ? data.message : err.message;
      const apiErr = new Error(message) as Error & {
        status: number;
        errorCode?: string;
      };
      apiErr.status = err.response.status;
      apiErr.errorCode = data?.errorCode;
      throw apiErr;
    }
    throw err;
  }
}
