import type { ApiResponse, PaginatedResponse } from "~/types/api";
import type { FlagshipGame, Game, GameCategory } from "~/types/game";
import apiClient, { createServerClient } from "~/lib/axios";
import {
  GAMES_ROUTE,
  GAME_ROUTE,
  GAMES_FLAGSHIP_ROUTE,
  GAMES_FEATURED_ROUTE,
} from "~/lib/constants";

function getClient(cookieHeader?: string) {
  return cookieHeader ? createServerClient(cookieHeader) : apiClient;
}

export async function getGames(
  params?: { page?: number; category?: GameCategory },
  cookieHeader?: string
) {
  const client = getClient(cookieHeader);
  const res = await client.get<PaginatedResponse<Game>>(GAMES_ROUTE, { params });
  return res.data;
}

export async function getGame(id: string, cookieHeader?: string) {
  const client = getClient(cookieHeader);
  const res = await client.get<ApiResponse<Game>>(GAME_ROUTE(id));
  return res.data.data;
}

export async function getFlagshipGame(cookieHeader?: string) {
  const client = getClient(cookieHeader);
  const res = await client.get<ApiResponse<FlagshipGame | null>>(
    GAMES_FLAGSHIP_ROUTE
  );
  return res.data.data;
}

export async function getFeaturedGames(cookieHeader?: string) {
  const client = getClient(cookieHeader);
  const res = await client.get<ApiResponse<Game[]>>(GAMES_FEATURED_ROUTE);
  return res.data.data;
}
