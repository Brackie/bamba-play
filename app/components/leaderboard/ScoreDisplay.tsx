import type { ScoringConfig } from "~/types/game";

interface ScoreDisplayProps {
  value: number;
  config: ScoringConfig;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function formatScore(value: number, config: ScoringConfig): string {
  switch (config.type) {
    case "points":
      return `${Math.round(value).toLocaleString()} pts`;
    case "time":
      return formatTime(value);
    case "percentage":
      return `${Math.round(value)}%`;
    case "custom":
      return `${Math.round(value).toLocaleString()} ${config.unitLabel}`;
  }
}

export function ScoreDisplay({ value, config }: ScoreDisplayProps) {
  return <span>{formatScore(value, config)}</span>;
}
