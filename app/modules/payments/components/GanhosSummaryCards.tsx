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

  const pendingPayouts = all.filter(
    (p) => p.status === "not_due" || p.status === "pending" || p.status === "scheduled"
  );
  const toReceiveTotal = pendingPayouts.reduce((sum, p) => sum + p.amountCents, 0);

  const paidPayouts = all.filter((p) => p.status === "paid");
  const receivedTotal = paidPayouts.reduce((sum, p) => sum + p.amountCents, 0);

  return (
    <div className="flex gap-3 overflow-x-auto snap-x pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:overflow-visible">
      {/* A Receber */}
      <DashboardCard
        shadowTone={toReceiveTotal > 0 ? "brand" : "neutral"}
        className={`snap-start shrink-0 w-[72vw] max-w-[280px] lg:w-auto lg:max-w-none flex flex-col gap-1 ${toReceiveTotal > 0 ? "border-l-4 border-l-amber-400" : ""}`}
      >
        <p className="text-xs text-slate-500">A receber</p>
        <p className="text-2xl font-black text-slate-900">{formatCents(toReceiveTotal, currency)}</p>
        <p className="text-xs text-slate-400">
          {pendingPayouts.length} repasse{pendingPayouts.length !== 1 ? "s" : ""} aguardando
        </p>
      </DashboardCard>

      {/* Já recebido */}
      <DashboardCard
        shadowTone={receivedTotal > 0 ? "brand" : "neutral"}
        className={`snap-start shrink-0 w-[72vw] max-w-[280px] lg:w-auto lg:max-w-none flex flex-col gap-1 ${receivedTotal > 0 ? "border-l-4 border-l-green-400" : ""}`}
      >
        <p className="text-xs text-slate-500">Já recebido</p>
        <p className="text-2xl font-black text-slate-900">{formatCents(receivedTotal, currency)}</p>
        <p className="text-xs text-slate-400">
          {paidPayouts.length} repasse{paidPayouts.length !== 1 ? "s" : ""} pago{paidPayouts.length !== 1 ? "s" : ""}
        </p>
      </DashboardCard>

      {/* Repasses pendentes */}
      <DashboardCard
        shadowTone={pendingPayouts.length > 0 ? "brand" : "neutral"}
        className={`snap-start shrink-0 w-[72vw] max-w-[280px] lg:w-auto lg:max-w-none flex flex-col gap-1 ${pendingPayouts.length > 0 ? "border-l-4 border-l-amber-400" : ""}`}
      >
        <p className="text-xs text-slate-500">Repasses pendentes</p>
        <p className="text-2xl font-black text-slate-900">{pendingPayouts.length}</p>
        <p className="text-xs text-slate-400">
          {pendingPayouts.length > 0 ? "Aguardando processamento" : "Sem pendências"}
        </p>
      </DashboardCard>
    </div>
  );
}
