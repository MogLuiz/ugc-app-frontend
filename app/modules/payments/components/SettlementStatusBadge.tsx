import type { SettlementStatus } from "../types/payment.types";

type Props = { status: SettlementStatus };

const statusConfig: Record<SettlementStatus, { label: string; className: string }> = {
  HELD:                  { label: "Em custódia",          className: "bg-amber-100 text-amber-800" },
  APPLIED:               { label: "Repassado ao creator", className: "bg-green-100 text-green-800" },
  CONVERTED_TO_CREDIT:   { label: "Virou crédito",        className: "bg-purple-100 text-purple-800" },
};

export function SettlementStatusBadge({ status }: Props) {
  const config = statusConfig[status] ?? { label: status, className: "bg-neutral-100 text-neutral-600" };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
