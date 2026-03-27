import { useState, useCallback } from "react";
import { Lock } from "lucide-react";
import { redirect } from "react-router";
import type { Route } from "./+types/game.$id";
import { getGame } from "~/services/game.service";
import { getLeaderboard } from "~/services/score.service";
import { AUTH_TOKEN_KEY } from "~/lib/constants";
import { GameEmbed } from "~/components/game/GameEmbed";
import { ScoreSubmission } from "~/components/game/ScoreSubmission";
import { LeaderboardTable } from "~/components/leaderboard/LeaderboardTable";
import { Container } from "~/components/ui/Container";
import { Badge } from "~/components/ui/Badge";
import { useGameScore } from "~/hooks/useGameScore";
import { useSubscription } from "~/hooks/useSubscription";

export function meta({ data }: Route.MetaArgs) {
  const title = data?.game ? `${data.game.title} - ProPlay` : "Game - ProPlay";
  return [{ title }];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  if (!cookieHeader.includes(`${AUTH_TOKEN_KEY}=`)) {
    const url = new URL(request.url);
    throw redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`);
  }
  try {
    const [game, leaderboard] = await Promise.all([
      getGame(params.id, cookieHeader),
      getLeaderboard(params.id, cookieHeader).catch((e) => {
        console.error("getLeaderboard failed:", e.message, e.response?.data?.message, e.response?.status);
        return null;
      }),
    ]);
    return { game, leaderboard };
  } catch (e: any) {
    console.error("getGame failed:", e.message, e.response?.data?.message, e.response?.status);
    throw new Response("Game not found", { status: 404 });
  }
}

export default function GameDetail({ loaderData }: Route.ComponentProps) {
  const { game, leaderboard } = loaderData;
  const { canAccessGame } = useSubscription();
  const hasAccess = canAccessGame(game);
  const [capturedScore, setCapturedScore] = useState<{
    value: number;
    metadata?: Record<string, unknown>;
  } | null>(null);

  const handleScore = useCallback(
    (value: number, metadata?: Record<string, unknown>) => {
      setCapturedScore({ value, metadata });
    },
    []
  );

  useGameScore({ onScore: handleScore });

  return (
    <Container className="py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white">{game.title}</h1>
          <Badge label={game.category} />
          {game.isPremium && (
            <Badge label="Premium" colorKey="premium" />
          )}
        </div>
        <p className="mt-2 text-gray-400">{game.description}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {hasAccess ? (
            <>
              <GameEmbed game={game} />

              {capturedScore && (
                <div className="mt-6">
                  <ScoreSubmission
                    game={game}
                    score={capturedScore.value}
                    metadata={capturedScore.metadata}
                    onSubmitted={() => setCapturedScore(null)}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-surface-border bg-surface-elevated p-12 text-center">
              <Lock className="h-12 w-12 text-amber-400" />
              <h2 className="mt-4 text-xl font-bold text-white">
                Premium Game
              </h2>
              <p className="mt-2 max-w-md text-gray-400">
                This game requires an active subscription to play. Subscribe to
                unlock access to all premium games.
              </p>
            </div>
          )}
        </div>

        {/* Leaderboard sidebar */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-white">Leaderboard</h2>
          {leaderboard ? (
            <LeaderboardTable
              entries={leaderboard.entries}
              currentUserId={leaderboard.userEntry?.userId}
            />
          ) : (
            <p className="text-sm text-gray-400">
              No scores yet. Be the first to play!
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
