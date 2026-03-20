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
