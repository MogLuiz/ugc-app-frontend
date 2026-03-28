import { AuthGuard } from "~/components/auth-guard";
import { Navigate, useParams } from "react-router";
import { useAuth } from "~/hooks/use-auth";
import type { CompanyCampaignsLocationState } from "~/modules/contract-requests/company-campaigns-location-state";

/**
 * Rota canónica `/campanha/:contractRequestId` — redireciona conforme o papel:
 * - empresa: abre a campanha em `/campanhas` (estado consumido por CompanyContractRequestsScreen)
 * - criador: detalhe da oferta em `/ofertas/:id`
 */
function CampanhaRedirect() {
  const { contractRequestId } = useParams<{ contractRequestId: string }>();
  const { user } = useAuth();

  if (!contractRequestId?.trim()) {
    return <Navigate to="/dashboard" replace />;
  }

  if (user?.role === "business") {
    return (
      <Navigate
        to="/campanhas"
        replace
        state={
          { openContractRequestId: contractRequestId } satisfies CompanyCampaignsLocationState
        }
      />
    );
  }

  return <Navigate to={`/ofertas/${contractRequestId}`} replace />;
}

export default function CampanhaContractRequestRoute() {
  return (
    <AuthGuard>
      <CampanhaRedirect />
    </AuthGuard>
  );
}
