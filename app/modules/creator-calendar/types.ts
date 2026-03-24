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
  /** Quando existir no backend, exibe ganhos da semana na UI; caso contrário omitir. */
  weeklyEarnings?: number;
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
  companyName?: string | null;
  contractRequestId?: string | null;
  location?: string | null;
};

/** Origem da linha no calendário (adapter); não confundir com `origin` legado da API de booking. */
export type CalendarItemOrigin = "BOOKING" | "CONTRACT_REQUEST";

export type VisualCalendarStatus = "confirmed" | "pending" | "completed" | "cancelled";

export type UiCalendarEvent = {
  id: string;
  origin: CalendarItemOrigin;
  contractRequestId: string | null;
  bookingStatus: BookingStatus;
  visualStatus: VisualCalendarStatus;
  company: string;
  title: string;
  jobTypeName: string;
  mode: JobMode;
  startAt: Date;
  endAt: Date;
  startLabel: string;
  endLabel: string;
  locationLine: string | null;
  /** Linha de modo (presencial/remoto) para exibição quando não houver endereço. */
  modeLine: string;
  description: string | null;
  notes: string | null;
  dayIndex: number;
  startHour: number;
  startMinute: number;
  durationMinutes: number;
  overlapIndex: number;
  overlapCount: number;
};

export type CalendarTimelineSection = {
  dateKey: string;
  /** Cabeçalho da timeline (ex.: "TER - 31 de Março", "HOJE - 24 de Março"). */
  sectionLabel: string;
  events: UiCalendarEvent[];
};

export type CalendarWeeklyStats = {
  jobCount: number;
  totalHours: number;
  weeklyEarnings?: number;
};

/** Período visível (7 dias) em relação a hoje no fuso da agenda. */
export type CalendarRangePastNotice = "none" | "partial" | "full";

export type CalendarViewModel = {
  timeZone: string;
  weekRangeLabel: string;
  weekDays: CalendarWeekDay[];
  hourSlots: string[];
  events: UiCalendarEvent[];
  timelineByDay: CalendarTimelineSection[];
  nextConfirmedJob: UiCalendarEvent | null;
  todayJobs: UiCalendarEvent[];
  weeklyStats: CalendarWeeklyStats;
  todayDateKey: string;
  rangePastNotice: CalendarRangePastNotice;
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
