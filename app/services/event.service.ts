import type { ApiResponse } from "~/types/api";
import type { ActivityLog, EventType } from "~/types/event";
import apiClient, { createServerClient } from "~/lib/axios";
import { EVENTS_ROUTE, EVENTS_ACTIVITY_ROUTE } from "~/lib/constants";

function getClient(cookieHeader?: string) {
  return cookieHeader ? createServerClient(cookieHeader) : apiClient;
}

export async function logEvent(
  type: EventType,
  payload: Record<string, unknown>
) {
  const res = await apiClient.post<ApiResponse<null>>(EVENTS_ROUTE, {
    type,
    payload,
  });
  return res.data;
}

export async function getActivityLogs(cookieHeader?: string) {
  const client = getClient(cookieHeader);
  const res =
    await client.get<ApiResponse<ActivityLog[]>>(EVENTS_ACTIVITY_ROUTE);
  return res.data.data;
}
