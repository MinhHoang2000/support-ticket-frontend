"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types/auth";
import * as authApi from "@/lib/auth-api";
import { clearAuth, getStoredAuth, setAuth } from "@/lib/auth-storage";
import { toastError } from "@/lib/toast";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = getStoredAuth();
    const run = () => {
      if (stored) {
        setUser(stored.user);
        setToken(stored.token);
      }
      setIsReady(true);
    };
    queueMicrotask(run);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    setAuth(data.user, data.token);
    setUser(data.user);
    setToken(data.token);
  }, []);

  const signup = useCallback(
    async (body: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      await authApi.signup(body);
      // No token from signup; user must sign in
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout(token);
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Logout failed");
      // still clear local state
    }
    clearAuth();
    setUser(null);
    setToken(null);
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isReady,
      login,
      signup,
      logout,
      isAuthenticated: !!token && !!user,
    }),
    [user, token, isReady, login, signup, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
