import { Navigate, useLocation } from "react-router";
import { AuthGuard } from "~/components/auth-guard";

function PaymentPendingLegacyRedirect() {
  const location = useLocation();

  return <Navigate to={`/pagamento/aguardando${location.search}`} replace />;
}

export default function PaymentPendingLegacyRoute() {
  return (
    <AuthGuard>
      <PaymentPendingLegacyRedirect />
    </AuthGuard>
  );
}
