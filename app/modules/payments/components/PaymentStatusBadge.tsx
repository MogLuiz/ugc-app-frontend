import type { PaymentStatus } from "../types/payment.types";

type Props = { status: PaymentStatus };

const statusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  pending:            { label: "Aguardando pagamento", className: "bg-yellow-100 text-yellow-800" },
  processing:         { label: "Processando",          className: "bg-blue-100 text-blue-800" },
  authorized:         { label: "Autorizado",           className: "bg-blue-100 text-blue-800" },
  paid:               { label: "Pago",                 className: "bg-green-100 text-green-800" },
  failed:             { label: "Pagamento falhou",     className: "bg-red-100 text-red-800" },
  canceled:           { label: "Cancelado",            className: "bg-neutral-100 text-neutral-600" },
  refunded:           { label: "Reembolsado",          className: "bg-purple-100 text-purple-800" },
  partially_refunded: { label: "Reembolso parcial",    className: "bg-purple-100 text-purple-700" },
};

export function PaymentStatusBadge({ status }: Props) {
  const config = statusConfig[status] ?? { label: status, className: "bg-neutral-100 text-neutral-600" };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
