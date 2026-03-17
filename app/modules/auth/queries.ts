import { useQuery } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { authKeys } from "~/lib/query/query-keys";
import { getSession } from "~/modules/auth/service";

const SESSION_STALE_TIME_MS = 5 * 60 * 1000; // 5 minutos

export function useSessionQuery(supabaseSession: Session | null) {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: () => getSession(),
    enabled: !!supabaseSession,
    staleTime: SESSION_STALE_TIME_MS,
  });
}
