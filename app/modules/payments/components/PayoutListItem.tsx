import type { CreatorPayout } from "../types/payment.types";
import { PayoutStatusBadge } from "./PayoutStatusBadge";

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

function formatDateCompact(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(iso));
}

type Props = {
  payout: CreatorPayout;
  onTap: (payout: CreatorPayout) => void;
};

export function PayoutListItem({ payout, onTap }: Props) {
  const isPaid = payout.status === "paid";

  const dateMain = isPaid && payout.paidAt
    ? `Recebido em ${formatDateShort(payout.paidAt)}`
    : formatDateShort(payout.createdAt);

  const dateSub = !isPaid && payout.scheduledFor
    ? `Previsto ${formatDateCompact(payout.scheduledFor)}`
    : null;

  return (
    <button
      type="button"
      onClick={() => onTap(payout)}
      className="w-full flex items-start justify-between py-3 px-1 border-b border-slate-100 last:border-0 text-left hover:bg-slate-50 rounded-lg transition-colors gap-3"
    >
      <div className="flex flex-col gap-1 min-w-0">
        {isPaid ? (
          <span className="inline-flex items-center justify-center size-5 rounded-full bg-green-100">
            <svg className="size-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        ) : (
          <PayoutStatusBadge status={payout.status} />
        )}
        <p className="text-sm text-slate-800">{dateMain}</p>
        {dateSub && <p className="text-xs text-slate-400">{dateSub}</p>}
      </div>

      <p className={`text-sm font-semibold shrink-0 ${isPaid ? "text-green-600" : "text-slate-900"}`}>
        {formatCents(payout.amountCents, payout.currency)}
      </p>
    </button>
  );
}
