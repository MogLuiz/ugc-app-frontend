import type { OpenOfferListItemViewModel } from "~/modules/open-offers/types";
import type { ContractRequestItem } from "./types";

const STATUS_SUBTITLE: Partial<Record<string, string>> = {
  COMPLETED: "Trabalho concluído",
  REJECTED: "Proposta recusada",
  CANCELLED: "Trabalho cancelado",
};

const STATUS_LABEL: Partial<Record<string, string>> = {
  PENDING_ACCEPTANCE: "Pendente",
  ACCEPTED: "Aceita",
  COMPLETED: "Concluída",
  REJECTED: "Recusada",
  CANCELLED: "Cancelada",
};

function formatCreatorExpiry(expiresAt: string, now: number): string {
  const diffMs = new Date(expiresAt).getTime() - now;
  if (diffMs <= 0) return "Expirada";
  const totalMinutes = Math.ceil(diffMs / 60_000);
  const totalHours = Math.ceil(diffMs / 3_600_000);
  const totalDays = Math.ceil(diffMs / 86_400_000);
  if (totalMinutes < 60) return `Expira em ${totalMinutes} min`;
  if (totalHours < 24) return `Expira em ${totalHours}h`;
  return `Expira em ${totalDays} dia${totalDays > 1 ? "s" : ""}`;
}

export function mapCreatorContractToListItem(
  item: ContractRequestItem,
  now = Date.now()
): OpenOfferListItemViewModel {
  const isPending = item.status === "PENDING_ACCEPTANCE";
  const isExpiredStatus = item.status === "EXPIRED";
  const isExpiredPending =
    isPending && !!item.expiresAt && new Date(item.expiresAt).getTime() <= now;
  const hasStarted =
    item.status === "ACCEPTED" &&
    !!item.startsAt &&
    new Date(item.schedule?.startTime ?? item.startsAt).getTime() <= now;

  const expiredLabel = item.openOfferId ? "Oferta expirada" : "Convite expirado";

  let subtitle: string;
  if (isPending) {
    subtitle = isExpiredPending
      ? "Expirada"
      : item.expiresAt
        ? formatCreatorExpiry(item.expiresAt, now)
        : "Aguardando resposta";
  } else if (isExpiredStatus) {
    subtitle = expiredLabel;
  } else if (item.status === "ACCEPTED") {
    subtitle = hasStarted ? "Trabalho em andamento" : "Trabalho aceito";
  } else {
    subtitle = STATUS_SUBTITLE[item.status as string] ?? item.status;
  }

  const statusLabel = isExpiredStatus
    ? expiredLabel
    : isExpiredPending
      ? "Expirada"
      : STATUS_LABEL[item.status as string] ?? item.status;

  return {
    id: item.id,
    kind: "direct_invite",
    visualLabel: "Convite direto",
    title: item.companyName ?? item.job?.title ?? "Empresa",
    subtitle,
    description: item.description,
    address: item.jobFormattedAddress ?? item.jobAddress ?? "Local a combinar",
    amount: item.pricing?.totalAmount ?? item.totalAmount ?? item.totalPrice,
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
    startsAt: item.schedule?.startTime ?? item.startsAt ?? null,
    durationMinutes: item.job?.durationMinutes ?? item.durationMinutes,
    expiresAt: item.expiresAt ?? null,
    expiresInMs: item.expiresAt ? new Date(item.expiresAt).getTime() - now : null,
    statusLabel,
    href: undefined,
    contractRequestId: item.id,
  };
}

export function sortByStartsAtDesc(
  left: OpenOfferListItemViewModel,
  right: OpenOfferListItemViewModel
): number {
  const leftStart = new Date(left.startsAt ?? 0).getTime();
  const rightStart = new Date(right.startsAt ?? 0).getTime();
  return rightStart - leftStart;
}
