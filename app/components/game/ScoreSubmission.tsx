import { useState } from "react";
import type { Game } from "~/types/game";
import { submitScore } from "~/services/score.service";
import { useAuth } from "~/hooks/useAuth";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { ScoreDisplay } from "~/components/leaderboard/ScoreDisplay";

interface ScoreSubmissionProps {
  game: Game;
  score: number;
  metadata?: Record<string, unknown>;
  onSubmitted: () => void;
}

export function ScoreSubmission({
  game,
  score,
  metadata,
  onSubmitted,
}: ScoreSubmissionProps) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitScore(game.id, score, metadata);
      setSubmitted(true);
      onSubmitted();
    } catch {
      setError("Failed to submit score. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-white">Your Score</h3>
      <div className="mt-2 text-3xl font-bold text-brand-500">
        <ScoreDisplay value={score} config={game.scoringConfig} />
      </div>

      {!user ? (
        <p className="mt-4 text-sm text-gray-400">
          Log in to submit your score to the leaderboard.
        </p>
      ) : submitted ? (
        <p className="mt-4 text-sm text-green-400">Score submitted!</p>
      ) : (
        <div className="mt-4">
          {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Score"}
          </Button>
        </div>
      )}
    </Card>
  );
}
