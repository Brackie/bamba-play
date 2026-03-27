export type EventType =
  | "game_played"
  | "score_submitted"
  | "user_registered"
  | "user_login"
  | "profile_updated";

export interface AppEvent {
  id: string;
  type: EventType;
  userId: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  type: EventType;
  userId: string;
  username: string;
  description: string;
  createdAt: string;
}

export interface ReportData {
  totalUsers: number;
  totalGamesPlayed: number;
  totalScoresSubmitted: number;
  activeUsers: number;
  topGames: { gameId: string; title: string; playCount: number }[];
  recentActivity: ActivityLog[];
}
