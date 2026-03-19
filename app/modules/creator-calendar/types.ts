export type DesktopCalendarView = "day" | "week" | "month";

export type MobileCalendarView = "weekly" | "daily";

export type AvailabilityDayOfWeek =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export type JobMode = "PRESENTIAL" | "REMOTE" | "HYBRID";

export type CreatorAvailabilityResponse = {
  creatorUserId: string;
  timezone: string;
  days: Array<{
    dayOfWeek: AvailabilityDayOfWeek;
    isActive: boolean;
    startTime: string | null;
    endTime: string | null;
  }>;
};

export type UpdateCreatorAvailabilityInput = {
  days: Array<{
    dayOfWeek: AvailabilityDayOfWeek;
    isActive: boolean;
    startTime?: string | null;
    endTime?: string | null;
  }>;
};

export type CreatorCalendarResponse = {
  creatorUserId: string;
  timezone: string;
  range: {
    start: string;
    end: string;
  };
  blockedStatuses: BookingStatus[];
  bookings: CalendarBooking[];
};

export type CalendarBooking = {
  id: string;
  title: string;
  description: string | null;
  status: BookingStatus;
  mode: JobMode;
  startDateTime: string;
  endDateTime: string;
  durationMinutes: number;
  origin: string;
  notes: string | null;
  jobType: {
    id: string;
    name: string;
  };
  companyUserId: string;
  creatorUserId: string;
  isBlocking: boolean;
};

export type CalendarWeekDay = {
  id: string;
  label: string;
  date: string;
  highlighted?: boolean;
  isoDate: string;
  fullLabel: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  startLabel: string;
  endLabel: string;
  dayIndex: number;
  startHour: number;
  startMinuteOffset: number;
  durationMinutes: number;
  tone?: "primary" | "indigo" | "muted";
  status: BookingStatus;
  isBlocking: boolean;
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
  dayOfWeek: AvailabilityDayOfWeek;
  label: string;
  enabled: boolean;
  start: string;
  end: string;
};

export type CalendarSummaryCard = {
  title: string;
  schedule: string;
};
