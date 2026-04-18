import type { CompanyBalance, Payment } from "~/modules/payments/types/payment.types";
import type { RefundRequest } from "../types/billing.types";
import { DashboardCard } from "~/components/ui/dashboard-card";

function formatCents(cents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100);
}

type Props = {
  balance: CompanyBalance | undefined;
  payments: Payment[] | undefined;
  refundRequests: RefundRequest[] | undefined;
  onRequestRefund: () => void;
};

export function FinanceiroSummaryCards({ balance, payments, refundRequests, onRequestRefund }: Props) {
  const currency = balance?.currency ?? "BRL";

  const totalPaid = (payments ?? [])
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.grossAmountCents, 0);
  const paidCount = (payments ?? []).filter((p) => p.status === "paid").length;

  const pendingPayments = (payments ?? []).filter(
    (p) => p.status === "pending" || p.status === "processing" || p.status === "authorized"
  );
  const pendingTotal = pendingPayments.reduce((sum, p) => sum + p.grossAmountCents, 0);

  const pendingRefunds = (refundRequests ?? []).filter((r) => r.status === "PENDING");
  const pendingRefundTotal = pendingRefunds.reduce((sum, r) => sum + r.amountCents, 0);

  const availableCents = balance?.availableCents ?? 0;
  const maxCreditCents = balance?.maxCreditCents ?? 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Saldo em créditos */}
      <DashboardCard
        shadowTone={availableCents > 0 ? "brand" : "neutral"}
        className={`flex flex-col gap-1 p-4 lg:p-5 ${availableCents > 0 ? "border-l-4 border-l-green-400" : ""}`}
      >
        <p className="text-xs text-slate-500 leading-tight">Saldo em créditos</p>
        <p className="text-xl font-black text-slate-900 leading-tight">{formatCents(availableCents, currency)}</p>
        <p className="text-xs text-slate-400 leading-tight">Limite: {formatCents(maxCreditCents, currency)}</p>
        {availableCents > 0 && (
          <button
            type="button"
            onClick={onRequestRefund}
            className="mt-1 text-xs font-semibold text-[#895af6] hover:text-[#7c4de0] text-left leading-tight"
          >
            Solicitar →
          </button>
        )}
      </DashboardCard>

      {/* Total pago */}
      <DashboardCard shadowTone="neutral" className="flex flex-col gap-1 p-4 lg:p-5">
        <p className="text-xs text-slate-500 leading-tight">Total pago</p>
        <p className="text-xl font-black text-slate-900 leading-tight">{formatCents(totalPaid, currency)}</p>
        <p className="text-xs text-slate-400 leading-tight">
          {paidCount} pago{paidCount !== 1 ? "s" : ""}
        </p>
      </DashboardCard>

      {/* Pagamentos pendentes */}
      <DashboardCard
        shadowTone={pendingPayments.length > 0 ? "brand" : "neutral"}
        className={`flex flex-col gap-1 p-4 lg:p-5 ${pendingPayments.length > 0 ? "border-l-4 border-l-amber-400" : ""}`}
      >
        <p className="text-xs text-slate-500 leading-tight">Pendentes</p>
        <p className="text-xl font-black text-slate-900 leading-tight">{pendingPayments.length}</p>
        <p className="text-xs text-slate-400 leading-tight">
          {pendingPayments.length > 0
            ? formatCents(pendingTotal, currency)
            : "Nenhum"}
        </p>
      </DashboardCard>

      {/* Reembolsos em análise */}
      <DashboardCard
        shadowTone={pendingRefunds.length > 0 ? "brand" : "neutral"}
        className={`flex flex-col gap-1 p-4 lg:p-5 ${pendingRefunds.length > 0 ? "border-l-4 border-l-purple-400" : ""}`}
      >
        <p className="text-xs text-slate-500 leading-tight">Reembolsos</p>
        <p className="text-xl font-black text-slate-900 leading-tight">{pendingRefunds.length}</p>
        <p className="text-xs text-slate-400 leading-tight">
          {pendingRefunds.length > 0
            ? formatCents(pendingRefundTotal, currency)
            : "Nenhum"}
        </p>
      </DashboardCard>
    </div>
  );
}
