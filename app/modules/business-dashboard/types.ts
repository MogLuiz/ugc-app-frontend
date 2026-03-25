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

export type OperationalStatusVariant = "confirmed" | "pending_schedule" | "in_progress" | "completed";

export type CompanyDashboardCampaignItem = {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatarUrl: string | null;
  locationText: string;
  status: CompanyCampaignStatus;
  /** Rótulo exibido no badge (Confirmada, Pendente, Em andamento, Concluída). */
  operationalStatusLabel: string;
  operationalStatusVariant: OperationalStatusVariant;
  durationMinutes: number;
  recordingInstant: Date | null;
  /** Timestamp ms para ordenação; sem data = null (fica por último). */
  recordingSortKey: number | null;
  dateLine: string;
  timeLine: string;
  durationLine: string;
  dayUrgency: "HOJE" | "AMANHÃ" | null;
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

export type CompanyDashboardActivityItem = {
  id: string;
  title: string;
  description: string;
  relativeLabel: string;
  href?: string;
};

export type CompanyDashboardViewModel = {
  greetingName: string;
  subtitle: string;
  metrics: CompanyDashboardMetric[];
  activeCampaigns: CompanyDashboardCampaignItem[];
  pendingRequests: CompanyDashboardPendingItem[];
  recommendedCreators: CompanyDashboardRecommendedCreator[];
  /** Regiões derivadas dos creators do marketplace (ex.: chip Belo Horizonte/MG). */
  mapHighlights: string[];
  recentActivity: CompanyDashboardActivityItem[];
  hasCampaignData: boolean;
  hasRecommendedCreators: boolean;
  isCampaignsLoading: boolean;
  isRecommendedLoading: boolean;
  isCampaignsRefreshing: boolean;
  isRecommendedRefreshing: boolean;
  isActivityLoading: boolean;
  isActivityRefreshing: boolean;
  campaignsErrorMessage: string | null;
  recommendedErrorMessage: string | null;
  activityErrorMessage: string | null;
};
