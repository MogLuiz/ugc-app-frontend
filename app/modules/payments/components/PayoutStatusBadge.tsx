import type { PayoutStatus } from "../types/payment.types";

type Props = { status: PayoutStatus };

const statusConfig: Record<PayoutStatus, { label: string; className: string }> = {
  not_due:   { label: "Aguardando liberação", className: "bg-slate-100 text-slate-600" },
  pending:   { label: "Aguardando repasse",   className: "bg-yellow-100 text-yellow-800" },
  scheduled: { label: "Agendado",             className: "bg-blue-100 text-blue-800" },
  paid:      { label: "Recebido",             className: "bg-green-100 text-green-800" },
  failed:    { label: "Falhou",               className: "bg-red-100 text-red-800" },
  canceled:  { label: "Cancelado",            className: "bg-neutral-100 text-neutral-600" },
};

export function PayoutStatusBadge({ status }: Props) {
  const config = statusConfig[status] ?? { label: status, className: "bg-neutral-100 text-neutral-600" };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
