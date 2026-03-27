import { Link } from "react-router";
import { Lock, Play } from "lucide-react";
import type { Game } from "~/types/game";
import { Badge } from "~/components/ui/Badge";
import { Card } from "~/components/ui/Card";
import { useSubscription } from "~/hooks/useSubscription";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { canAccessGame } = useSubscription();
  const hasAccess = canAccessGame(game);

  return (
    <Link to={`/games/${game.id}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-colors hover:border-brand-400/60">
        {/* Image container */}
        <div className="relative aspect-video w-full overflow-hidden bg-surface-border">
          <img
            src={game.thumbnail}
            alt={game.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Category badge — top right, floating over image */}
          <div className="absolute right-2 top-2 z-10">
            <Badge label={game.category} />
          </div>

          {/* Free / Premium badge — top left */}
          <div className="absolute left-2 top-2 z-10">
            {game.isPremium ? (
              <Badge label="Premium" colorKey="premium" />
            ) : (
              <Badge label="Free" colorKey="free" />
            )}
          </div>

          {/* Lock overlay for inaccessible premium games */}
          {game.isPremium && !hasAccess ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Lock className="h-8 w-8 text-white/70" />
            </div>
          ) : (
            /* Play icon overlay on hover */
            <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="rounded-full bg-brand-400 p-3.5 shadow-lg">
                <Play className="h-6 w-6 fill-white text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Card footer — title only */}
        <div className="px-3 py-2.5">
          <h3 className="truncate font-semibold text-gray-100">{game.title}</h3>
        </div>
      </Card>
    </Link>
  );
}
