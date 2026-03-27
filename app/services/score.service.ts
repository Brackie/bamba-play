import type { ApiResponse } from "~/types/api";
import type { LeaderboardResponse, Score } from "~/types/score";
import apiClient, { createServerClient } from "~/lib/axios";
import {
  SCORES_ROUTE,
  LEADERBOARD_ROUTE,
  LEADERBOARD_GLOBAL_ROUTE,
} from "~/lib/constants";

function getClient(cookieHeader?: string) {
  return cookieHeader ? createServerClient(cookieHeader) : apiClient;
}

export async function submitScore(
  gameId: string,
  value: number,
  metadata?: Record<string, unknown>
) {
  const res = await apiClient.post<ApiResponse<Score>>(SCORES_ROUTE, {
    gameId,
    value,
    metadata,
  });
  return res.data.data;
}

export async function getLeaderboard(gameId: string, cookieHeader?: string) {
  const client = getClient(cookieHeader);
  const res = await client.get<ApiResponse<LeaderboardResponse>>(
    LEADERBOARD_ROUTE(gameId)
  );
  return res.data.data;
}

export async function getGlobalLeaderboard(cookieHeader?: string) {
  const client = getClient(cookieHeader);
  const res = await client.get<ApiResponse<LeaderboardResponse>>(
    LEADERBOARD_GLOBAL_ROUTE
  );
  return res.data.data;
}
