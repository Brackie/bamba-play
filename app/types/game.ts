export type GameCategory =
  | "arcade"
  | "puzzle"
  | "strategy"
  | "action"
  | "sports"
  | "racing"
  | "adventure";

export type GameStatus = "active" | "inactive" | "coming_soon";

export interface ScoringConfig {
  type: "points" | "time" | "percentage" | "custom";
  higherIsBetter: boolean;
  unitLabel: string;
  maxScore: number | null;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  category: GameCategory;
  status: GameStatus;
  isPremium: boolean;
  scoringConfig: ScoringConfig;
  createdAt: string;
  updatedAt: string;
}

export interface FlagshipGame extends Game {
  bannerImage: string;
  tagline: string;
  weekStart: string;
  weekEnd: string;
  playableGameId: string;
}
