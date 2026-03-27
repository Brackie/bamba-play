import { useEffect, useCallback, useRef } from "react";

interface GameScoreMessage {
  type: "PRO_PLAY_SCORE";
  value: number;
  metadata?: Record<string, unknown>;
}

function isGameScoreMessage(data: unknown): data is GameScoreMessage {
  if (typeof data !== "object" || data === null) return false;
  const msg = data as Record<string, unknown>;
  return (
    msg.type === "PRO_PLAY_SCORE" &&
    typeof msg.value === "number" &&
    Number.isFinite(msg.value)
  );
}

interface UseGameScoreOptions {
  onScore: (value: number, metadata?: Record<string, unknown>) => void;
  /** Only trigger onScore for final (game-over) scores. Default: true */
  finalOnly?: boolean;
}

export function useGameScore({ onScore, finalOnly = true }: UseGameScoreOptions) {
  const onScoreRef = useRef(onScore);
  onScoreRef.current = onScore;

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (isGameScoreMessage(event.data)) {
        const isFinal = event.data.metadata?.isFinal === true;
        if (finalOnly && !isFinal) return;
        onScoreRef.current(event.data.value, event.data.metadata);
      }
    },
    [finalOnly]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);
}
