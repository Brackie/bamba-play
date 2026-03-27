import { useAuth } from "./useAuth";

export function useSubscription() {
  const { user, hasActiveSubscription, refreshSubscription } = useAuth();

  function canAccessGame(game: { isPremium: boolean }): boolean {
    if (!game.isPremium) return true;
    return hasActiveSubscription;
  }

  return {
    hasActiveSubscription,
    refreshSubscription,
    canAccessGame,
    isLoggedIn: !!user,
  };
}
