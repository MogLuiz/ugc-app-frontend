import { Card } from "~/components/ui/card";
import type { UserRole } from "~/modules/auth/types";

type DashboardOverviewProps = {
  role: UserRole;
};

const contentByRole = {
  business: {
    title: "Painel da empresa",
    subtitle: "Acompanhe seus pedidos, jobs em andamento e historico de contratacoes."
  },
  creator: {
    title: "Painel da criadora",
    subtitle: "Veja suas solicitacoes, ganhos e entregas pendentes."
  }
};

export function DashboardOverview({ role }: DashboardOverviewProps) {
  return (
    <Card>
      <h2 className="text-base font-semibold">{contentByRole[role].title}</h2>
      <p className="mt-2 text-sm text-slate-600">{contentByRole[role].subtitle}</p>
    </Card>
  );
}
