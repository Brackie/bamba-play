export type UserRole = "player" | "admin";

export interface UserStats {
  totalGamesPlayed: number | null;
  totalScore: number | null;
  highestScore: number | null;
  favoriteGame: string | { id: string; title: string } | null;
  rank: number | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  stats: UserStats;
  hasActiveSubscription: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicUser {
  id: string;
  username: string;
  avatar: string | null;
  stats: UserStats;
  createdAt: string;
}
