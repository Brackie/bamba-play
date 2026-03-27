export type ScoringType = "points" | "time" | "percentage" | "custom";

export interface Score {
  id: string;
  userId: string;
  gameId: string;
  value: number;
  formattedScore: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string | null;
  score: number;
  formattedScore: string;
  createdAt: string;
}

export interface LeaderboardResponse {
  gameId: string;
  gameTitle: string;
  entries: LeaderboardEntry[];
  totalEntries: number;
  userEntry: LeaderboardEntry | null;
}
