import { AuthGuard } from "~/components/auth-guard";
import { CompanyProfileScreen } from "~/modules/company-profile/components/company-profile-screen";
import { useAuth } from "~/hooks/use-auth";
import { Navigate } from "react-router";

export default function PerfilRoute() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      {user?.role === "business" ? (
        <CompanyProfileScreen />
      ) : (
        <Navigate to="/dashboard" replace />
      )}
    </AuthGuard>
  );
}
