import { createContext, useCallback, useState } from "react";
import type { User } from "~/types/user";
import { AUTH_TOKEN_KEY } from "~/lib/constants";
import { getSubscriptionStatus } from "~/services/subscription.service";

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  hasActiveSubscription: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  refreshSubscription: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  initialUser: User | null;
  children: React.ReactNode;
}

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    }
    return null;
  });
  const [hasActiveSub, setHasActiveSub] = useState<boolean>(
    initialUser?.hasActiveSubscription ?? false
  );

  const setAuth = useCallback((user: User, token: string) => {
    setUser(user);
    setToken(token);
    setHasActiveSub(user.hasActiveSubscription);
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setHasActiveSub(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.href = "/login";
    }
  }, []);

  const refreshSubscription = useCallback(async () => {
    try {
      const status = await getSubscriptionStatus();
      setHasActiveSub(status.hasActiveSubscription);
    } catch {
      // Silently fail -- subscription status unchanged
    }
  }, []);

  return (
    <AuthContext
      value={{
        user,
        token,
        hasActiveSubscription: hasActiveSub,
        setAuth,
        logout,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext>
  );
}
