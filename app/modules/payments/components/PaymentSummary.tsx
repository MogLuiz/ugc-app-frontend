type PaymentSummaryProps = {
  grossAmountCents: number;
  platformFeeCents: number;
  creatorBaseAmountCents: number;
  transportFeeCents: number;
  /** creatorBaseAmountCents + transportFeeCents */
  creatorNetAmountCents: number;
  currency?: string;
};

function formatCents(cents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

/**
 * Breakdown financeiro do pagamento — perspectiva da empresa (comprador).
 * Todos os valores são positivos.
 *
 * Invariante:
 *   Total = Serviço do creator + Deslocamento + Taxa da plataforma
 */
export function PaymentSummary({
  grossAmountCents,
  platformFeeCents,
  creatorBaseAmountCents,
  transportFeeCents,
  currency = "BRL",
}: PaymentSummaryProps) {
  const showTransport = transportFeeCents > 0;

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 space-y-3">
      <p className="text-sm font-semibold text-neutral-700">Resumo do pagamento</p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Serviço do creator</span>
          <span className="text-neutral-900">
            {formatCents(creatorBaseAmountCents, currency)}
          </span>
        </div>

        {showTransport && (
          <div className="flex justify-between">
            <span className="text-neutral-500">Deslocamento</span>
            <span className="text-neutral-900">
              {formatCents(transportFeeCents, currency)}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-neutral-500">Taxa da plataforma</span>
          <span className="text-neutral-900">
            {formatCents(platformFeeCents, currency)}
          </span>
        </div>

        <div className="border-t border-neutral-200 pt-2 flex justify-between">
          <span className="font-semibold text-neutral-800">Total</span>
          <span className="font-semibold text-neutral-900">
            {formatCents(grossAmountCents, currency)}
          </span>
        </div>
      </div>

      <p className="text-xs text-neutral-400">
        O repasse ao creator será processado após confirmação do pagamento.
      </p>
    </div>
  );
}
