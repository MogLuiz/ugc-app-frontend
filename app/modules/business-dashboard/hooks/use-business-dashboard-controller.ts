import { useMemo } from "react";
import { useAuth } from "~/hooks/use-auth";
import { useConversationsQuery } from "~/modules/chat/queries";
import { useMyCompanyContractRequestsQuery } from "~/modules/contract-requests/queries";
import { getInitials } from "~/modules/contract-requests/utils";
import type { CompanyCampaignStatus, ContractRequestItem } from "~/modules/contract-requests/types";
import { useMarketplaceCreatorsQuery } from "~/modules/marketplace/queries";
import {
  buildActivityFeed,
  formatDurationLabel,
  formatRecordingDateLabel,
  formatRecordingTimeLabel,
  getDayUrgencyBanner,
  getRelativeActivityLabel,
  resolveRecordingInstant,
} from "../utils";
import type {
  CompanyDashboardActivityItem,
  CompanyDashboardCampaignItem,
  CompanyDashboardPendingItem,
  CompanyDashboardRecommendedCreator,
  CompanyDashboardViewModel,
  OperationalStatusVariant,
} from "../types";

const RECOMMENDED_CREATORS_LIMIT = 4;

function getCompanyStatus(item: ContractRequestItem): CompanyCampaignStatus {
  if (item.status === "PENDING" || item.status === "PENDING_ACCEPTANCE") return "PENDING";
  if (item.status === "ACCEPTED") return "ACCEPTED";
  if (item.status === "IN_PROGRESS") return "IN_PROGRESS";
  if (item.status === "COMPLETED") return "COMPLETED";
  return "CANCELLED";
}

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

function getLocationText(item: ContractRequestItem) {
  const city = item.location?.city;
  const state = item.location?.state;

  return (
    (city && state ? `${city}, ${state}` : city || state) ??
    item.jobFormattedAddress ??
    item.jobAddress ??
    "Local a combinar"
  );
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
    if (recording) return { label: "Confirmada", variant: "confirmed" };
    return { label: "Pendente", variant: "pending_schedule" };
  }
  if (status === "COMPLETED") {
    return { label: "Concluída", variant: "completed" };
  }
  return { label: "Pendente", variant: "pending_schedule" };
}

function mapCampaignItem(item: ContractRequestItem): CompanyDashboardCampaignItem {
  const status = getCompanyStatus(item);
  const creatorName = item.creator?.name ?? item.creatorNameSnapshot ?? "Creator";
  const recordingInstant = resolveRecordingInstant(item);
  const durationMinutes = item.job?.durationMinutes ?? item.durationMinutes;
  const { label: operationalStatusLabel, variant: operationalStatusVariant } = getOperationalDisplay(
    status,
    recordingInstant
  );

  const dateLine = recordingInstant ? formatRecordingDateLabel(recordingInstant) : "Data a combinar";
  const timeLine = recordingInstant ? formatRecordingTimeLabel(recordingInstant) : "Horário a combinar";
  const durationLine = formatDurationLabel(durationMinutes);

  return {
    id: item.id,
    title: item.job?.title ?? item.jobTypeName ?? "Campanha",
    creatorName,
    creatorAvatarUrl: item.creator?.avatarUrl ?? item.creatorAvatarUrlSnapshot ?? null,
    locationText: getLocationText(item),
    status,
    operationalStatusLabel,
    operationalStatusVariant,
    durationMinutes,
    recordingInstant,
    recordingSortKey: recordingInstant ? recordingInstant.getTime() : null,
    dateLine,
    timeLine,
    durationLine,
    dayUrgency: getDayUrgencyBanner(recordingInstant),
    source: item,
  };
}

function mapPendingItem(item: ContractRequestItem): CompanyDashboardPendingItem {
  const creatorName = item.creator?.name ?? item.creatorNameSnapshot ?? "Creator";

  return {
    id: item.id,
    title: item.job?.title ?? item.jobTypeName ?? "Campanha",
    creatorName,
    creatorAvatarUrl: item.creator?.avatarUrl ?? item.creatorAvatarUrlSnapshot ?? null,
    waitingLabel: getRelativeLabel(item.metadata?.createdAt ?? item.createdAt),
    statusLabel: "Aguardando aceite do creator",
    source: item,
  };
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
  const ca = new Date(a.source.metadata?.createdAt ?? a.source.createdAt ?? 0).getTime();
  const cb = new Date(b.source.metadata?.createdAt ?? b.source.createdAt ?? 0).getTime();
  return cb - ca;
}

