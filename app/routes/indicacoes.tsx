import { AuthGuard } from "~/components/auth-guard";
import { IndicacoesScreen } from "~/modules/referrals/components/indicacoes-screen";

export default function IndicacoesRoute() {
  return (
    <AuthGuard>
      <IndicacoesScreen />
    </AuthGuard>
  );
}
