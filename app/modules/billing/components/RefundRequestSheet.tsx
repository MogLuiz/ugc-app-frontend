import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useRequestRefundMutation } from "../api/billing.queries";

function formatCents(cents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100);
}

type Props = {
  maxAmountCents: number;
  currency: string;
  open: boolean;
  onClose: () => void;
};

export function RefundRequestSheet({ maxAmountCents, currency, open, onClose }: Props) {
  const mutation = useRequestRefundMutation();
  const [amountStr, setAmountStr] = useState("");
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    setAmountStr("");
    setReason("");
    setSuccess(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountCents = Math.round(parseFloat(amountStr.replace(",", ".")) * 100);
    if (!amountCents || amountCents <= 0 || amountCents > maxAmountCents) return;
    mutation.mutate(
      { amountCents, reason: reason || undefined },
      { onSuccess: () => setSuccess(true) }
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40" onClick={handleClose}>
      <aside
        className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-5 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Solicitar reembolso</h3>
          <button type="button" onClick={handleClose} className="text-slate-400 hover:text-slate-600 text-sm">
            Fechar
          </button>
        </header>

        <p className="text-xs text-slate-500 mb-4">
          O reembolso é processado manualmente via PIX. Nossa equipe analisará sua solicitação em até 3 dias úteis.
        </p>

        {success ? (
          <div className="rounded-xl bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-green-700 font-medium">
              Solicitação enviada! Nossa equipe entrará em contato para processar o reembolso.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 flex-1">
            <div className="space-y-1">
              <label className="text-sm text-slate-700 font-medium">
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
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#895af6]/30 focus:border-[#895af6]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-700 font-medium">
                Motivo <span className="text-slate-400">(opcional)</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Descreva o motivo do reembolso..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#895af6]/30 focus:border-[#895af6] resize-none"
              />
            </div>

            {mutation.isError && (
              <p className="text-sm text-red-500">Não foi possível enviar a solicitação. Tente novamente.</p>
            )}

            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Enviando..." : "Solicitar reembolso"}
            </Button>
          </form>
        )}
      </aside>
    </div>
  );
}
