import type { CreatorPayout } from "../types/payment.types";
import { PayoutStatusBadge } from "./PayoutStatusBadge";

function formatCents(cents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

function buildIdentifier(payout: CreatorPayout): string {
  const contractId = payout.payment?.contractRequestId;
  if (contractId) {
    return `Ref. ${contractId.slice(-8).toUpperCase()}`;
  }
  return `Repasse ${payout.id.slice(-8).toUpperCase()}`;
}

type Props = {
  payout: CreatorPayout;
  onTap: (payout: CreatorPayout) => void;
  showDate?: boolean;
};

export function PayoutListItem({ payout, onTap, showDate = true }: Props) {
  const isPaid = payout.status === "paid";
  const dateLabel = isPaid && payout.paidAt
    ? `Recebido em ${formatDate(payout.paidAt)}`
    : payout.scheduledFor
      ? `Previsto para ${formatDate(payout.scheduledFor)}`
      : "Data a confirmar";

  return (
    <button
      type="button"
      onClick={() => onTap(payout)}
      className="w-full flex items-center justify-between py-3 px-1 border-b border-slate-100 last:border-0 text-left hover:bg-slate-50 rounded-lg transition-colors"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="pt-0.5 shrink-0">
          {isPaid ? (
            <span className="inline-flex items-center justify-center size-5 rounded-full bg-green-100">
              <svg className="size-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          ) : (
            <PayoutStatusBadge status={payout.status} />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-800 truncate">{buildIdentifier(payout)}</p>
          {showDate && <p className="text-xs text-slate-400 mt-0.5">{dateLabel}</p>}
        </div>
      </div>
      <p className={`text-sm font-semibold shrink-0 ml-3 ${isPaid ? "text-green-600" : "text-slate-900"}`}>
        {formatCents(payout.amountCents, payout.currency)}
      </p>
    </button>
  );
}
