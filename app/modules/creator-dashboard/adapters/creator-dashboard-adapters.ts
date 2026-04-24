import {
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
import type { CreatorActivityApi } from "../service";
import type { CreatorHubItem } from "~/modules/contract-requests/creator-hub.types";

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
  averageRating: number | null,
  inProgressCount: number,
  pendingInvitesCount: number,
  /** Ganhos do mês atual: soma de payouts paid com paidAt no mês corrente (centavos). */
  ganhosDoMesCents: number | null = null,
): CreatorKpiCardVm[] {
  const ratingDisplay =
    averageRating != null && averageRating > 0
      ? `${averageRating.toFixed(1)}/5`
      : "—";

  return [
    {
      id: "confirmed",
      label: "Contratos ativos",
      valueDisplay: String(inProgressCount),
      subtitle: "Aguardando finalização",
      href: "/ofertas",
    },
    {
      id: "invites",
      label: "pendentes",
      valueDisplay: String(pendingInvitesCount),
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

export function adaptHubInvites(items: CreatorHubItem[]): CreatorInviteVm[] {
  return items.map((item) => {
    const d = item.startsAt ? new Date(item.startsAt) : null;
    const proposedDateDisplay =
      d && !Number.isNaN(d.getTime()) ? formatRecordingDateLabel(d) : "Data a combinar";
    return {
      id: item.id,
      companyName: item.company.name,
      campaignTitle: item.title,
      proposedDateDisplay,
      paymentDisplay: formatBrlCompact(item.totalAmount ?? 0),
      distanceDisplay: null,
    };
  });
}

export function adaptHubUpcoming(
  items: CreatorHubItem[],
  now: Date,
): CreatorUpcomingCampaignVm[] {
  return items
    .filter((item) => item.startsAt != null)
    .sort((a, b) => new Date(a.startsAt!).getTime() - new Date(b.startsAt!).getTime())
    .slice(0, 3)
    .map((item) => {
      const recordingAt = new Date(item.startsAt!);
      const safe = Number.isNaN(recordingAt.getTime()) ? now : recordingAt;
      const statusBadge =
        item.displayStatus === "AWAITING_CONFIRMATION"
          ? "Concluída"
          : item.displayStatus === "IN_DISPUTE"
            ? "Pendente"
            : "Confirmada";
      const primaryAction =
        item.displayStatus === "AWAITING_CONFIRMATION" ? "CONFIRM_OR_DISPUTE" : "VIEW";
      return {
        id: item.id,
        campaignName: item.title,
        companyName: item.company.name,
        recordingAt: safe,
        dayBanner: getDayUrgencyBanner(safe),
        dateBadge: formatRecordingMonthDayUpper(safe),
        timeDisplay: formatRecordingTimeLabel(safe),
        locationDisplay:
          item.displayStatus === "AWAITING_CONFIRMATION"
            ? null
            : (item.address ?? item.locationDisplay),
        durationDisplay: "",
        statusBadge,
        primaryAction,
        href: `/ofertas/${item.id}`,
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
