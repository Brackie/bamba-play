import { Link } from "react-router";
import type { Game } from "~/types/game";
import { GameCard } from "~/components/game/GameCard";
import { Container } from "~/components/ui/Container";

interface HeroSectionProps {
  games: Game[];
}

export function HeroSection({ games }: HeroSectionProps) {
  const [left, center, right] = games;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-elevated via-surface to-surface py-16 md:py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-3xl" />
      </div>

      <Container className="relative z-10">
        {/* Headline */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            Play.{" "}
            <span className="text-brand-300">Compete.</span>{" "}
            <span className="text-accent-500">Dominate.</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            The best HTML5 games, weekly competitions, and global leaderboards.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/games"
              className="inline-flex items-center rounded-lg bg-accent-500 px-6 py-3 text-base font-semibold text-surface transition-colors hover:bg-accent-400"
            >
              Browse Games
            </Link>
            <Link
              to="/leaderboard"
              className="inline-flex items-center rounded-lg border border-surface-border bg-surface-elevated px-6 py-3 text-base font-semibold text-gray-200 transition-colors hover:border-brand-400/50 hover:text-white"
            >
              Leaderboard
            </Link>
          </div>
        </div>

        {/* 3-card cone display */}
        {games.length > 0 && (
          <div
            className="flex items-end justify-center"
            style={{ perspective: "1400px" }}
          >
            {/* Left card */}
            {left && (
              <div
                className="w-56 flex-shrink-0 opacity-70 transition-opacity hover:opacity-100 md:w-64"
                style={{
                  transform: "rotateY(30deg) scale(0.88)",
                  transformOrigin: "center center",
                  transformStyle: "preserve-3d",
                }}
              >
                <GameCard game={left} />
              </div>
            )}

            {/* Center card — largest */}
            {center && (
              <div
                className="relative z-10 mx-[-16px] w-64 flex-shrink-0 md:mx-[-24px] md:w-80"
                style={{ transformStyle: "preserve-3d" }}
              >
                <GameCard game={center} />
              </div>
            )}

            {/* Right card */}
            {right && (
              <div
                className="w-56 flex-shrink-0 opacity-70 transition-opacity hover:opacity-100 md:w-64"
                style={{
                  transform: "rotateY(-30deg) scale(0.88)",
                  transformOrigin: "center center",
                  transformStyle: "preserve-3d",
                }}
              >
                <GameCard game={right} />
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
