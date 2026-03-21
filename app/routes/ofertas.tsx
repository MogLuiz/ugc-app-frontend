import { AuthGuard } from "~/components/auth-guard";
import { CreatorPendingContractRequestsScreen } from "~/modules/contract-requests/components/creator-pending-contract-requests-screen";

export default function OffersRoute() {
  return (
    <AuthGuard allowedRoles={["creator"]}>
      <CreatorPendingContractRequestsScreen />
    </AuthGuard>
  );
}
