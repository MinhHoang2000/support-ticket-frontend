/** User shape from API (signup response and login response.user) */
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role?: "admin" | "agent" | "user";
  createdAt: string;
  updatedAt: string;
}

/** API success envelope */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

/** API error envelope */
export interface ApiError {
  success: false;
  data: null;
  message: string;
  errorCode?: string;
  timestamp?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/** Login response data */
export interface LoginData {
  user: User;
  token: string;
}

/** Signup request body */
export interface SignupBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/** Login request body */
export interface LoginBody {
  email: string;
  password: string;
}
