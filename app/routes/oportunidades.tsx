import { AuthGuard } from "~/components/auth-guard";
import { CreatorOpportunitiesScreen } from "~/modules/opportunities/components/creator-opportunities-screen";

export default function OportunidadesRoute() {
  return (
    <AuthGuard allowedRoles={["creator"]}>
      <CreatorOpportunitiesScreen />
    </AuthGuard>
  );
}
