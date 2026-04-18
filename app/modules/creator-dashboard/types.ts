/** View models consumidos apenas pelos componentes de UI do dashboard do creator. */

export type CreatorKpiCardVm = {
  id: string;
  label: string;
  valueDisplay: string;
  /** Texto secundário abaixo do valor principal. */
  subtitle?: string;
  /** Se fornecido, o card inteiro vira um link para essa rota. */
  href?: string;
};

export type CreatorInviteVm = {
  id: string;
  companyName: string;
  campaignTitle: string;
  proposedDateDisplay: string;
  paymentDisplay: string;
  distanceDisplay: string | null;
};

export type CreatorUpcomingCampaignVm = {
  id: string;
  campaignName: string;
  companyName: string;
  recordingAt: Date;
  dayBanner: "HOJE" | "AMANHÃ" | null;
  dateBadge: string;
  timeDisplay: string;
  locationDisplay: string;
  durationDisplay: string;
  statusBadge: string;
};

export type CreatorActivityItemVm = {
  id: string;
  title: string;
  description: string;
  relativeLabel: string;
  href?: string;
};

export type NearbyCampaignCardVm = {
  id: string;
  title: string;
  distanceKm: number;
  payment: number;
  durationHours: number;
};
