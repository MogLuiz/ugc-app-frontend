import { AuthGuard } from "~/components/auth-guard";
import { CompanyContractRequestsScreen } from "~/modules/contract-requests/components/company-contract-requests-screen";

export default function CampaignsRoute() {
  return (
    <AuthGuard allowedRoles={["business"]}>
      <CompanyContractRequestsScreen />
    </AuthGuard>
  );
}
