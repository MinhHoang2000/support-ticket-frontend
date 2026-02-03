import type {
  ApiResponse,
  LoginData,
  LoginBody,
  SignupBody,
  User,
} from "@/types/auth";
import { apiRequest } from "./api";

export async function signup(body: SignupBody): Promise<User> {
  const res = await apiRequest<ApiResponse<User>>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.success || !res.data) {
    throw new Error((res as { message?: string }).message ?? "Signup failed");
  }
  return res.data;
}

export async function login(body: LoginBody): Promise<LoginData> {
  const res = await apiRequest<ApiResponse<LoginData>>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.success || !res.data) {
    throw new Error((res as { message?: string }).message ?? "Login failed");
  }
  return res.data;
}

export async function logout(token?: string | null): Promise<void> {
  await apiRequest("/auth/logout", {
    method: "POST",
    token: token ?? undefined,
  });
}
