import { AuthGuard } from "~/components/auth-guard";
import { FinanceiroScreen } from "~/modules/billing/components/FinanceiroScreen";

export default function FinanceiroRoute() {
  return (
    <AuthGuard allowedRoles={["business"]}>
      <FinanceiroScreen />
    </AuthGuard>
  );
}
