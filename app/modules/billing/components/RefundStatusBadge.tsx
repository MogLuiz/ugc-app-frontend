import type { RefundRequestStatus } from "../types/billing.types";

type Props = { status: RefundRequestStatus };

const statusConfig: Record<RefundRequestStatus, { label: string; className: string }> = {
  PENDING:  { label: "Em análise",   className: "bg-yellow-100 text-yellow-800" },
  APPROVED: { label: "Aprovado",     className: "bg-blue-100 text-blue-800" },
  REJECTED: { label: "Não aprovado", className: "bg-red-100 text-red-800" },
  PAID:     { label: "Reembolsado",  className: "bg-green-100 text-green-800" },
};

export function RefundStatusBadge({ status }: Props) {
  const config = statusConfig[status] ?? { label: status, className: "bg-neutral-100 text-neutral-600" };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
