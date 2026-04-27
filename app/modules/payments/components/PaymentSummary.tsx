type PaymentSummaryProps = {
  serviceGrossAmountCents: number;
  platformFeeAmountCents: number;
  transportFeeAmountCents: number;
  creatorPayoutAmountCents: number;
  companyTotalAmountCents: number;
  currency?: string;
  creditAppliedCents?: number;
  remainderCents?: number;
};

function formatCents(cents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(
    cents / 100,
  );
}

/** Breakdown financeiro do pagamento — perspectiva da empresa (comprador). */
export function PaymentSummary({
  serviceGrossAmountCents,
  platformFeeAmountCents,
  transportFeeAmountCents,
  companyTotalAmountCents,
  currency = "BRL",
  creditAppliedCents = 0,
  remainderCents,
}: PaymentSummaryProps) {
  const showTransport = transportFeeAmountCents > 0;
  const hasCredit = creditAppliedCents > 0;
  const effectiveRemainder = remainderCents ?? companyTotalAmountCents;

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 space-y-3">
      <p className="text-sm font-semibold text-neutral-700">
        Resumo do pagamento
      </p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Serviço</span>
          <span className="text-neutral-900">
            {formatCents(serviceGrossAmountCents, currency)}
          </span>
        </div>

        {showTransport && (
          <div className="flex justify-between">
            <span className="text-neutral-500">Deslocamento</span>
            <span className="text-neutral-900">
              {formatCents(transportFeeAmountCents, currency)}
            </span>
          </div>
        )}

        <div className="border-t border-neutral-200 pt-2 flex justify-between">
          <span className="font-semibold text-neutral-800">Total</span>
          <span className="font-semibold text-neutral-900">
            {formatCents(companyTotalAmountCents, currency)}
          </span>
        </div>

        {hasCredit && (
          <>
            <div className="flex justify-between text-green-700">
              <span>Crédito aplicado</span>
              <span>− {formatCents(creditAppliedCents, currency)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-neutral-800">A cobrar agora</span>
              <span
                className={
                  effectiveRemainder === 0
                    ? "text-green-700"
                    : "text-neutral-900"
                }
              >
                {effectiveRemainder === 0
                  ? "Grátis"
                  : formatCents(effectiveRemainder, currency)}
              </span>
            </div>
          </>
        )}
      </div>

      <p className="text-xs text-neutral-400">
        O repasse ao creator será processado após confirmação do pagamento.
      </p>
    </div>
  );
}
