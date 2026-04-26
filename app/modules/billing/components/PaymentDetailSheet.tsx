import { Link } from "react-router";
import type { Payment } from "~/modules/payments/types/payment.types";
import { PaymentStatusBadge } from "~/modules/payments/components/PaymentStatusBadge";
import { PaymentSummary } from "~/modules/payments/components/PaymentSummary";
import { SettlementStatusBadge } from "~/modules/payments/components/SettlementStatusBadge";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

const CARD_BRANDS = new Set([
  "master", "visa", "amex", "elo", "hipercard", "hiper",
  "diners", "discover", "aura", "jcb", "cabal",
]);

function paymentMethodLabel(method: string | null): string {
  if (!method) return "—";
  const m = method.toLowerCase();
  if (m.includes("pix")) return "PIX";
  if (m.includes("boleto")) return "Boleto";
  if (m.includes("credit")) return "Cartão de crédito";
  if (m.includes("debit")) return "Cartão de débito";
  if (CARD_BRANDS.has(m)) return "Cartão de crédito";
  return method;
}

type Props = {
  payment: Payment | null;
  open: boolean;
  onClose: () => void;
};

export function PaymentDetailSheet({ payment, open, onClose }: Props) {
  if (!open || !payment) return null;

  const ref = payment.contractRequestId.slice(-8).toUpperCase();
  const isPaid = payment.status === "paid";
  const isFailed = payment.status === "failed";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40" onClick={onClose}>
      <aside
        className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Detalhe do pagamento</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">
            Fechar
          </button>
        </header>

        <div className="p-5 space-y-5 flex-1">
          {/* Status & ID */}
          <div className="space-y-2">
            <PaymentStatusBadge status={payment.status} />
            <p className="text-sm font-medium text-slate-800">Ref. {ref}</p>
            {isPaid && payment.paidAt && (
              <p className="text-xs text-slate-400">Pago em {formatDate(payment.paidAt)}</p>
            )}
            {!isPaid && (
              <p className="text-xs text-slate-400">Criado em {formatDate(payment.createdAt)}</p>
            )}
          </div>

          {/* Breakdown */}
          <PaymentSummary
            serviceGrossAmountCents={payment.serviceGrossAmountCents}
            platformFeeAmountCents={payment.platformFeeAmountCents}
            transportFeeAmountCents={payment.transportFeeAmountCents}
            creatorPayoutAmountCents={payment.creatorPayoutAmountCents}
            companyTotalAmountCents={payment.companyTotalAmountCents}
            currency={payment.currency}
            creditAppliedCents={payment.creditAppliedCents}
            remainderCents={payment.companyTotalAmountCents - payment.creditAppliedCents}
          />

          {/* Método de pagamento */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Método</p>
            <p className="text-sm text-slate-800">
              {paymentMethodLabel(payment.paymentMethod)}
              {payment.installments && payment.installments > 1 && (
                <span className="text-slate-400"> · {payment.installments}×</span>
              )}
            </p>
          </div>

          {/* Situação do repasse */}
          {isPaid && payment.settlementStatus && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Repasse ao creator</p>
              <SettlementStatusBadge status={payment.settlementStatus} />
            </div>
          )}

          {/* CTAs */}
          <div className="space-y-2 pt-2">
            {isPaid && (
              <Link
                to={`/campanha/${payment.contractRequestId}`}
                className="block w-full text-center rounded-xl bg-slate-100 text-slate-700 py-2.5 text-sm font-medium hover:bg-slate-200 transition-colors"
                onClick={onClose}
              >
                Ver campanha
              </Link>
            )}
            {isFailed && (
              <Link
                to={`/pagamento/${payment.contractRequestId}`}
                className="block w-full text-center rounded-xl bg-[#895af6] text-white py-2.5 text-sm font-medium hover:bg-[#7c4de0] transition-colors"
                onClick={onClose}
              >
                Tentar novamente
              </Link>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
