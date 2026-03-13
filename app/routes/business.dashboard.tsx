import { AuthGuard } from "~/components/auth-guard";
import { CreatorsMapScreen } from "~/modules/creators-map/components/creators-map-screen";

export default function BusinessDashboardRoute() {
  return (
    <AuthGuard allowedRoles={["business"]}>
      <CreatorsMapScreen />
    </AuthGuard>
  );
}
