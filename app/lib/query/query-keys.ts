export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

export const creatorCalendarKeys = {
  all: ["creator-calendar"] as const,
  availability: () => [...creatorCalendarKeys.all, "availability"] as const,
  calendar: (start: string, end: string) =>
    [...creatorCalendarKeys.all, "calendar", start, end] as const,
};

export const creatorJobTypesKeys = {
  all: ["creator-job-types"] as const,
  list: () => [...creatorJobTypesKeys.all, "list"] as const,
};

export const marketplaceKeys = {
  all: ["marketplace"] as const,
  creators: (params: {
    page: number;
    limit: number;
    search?: string;
    serviceTypeId?: string;
    minAge?: number;
    maxAge?: number;
  }) =>
    [
      ...marketplaceKeys.all,
      "creators",
      params.page,
      params.limit,
      params.search ?? "",
      params.serviceTypeId ?? "",
      params.minAge ?? "",
      params.maxAge ?? "",
    ] as const,
  serviceTypes: () => [...marketplaceKeys.all, "service-types"] as const,
};

export const creatorsMapKeys = {
  all: ["creators-map"] as const,
  list: (search?: string) => [...creatorsMapKeys.all, "list", search ?? ""] as const,
};

export const creatorProfileKeys = {
  all: ["creator-profile"] as const,
  detail: (creatorId: string) =>
    [...creatorProfileKeys.all, "detail", creatorId] as const,
};

export const contractRequestKeys = {
  all: ["contract-requests"] as const,
  companyList: (status?: string) =>
    [...contractRequestKeys.all, "company", status ?? "all"] as const,
  creatorPending: () => [...contractRequestKeys.all, "creator", "pending"] as const,
  creatorList: (status: string) =>
    [...contractRequestKeys.all, "creator", status] as const,
};

export const openOfferKeys = {
  all: ["open-offers"] as const,
  companyList: (params?: { page?: number; limit?: number; status?: string }) =>
    [
      ...openOfferKeys.all,
      "company",
      params?.page ?? 1,
      params?.limit ?? 20,
      params?.status ?? "all",
    ] as const,
  companyDetail: (id: string) => [...openOfferKeys.all, "company", id] as const,
};

export const creatorDashboardKeys = {
  all: ["creator-dashboard"] as const,
  summary: () => [...creatorDashboardKeys.all, "summary"] as const,
  invites: () => [...creatorDashboardKeys.all, "invites"] as const,
  upcoming: () => [...creatorDashboardKeys.all, "upcoming"] as const,
  activity: () => [...creatorDashboardKeys.all, "activity"] as const,
};

export const chatKeys = {
  all: ["chat"] as const,
  conversations: (contractRequestId?: string) =>
    [...chatKeys.all, "conversations", contractRequestId ?? "all"] as const,
  messages: (conversationId?: string) =>
    [...chatKeys.all, "messages", conversationId ?? "none"] as const,
};

export const opportunityKeys = {
  all: ["opportunities"] as const,
  list: (params?: { page?: number; limit?: number }) =>
    [...opportunityKeys.all, "list", params?.page ?? 1, params?.limit ?? 50] as const,
  detail: (id: string) => [...opportunityKeys.all, "detail", id] as const,
};

export const referralsKeys = {
  all: ["referrals"] as const,
  profile: () => [...referralsKeys.all, "profile"] as const,
  dashboard: () => [...referralsKeys.all, "dashboard"] as const,
  referrals: (page: number, limit: number, status?: string) =>
    [...referralsKeys.all, "referrals", page, limit, status ?? "ALL"] as const,
  commissions: (page: number, limit: number) =>
    [...referralsKeys.all, "commissions", page, limit] as const,
};

export const paymentKeys = {
  all: ["payments"] as const,
  detail: (paymentId: string) => [...paymentKeys.all, "detail", paymentId] as const,
  myPayouts: () => [...paymentKeys.all, "my-payouts"] as const,
  payoutSettings: () => [...paymentKeys.all, "payout-settings"] as const,
  companyList: () => [...paymentKeys.all, "company-list"] as const,
};

export const billingKeys = {
  all: ["billing"] as const,
  balance: () => [...billingKeys.all, "balance"] as const,
  refundRequests: () => [...billingKeys.all, "refund-requests"] as const,
};
