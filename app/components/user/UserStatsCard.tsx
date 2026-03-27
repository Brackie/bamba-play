import type { UserStats } from "~/types/user";
import { Card } from "~/components/ui/Card";

interface UserStatsCardProps {
  stats: UserStats;
}

export function UserStatsCard({ stats }: UserStatsCardProps) {
  const statItems = [
    { label: "Games Played", value: stats.totalGamesPlayed ?? 0 },
    { label: "Total Score", value: Math.round(stats.totalScore ?? 0).toLocaleString() },
    { label: "Highest Score", value: Math.round(stats.highestScore ?? 0).toLocaleString() },
    { label: "Global Rank", value: stats.rank ?? "Unranked" },
  ];

  return (
    <Card className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
      {statItems.map((item) => (
        <div key={item.label} className="text-center">
          <p className="text-2xl font-bold text-white">{item.value}</p>
          <p className="mt-1 text-xs text-gray-400">{item.label}</p>
        </div>
      ))}
    </Card>
  );
}
