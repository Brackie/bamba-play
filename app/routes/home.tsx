import type { Route } from "./+types/home";
import { getFlagshipGame, getFeaturedGames } from "~/services/game.service";
import { HeroSection } from "~/components/home/HeroSection";
import { PromoSection } from "~/components/home/PromoSection";
import { GameCarousel } from "~/components/game/GameCarousel";
import { Container } from "~/components/ui/Container";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bamba Play - Play, Compete, Dominate" },
    {
      name: "description",
      content: "HTML5 gaming platform with weekly flagship games and leaderboards.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie") ?? undefined;
  try {
    const [flagship, featured] = await Promise.all([
      getFlagshipGame(cookieHeader).catch((e) => {
        console.error("getFlagshipGame failed:", e.message, e.response?.data?.message, e.response?.status);
        return null;
      }),
      getFeaturedGames(cookieHeader).catch((e) => {
        console.error("getFeaturedGames failed:", e.message, e.response?.data?.message, e.response?.status);
        return [];
      }),
    ]);
    return { flagship, featured };
  } catch {
    return { flagship: null, featured: [] };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { flagship, featured } = loaderData;

  // Build hero games: flagship as center + first two featured as sides;
  // fall back to first three featured if no flagship.
  const heroGames = flagship
    ? [featured[0], flagship, featured[1]].filter(Boolean)
    : featured.slice(0, 3);

  const carouselGames = flagship ? featured.slice(2) : featured.slice(3);

  return (
    <div>
      <HeroSection games={heroGames as any[]} />

      {carouselGames.length > 0 && (
        <div className="bg-surface py-12">
          <Container>
            <GameCarousel title="Featured Games" games={carouselGames} />
          </Container>
        </div>
      )}

      <PromoSection />
    </div>
  );
}
