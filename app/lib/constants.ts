function getEnvUrl(): string | undefined {
  if (typeof process !== "undefined" && process.env?.VITE_API_BASE_URL) {
    return process.env.VITE_API_BASE_URL;
  } else if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  if (typeof window !== "undefined") {
    const env = (window as unknown as Record<string, Record<string, string>>)
      .__ENV__;
    if (env?.VITE_API_BASE_URL) return env.VITE_API_BASE_URL;
  }
  return undefined;
}

export const API_BASE_URL = getEnvUrl() ?? "http://127.0.0.1:8000/api/v1";

function getPlatformId(): string {
  if (typeof process !== "undefined" && process.env?.VITE_PLATFORM_ID) {
    return process.env.VITE_PLATFORM_ID;
  } else if (typeof import.meta !== "undefined" && import.meta.env?.VITE_PLATFORM_ID) {
    return import.meta.env.VITE_PLATFORM_ID;
  }
  if (typeof window !== "undefined") {
    const env = (window as unknown as Record<string, Record<string, string>>).__ENV__;
    if (env?.VITE_PLATFORM_ID) return env.VITE_PLATFORM_ID;
  }
  return "default";
}

export const PLATFORM_ID = getPlatformId();
export const PLATFORM_HEADER = "X-Platform-ID";

export const AUTH_TOKEN_KEY = "pro_play_auth_token";

// Auth routes
export const AUTH_LOGIN_ROUTE = "/auth/login";
export const AUTH_REGISTER_ROUTE = "/auth/register";
export const AUTH_ME_ROUTE = "/auth/me";
export const AUTH_LOGOUT_ROUTE = "/auth/logout";

// User routes
export const USER_ROUTE = (id: string) => `/users/${id}`;
export const USERS_ME_ROUTE = "/users/me";

// Game routes
export const GAMES_ROUTE = "/games";
export const GAME_ROUTE = (id: string) => `/games/${id}`;
export const GAMES_FLAGSHIP_ROUTE = "/games/flagship";
export const GAMES_FEATURED_ROUTE = "/games/featured";

// Event routes
export const EVENTS_ROUTE = "/events";
export const EVENTS_ACTIVITY_ROUTE = "/events/activity";

// Score & Leaderboard routes
export const SCORES_ROUTE = "/scores";
export const LEADERBOARD_ROUTE = (gameId: string) => `/leaderboard/${gameId}`;
export const LEADERBOARD_GLOBAL_ROUTE = "/leaderboard/global";

// Subscription routes
export const SUBSCRIPTIONS_STATUS_ROUTE = "/subscriptions/status";
export const SUBSCRIPTIONS_SAFARICOM_ROUTE = "/subscriptions/safaricom";
export const SUBSCRIPTIONS_MPESA_ROUTE = "/subscriptions/mpesa";
export const SUBSCRIPTIONS_HISTORY_ROUTE = "/subscriptions/history";
export const SUBSCRIPTIONS_TRANSACTIONS_ROUTE = "/subscriptions/transactions";
