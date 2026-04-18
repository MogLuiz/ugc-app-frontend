import { Link } from "react-router";
import type { CreatorPayout } from "../types/payment.types";
import { PayoutStatusBadge } from "./PayoutStatusBadge";

function formatCents(cents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

const STATUS_DESCRIPTIONS: Record<string, string> = {
  not_due: "O serviço ainda está em andamento. O repasse será liberado após confirmação.",
  pending: "Repasse aguardando processamento pela equipe.",
  scheduled: "Repasse agendado. O valor será enviado na data prevista.",
  paid: "Valor enviado para sua chave PIX.",
  failed: "Ocorreu um problema no repasse. Entre em contato com o suporte.",
  canceled: "Este repasse foi cancelado.",
};

type Props = {
  payout: CreatorPayout | null;
  open: boolean;
  onClose: () => void;
};

export function PayoutDetailSheet({ payout, open, onClose }: Props) {
  if (!open || !payout) return null;

  const ref = payout.id.slice(-8).toUpperCase();
  const payment = payout.payment;
  const contractRequestId = payment?.contractRequestId;

  const creatorBaseAmountCents = payment
    ? payment.grossAmountCents - payment.platformFeeCents - (payout.amountCents - (payment.grossAmountCents - payment.platformFeeCents - /* transport */ 0))
    : null;

  // Derivar serviço e deslocamento a partir dos campos disponíveis
  // creatorNetAmountCents = payout.amountCents (invariante)
  // Não temos breakdown granular no payout, mas payment aninhado tem grossAmountCents e platformFeeCents
  const totalToReceive = payout.amountCents;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40" onClick={onClose}>
      <aside
        className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Detalhe do repasse</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">
            Fechar
          </button>
        </header>

        <div className="p-5 space-y-5 flex-1">
          {/* Status & ID */}
          <div className="space-y-2">
            <PayoutStatusBadge status={payout.status} />
            <p className="text-sm font-medium text-slate-800">Repasse #{ref}</p>
            {payout.status === "paid" && payout.paidAt && (
              <p className="text-xs text-slate-400">Recebido em {formatDate(payout.paidAt)}</p>
            )}
            {payout.scheduledFor && payout.status !== "paid" && (
              <p className="text-xs text-slate-400">Previsto para {formatDate(payout.scheduledFor)}</p>
            )}
          </div>

          {/* Seu valor */}
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Seu valor</p>
            <div className="space-y-1.5 text-sm">
              {payment ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Valor do contrato</span>
                    <span className="text-slate-800">{formatCents(payment.grossAmountCents, payout.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Taxa da plataforma</span>
                    <span className="text-slate-500">− {formatCents(payment.platformFeeCents, payout.currency)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between">
                    <span className="font-semibold text-slate-900">Total a receber</span>
                    <span className="font-bold text-slate-900">{formatCents(totalToReceive, payout.currency)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">Total a receber</span>
                  <span className="font-bold text-slate-900">{formatCents(totalToReceive, payout.currency)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Situação */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Situação</p>
            <p className="text-sm text-slate-700">{STATUS_DESCRIPTIONS[payout.status] ?? "—"}</p>
          </div>

          {/* Campanha */}
          {contractRequestId && (
            <Link
              to={`/campanha/${contractRequestId}`}
              className="block w-full text-center rounded-xl bg-slate-100 text-slate-700 py-2.5 text-sm font-medium hover:bg-slate-200 transition-colors"
              onClick={onClose}
            >
              Ver campanha
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}
