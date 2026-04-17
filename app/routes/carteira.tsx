import { useState } from "react";
import { AuthGuard } from "~/components/auth-guard";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { useCompanyBalanceQuery, useRequestRefundMutation } from "~/modules/billing/api/billing.queries";
import type { BalanceTransaction } from "~/modules/payments/types/payment.types";

function formatCents(cents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

const TRANSACTION_LABELS: Record<BalanceTransaction["type"], string> = {
  CREDIT_FROM_REJECTION: "Crédito por recusa do creator",
  CREDIT_FROM_EXPIRATION: "Crédito por convite expirado",
  CREDIT_USED: "Crédito usado em contratação",
  REFUND_PROCESSED: "Reembolso processado",
};

function TransactionRow({ tx, currency }: { tx: BalanceTransaction; currency: string }) {
  const isPositive = tx.amountCents > 0;
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
      <div className="space-y-0.5">
        <p className="text-sm text-neutral-800">{TRANSACTION_LABELS[tx.type] ?? tx.type}</p>
        <p className="text-xs text-neutral-400">{formatDate(tx.createdAt)}</p>
        {tx.note && <p className="text-xs text-neutral-400 italic">{tx.note}</p>}
      </div>
      <span
        className={`text-sm font-semibold ${isPositive ? "text-green-700" : "text-neutral-700"}`}
      >
        {isPositive ? "+" : ""}
        {formatCents(tx.amountCents, currency)}
      </span>
    </div>
  );
}

function RefundRequestModal({
  maxAmountCents,
  currency,
}: {
  maxAmountCents: number;
  currency: string;
}) {
  const mutation = useRequestRefundMutation();
  const [amountStr, setAmountStr] = useState("");
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountCents = Math.round(parseFloat(amountStr.replace(",", ".")) * 100);
    if (!amountCents || amountCents <= 0 || amountCents > maxAmountCents) return;
    mutation.mutate(
      { amountCents, reason: reason || undefined },
      {
        onSuccess: () => setSuccess(true),
      }
    );
  };

  if (success) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-green-700 font-medium">
          Solicitação enviada! Nossa equipe entrará em contato para processar o reembolso.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm text-neutral-700 font-medium">
          Valor (máx. {formatCents(maxAmountCents, currency)})
        </label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          max={(maxAmountCents / 100).toFixed(2)}
          value={amountStr}
          onChange={(e) => setAmountStr(e.target.value)}
          required
          placeholder="0,00"
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-neutral-700 font-medium">
          Motivo <span className="text-neutral-400">(opcional)</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Descreva o motivo do reembolso..."
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {mutation.isError && (
        <p className="text-sm text-red-500">Não foi possível enviar a solicitação. Tente novamente.</p>
      )}

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Enviando..." : "Solicitar reembolso"}
      </Button>
    </form>
  );
}

function CarteiraScreen() {
  const { data: balance, isLoading, isError } = useCompanyBalanceQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-neutral-400 text-sm">Carregando saldo...</p>
      </div>
    );
  }

  if (isError || !balance) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-red-500 text-sm">Não foi possível carregar o saldo.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900">Carteira</h1>

      {/* Saldo disponível */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 space-y-1">
        <p className="text-sm text-neutral-500">Saldo disponível</p>
        <p className="text-3xl font-bold text-neutral-900">
          {formatCents(balance.availableCents, balance.currency)}
        </p>
        <p className="text-xs text-neutral-400">
          Limite: {formatCents(balance.maxCreditCents, balance.currency)}
        </p>
      </div>

      {/* Botão de reembolso */}
      {balance.availableCents > 0 && (
        <Dialog
          title="Solicitar reembolso"
          description="O reembolso é processado manualmente via PIX. Nossa equipe analisará sua solicitação em até 3 dias úteis."
          triggerLabel="Solicitar reembolso"
        >
          <RefundRequestModal
            maxAmountCents={balance.availableCents}
            currency={balance.currency}
          />
        </Dialog>
      )}

      {/* Histórico */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-neutral-700">Histórico de movimentações</p>

        {balance.transactions.length === 0 ? (
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-center">
            <p className="text-sm text-neutral-400">Nenhuma movimentação ainda.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-neutral-200 bg-white px-4">
            {balance.transactions.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} currency={balance.currency} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CarteiraRoute() {
  return (
    <AuthGuard allowedRoles={["business"]}>
      <CarteiraScreen />
    </AuthGuard>
  );
}
