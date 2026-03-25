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
  }) =>
    [
      ...marketplaceKeys.all,
      "creators",
      params.page,
      params.limit,
      params.search ?? "",
      params.serviceTypeId ?? "",
    ] as const,
  serviceTypes: () => [...marketplaceKeys.all, "service-types"] as const,
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
