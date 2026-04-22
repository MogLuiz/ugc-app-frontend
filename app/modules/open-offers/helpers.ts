import type { ContractRequestItem } from "~/modules/contract-requests/types";
import { formatCurrency } from "~/modules/contract-requests/utils";
import type {
  OpenOfferFinalizedSectionViewModel,
  OpenOfferItem,
  OpenOfferListItemViewModel,
} from "./types";

const PENDING_DIRECT_INVITE_WINDOW_MS = 48 * 60 * 60 * 1000;

export function isOpenOfferExpired(expiresAt?: string | null, now = Date.now()) {
  if (!expiresAt) return false;
  const target = new Date(expiresAt).getTime();
  if (Number.isNaN(target)) return false;
  return target <= now;
}

export function getRemainingMs(expiresAt?: string | null, now = Date.now()) {
  if (!expiresAt) return null;
  const target = new Date(expiresAt).getTime();
  if (Number.isNaN(target)) return null;
  return target - now;
}

export function getDirectInviteExpiresAt(item: ContractRequestItem) {
  const base = item.metadata?.createdAt ?? item.createdAt ?? null;
  if (!base) return null;
  const createdAtMs = new Date(base).getTime();
  if (Number.isNaN(createdAtMs)) return null;
  return new Date(createdAtMs + PENDING_DIRECT_INVITE_WINDOW_MS).toISOString();
}

export function formatOfferExpiry(expiresInMs: number | null) {
  if (expiresInMs == null) return "Prazo indisponível";
  if (expiresInMs <= 0) return "Expirada";

  const totalMinutes = Math.ceil(expiresInMs / 60_000);
  const totalHours = Math.ceil(expiresInMs / 3_600_000);
  const totalDays = Math.ceil(expiresInMs / 86_400_000);

  if (totalMinutes < 60) {
    return `Expira em ${totalMinutes} min`;
  }
  if (totalHours < 24) {
    return `Expira em ${totalHours}h`;
  }
  return `Expira em ${totalDays} dia${totalDays > 1 ? "s" : ""}`;
}

function resolveAddress(
  item: Pick<OpenOfferItem, "jobFormattedAddress" | "jobAddress"> | ContractRequestItem
) {
  return item.jobFormattedAddress ?? item.jobAddress ?? "Local a combinar";
}

function resolveTitleFromContract(item: ContractRequestItem) {
  return item.job?.title ?? item.jobTypeName ?? "Campanha";
}

export function getContractOriginLabel(item: ContractRequestItem) {
  return item.openOfferId ? "Oferta aberta" : "Convite direto";
}

function sortByCreatedAtDesc<T extends { createdAt?: string | null }>(left: T, right: T) {
  return new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime();
}

export function sortMixedOpenItems(
  left: OpenOfferListItemViewModel,
  right: OpenOfferListItemViewModel
) {
  // Ofertas com candidaturas para avaliar primeiro
  const leftHas = (left.applicationsToReviewCount ?? 0) > 0 ? 0 : 1;
  const rightHas = (right.applicationsToReviewCount ?? 0) > 0 ? 0 : 1;
  if (leftHas !== rightHas) return leftHas - rightHas;

  // Dentro do mesmo grupo, expiração mais próxima primeiro
  const leftExpires = left.expiresInMs ?? Number.POSITIVE_INFINITY;
  const rightExpires = right.expiresInMs ?? Number.POSITIVE_INFINITY;
  if (leftExpires !== rightExpires) return leftExpires - rightExpires;

  return sortByCreatedAtDesc(left, right);
}

export function mapOpenOfferToListItem(item: OpenOfferItem, now = Date.now()): OpenOfferListItemViewModel {
  return {
    id: item.id,
    kind: "open_offer",
    visualLabel: "Oferta aberta",
    title: item.jobType?.name ?? "Oferta aberta",
    subtitle: formatOfferExpiry(getRemainingMs(item.expiresAt, now)),
    description: item.description,
    address: resolveAddress(item),
    amount: item.offeredAmount,
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
    startsAt: item.startsAt,
    durationMinutes: item.durationMinutes,
    expiresAt: item.expiresAt,
    expiresInMs: getRemainingMs(item.expiresAt, now),
    statusLabel: undefined,
    href: `/ofertas/${item.id}`,
    offerId: item.id,
    applicationsToReviewCount: item.applicationsToReviewCount ?? 0,
  };
}

export function mapPendingDirectInviteToListItem(
  item: ContractRequestItem,
  now = Date.now()
): OpenOfferListItemViewModel {
  const expiresAt = getDirectInviteExpiresAt(item);

  return {
    id: item.id,
    kind: "direct_invite",
    visualLabel: "Convite direto",
    title: resolveTitleFromContract(item),
    subtitle: formatOfferExpiry(getRemainingMs(expiresAt, now)),
    description: item.description,
    address: resolveAddress(item),
    amount: item.pricing?.totalAmount ?? item.totalAmount ?? item.totalPrice,
    createdAt: item.metadata?.createdAt ?? item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
    startsAt: item.schedule?.startTime ?? item.startsAt,
    durationMinutes: item.job?.durationMinutes ?? item.durationMinutes,
    expiresAt,
    expiresInMs: getRemainingMs(expiresAt, now),
    statusLabel: "Pendente",
    href: `/ofertas/${item.id}`,
    contractRequestId: item.id,
  };
}

