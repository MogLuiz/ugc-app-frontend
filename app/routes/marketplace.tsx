import { AuthGuard } from "~/components/auth-guard";
import { MarketplaceScreen } from "~/modules/marketplace/components/marketplace-screen";

export default function MarketplaceRoute() {
  return (
    <AuthGuard>
      <MarketplaceScreen />
    </AuthGuard>
  );
}
