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
