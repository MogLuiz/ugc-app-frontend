import { AuthGuard } from "~/components/auth-guard";
import { CompanyProfileScreen } from "~/modules/company-profile/components/company-profile-screen";
import { CreatorProfileEditScreen } from "~/modules/creator-profile-edit/components/creator-profile-edit-screen";
import { useAuth } from "~/hooks/use-auth";
import { Navigate } from "react-router";

export default function PerfilRoute() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      {user?.role === "business" ? (
        <CompanyProfileScreen />
      ) : user?.role === "creator" ? (
        <CreatorProfileEditScreen />
      ) : (
        <Navigate to="/dashboard" replace />
      )}
    </AuthGuard>
  );
}
