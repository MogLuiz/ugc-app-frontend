import { useMemo } from "react";
import { useAuth } from "~/hooks/use-auth";
import { useConversationsQuery } from "~/modules/chat/queries";
import { useMyCompanyContractRequestsQuery } from "~/modules/contract-requests/queries";
import { useCompanyOffersHubQuery } from "~/modules/open-offers/queries";
import { getInitials } from "~/modules/contract-requests/utils";
import type { CompanyCampaignStatus } from "~/modules/contract-requests/types";
import type { CompanyHubItem } from "~/modules/open-offers/types";
import { useMarketplaceCreatorsQuery } from "~/modules/marketplace/queries";
import {
  buildActivityFeed,
  formatContestDeadlineLabel,
  formatDurationLabel,
  formatRecordingDateLabel,
  formatRecordingTimeLabel,
  getDayUrgencyBanner,
  getRelativeActivityLabel,
  isAwaitingCreatorConfirmationItem,
  isUpcomingBusinessCampaignItem,
} from "../utils";
import type {
  BusinessAwaitingCreatorConfirmVm,
  BusinessPendingApplicationVm,
  BusinessPendingConfirmVm,
  BusinessPendingReviewVm,
  CompanyDashboardActivityItem,
  CompanyDashboardCampaignItem,
  CompanyDashboardPendingItem,
  CompanyDashboardPendingReviewItem,
  CompanyDashboardRecommendedCreator,
  CompanyDashboardViewModel,
  OperationalStatusVariant,
} from "../types";

const RECOMMENDED_CREATORS_LIMIT = 4;

