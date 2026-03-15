export type BusinessDashboardStat = {
  id: string;
  label: string;
  value: string;
  change?: string;
  changeVariant?: "positive" | "negative";
  subtitle?: string;
  iconType?: "investment" | "jobs" | "pending";
};

export type BusinessCampaignJob = {
  id: string;
  title: string;
  description: string;
  value: string;
  status: "em_producao" | "pendente" | "concluido";
  statusLabel: string;
};

export type RecommendedCreator = {
  id: string;
  name: string;
  category: string;
  avatarUrl?: string;
};
