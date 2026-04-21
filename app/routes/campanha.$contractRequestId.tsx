import { AuthGuard } from "~/components/auth-guard";
import { Navigate, useParams } from "react-router";
import { useAuth } from "~/hooks/use-auth";

/**
 * Rota canónica `/campanha/:contractRequestId` — redireciona conforme o papel:
 * - empresa: abre o detalhe em `/ofertas/:id`
 * - criador: detalhe da oferta em `/ofertas/:id`
 *
 * Compat layer de go-live: mantém links antigos/handoffs sem reativar `campaigns`.
 */
function CampanhaRedirect() {
  const { contractRequestId } = useParams<{ contractRequestId: string }>();
  const { user } = useAuth();

  if (!contractRequestId?.trim()) {
    return <Navigate to="/dashboard" replace />;
  }

  if (user?.role === "business") {
    return <Navigate to={`/ofertas/${contractRequestId}`} replace />;
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
