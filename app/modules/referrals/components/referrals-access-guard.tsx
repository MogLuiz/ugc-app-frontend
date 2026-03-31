import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { AppLoadingSplash } from "~/components/ui/app-loading-splash";
import { usePartnerProfileQuery } from "../hooks/use-referrals-data";

/**
 * Só renderiza filhos se o usuário for parceiro ativo (GET /partners/me com sucesso).
 * Caso contrário redireciona — não depender apenas de esconder links no menu.
 */
export function ReferralsAccessGuard({ children }: { children: ReactNode }) {
  const profileQuery = usePartnerProfileQuery();

  if (profileQuery.isLoading) {
    return <AppLoadingSplash />;
  }

  if (profileQuery.data?.kind !== "active") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
