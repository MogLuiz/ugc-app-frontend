export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  badge?: { text: string; variant: "success" | "info" | "urgent" };
  subtitle?: string;
};

export type JobOffer = {
  id: string;
  title: string;
  location: string;
  description: string;
  value: string;
  iconType: "gastronomy" | "unboxing";
};

export type ProgressItem = {
  id: string;
  title: string;
  deadline: string;
  progress: number;
};
