import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getSession, logout } from "~/modules/auth/service";
import type { AuthUser } from "~/modules/auth/types";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshSession() {
    setLoading(true);

    try {
      const session = await getSession();
      setUser(session.authenticated ? session.user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  useEffect(() => {
    void refreshSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshSession,
      logout: handleLogout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
  }

  return context;
}
