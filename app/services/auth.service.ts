import type { ApiResponse } from "~/types/api";
import type { User } from "~/types/user";
import apiClient, { createServerClient } from "~/lib/axios";
import {
  AUTH_LOGIN_ROUTE,
  AUTH_REGISTER_ROUTE,
  AUTH_ME_ROUTE,
  AUTH_LOGOUT_ROUTE,
} from "~/lib/constants";

function getClient(cookieHeader?: string) {
  return cookieHeader ? createServerClient(cookieHeader) : apiClient;
}

export async function login(email: string, password: string) {
  const res = await apiClient.post<ApiResponse<{ token: string; user: User }>>(
    AUTH_LOGIN_ROUTE,
    { email, password }
  );
  return res.data.data;
}

export async function register(
  username: string,
  email: string,
  password: string
) {
  const res = await apiClient.post<ApiResponse<{ token: string; user: User }>>(
    AUTH_REGISTER_ROUTE,
    { username, email, password }
  );
  return res.data.data;
}

export async function getMe(cookieHeader?: string) {
  const client = getClient(cookieHeader);
  const res = await client.get<ApiResponse<User>>(AUTH_ME_ROUTE);
  return res.data.data;
}

export async function logout() {
  const res = await apiClient.post<ApiResponse<null>>(AUTH_LOGOUT_ROUTE);
  return res.data;
}
