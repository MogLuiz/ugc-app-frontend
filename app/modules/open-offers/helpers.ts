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
  const leftExpires = left.expiresInMs ?? Number.POSITIVE_INFINITY;
  const rightExpires = right.expiresInMs ?? Number.POSITIVE_INFINITY;

  if (leftExpires !== rightExpires) {
    return leftExpires - rightExpires;
  }

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
    statusLabel: item.status,
    href: `/ofertas/${item.id}`,
    offerId: item.id,
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
    href: `/campanha/${item.id}`,
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
    href: `/campanha/${item.id}`,
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
    .filter((item) => item.openOfferId == null)
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
  const finalizedContracts = contracts
    .filter((item) => item.status === "COMPLETED" || item.status === "CANCELLED")
    .map(mapFinalizedContractToListItem)
    .sort((left, right) => new Date(right.updatedAt ?? 0).getTime() - new Date(left.updatedAt ?? 0).getTime());

  const finalizedOffers = openOffers
    .filter(
      (item) =>
        item.status === "CANCELLED" ||
        item.status === "EXPIRED" ||
        (item.status === "OPEN" && isOpenOfferExpired(item.expiresAt, now))
    )
    .map((item) => ({
      ...mapOpenOfferToListItem(item, now),
      subtitle: item.status === "CANCELLED" ? "Oferta cancelada" : "Oferta encerrada sem contratação",
    }))
    .sort((left, right) => {
      const leftUpdated = new Date(left.updatedAt ?? left.createdAt ?? 0).getTime();
      const rightUpdated = new Date(right.updatedAt ?? right.createdAt ?? 0).getTime();
      return rightUpdated - leftUpdated;
    });

  return {
    contracts: finalizedContracts,
    offersWithoutHire: finalizedOffers,
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
