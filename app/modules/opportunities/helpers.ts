import type { PortfolioPayload } from "~/modules/auth/types";
import type {
  OpportunityFilters,
  OpportunityListItem,
  SortOption,
} from "./types";

// ─── Portfolio eligibility ────────────────────────────────────────────────────

/**
 * Creator é elegível para candidatura se tiver ao menos 1 item READY no portfólio.
 */
export function hasEligiblePortfolio(
  portfolio?: PortfolioPayload | null
): boolean {
  return !!(portfolio?.media?.some((m) => m.status === "READY"));
}

// ─── Formatters ───────────────────────────────────────────────────────────────

export function formatAmount(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatDurationMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  const rounded = Number.isInteger(hours) ? hours : parseFloat(hours.toFixed(1));
  return `${rounded} hora${rounded !== 1 ? "s" : ""}`;
}

export function formatShortDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function formatFullDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getDeadlineDays(expiresAt: string, now = Date.now()): number {
  return Math.ceil(
    (new Date(expiresAt).getTime() - now) / (1000 * 60 * 60 * 24)
  );
}

export function formatDistance(km: number): string {
  if (km === 0) return "No local";
  return `${km.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`;
}

// ─── Filter & sort (MVP: frontend-only) ──────────────────────────────────────
// Isolado em helpers.ts para fácil migração futura para params de API.

export function filterOpportunities(
  items: OpportunityListItem[],
  filters: OpportunityFilters
): OpportunityListItem[] {
  return items.filter((item) => {
    if (
      filters.workType !== "all" &&
      item.jobType?.name !== filters.workType
    ) {
      return false;
    }

    if (filters.distance !== "all") {
      const maxKm = parseInt(filters.distance, 10);
      if (item.distanceKm > maxKm) return false;
    }

    return true;
  });
}

export function sortOpportunities(
  items: OpportunityListItem[],
  sort: SortOption
): OpportunityListItem[] {
  const copy = [...items];

  switch (sort) {
    case "value":
      return copy.sort((a, b) => b.creatorNetServiceAmountCents - a.creatorNetServiceAmountCents);

    case "distance":
      return copy.sort((a, b) => a.distanceKm - b.distanceKm);

    case "recent":
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()
      );
  }
}

/** Extrai nomes únicos de tipos de trabalho para popular o filtro dinamicamente */
export function extractWorkTypeNames(items: OpportunityListItem[]): string[] {
  const names = new Set<string>();
  for (const item of items) {
    if (item.jobType?.name) names.add(item.jobType.name);
  }
  return [...names].sort();
}