export function mapActiveContractToListItem(item: ContractRequestItem): OpenOfferListItemViewModel {
  return {
    id: item.id,
    kind: item.openOfferId ? "open_offer" : "direct_invite",
    visualLabel: getContractOriginLabel(item),
    title: resolveTitleFromContract(item),
    subtitle: item.status === "IN_PROGRESS" ? "Operação em andamento" : "Contrato ativo",
    description: item.job?.description ?? item.description,
    address: resolveAddress(item),
    amount: item.pricing?.totalAmount ?? item.totalAmount ?? item.totalPrice,
    createdAt: item.metadata?.createdAt ?? item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
    startsAt: item.schedule?.startTime ?? item.startsAt,
    durationMinutes: item.job?.durationMinutes ?? item.durationMinutes,
    expiresAt: null,
    expiresInMs: null,
    statusLabel: item.status,
    href: `/ofertas/${item.id}`,
    contractRequestId: item.id,
    offerId: item.openOfferId ?? undefined,
  };
}

export function mapFinalizedContractToListItem(item: ContractRequestItem): OpenOfferListItemViewModel {
  return {
    ...mapActiveContractToListItem(item),
    subtitle: item.status === "COMPLETED" ? "Contrato finalizado" : "Contrato encerrado",
  };
}

export function buildOpenTabItems(
  openOffers: OpenOfferItem[],
  pendingContracts: ContractRequestItem[],
  now = Date.now()
) {
  const offerItems = openOffers
    .filter((item) => item.status === "OPEN" && !isOpenOfferExpired(item.expiresAt, now))
    .map((item) => mapOpenOfferToListItem(item, now));

  const inviteItems = pendingContracts
    .filter((item) => {
      if (item.openOfferId != null) return false;
      const expiresAt = getDirectInviteExpiresAt(item);
      return !isOpenOfferExpired(expiresAt, now);
    })
    .map((item) => mapPendingDirectInviteToListItem(item, now));

  return [...offerItems, ...inviteItems].sort(sortMixedOpenItems);
}

export function buildInProgressItems(contracts: ContractRequestItem[]) {
  return contracts
    .filter((item) => item.status === "ACCEPTED" || item.status === "IN_PROGRESS")
    .map(mapActiveContractToListItem)
    .sort((left, right) => {
      const leftStart = new Date(left.startsAt ?? 0).getTime();
      const rightStart = new Date(right.startsAt ?? 0).getTime();

      if (leftStart !== rightStart) return leftStart - rightStart;

      return sortByCreatedAtDesc(left, right);
    });
}

export function buildFinalizedSections(
  contracts: ContractRequestItem[],
  openOffers: OpenOfferItem[],
  now = Date.now()
): OpenOfferFinalizedSectionViewModel {
  function byUpdatedAtDesc(left: OpenOfferListItemViewModel, right: OpenOfferListItemViewModel) {
    const l = new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
    const r = new Date(right.updatedAt ?? right.createdAt ?? 0).getTime();
    return r - l;
  }

  const completedContracts = contracts
    .filter((item) => item.status === "COMPLETED")
    .map(mapFinalizedContractToListItem)
    .sort(byUpdatedAtDesc);

  const cancelledContracts = contracts
    .filter((item) => item.status === "CANCELLED")
    .map(mapFinalizedContractToListItem);

  const cancelledOffers = openOffers
    .filter((item) => item.status === "CANCELLED")
    .map((item) => ({
      ...mapOpenOfferToListItem(item, now),
      subtitle: "Oferta cancelada",
    }));

  const allCancelled = [...cancelledContracts, ...cancelledOffers].sort(byUpdatedAtDesc);

  const expiredOffers = openOffers
    .filter(
      (item) =>
        item.status === "EXPIRED" ||
        (item.status === "OPEN" && isOpenOfferExpired(item.expiresAt, now))
    )
    .map((item) => ({
      ...mapOpenOfferToListItem(item, now),
      subtitle: "Oferta encerrada sem contratação",
    }))
    .sort(byUpdatedAtDesc);

  return {
    completed: completedContracts,
    cancelled: allCancelled,
    offersWithoutHire: expiredOffers,
  };
}

export function formatOfferMoney(value: number) {
  return formatCurrency(value, "BRL");
}

// ─── Address helpers ──────────────────────────────────────────────────────────

type AddressProfile = {
  addressStreet?: string | null;
  addressNumber?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  addressZipCode?: string | null;
} | null | undefined;

/**
 * Formats a profile's address fields into a single string for geocoding.
 * Returns "" when the profile has no usable address.
 * Format: "Street, Number - City/State - CEP 00000-000"
 */
export function formatProfileAddress(profile: AddressProfile): string {
  return (
    [
      [profile?.addressStreet, profile?.addressNumber].filter(Boolean).join(", "),
      profile?.addressCity
        ? profile?.addressState
          ? `${profile.addressCity}/${profile.addressState}`
          : profile.addressCity
        : null,
      profile?.addressZipCode ? `CEP ${profile.addressZipCode}` : null,
    ]
      .filter(Boolean)
      .join(" - ") || ""
  );
}

/**
 * Returns true only when all 5 address fields are present and non-empty.
 * A partial address is not considered usable because it may not geocode reliably.
 */
export function hasUsableCompanyAddress(profile: AddressProfile): boolean {
  return !!(
    profile?.addressStreet?.trim() &&
    profile?.addressNumber?.trim() &&
    profile?.addressCity?.trim() &&
    profile?.addressState?.trim() &&
    profile?.addressZipCode?.trim()
  );
}
