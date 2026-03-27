import type { ApiResponse } from "~/types/api";
import type { PublicUser, User } from "~/types/user";
import apiClient, { createServerClient } from "~/lib/axios";
import { USER_ROUTE, USERS_ME_ROUTE } from "~/lib/constants";

function getClient(cookieHeader?: string) {
  return cookieHeader ? createServerClient(cookieHeader) : apiClient;
}

export async function getUser(id: string, cookieHeader?: string) {
  const client = getClient(cookieHeader);
  const res = await client.get<ApiResponse<PublicUser>>(USER_ROUTE(id));
  return res.data.data;
}

export async function updateProfile(data: {
  username?: string;
  avatar?: string;
}) {
  const res = await apiClient.patch<ApiResponse<User>>(USERS_ME_ROUTE, data);
  return res.data.data;
}
