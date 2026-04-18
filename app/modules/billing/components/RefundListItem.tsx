import type { RefundRequest } from "../types/billing.types";
import { RefundStatusBadge } from "./RefundStatusBadge";

function formatCents(cents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

type Props = {
  refund: RefundRequest;
  onTap: (refund: RefundRequest) => void;
};

export function RefundListItem({ refund, onTap }: Props) {
  return (
    <button
      type="button"
      onClick={() => onTap(refund)}
      className="w-full flex items-center justify-between py-3 px-1 border-b border-slate-100 last:border-0 text-left hover:bg-slate-50 rounded-lg transition-colors"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="pt-0.5 shrink-0">
          <RefundStatusBadge status={refund.status} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-800 truncate max-w-[180px]">
            {refund.reason ?? "Sem motivo informado"}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{formatDate(refund.createdAt)}</p>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-900 shrink-0 ml-3">
        {formatCents(refund.amountCents)}
      </p>
    </button>
  );
}
