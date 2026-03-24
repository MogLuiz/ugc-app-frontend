import type { CompanyCampaignStatus, ContractRequestItem } from "~/modules/contract-requests/types";

export type CompanyDashboardMetricId =
  | "active-campaigns"
  | "active-creators"
  | "completed-campaigns"
  | "pending-requests";

export type CompanyDashboardMetric = {
  id: CompanyDashboardMetricId;
  label: string;
  value: number;
  subtitle: string;
  tone: "default" | "highlight";
};

export type CompanyDashboardQuickAction = {
  id: string;
  label: string;
  description: string;
  to?: string;
  disabled?: boolean;
  todoNote?: string;
};

export type CompanyDashboardCampaignItem = {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatarUrl: string | null;
  locationText: string;
  status: CompanyCampaignStatus;
  statusLabel: string;
  progressValue: number;
  progressLabel: string;
  totalAmount: number;
  currency: string;
  startsAt: string;
  startsAtLabel: string;
  relativeDateLabel: string;
  source: ContractRequestItem;
};

export type CompanyDashboardPendingItem = {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatarUrl: string | null;
  waitingLabel: string;
  statusLabel: string;
  source: ContractRequestItem;
};

export type CompanyDashboardRecommendedCreator = {
  id: string;
  name: string;
  niche: string;
  location: string;
  rating: number | null;
  avatarUrl: string | null;
};

export type CompanyDashboardViewModel = {
  greetingName: string;
  subtitle: string;
  search: string;
  metrics: CompanyDashboardMetric[];
  quickActions: CompanyDashboardQuickAction[];
  activeCampaigns: CompanyDashboardCampaignItem[];
  pendingRequests: CompanyDashboardPendingItem[];
  recommendedCreators: CompanyDashboardRecommendedCreator[];
  mapHighlights: string[];
  hasCampaignData: boolean;
  hasRecommendedCreators: boolean;
  isCampaignsLoading: boolean;
  isRecommendedLoading: boolean;
  isCampaignsRefreshing: boolean;
  isRecommendedRefreshing: boolean;
  campaignsErrorMessage: string | null;
  recommendedErrorMessage: string | null;
};