export function useBusinessDashboardController() {
  const { user } = useAuth();

  const campaignsQuery = useMyCompanyContractRequestsQuery();
  const creatorsQuery = useMarketplaceCreatorsQuery({
    page: 1,
    limit: RECOMMENDED_CREATORS_LIMIT,
  });
  const conversationsQuery = useConversationsQuery();

  const campaigns = campaignsQuery.data ?? [];
  const creators = creatorsQuery.data?.items ?? [];
  const conversations = conversationsQuery.data ?? [];

  const viewModel = useMemo<CompanyDashboardViewModel>(() => {
    const activeCampaignsRaw = campaigns
      .filter((item) => {
        const status = getCompanyStatus(item);
        return status === "ACCEPTED" || status === "IN_PROGRESS";
      })
      .map(mapCampaignItem)
      .sort(compareActiveCampaigns);

    const pendingRequestsRaw = campaigns
      .filter((item) => getCompanyStatus(item) === "PENDING")
      .sort(
        (left, right) =>
          new Date(right.metadata?.createdAt ?? right.createdAt ?? 0).getTime() -
          new Date(left.metadata?.createdAt ?? left.createdAt ?? 0).getTime()
      )
      .map(mapPendingItem);

    const recommendedCreatorsRaw: CompanyDashboardRecommendedCreator[] = creators.map((creator) => ({
      id: creator.id,
      name: creator.name,
      niche: creator.niche,
      location: creator.location,
      rating: Number.isFinite(creator.rating) ? creator.rating : null,
      avatarUrl: creator.avatarUrl ?? null,
    }));

    const activeCampaignCount = activeCampaignsRaw.length;
    const activeCreatorCount = new Set(activeCampaignsRaw.map((item) => item.source.creatorId)).size;
    const completedCampaignCount = campaigns.filter(
      (item) => getCompanyStatus(item) === "COMPLETED"
    ).length;
    const pendingRequestCount = pendingRequestsRaw.length;

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
      subtitle:
        "Acompanhe campanhas, creators e oportunidades próximas. Sua curadoria editorial começa aqui.",
      metrics: [
        {
          id: "active-campaigns",
          label: "Campanhas ativas",
          value: activeCampaignCount,
          subtitle: "Aceitas ou em andamento",
          tone: "default",
        },
        {
          id: "active-creators",
          label: "Criadores ativos",
          value: activeCreatorCount,
          subtitle: "Nas campanhas atuais",
          tone: "default",
        },
        {
          id: "completed-campaigns",
          label: "Campanhas concluídas",
          value: completedCampaignCount,
          subtitle: "Histórico finalizado",
          tone: "default",
        },
        {
          id: "pending-requests",
          label: "Solicitações pendentes",
          value: pendingRequestCount,
          subtitle: pendingRequestCount > 0 ? "Ação requerida" : "Nenhuma pendência",
          tone: pendingRequestCount > 0 ? "highlight" : "default",
        },
      ],
      activeCampaigns: activeCampaignsRaw,
      pendingRequests: pendingRequestsRaw,
      recommendedCreators: recommendedCreatorsRaw,
      mapHighlights: creators.slice(0, 2).map((c) => c.location),
      recentActivity,
      hasCampaignData: campaigns.length > 0,
      hasRecommendedCreators: creators.length > 0,
      isCampaignsLoading: campaignsQuery.isLoading && !campaignsQuery.data,
      isRecommendedLoading: creatorsQuery.isLoading && !creatorsQuery.data,
      isCampaignsRefreshing: campaignsQuery.isFetching,
      isRecommendedRefreshing: creatorsQuery.isFetching,
      isActivityLoading: conversationsQuery.isLoading && !conversationsQuery.data,
      isActivityRefreshing: conversationsQuery.isFetching,
      campaignsErrorMessage: getQueryErrorMessage(
        campaignsQuery.error,
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
    campaigns,
    campaignsQuery.data,
    campaignsQuery.error,
    campaignsQuery.isFetching,
    campaignsQuery.isLoading,
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
