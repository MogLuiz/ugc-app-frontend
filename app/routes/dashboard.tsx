import { AuthGuard } from "~/components/auth-guard";
import { BusinessDashboardScreen } from "~/modules/business-dashboard/components/business-dashboard-screen";
import { CreatorDashboardScreen } from "~/modules/creator-dashboard/components/creator-dashboard-screen";
import { useAuth } from "~/hooks/use-auth";

export default function DashboardRoute() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      {user?.role === "creator" ? (
        <CreatorDashboardScreen />
      ) : (
        <BusinessDashboardScreen />
      )}
    </AuthGuard>
  );
}
