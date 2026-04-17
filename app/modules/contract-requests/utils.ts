import type {
  CompanyCampaignStatus,
  ContractRequestStatus,
  OfferDisplayStatus,
} from "./types";

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

/** Ex: 120 → "2 Horas", 360 → "6 Horas" ou "2h" para mobile. Retorna null se duração inválida (0 ou negativa). */
export function formatDuration(
  durationMinutes: number,
  compact = false
): string | null {
  if (durationMinutes == null || durationMinutes <= 0) return null;
  const hours = durationMinutes / 60;
  if (compact) {
    return `${Math.round(hours)}h`;
  }
  return hours === 1 ? "1 Hora" : `${Math.round(hours)} Horas`;
}

/** Ex: "15 Out, 2023" */
export function formatDateShort(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Ex: "14:00 - 20:00". Se durationMinutes <= 0, retorna só o início ou "A combinar". */
export function formatTimeRange(startsAt: string, durationMinutes: number) {
  const start = new Date(startsAt);
  const mins = durationMinutes ?? 0;
  if (mins <= 0) {
    return start.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  const end = new Date(start.getTime() + mins * 60 * 1000);
  const format = (d: Date) =>
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${format(start)} - ${format(end)}`;
}

export function getContractRequestStatusMeta(
  status: ContractRequestStatus | CompanyCampaignStatus | OfferDisplayStatus
) {
  switch (status) {
    case "PENDING_PAYMENT":
      return {
        label: "Aguardando pagamento",
        className: "bg-orange-100 text-orange-700",
      };
    case "PENDING_ACCEPTANCE":
    case "PENDING":
      return {
        label: "Pendente",
        className: "bg-amber-100 text-amber-700",
      };
    case "ACCEPTED":
      return {
        label: "Aceito",
        className: "bg-emerald-100 text-emerald-700",
      };
    case "IN_PROGRESS":
      return {
        label: "Em produção",
        className: "bg-blue-100 text-blue-700",
      };
    case "REJECTED":
      return {
        label: "Cancelado",
        className: "bg-rose-100 text-rose-700",
      };
    case "CANCELLED":
      return {
        label: "Cancelado",
        className: "bg-rose-100 text-rose-700",
      };
    case "COMPLETED":
      return {
        label: "Finalizado",
        className: "bg-slate-200 text-slate-700",
      };
    case "EXPIRED":
      return {
        label: "Expirada",
        className: "bg-slate-200 text-slate-600",
      };
    default:
      return {
        label: String(status),
        className: "bg-slate-100 text-slate-700",
      };
  }
}

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
