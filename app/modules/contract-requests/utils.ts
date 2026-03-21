import type { ContractRequestStatus } from "./types";

export function formatCurrency(value: number, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function getContractRequestStatusMeta(status: ContractRequestStatus) {
  switch (status) {
    case "PENDING_ACCEPTANCE":
      return {
        label: "Pendente",
        className: "bg-amber-100 text-amber-700",
      };
    case "ACCEPTED":
      return {
        label: "Aceita",
        className: "bg-emerald-100 text-emerald-700",
      };
    case "REJECTED":
      return {
        label: "Recusada",
        className: "bg-rose-100 text-rose-700",
      };
    case "CANCELLED":
      return {
        label: "Cancelada",
        className: "bg-slate-200 text-slate-700",
      };
    case "COMPLETED":
      return {
        label: "Concluída",
        className: "bg-blue-100 text-blue-700",
      };
    default:
      return {
        label: status,
        className: "bg-slate-100 text-slate-700",
      };
  }
}
