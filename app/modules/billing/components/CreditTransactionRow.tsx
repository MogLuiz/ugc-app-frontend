import type { BalanceTransaction } from "~/modules/payments/types/payment.types";

function formatCents(cents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

const LABELS: Record<BalanceTransaction["type"], string> = {
  CREDIT_FROM_REJECTION: "Crédito por recusa do creator",
  CREDIT_FROM_EXPIRATION: "Crédito por convite expirado",
  CREDIT_USED: "Crédito usado em contratação",
  REFUND_PROCESSED: "Reembolso processado",
};

const LEFT_BORDER: Record<BalanceTransaction["type"], string> = {
  CREDIT_FROM_REJECTION: "border-l-4 border-l-green-400",
  CREDIT_FROM_EXPIRATION: "border-l-4 border-l-amber-400",
  CREDIT_USED: "border-l-4 border-l-slate-300",
  REFUND_PROCESSED: "border-l-4 border-l-purple-400",
};

type Props = {
  tx: BalanceTransaction;
  currency: string;
};

export function CreditTransactionRow({ tx, currency }: Props) {
  const isPositive = tx.amountCents > 0;

  return (
    <div className={`flex items-center justify-between py-3 pl-3 border-b border-neutral-100 last:border-0 ${LEFT_BORDER[tx.type] ?? ""}`}>
      <div className="space-y-0.5">
        <p className="text-sm text-neutral-800">{LABELS[tx.type] ?? tx.type}</p>
        <p className="text-xs text-neutral-400">{formatDate(tx.createdAt)}</p>
        {tx.note && <p className="text-xs text-neutral-400 italic">{tx.note}</p>}
      </div>
      <span className={`text-sm font-semibold ml-3 shrink-0 ${isPositive ? "text-green-700" : "text-neutral-600"}`}>
        {isPositive ? "+" : ""}
        {formatCents(tx.amountCents, currency)}
      </span>
    </div>
  );
}
