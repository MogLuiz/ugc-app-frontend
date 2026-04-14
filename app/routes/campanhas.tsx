import { AuthGuard } from "~/components/auth-guard";
import { Navigate } from "react-router";

export default function CampaignsRoute() {
  return (
    <AuthGuard allowedRoles={["business"]}>
      <Navigate to="/ofertas" replace />
    </AuthGuard>
  );
}
