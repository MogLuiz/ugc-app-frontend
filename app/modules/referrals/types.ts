/** Alinhado aos enums do backend (referrals). */
export type ReferralStatusApi = "PENDING" | "QUALIFIED" | "EXPIRED";

export type CommissionStatusApi =
  | "PENDING"
  | "APPROVED"
  | "PAID"
  | "CANCELLED";

export type PartnerProfileResponse = {
  userId: string;
  status: string;
  referralCode: string | null;
  referralLink: string | null;
  commissionRatePercent: number;
  displayName: string | null;
  activatedAt: string;
};

export type ActivatePartnerResponse = {
  userId: string;
  status: string;
  referralCode: string;
  referralLink: string;
  commissionRatePercent: number;
  activatedAt: string;
};

export type ReferralsDashboardResponse = {
  totalReferrals: number;
  pendingReferrals: number;
  qualifiedReferrals: number;
  totalCommissionAmountCents: number;
  pendingCommissionAmountCents: number;
  currency: string;
};

export type ReferralListItem = {
  id: string;
  referredUser: { name: string; photoUrl: string | null };
  status: ReferralStatusApi;
  qualifiedAt: string | null;
  createdAt: string;
};

export type ReferralsListResponse = {
  items: ReferralListItem[];
  total: number;
  page: number;
  limit: number;
};

export type CommissionListItem = {
  id: string;
  referredUserName: string;
  grossAmountCents: number;
  commissionAmountCents: number;
  commissionRatePercent: number;
  currency: string;
  status: CommissionStatusApi;
  createdAt: string;
};

export type CommissionsListResponse = {
  items: CommissionListItem[];
  total: number;
  page: number;
  limit: number;
};
