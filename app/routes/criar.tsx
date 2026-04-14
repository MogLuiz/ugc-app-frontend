import { AuthGuard } from "~/components/auth-guard";
import { Navigate } from "react-router";

export default function CriarRoute() {
  return (
    <AuthGuard allowedRoles={["business"]}>
      <Navigate to="/ofertas/criar" replace />
    </AuthGuard>
  );
}
