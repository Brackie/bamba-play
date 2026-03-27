import type { Route } from "./+types/leaderboard";
import { getGlobalLeaderboard } from "~/services/score.service";
import { LeaderboardTable } from "~/components/leaderboard/LeaderboardTable";
import { Container } from "~/components/ui/Container";
import { Trophy } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Leaderboard - Bamba Play" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie") ?? undefined;
  try {
    const leaderboard = await getGlobalLeaderboard(cookieHeader);
    return { leaderboard };
  } catch (e: any) {
    console.error("getGlobalLeaderboard failed:", e.message, e.response?.data?.message, e.response?.status);
    return { leaderboard: null };
  }
}

export default function Leaderboard({ loaderData }: Route.ComponentProps) {
  const { leaderboard } = loaderData;

  return (
    <Container className="py-10">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-amber-500/15 p-3">
          <Trophy className="h-6 w-6 text-gold" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Global Leaderboard</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Top players across all games on the platform.
          </p>
        </div>
      </div>

      {leaderboard ? (
        <LeaderboardTable
          entries={leaderboard.entries}
          currentUserId={leaderboard.userEntry?.userId}
        />
      ) : (
        <div className="rounded-2xl border border-surface-border bg-surface-elevated py-20 text-center">
          <Trophy className="mx-auto mb-4 h-10 w-10 text-gray-600" />
          <p className="text-lg font-medium text-gray-400">
            No leaderboard data available yet.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Play some games to get on the board!
          </p>
        </div>
      )}
    </Container>
  );
}