function getQueryErrorMessage(error: unknown, fallback: string) {
  if (!error) return null;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function getGreetingName(name?: string | null) {
  if (!name) return "Time";
  const firstName = name.trim().split(/\s+/)[0];
  return firstName || "Time";
}

function getRelativeLabel(value?: string | null) {
  if (!value) return "Agora há pouco";

  const now = Date.now();
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return "Agora há pouco";

  const diffMs = now - target;
  const diffMinutes = Math.max(1, Math.round(diffMs / (1000 * 60)));

  if (diffMinutes < 60) {
    return `Há ${diffMinutes} min`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `Há ${diffHours}h`;
  }

  const diffDays = Math.round(diffHours / 24);
  return diffDays === 1 ? "Há 1 dia" : `Há ${diffDays} dias`;
}

function getOperationalDisplay(
  status: CompanyCampaignStatus,
  recording: Date | null
): { label: string; variant: OperationalStatusVariant } {
  if (status === "IN_PROGRESS") {
    return { label: "Em andamento", variant: "in_progress" };
  }
  if (status === "ACCEPTED") {
    if (recording) return { label: "Aceita", variant: "confirmed" };
    return { label: "Pendente", variant: "pending_schedule" };
  }
  if (status === "COMPLETED") {
    return { label: "Concluída", variant: "completed" };
  }
  return { label: "Pendente", variant: "pending_schedule" };
}

function mapCampaignItem(item: CompanyHubItem): CompanyDashboardCampaignItem {
  const recordingInstant = item.startsAt ? new Date(item.startsAt) : null;
  const durationMinutes = item.durationMinutes ?? 0;
  const status = item.displayStatus as CompanyCampaignStatus;
  const base = getOperationalDisplay(status, recordingInstant);

  const operationalStatusLabel =
    item.companyPerspectiveStatus === "COMPANY_CONFIRMATION_REQUIRED"
      ? "Aguardando confirmação"
      : item.companyPerspectiveStatus === "AWAITING_CREATOR_CONFIRMATION"
        ? "Aguardando creator"
        : item.companyPerspectiveStatus === "COMPLETION_DISPUTE"
          ? "Conclusão em disputa"
          : base.label;

  const operationalStatusVariant: OperationalStatusVariant =
    item.companyPerspectiveStatus === "COMPANY_CONFIRMATION_REQUIRED" ||
    item.companyPerspectiveStatus === "AWAITING_CREATOR_CONFIRMATION"
      ? "awaiting_confirmation"
      : base.variant;

  return {
    id: item.id,
    title: item.title,
    creatorName: item.creatorName ?? "Creator",
    creatorAvatarUrl: item.creatorAvatarUrl ?? null,
    locationText: item.address,
    status,
    operationalStatusLabel,
    operationalStatusVariant,
    durationMinutes,
    recordingInstant,
    recordingSortKey: recordingInstant ? recordingInstant.getTime() : null,
    dateLine: recordingInstant ? formatRecordingDateLabel(recordingInstant) : "Data a combinar",
    timeLine: recordingInstant ? formatRecordingTimeLabel(recordingInstant) : "Horário a combinar",
    durationLine: formatDurationLabel(durationMinutes),
    dayUrgency: getDayUrgencyBanner(recordingInstant),
    progressSummary: null,
    source: item,
  };
}

function mapPendingReviewItem(item: CompanyHubItem): CompanyDashboardPendingReviewItem {
  const contractRequestId = item.contractRequestId ?? item.id;
  let completedLabel: string;
  if (item.completedAt) {
    const d = new Date(item.completedAt);
    completedLabel = `Concluído em ${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}`;
  } else if (item.startsAt) {
    const d = new Date(item.startsAt);
    completedLabel = `Realizado em ${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}`;
  } else {
    completedLabel = "Trabalho concluído";
  }
  return {
    id: contractRequestId,
    contractRequestId,
    title: item.title,
    creatorName: item.creatorName ?? "Creator",
    creatorAvatarUrl: item.creatorAvatarUrl ?? null,
    completedLabel,
    source: item,
  };
}

function mapPendingItem(item: CompanyHubItem): CompanyDashboardPendingItem {
  return {
    id: item.id,
    title: item.title,
    creatorName: item.creatorName ?? "Creator",
    creatorAvatarUrl: item.creatorAvatarUrl ?? null,
    waitingLabel: getRelativeLabel(item.createdAt),
    statusLabel: "Aguardando aceite do creator",
    source: item,
  };
}

function formatDayMonthCompany(isoDate: string | null): string | null {
  if (!isoDate) return null;
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function adaptPendingConfirmItems(inProgress: CompanyHubItem[]): BusinessPendingConfirmVm[] {
  return (inProgress ?? [])
    .filter((item) => item.companyPerspectiveStatus === "COMPANY_CONFIRMATION_REQUIRED")
    .map((item) => {
      const dayMonth = formatDayMonthCompany(item.startsAt);
      return {
        id: item.contractRequestId ?? item.id,
        creatorName: item.creatorName ?? "Creator",
        creatorAvatarUrl: item.creatorAvatarUrl ?? null,
        title: item.title,
        dateLabel: dayMonth ? `Realizado em ${dayMonth}` : null,
        contestDeadlineAt: item.completionConfirmation?.contestDeadlineAt ?? null,
      };
    });
}

function adaptPendingReviewItems(completed: CompanyHubItem[]): BusinessPendingReviewVm[] {
  return (completed ?? [])
    .filter((item) => item.myReviewPending === true)
    .slice(0, 3)
    .map((item) => {
      const contractRequestId = item.contractRequestId ?? item.id;
      let completedLabel: string;
      if (item.completedAt) {
        const d = new Date(item.completedAt);
        completedLabel = `Concluído em ${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}`;
      } else if (item.startsAt) {
        const d = new Date(item.startsAt);
        completedLabel = `Realizado em ${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}`;
      } else {
        completedLabel = "Trabalho concluído";
      }
      return {
        id: contractRequestId,
        contractRequestId,
        creatorName: item.creatorName ?? "Creator",
        creatorAvatarUrl: item.creatorAvatarUrl ?? null,
        title: item.title,
        completedLabel,
      };
    });
}

function adaptPendingApplicationItems(openOffers: CompanyHubItem[]): BusinessPendingApplicationVm[] {
  return (openOffers ?? [])
    .filter((item) => (item.applicationsToReviewCount ?? 0) > 0)
    .map((item) => ({
      id: item.offerId ?? item.id,
      title: item.title,
      applicationsCount: item.applicationsToReviewCount,
      expiresAt: item.expiresAt ?? null,
    }));
}

function adaptAwaitingCreatorConfirmItems(
  inProgress: CompanyHubItem[],
): BusinessAwaitingCreatorConfirmVm[] {
  return (inProgress ?? [])
    .filter((item) => isAwaitingCreatorConfirmationItem(item))
    .map((item) => {
      const dayMonth = formatDayMonthCompany(item.startsAt);
      return {
        id: item.contractRequestId ?? item.id,
        creatorName: item.creatorName ?? "Creator",
        creatorAvatarUrl: item.creatorAvatarUrl ?? null,
        title: item.title,
        dateLabel: dayMonth ? `Realizado em ${dayMonth}` : null,
        deadlineLabel: formatContestDeadlineLabel(
          item.completionConfirmation?.contestDeadlineAt ?? null,
        ),
      };
    });
}

function compareActiveCampaigns(
  a: CompanyDashboardCampaignItem,
  b: CompanyDashboardCampaignItem
): number {
  if (a.recordingSortKey != null && b.recordingSortKey != null) {
    return a.recordingSortKey - b.recordingSortKey;
  }
  if (a.recordingSortKey != null) return -1;
  if (b.recordingSortKey != null) return 1;
  const ca = new Date(a.source.createdAt ?? 0).getTime();
  const cb = new Date(b.source.createdAt ?? 0).getTime();
  return cb - ca;
}

export function useBusinessDashboardController() {
  const { user } = useAuth();

  const hubQuery = useCompanyOffersHubQuery();
  const campaignsQuery = useMyCompanyContractRequestsQuery();
  const creatorsQuery = useMarketplaceCreatorsQuery({
    page: 1,
    limit: RECOMMENDED_CREATORS_LIMIT,
  });
  const conversationsQuery = useConversationsQuery();

  const hub = hubQuery.data;
  const campaigns = campaignsQuery.data ?? [];
  const creators = creatorsQuery.data?.items ?? [];
  const conversations = conversationsQuery.data ?? [];

  const viewModel = useMemo<CompanyDashboardViewModel>(() => {
    const allHubContracts = [
      ...(hub?.pending.directInvites ?? []),
      ...(hub?.inProgress ?? []),
    ];

    // Compute per-job progress summary (confirmed vs pending count) from hub data
    const jobProgressMap = new Map<string, { confirmed: number; pending: number }>();
    for (const item of allHubContracts) {
      const jobKey = item.title;
      if (!jobProgressMap.has(jobKey)) jobProgressMap.set(jobKey, { confirmed: 0, pending: 0 });
      const entry = jobProgressMap.get(jobKey)!;
      if (item.displayStatus === "ACCEPTED" || item.displayStatus === "IN_PROGRESS") {
        entry.confirmed += 1;
      } else if (item.displayStatus === "PENDING") {
        entry.pending += 1;
      }
    }

    function buildProgressSummary(item: ReturnType<typeof mapCampaignItem>): string | null {
      const entry = jobProgressMap.get(item.source.title);
      if (!entry) return null;
      const { confirmed, pending } = entry;
      if (confirmed === 0 && pending === 0) return null;
      const parts: string[] = [];
      if (confirmed > 0) parts.push(`${confirmed} ${confirmed === 1 ? "aceito" : "aceitos"}`);
      if (pending > 0) parts.push(`${pending} aguardando resposta`);
      return parts.join(" · ");
    }

    const activeCampaignsRaw = (hub?.inProgress ?? [])
      .filter((item) => isUpcomingBusinessCampaignItem(item))
      .map((item) => {
        const mapped = mapCampaignItem(item);
        return { ...mapped, progressSummary: buildProgressSummary(mapped) };
      })
      .sort(compareActiveCampaigns);

    const pendingConfirmItems = adaptPendingConfirmItems(hub?.inProgress ?? []);
    const pendingReviewItems = adaptPendingReviewItems(hub?.finalized?.completed ?? []);
    const pendingApplicationItems = adaptPendingApplicationItems(hub?.pending?.openOffers ?? []);
    const awaitingCreatorConfirmItems = adaptAwaitingCreatorConfirmItems(hub?.inProgress ?? []);

    const pendingRequestsRaw = (hub?.pending.directInvites ?? [])
      .slice()
      .sort(
        (left, right) =>
          new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime()
      )
      .map(mapPendingItem);

    const allPendingReviewsHub = (hub?.finalized.completed ?? []).filter(
      (item) => item.myReviewPending === true,
    );
    const pendingReviewsRaw = allPendingReviewsHub.slice(0, 3).map(mapPendingReviewItem);

    const recommendedCreatorsRaw: CompanyDashboardRecommendedCreator[] = creators.map((creator) => ({
      id: creator.id,
      name: creator.name,
      niche: creator.niche,
      location: creator.location,
      rating: Number.isFinite(creator.rating) ? creator.rating : null,
      avatarUrl: creator.avatarUrl ?? null,
    }));

    const activeCampaignCount = activeCampaignsRaw.length;
    const pendingApplicationCount = (hub?.pending.openOffers ?? []).reduce(
      (sum, o) => sum + o.applicationsToReviewCount,
      0
    );
    const upcomingRecordingCount = activeCampaignsRaw.filter(
      (item) => item.recordingInstant !== null && item.recordingInstant.getTime() > Date.now()
    ).length;
    const unreadMessageCount = conversations.reduce(
      (sum, conv) => sum + (conv.unreadCount ?? 0),
      0
    );

    const companyName = user?.companyProfile?.companyName ?? user?.profile?.name ?? user?.name;

    const activityRaw = buildActivityFeed(campaigns, conversations);
    const recentActivity: CompanyDashboardActivityItem[] = activityRaw.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      relativeLabel: getRelativeActivityLabel(new Date(row.at).toISOString()),
      href: row.href,
    }));

    return {
      greetingName: getGreetingName(companyName),
      subtitle: "Acompanhe campanhas, creators e oportunidades próximas.",
      metrics: [
        {
          id: "pending-applications",
          label: "Candidaturas pendentes",
          value: pendingApplicationCount,
          subtitle: pendingApplicationCount > 0 ? "Creators esperando sua decisão" : "Nenhuma pendência",
          tone: pendingApplicationCount > 0 ? "highlight" : "default",
          href: "/ofertas",
        },
        {
          id: "unread-messages",
          label: "Mensagens não lidas",
          value: unreadMessageCount,
          subtitle: unreadMessageCount > 0 ? "Nova atividade" : "Tudo em dia",
          tone: unreadMessageCount > 0 ? "highlight" : "default",
          href: "/chat",
        },
        {
          id: "active-campaigns",
          label: "Campanhas ativas",
          value: activeCampaignCount,
          subtitle: "Aceitas ou em andamento",
          tone: "default",
          href: "/ofertas",
        },
        {
          id: "upcoming-recordings",
          label: "Próximas gravações",
          value: upcomingRecordingCount,
          subtitle: "Agendadas nos próximos dias",
          tone: "default",
          href: "/agenda",
        },
      ],
      activeCampaigns: activeCampaignsRaw,
      pendingRequests: pendingRequestsRaw,
      pendingReviews: pendingReviewsRaw,
      hasPendingReviewsOverflow: allPendingReviewsHub.length > 3,
      pendingConfirmItems,
      pendingReviewItems,
      pendingApplicationItems,
      awaitingCreatorConfirmItems,
      recommendedCreators: recommendedCreatorsRaw,
      mapHighlights: creators.slice(0, 2).map((c) => c.location),
      recentActivity,
      hasCampaignData: campaigns.length > 0 || (hub?.inProgress.length ?? 0) > 0 || (hub?.pending.directInvites.length ?? 0) > 0,
      hasRecommendedCreators: creators.length > 0,
      isCampaignsLoading: hubQuery.isLoading && !hubQuery.data,
      isRecommendedLoading: creatorsQuery.isLoading && !creatorsQuery.data,
      isCampaignsRefreshing: hubQuery.isFetching,
      isRecommendedRefreshing: creatorsQuery.isFetching,
      isActivityLoading: conversationsQuery.isLoading && !conversationsQuery.data,
      isActivityRefreshing: conversationsQuery.isFetching,
      campaignsErrorMessage: getQueryErrorMessage(
        hubQuery.error,
        "Não foi possível carregar as campanhas da empresa."
      ),
      recommendedErrorMessage: getQueryErrorMessage(
        creatorsQuery.error,
        "Não foi possível carregar os creators recomendados."
      ),
      activityErrorMessage: getQueryErrorMessage(
        conversationsQuery.error,
        "Não foi possível carregar a atividade recente."
      ),
    };
  }, [
    hub,
    hubQuery.data,
    hubQuery.error,
    hubQuery.isFetching,
    hubQuery.isLoading,
    campaigns,
    conversations,
    conversationsQuery.data,
    conversationsQuery.error,
    conversationsQuery.isFetching,
    conversationsQuery.isLoading,
    creators,
    creatorsQuery.data,
    creatorsQuery.error,
    creatorsQuery.isFetching,
    creatorsQuery.isLoading,
    user?.companyProfile?.companyName,
    user?.name,
    user?.profile?.name,
  ]);

  return {
    actions: {
      getCreatorFallbackInitials: getInitials,
    },
    viewModel,
  };
}
