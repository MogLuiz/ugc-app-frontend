import { useMemo, useState } from "react";
import { useAuth } from "~/hooks/use-auth";
import { useMyCompanyContractRequestsQuery } from "~/modules/contract-requests/queries";
import { getInitials } from "~/modules/contract-requests/utils";
import type { CompanyCampaignStatus, ContractRequestItem } from "~/modules/contract-requests/types";
import { useMarketplaceCreatorsQuery } from "~/modules/marketplace/queries";
import type {
  CompanyDashboardCampaignItem,
  CompanyDashboardPendingItem,
  CompanyDashboardRecommendedCreator,
  CompanyDashboardViewModel,
} from "../types";

const RECOMMENDED_CREATORS_LIMIT = 4;

const QUICK_ACTIONS = [
  {
    id: "create-campaign",
    label: "Criar campanha",
    description: "O fluxo atual começa pelo marketplace ou perfil do creator.",
    disabled: true,
    todoNote: "TODO: conectar quando existir rota dedicada para nova campanha.",
  },
  {
    id: "explore-creators",
    label: "Explorar criadores",
    description: "Busque creators disponíveis no marketplace.",
    to: "/marketplace",
  },
  {
    id: "map",
    label: "Mapa",
    description: "Visualize a distribuição atual dos creators.",
    to: "/mapa",
  },
] as const;

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

function getStartsAtLabel(startsAt: string) {
  const date = new Date(startsAt);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getProgressMeta(status: CompanyCampaignStatus) {
  switch (status) {
    case "IN_PROGRESS":
      return { value: 75, label: "Em execução" };
    case "ACCEPTED":
      return { value: 45, label: "Confirmada" };
    case "COMPLETED":
      return { value: 100, label: "Concluída" };
    case "PENDING":
      return { value: 20, label: "Aguardando creator" };
    default:
      return { value: 0, label: "Encerrada" };
  }
}

function getStatusLabel(status: CompanyCampaignStatus) {
  switch (status) {
    case "PENDING":
      return "Aguardando resposta";
    case "ACCEPTED":
      return "Aceita";
    case "IN_PROGRESS":
      return "Em andamento";
    case "COMPLETED":
      return "Concluída";
    default:
      return "Cancelada";
  }
}

function mapCampaignItem(item: ContractRequestItem): CompanyDashboardCampaignItem {
  const status = getCompanyStatus(item);
  const progress = getProgressMeta(status);
  const creatorName = item.creator?.name ?? item.creatorNameSnapshot ?? "Creator";

  return {
    id: item.id,
    title: item.job?.title ?? item.jobTypeName ?? "Campanha",
    creatorName,
    creatorAvatarUrl: item.creator?.avatarUrl ?? item.creatorAvatarUrlSnapshot ?? null,
    locationText: getLocationText(item),
    status,
    statusLabel: getStatusLabel(status),
    progressValue: progress.value,
    progressLabel: progress.label,
    totalAmount: item.pricing?.totalAmount ?? item.totalAmount ?? item.totalPrice,
    currency: item.currency,
    startsAt: item.schedule?.startTime ?? item.startsAt,
    startsAtLabel: getStartsAtLabel(item.schedule?.startTime ?? item.startsAt),
    relativeDateLabel: getRelativeLabel(item.metadata?.createdAt ?? item.createdAt),
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

function filterBySearch<T>(items: T[], resolver: (item: T) => string, search: string) {
  const normalized = search.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter((item) => resolver(item).toLowerCase().includes(normalized));
}

export function useBusinessDashboardController() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const campaignsQuery = useMyCompanyContractRequestsQuery();
  const creatorsQuery = useMarketplaceCreatorsQuery({
    page: 1,
    limit: RECOMMENDED_CREATORS_LIMIT,
  });

  const campaigns = campaignsQuery.data ?? [];
  const creators = creatorsQuery.data?.items ?? [];

  const viewModel = useMemo<CompanyDashboardViewModel>(() => {
    const activeCampaignsRaw = campaigns
      .filter((item) => {
        const status = getCompanyStatus(item);
        return status === "ACCEPTED" || status === "IN_PROGRESS";
      })
      .sort((left, right) => {
        const leftStatus = getCompanyStatus(left);
        const rightStatus = getCompanyStatus(right);

        if (leftStatus !== rightStatus) {
          return leftStatus === "IN_PROGRESS" ? -1 : 1;
        }

        return (
          new Date(right.metadata?.createdAt ?? right.createdAt ?? 0).getTime() -
          new Date(left.metadata?.createdAt ?? left.createdAt ?? 0).getTime()
        );
      })
      .map(mapCampaignItem);

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

    const filteredActiveCampaigns = filterBySearch(
      activeCampaignsRaw,
      (item) => `${item.title} ${item.creatorName} ${item.locationText}`,
      search
    );
    const filteredPendingRequests = filterBySearch(
      pendingRequestsRaw,
      (item) => `${item.title} ${item.creatorName}`,
      search
    );
    const filteredRecommendedCreators = filterBySearch(
      recommendedCreatorsRaw,
      (item) => `${item.name} ${item.niche} ${item.location}`,
      search
    );

    const companyName = user?.companyProfile?.companyName ?? user?.profile?.name ?? user?.name;

    return {
      greetingName: getGreetingName(companyName),
      subtitle: "Acompanhe campanhas, creators e o que precisa de resposta agora.",
      search,
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
          subtitle: "Trabalhando nas campanhas atuais",
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
          subtitle: "Aguardando aceite do creator",
          tone: "highlight",
        },
      ],
      quickActions: QUICK_ACTIONS.map((action) => ({ ...action })),
      activeCampaigns: filteredActiveCampaigns,
      pendingRequests: filteredPendingRequests,
      recommendedCreators: filteredRecommendedCreators,
      mapHighlights: creators.slice(0, 2).map((creator) => creator.location),
      hasCampaignData: campaigns.length > 0,
      hasRecommendedCreators: creators.length > 0,
      isCampaignsLoading: campaignsQuery.isLoading && !campaignsQuery.data,
      isRecommendedLoading: creatorsQuery.isLoading && !creatorsQuery.data,
      isCampaignsRefreshing: campaignsQuery.isFetching,
      isRecommendedRefreshing: creatorsQuery.isFetching,
      campaignsErrorMessage: getQueryErrorMessage(
        campaignsQuery.error,
        "Não foi possível carregar as campanhas da empresa."
      ),
      recommendedErrorMessage: getQueryErrorMessage(
        creatorsQuery.error,
        "Não foi possível carregar os creators recomendados."
      ),
    };
  }, [
    campaigns,
    campaignsQuery.data,
    campaignsQuery.error,
    campaignsQuery.isFetching,
    campaignsQuery.isLoading,
    creators,
    creatorsQuery.data,
    creatorsQuery.error,
    creatorsQuery.isFetching,
    creatorsQuery.isLoading,
    search,
    user?.companyProfile?.companyName,
    user?.name,
    user?.profile?.name,
  ]);

  return {
    actions: {
      setSearch,
      getCreatorFallbackInitials: getInitials,
    },
    viewModel,
  };
}
