import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Game } from "~/types/game";
import { GameCard } from "./GameCard";

interface GameCarouselProps {
  title: string;
  games: Game[];
}

export function GameCarousel({ title, games }: GameCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  if (games.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <div className="hidden gap-2 md:flex">
          <button
            onClick={() => scroll("left")}
            className="rounded-lg border border-surface-border bg-surface-elevated p-2 text-gray-400 transition-colors hover:border-brand-400/50 hover:text-brand-300"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="rounded-lg border border-surface-border bg-surface-elevated p-2 text-gray-400 transition-colors hover:border-brand-400/50 hover:text-brand-300"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {games.map((game) => (
          <div
            key={game.id}
            className="w-[260px] flex-shrink-0 self-stretch"
            style={{ scrollSnapAlign: "start" }}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </section>
  );
}
