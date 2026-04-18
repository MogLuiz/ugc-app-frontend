import type { Payment } from "~/modules/payments/types/payment.types";
import { PaymentStatusBadge } from "~/modules/payments/components/PaymentStatusBadge";

function formatCents(cents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100);
}

function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function paymentMethodLabel(method: string | null): string {
  if (!method) return "Método não informado";
  const m = method.toLowerCase();
  if (m.includes("pix")) return "PIX";
  if (m.includes("credit") || m.includes("debit")) return "Cartão";
  if (m.includes("boleto")) return "Boleto";
  return "Método não informado";
}

type Props = {
  payment: Payment;
  onTap: (payment: Payment) => void;
};

export function PaymentListItem({ payment, onTap }: Props) {
  const hasCredit = payment.creditAppliedCents > 0;
  const date = payment.paidAt ?? payment.createdAt;
  const shortId = payment.contractRequestId.slice(-8).toUpperCase();
  const method = paymentMethodLabel(payment.paymentMethod);

  return (
    <button
      type="button"
      onClick={() => onTap(payment)}
      className="w-full flex items-start justify-between py-3 px-1 border-b border-slate-100 last:border-0 text-left hover:bg-slate-50 rounded-lg transition-colors gap-3"
    >
      <div className="flex flex-col gap-1 min-w-0">
        <PaymentStatusBadge status={payment.status} />
        <p className="text-sm text-slate-800">{formatDateShort(date)}</p>
        <p className="text-xs text-slate-400">
          {method} · ID {shortId}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-slate-900">
          {formatCents(payment.grossAmountCents, payment.currency)}
        </p>
        {hasCredit && (
          <p className="text-xs text-green-600 mt-0.5">
            − {formatCents(payment.creditAppliedCents, payment.currency)} crédito
          </p>
        )}
      </div>
    </button>
  );
}
