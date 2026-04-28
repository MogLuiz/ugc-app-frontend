import { AlertCircle } from "lucide-react";
import { Link } from "react-router";
import { useCompanyOffersHubQuery } from "~/modules/open-offers/queries";
import { getPaymentResumeState } from "~/modules/payments/utils/payment-resume-state";

export function BusinessDashboardPendingPaymentBanner() {
  const { data: hub } = useCompanyOffersHubQuery();
  const awaitingPayment = hub?.pending.awaitingPayment ?? [];

  if (awaitingPayment.length === 0) return null;

  const count = awaitingPayment.length;
  const isSingle = count === 1;
  const singleItem = isSingle ? awaitingPayment[0] : null;
  const resumeState = singleItem ? getPaymentResumeState(singleItem) : null;

  const titleText = isSingle
    ? "Você tem um pagamento pendente"
    : `Você tem ${count} pagamentos pendentes`;

  const descText = isSingle
    ? "Finalize o pagamento para confirmar a contratação com o creator."
    : "Finalize os pagamentos pendentes para confirmar as contratações.";

  const ctaLabel = isSingle
    ? (resumeState?.ctaLabel ?? "Continuar pagamento")
    : "Ver pagamentos pendentes";

  const ctaHref = isSingle
    ? (resumeState?.resumeUrl ?? "/ofertas")
    : "/ofertas";

  return (
    <div className="rounded-[24px] bg-amber-50 px-5 py-4 ring-1 ring-inset ring-amber-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden />
          <div className="min-w-0">
            <p className="text-sm font-bold text-amber-900">{titleText}</p>
            <p className="mt-0.5 text-sm text-amber-700">{descText}</p>
          </div>
        </div>
        <Link
          to={ctaHref}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-600"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
