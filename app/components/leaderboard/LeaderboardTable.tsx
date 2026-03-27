import { Link } from "react-router";
import { Medal } from "lucide-react";
import type { LeaderboardEntry } from "~/types/score";
import { UserAvatar } from "~/components/user/UserAvatar";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

function getRankStyle(rank: number) {
  switch (rank) {
    case 1:
      return { text: "text-gold", bg: "bg-gold/10", border: "border-gold/30" };
    case 2:
      return { text: "text-silver", bg: "bg-silver/10", border: "border-silver/20" };
    case 3:
      return { text: "text-bronze", bg: "bg-bronze/10", border: "border-bronze/20" };
    default:
      return { text: "text-gray-500", bg: "", border: "" };
  }
}

function getRankLabel(rank: number): string {
  switch (rank) {
    case 1: return "1st";
    case 2: return "2nd";
    case 3: return "3rd";
    default: return `${rank}th`;
  }
}

export function LeaderboardTable({
  entries,
  currentUserId,
}: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-surface-border bg-surface-elevated p-8 text-center">
        <p className="text-gray-400">No scores recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-border bg-surface-elevated">
      {/* Top 3 podium strip */}
      <div className="grid grid-cols-3 gap-px border-b border-surface-border bg-surface-border">
        {entries.slice(0, 3).map((entry) => {
          const { text, bg } = getRankStyle(entry.rank);
          return (
            <Link
              key={entry.userId}
              to={`/profile/${entry.userId}`}
              className={`flex flex-col items-center gap-1 py-5 text-center transition-colors hover:brightness-110 ${bg} bg-surface-elevated`}
            >
              <Medal className={`h-5 w-5 ${text}`} />
              <span className={`text-xs font-bold uppercase tracking-widest ${text}`}>
                {getRankLabel(entry.rank)}
              </span>
              <UserAvatar username={entry.username} avatar={entry.avatar} size="md" />
              <span className="mt-1 text-sm font-semibold text-gray-200">
                {entry.username}
              </span>
              <span className={`text-sm font-bold ${text}`}>
                {entry.formattedScore}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Remaining entries */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface-border text-left text-xs uppercase tracking-wider text-gray-500">
            <th className="px-5 py-3">Rank</th>
            <th className="px-5 py-3">Player</th>
            <th className="px-5 py-3 text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.slice(3).map((entry) => {
            const isCurrentUser = entry.userId === currentUserId;
            return (
              <tr
                key={entry.userId}
                className={`border-b border-surface-border last:border-0 transition-colors hover:bg-surface-border/30 ${
                  isCurrentUser ? "bg-brand-500/8 outline outline-1 outline-brand-500/20" : ""
                }`}
              >
                <td className="px-5 py-3">
                  <span className="font-semibold text-gray-500">
                    {getRankLabel(entry.rank)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <Link
                    to={`/profile/${entry.userId}`}
                    className="flex items-center gap-2.5 hover:text-white transition-colors"
                  >
                    <UserAvatar
                      username={entry.username}
                      avatar={entry.avatar}
                      size="sm"
                    />
                    <span className="text-sm font-medium text-gray-200">
                      {entry.username}
                    </span>
                    {isCurrentUser && (
                      <span className="rounded-full bg-brand-400/20 px-2 py-0.5 text-xs text-brand-300">
                        You
                      </span>
                    )}
                  </Link>
                </td>
                <td className="px-5 py-3 text-right text-sm font-semibold text-white">
                  {entry.formattedScore}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
