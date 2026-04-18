import {
  formatDurationLabel,
  formatRecordingDateLabel,
  formatRecordingMonthDayUpper,
  formatRecordingTimeLabel,
  getDayUrgencyBanner,
  getRelativeActivityLabel,
} from "~/lib/date-utils";
import type {
  CreatorActivityItemVm,
  CreatorInviteVm,
  CreatorKpiCardVm,
  CreatorUpcomingCampaignVm,
} from "../types";
import type {
  CreatorActivityApi,
  CreatorDashboardApi,
  CreatorInviteApi,
  CreatorUpcomingApi,
} from "../service";

const BR = "pt-BR";

export function formatBrlCompact(value: number): string {
  return new Intl.NumberFormat(BR, {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatBrlFull(value: number): string {
  return new Intl.NumberFormat(BR, {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function adaptCreatorKpis(
  api: CreatorDashboardApi,
  /** Ganhos do mês atual: soma de payouts paid com paidAt no mês corrente (centavos). */
  ganhosDoMesCents: number | null = null,
): CreatorKpiCardVm[] {
  const ratingDisplay =
    api.averageRating != null && api.averageRating > 0
      ? `${api.averageRating.toFixed(1)}/5`
      : "—";

  return [
    {
      id: "confirmed",
      label: "Contratos ativos",
      valueDisplay: String(api.confirmedCampaigns),
      subtitle: "Aguardando finalização",
      href: "/ofertas",
    },
    {
      id: "invites",
      label: "pendentes",
      valueDisplay: String(api.pendingInvites),
    },
    {
      id: "earnings",
      label: "Ganhos do mês",
      valueDisplay: ganhosDoMesCents === null ? "—" : formatBrlFull(ganhosDoMesCents / 100),
      subtitle: "Serviços concluídos",
      href: "/ganhos",
    },
    {
      id: "rating",
      label: "Avaliação",
      valueDisplay: ratingDisplay,
    },
  ];
}

export function adaptCreatorInvites(rows: CreatorInviteApi[]): CreatorInviteVm[] {
  return rows.map((row) => {
    const d = new Date(row.proposedDate);
    const proposedDateDisplay = Number.isNaN(d.getTime())
      ? "Data a combinar"
      : formatRecordingDateLabel(d);
    return {
      id: row.id,
      companyName: row.companyName,
      campaignTitle: row.campaignTitle,
      proposedDateDisplay,
      paymentDisplay: formatBrlCompact(row.payment),
      distanceDisplay:
        row.distanceKm != null
          ? `${row.distanceKm.toFixed(1).replace(".", ",")} km`
          : null,
    };
  });
}

export function adaptCreatorUpcoming(rows: CreatorUpcomingApi[]): CreatorUpcomingCampaignVm[] {
  return rows.map((row) => {
    const recordingAt = new Date(row.date);
    const safe = Number.isNaN(recordingAt.getTime()) ? new Date() : recordingAt;
    const dayBanner = getDayUrgencyBanner(safe);
    return {
      id: row.id,
      campaignName: row.campaignName,
      companyName: row.companyName,
      recordingAt: safe,
      dayBanner,
      dateBadge: formatRecordingMonthDayUpper(safe),
      timeDisplay: formatRecordingTimeLabel(safe),
      locationDisplay: row.location,
      durationDisplay: formatDurationLabel(row.duration),
      statusBadge: row.status,
    };
  });
}

/**
 * MVP: monta até 5 eventos a partir do dataset simples de contratos (sem agregador pesado no backend).
 */
export function adaptCreatorActivity(api: CreatorActivityApi): CreatorActivityItemVm[] {
  const out: CreatorActivityItemVm[] = [];

  for (const c of api.contracts) {
    const rel = getRelativeActivityLabel(c.updatedAt);
    const href = `/chat?contractRequestId=${c.contractRequestId}`;

    switch (c.status) {
      case "PENDING_ACCEPTANCE":
        out.push({
          id: `inv-${c.contractRequestId}`,
          title: "Novo convite para você",
          description: `${c.companyName} — ${c.campaignTitle}`,
          relativeLabel: rel,
        });
        break;
      case "ACCEPTED":
        out.push({
          id: `ok-${c.contractRequestId}`,
          title: "Campanha confirmada",
          description: `${c.campaignTitle} · ${c.companyName}`,
          relativeLabel: rel,
          href,
        });
        break;
      case "COMPLETED":
        out.push({
          id: `done-${c.contractRequestId}`,
          title: "Campanha concluída",
          description: c.campaignTitle,
          relativeLabel: rel,
        });
        break;
      case "REJECTED":
      case "CANCELLED":
        out.push({
          id: `off-${c.contractRequestId}`,
          title: "Atualização de convite",
          description: `${c.campaignTitle} · ${c.companyName}`,
          relativeLabel: rel,
        });
        break;
      default:
        break;
    }
  }

  return out.slice(0, 5);
}
