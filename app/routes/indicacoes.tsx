import { AuthGuard } from "~/components/auth-guard";
import { IndicacoesScreen } from "~/modules/referrals/components/indicacoes-screen";
import { ReferralsAccessGuard } from "~/modules/referrals/components/referrals-access-guard";

export default function IndicacoesRoute() {
  return (
    <AuthGuard>
      <ReferralsAccessGuard>
        <IndicacoesScreen />
      </ReferralsAccessGuard>
    </AuthGuard>
  );
}
