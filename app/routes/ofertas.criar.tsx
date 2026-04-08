import { AuthGuard } from "~/components/auth-guard";
import { CompanyOpenOfferCreateScreen } from "~/modules/open-offers/components/company-open-offer-create-screen";

export default function OfferCreateRoute() {
  return (
    <AuthGuard allowedRoles={["business"]}>
      <CompanyOpenOfferCreateScreen />
    </AuthGuard>
  );
}
