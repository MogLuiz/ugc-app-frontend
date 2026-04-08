import { AuthGuard } from "~/components/auth-guard";
import { useAuth } from "~/hooks/use-auth";
import { CreatorPendingContractRequestsScreen } from "~/modules/contract-requests/components/creator-pending-contract-requests-screen";
import { CompanyOpenOffersScreen } from "~/modules/open-offers/components/company-open-offers-screen";

export default function OffersRoute() {
  const { user } = useAuth();

  return (
    <AuthGuard allowedRoles={["creator", "business"]}>
      {user?.role === "business" ? (
        <CompanyOpenOffersScreen />
      ) : (
        <CreatorPendingContractRequestsScreen />
      )}
    </AuthGuard>
  );
}
