import { Link } from "react-router";
import type { FlagshipGame } from "~/types/game";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";

interface FlagshipBannerProps {
  flagship: FlagshipGame | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function FlagshipBanner({ flagship }: FlagshipBannerProps) {
  if (!flagship) {
    return (
      <section className="relative flex min-h-[400px] items-center justify-center bg-gradient-to-br from-brand-900 to-surface">
        <Container className="text-center">
          <h2 className="text-2xl font-bold text-white">
            No flagship game this week
          </h2>
          <p className="mt-2 text-gray-400">
            Check back soon for the next featured game!
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section
      className="relative flex min-h-[480px] items-end overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${flagship.bannerImage})` }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent" />

      <Container className="relative z-10 pb-12 pt-24">
        <p className="text-sm font-medium uppercase tracking-wider text-brand-500">
          Flagship Game &middot; {formatDate(flagship.weekStart)} &ndash;{" "}
          {formatDate(flagship.weekEnd)}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
          {flagship.title}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-gray-300">
          {flagship.tagline}
        </p>
        <Link to={`/games/${flagship.playableGameId}`} className="mt-6 inline-block">
          <Button size="lg">Play Now</Button>
        </Link>
      </Container>
    </section>
  );
}
