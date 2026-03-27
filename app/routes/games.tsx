import { useRef } from "react";
import { useSearchParams } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Route } from "./+types/games";
import type { GameCategory } from "~/types/game";
import { getGames } from "~/services/game.service";
import { GameCard } from "~/components/game/GameCard";
import { Container } from "~/components/ui/Container";
import { Button } from "~/components/ui/Button";

const categories: GameCategory[] = [
  "arcade",
  "puzzle",
  "strategy",
  "action",
  "sports",
  "racing",
  "adventure",
];

export function meta({}: Route.MetaArgs) {
  return [{ title: "Games - Bamba Play" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") as GameCategory | null;
  const page = Number(url.searchParams.get("page")) || 1;
  const cookieHeader = request.headers.get("Cookie") ?? undefined;

  try {
    const result = await getGames(
      { page, category: category ?? undefined },
      cookieHeader
    );
    return { games: result.data, total: result.total, totalPages: result.totalPages, page };
  } catch (e: any) {
    console.error("getGames failed:", e.message, e.response?.data?.message, e.response?.status);
    return { games: [], total: 0, totalPages: 0, page: 1 };
  }
}

export default function Games({ loaderData }: Route.ComponentProps) {
  const { games, totalPages, page } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");
  const scrollRef = useRef<HTMLDivElement>(null);

  function handleCategoryFilter(category: string | null) {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    params.delete("page");
    setSearchParams(params);
  }

  function handlePage(p: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    setSearchParams(params);
    scrollRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }

  function scrollCarousel(direction: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollRef.current.clientWidth * 0.8 : scrollRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold text-white">Games</h1>

      {/* Category filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          variant={activeCategory === null ? "primary" : "secondary"}
          size="sm"
          onClick={() => handleCategoryFilter(null)}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleCategoryFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      {/* Carousel + arrows */}
      {games.length > 0 ? (
        <>
          <div className="relative mt-8">
            {/* Left arrow */}
            <button
              onClick={() => scrollCarousel("left")}
              className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-surface-border bg-surface-elevated p-2 text-gray-400 shadow-lg transition-colors hover:border-brand-400/50 hover:text-brand-300 md:flex"
              aria-label="Scroll left"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Scrollable carousel */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {games.map((game) => (
                <div
                  key={game.id}
                  className="w-[240px] flex-shrink-0 self-stretch sm:w-[260px]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <GameCard game={game} />
                </div>
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => scrollCarousel("right")}
              className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-surface-border bg-surface-elevated p-2 text-gray-400 shadow-lg transition-colors hover:border-brand-400/50 hover:text-brand-300 md:flex"
              aria-label="Scroll right"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => handlePage(page - 1)}
                className="rounded-lg border border-surface-border bg-surface-elevated p-2 text-gray-400 transition-colors hover:border-brand-400/50 hover:text-brand-300 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePage(p)}
                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? "bg-brand-400 text-white"
                      : "border border-surface-border bg-surface-elevated text-gray-400 hover:border-brand-400/50 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => handlePage(page + 1)}
                className="rounded-lg border border-surface-border bg-surface-elevated p-2 text-gray-400 transition-colors hover:border-brand-400/50 hover:text-brand-300 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-400">No games found.</p>
          {activeCategory && (
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => handleCategoryFilter(null)}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
    </Container>
  );
}
