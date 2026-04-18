import type { CreatorPayout } from "../types/payment.types";
import { DashboardCard } from "~/components/ui/dashboard-card";

function formatCents(cents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100);
}

type Props = {
  payouts: CreatorPayout[] | undefined;
};

export function GanhosSummaryCards({ payouts }: Props) {
  const all = payouts ?? [];
  const currency = all[0]?.currency ?? "BRL";

  const aReceber = all.filter((p) => p.status === "pending" || p.status === "scheduled");
  const aReceberTotal = aReceber.reduce((sum, p) => sum + p.amountCents, 0);

  const recebidos = all.filter((p) => p.status === "paid");
  const recebidoTotal = recebidos.reduce((sum, p) => sum + p.amountCents, 0);

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* A receber */}
      <DashboardCard
        shadowTone={aReceberTotal > 0 ? "brand" : "neutral"}
        className={`flex flex-col gap-1 p-4 lg:p-5 ${aReceberTotal > 0 ? "border-l-4 border-l-[#895af6]" : ""}`}
      >
        <p className="text-xs text-slate-500 leading-tight">A receber</p>
        <p className="text-xl font-black text-slate-900 leading-tight">{formatCents(aReceberTotal, currency)}</p>
        <p className="text-xs text-slate-400 leading-tight">
          {aReceber.length > 0
            ? `${aReceber.length} repasse${aReceber.length !== 1 ? "s" : ""} liberado${aReceber.length !== 1 ? "s" : ""}`
            : "Aguardando pagamento"}
        </p>
      </DashboardCard>

      {/* Recebido */}
      <DashboardCard
        shadowTone={recebidoTotal > 0 ? "brand" : "neutral"}
        className={`flex flex-col gap-1 p-4 lg:p-5 ${recebidoTotal > 0 ? "border-l-4 border-l-green-400" : ""}`}
      >
        <p className="text-xs text-slate-500 leading-tight">Recebido</p>
        <p className="text-xl font-black text-slate-900 leading-tight">{formatCents(recebidoTotal, currency)}</p>
        <p className="text-xs text-slate-400 leading-tight">
          {recebidos.length > 0
            ? `${recebidos.length} repasse${recebidos.length !== 1 ? "s" : ""} pago${recebidos.length !== 1 ? "s" : ""}`
            : "Nenhum ainda"}
        </p>
      </DashboardCard>
    </div>
  );
}
