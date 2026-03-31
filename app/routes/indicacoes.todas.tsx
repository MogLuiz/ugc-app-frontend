import { AuthGuard } from "~/components/auth-guard";
import { ReferralsAccessGuard } from "~/modules/referrals/components/referrals-access-guard";
import { TodasIndicacoesScreen } from "~/modules/referrals/components/todas-indicacoes-screen";

export default function TodasIndicacoesRoute() {
  return (
    <AuthGuard>
      <ReferralsAccessGuard>
        <TodasIndicacoesScreen />
      </ReferralsAccessGuard>
    </AuthGuard>
  );
}
