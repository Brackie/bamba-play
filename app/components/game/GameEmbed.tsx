import { useRef, useState, useCallback } from "react";
import type { Game } from "~/types/game";

interface GameEmbedProps {
  game: Game;
}

export function GameEmbed({ game }: GameEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Keep state in sync if user exits fullscreen via Escape key
  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  return (
    <div
      ref={containerRef}
      onFullscreenChange={handleFullscreenChange}
      className="w-full h-[600px] fullscreen:h-screen overflow-hidden rounded-xl border border-surface-border bg-black flex flex-col"
    >
      <iframe
        ref={iframeRef}
        src={game.url}
        title={game.title}
        sandbox="allow-scripts allow-same-origin"
        className="h-full w-full border-0"
        allow="autoplay"
      />
      <div className="flex items-center justify-end bg-black/80 px-3 py-2 border-t border-white/10">
        <button
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          {isFullscreen ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
                <path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"/>
                <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
              </svg>
              Exit Fullscreen
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
              </svg>
              Fullscreen
            </>
          )}
        </button>
      </div>
    </div>
  );
}