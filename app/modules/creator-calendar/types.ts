export type DesktopCalendarView = "day" | "week" | "month";

export type MobileCalendarView = "weekly" | "daily";

export type CalendarWeekDay = {
  id: string;
  label: string;
  date: string;
  highlighted?: boolean;
};

export type CalendarEvent = {
  id: string;
  title: string;
  startLabel: string;
  endLabel: string;
  dayIndex: number;
  startHour: number;
  durationHours: number;
  tone?: "primary" | "indigo";
};

export type UpcomingJob = {
  id: string;
  category: string;
  title: string;
  badge?: string;
  schedule: string;
  location: string;
  note?: string;
  ctaLabel?: string;
  tone?: "primary" | "muted" | "danger";
};

export type DailyJob = {
  id: string;
  category: string;
  title: string;
  badge?: string;
  schedule: string;
  location: string;
  description?: string;
  client?: string;
  imageUrl?: string;
  tone?: "primary" | "muted";
};

export type AvailabilityDay = {
  id: string;
  label: string;
  enabled: boolean;
  start: string;
  end: string;
};
