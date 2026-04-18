import type { RefundRequest } from "../types/billing.types";
import { RefundStatusBadge } from "./RefundStatusBadge";

function formatCents(cents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

type Props = {
  refund: RefundRequest | null;
  open: boolean;
  onClose: () => void;
};

export function RefundDetailSheet({ refund, open, onClose }: Props) {
  if (!open || !refund) return null;

  const steps = [
    { label: "Solicitado", date: refund.createdAt, done: true },
    { label: "Em análise", date: null, done: refund.status !== "PENDING" },
    {
      label: refund.status === "REJECTED" ? "Recusado" : "Processado",
      date: refund.processedAt,
      done: refund.status === "PAID" || refund.status === "REJECTED",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40" onClick={onClose}>
      <aside
        className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Detalhe do reembolso</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">
            Fechar
          </button>
        </header>

        <div className="p-5 space-y-5 flex-1">
          {/* Status & data */}
          <div className="space-y-2">
            <RefundStatusBadge status={refund.status} />
            <p className="text-xs text-slate-400">Solicitado em {formatDate(refund.createdAt)}</p>
          </div>

          {/* Valor */}
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Valor solicitado</span>
              <span className="font-semibold text-slate-900">{formatCents(refund.amountCents)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Método de devolução</span>
              <span className="text-slate-700">PIX</span>
            </div>
          </div>

          {/* Motivo */}
          {refund.reason && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Motivo</p>
              <p className="text-sm text-slate-700">{refund.reason}</p>
            </div>
          )}

          {/* Nota admin */}
          {refund.adminNote && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Observação</p>
              <p className="text-sm text-slate-700">{refund.adminNote}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Histórico</p>
            <div className="space-y-2 mt-2">
              {steps.map((step) => (
                <div key={step.label} className="flex items-start gap-2">
                  <span className={`size-2 mt-1.5 rounded-full shrink-0 ${step.done ? "bg-[#895af6]" : "bg-slate-200"}`} />
                  <div>
                    <p className={`text-sm ${step.done ? "text-slate-800" : "text-slate-400"}`}>{step.label}</p>
                    {step.date && <p className="text-xs text-slate-400">{formatDate(step.date)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <p className="text-xs text-slate-400 bg-slate-50 rounded-xl p-3">
            Reembolsos são processados em até 3 dias úteis via PIX.
          </p>
        </div>
      </aside>
    </div>
  );
}
