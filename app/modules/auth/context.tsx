import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "~/lib/supabase";
import { authKeys } from "~/lib/query/query-keys";
import { logout } from "~/modules/auth/service";
import { useSessionQuery } from "~/modules/auth/queries";
import type { AuthUser } from "~/modules/auth/types";
import type { Session } from "@supabase/supabase-js";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [supabaseSession, setSupabaseSession] = useState<
    Session | null | undefined
  >(undefined);

  const { data: sessionResponse, isLoading, refetch } = useSessionQuery(
    supabaseSession ?? null
  );

  const user: AuthUser | null =
    supabaseSession === null || supabaseSession === undefined
      ? null
      : sessionResponse?.authenticated
        ? sessionResponse.user
        : null;

  const loading =
    supabaseSession === undefined || (!!supabaseSession && isLoading);

  const refreshSession = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleLogout = useCallback(async () => {
    await logout();
    setSupabaseSession(null);
    void queryClient.removeQueries({ queryKey: authKeys.session() });
  }, [queryClient]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseSession(session ?? null);
    });
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSupabaseSession(session ?? null);
      // Invalida apenas em eventos que indicam nova sessão ou login.
      // USER_UPDATED é disparado pelo próprio getSession() ao limpar referralCode dos
      // metadados do Supabase — invalidar aqui causaria um GET /profiles/me extra desnecessário.
      // SIGNED_OUT é tratado pela ausência de session (query fica disabled).
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        void queryClient.invalidateQueries({ queryKey: authKeys.session() });
      }
    });
    return () => subscription.unsubscribe();
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshSession,
      logout: handleLogout,
    }),
    [user, loading, refreshSession, handleLogout]
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
