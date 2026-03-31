import { AuthGuard } from "~/components/auth-guard";
import { TodasIndicacoesScreen } from "~/modules/referrals/components/todas-indicacoes-screen";

export default function TodasIndicacoesRoute() {
  return (
    <AuthGuard>
      <TodasIndicacoesScreen />
    </AuthGuard>
  );
}
