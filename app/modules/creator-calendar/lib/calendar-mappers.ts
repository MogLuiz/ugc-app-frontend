import type {
  AvailabilityDay,
  AvailabilityDayOfWeek,
  CalendarBooking,
  CalendarEvent,
  CalendarSummaryCard,
  CalendarWeekDay,
  CreatorAvailabilityResponse,
  DailyJob,
  JobMode,
  UpcomingJob,
} from "../types";
import {
  addDays,
  formatCalendarRangeLabel,
  formatDayNumber,
  formatIsoDate,
  formatMonthTitle,
  formatTimeLabel,
  formatWeekdayLong,
  formatWeekdayShort,
  getTimeParts,
  getMinutesBetween,
  isSameDay,
  parseCalendarDate,
  toRelativeDayLabel,
} from "./calendar-date";

const DAY_METADATA: Record<
  AvailabilityDayOfWeek,
  { id: string; label: string }
> = {
  MONDAY: { id: "monday", label: "Segunda-feira" },
  TUESDAY: { id: "tuesday", label: "Terca-feira" },
  WEDNESDAY: { id: "wednesday", label: "Quarta-feira" },
  THURSDAY: { id: "thursday", label: "Quinta-feira" },
  FRIDAY: { id: "friday", label: "Sexta-feira" },
  SATURDAY: { id: "saturday", label: "Sabado" },
  SUNDAY: { id: "sunday", label: "Domingo" },
};

const DAY_ORDER: AvailabilityDayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export function mapAvailabilityDays(
  response: CreatorAvailabilityResponse | undefined,
): AvailabilityDay[] {
  if (!response) {
    return DAY_ORDER.map((dayOfWeek) => ({
      ...DAY_METADATA[dayOfWeek],
      dayOfWeek,
      enabled: false,
      start: "09:00",
      end: "18:00",
    }));
  }

  const responseMap = new Map(
    response.days.map((day) => [day.dayOfWeek, day] as const),
  );

  return DAY_ORDER.map((dayOfWeek) => {
    const apiDay = responseMap.get(dayOfWeek);
    const metadata = DAY_METADATA[dayOfWeek];

    return {
      id: metadata.id,
      dayOfWeek,
      label: metadata.label,
      enabled: apiDay?.isActive ?? false,
      start: normalizeAvailabilityTime(apiDay?.startTime) ?? "09:00",
      end: normalizeAvailabilityTime(apiDay?.endTime) ?? "18:00",
    };
  });
}

export function mapWeekDays(weekStart: Date, selectedDate: Date): CalendarWeekDay[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);

    return {
      id: formatIsoDate(date),
      label: formatWeekdayShort(date),
      date: formatDayNumber(date),
      highlighted: isSameDay(date, selectedDate),
      isoDate: formatIsoDate(date),
      fullLabel: formatWeekdayLong(date),
    };
  });
}

export function mapDesktopEvents(
  bookings: CalendarBooking[],
  weekStart: Date,
): CalendarEvent[] {
  const events: Array<CalendarEvent | null> = bookings.map((booking) => {
    const startDate = new Date(booking.startDateTime);
    const endDate = new Date(booking.endDateTime);
    const startTime = getTimeParts(startDate);
    const dayIndex = getDayIndex(weekStart, startDate);

    if (dayIndex < 0 || dayIndex > 6) {
      return null;
    }

    return {
      id: booking.id,
      title: booking.title,
      startLabel: formatTimeLabel(startDate),
      endLabel: formatTimeLabel(endDate),
      dayIndex,
      startHour: startTime.hour,
      startMinuteOffset: startTime.minute,
      durationMinutes: booking.durationMinutes,
      tone: mapEventTone(booking.status, booking.isBlocking),
      status: booking.status,
      isBlocking: booking.isBlocking,
    };
  });

  return events.filter((event): event is CalendarEvent => event !== null);
}

export function mapDesktopTimeSlots(
  availabilityDays: AvailabilityDay[],
  bookings: CalendarBooking[],
): string[] {
  const activeStarts = availabilityDays
    .filter((day) => day.enabled)
    .map((day) => Number(day.start.split(":")[0] ?? 0));
  const bookingHours = bookings.flatMap((booking) => {
    const start = getTimeParts(booking.startDateTime);
    const end = getTimeParts(booking.endDateTime);
    return [start.hour, end.hour];
  });

  const minHour = Math.max(
    0,
    Math.min(...[...activeStarts, ...bookingHours, 8]),
  );
  const maxHour = Math.min(
    23,
    Math.max(...[...activeStarts, ...bookingHours, 18]),
  );

  return Array.from({ length: maxHour - minHour + 1 }, (_, index) =>
    `${String(minHour + index).padStart(2, "0")}:00`,
  );
}

export function mapUpcomingJobs(bookings: CalendarBooking[], now = new Date()): UpcomingJob[] {
  return bookings
    .filter((booking) => new Date(booking.startDateTime).getTime() >= now.getTime())
    .sort(
      (left, right) =>
        new Date(left.startDateTime).getTime() -
        new Date(right.startDateTime).getTime(),
    )
    .slice(0, 3)
    .map((booking) => {
      const startDate = new Date(booking.startDateTime);
      const endDate = new Date(booking.endDateTime);

      return {
        id: booking.id,
        category: booking.jobType.name,
        title: booking.title,
        badge: toRelativeDayLabel(startDate, now),
        schedule: `${formatCalendarRangeLabel(startDate, endDate)} (${formatDurationHours(
          booking.durationMinutes,
        )})`,
        location: mapModeLabel(booking.mode),
        note: booking.notes ?? booking.description ?? undefined,
        tone: mapCardTone(booking.status),
      };
    });
}

export function mapDailyJobs(
  bookings: CalendarBooking[],
  selectedDate: Date,
): DailyJob[] {
  return bookings
    .filter((booking) => isSameDay(new Date(booking.startDateTime), selectedDate))
    .sort(
      (left, right) =>
        new Date(left.startDateTime).getTime() -
        new Date(right.startDateTime).getTime(),
    )
    .map((booking) => {
      const startDate = new Date(booking.startDateTime);
      const endDate = new Date(booking.endDateTime);

      return {
        id: booking.id,
        category: booking.jobType.name,
        title: booking.title,
        badge: mapStatusLabel(booking.status),
        schedule: formatCalendarRangeLabel(startDate, endDate),
        location: mapModeLabel(booking.mode),
        description: booking.notes ?? booking.description ?? undefined,
        client: `Origem: ${booking.origin}`,
        tone: booking.status === "CONFIRMED" ? "primary" : "muted",
      };
    });
}

export function mapNextSession(bookings: CalendarBooking[]): CalendarSummaryCard | null {
  const now = new Date();
  const nextBooking = bookings
    .filter(
      (booking) =>
        booking.isBlocking &&
        new Date(booking.startDateTime).getTime() >= now.getTime(),
    )
    .sort(
      (left, right) =>
        new Date(left.startDateTime).getTime() -
        new Date(right.startDateTime).getTime(),
    )[0];

  if (!nextBooking) {
    return null;
  }

  const startDate = new Date(nextBooking.startDateTime);

  return {
    title: nextBooking.title,
    schedule: `${toRelativeDayLabel(startDate, now)}, as ${formatTimeLabel(startDate)}`,
  };
}

export function calculateTotalWeeklyMinutes(days: AvailabilityDay[]): number {
  return days.reduce((total, day) => {
    if (!day.enabled) {
      return total;
    }

    return total + Math.max(getMinutesBetween(day.start, day.end), 0);
  }, 0);
}

export function getMonthTitle(date: Date): string {
  return formatMonthTitle(date);
}

function getDayIndex(weekStart: Date, date: Date): number {
  const startOfWeekTime = parseCalendarDate(formatIsoDate(weekStart)).getTime();
  const eventTime = parseCalendarDate(formatIsoDate(date)).getTime();
  return Math.round((eventTime - startOfWeekTime) / (24 * 60 * 60 * 1000));
}

function mapModeLabel(mode: JobMode): string {
  if (mode === "REMOTE") return "Remoto";
  if (mode === "HYBRID") return "Hibrido";
  return "Presencial";
}

function mapStatusLabel(status: CalendarBooking["status"]): string {
  switch (status) {
    case "CONFIRMED":
      return "Confirmado";
    case "PENDING":
      return "Pendente";
    case "REJECTED":
      return "Recusado";
    case "CANCELLED":
      return "Cancelado";
    case "COMPLETED":
      return "Concluido";
    default:
      return status;
  }
}

function mapCardTone(status: CalendarBooking["status"]): UpcomingJob["tone"] {
  if (status === "CONFIRMED") return "primary";
  if (status === "PENDING") return "muted";
  return "danger";
}

function mapEventTone(
  status: CalendarBooking["status"],
  isBlocking: boolean,
): CalendarEvent["tone"] {
  if (!isBlocking) return "muted";
  return status === "PENDING" ? "indigo" : "primary";
}

function formatDurationHours(durationMinutes: number): string {
  const hours = durationMinutes / 60;
  if (durationMinutes % 60 === 0) {
    return `${hours}h`;
  }

  return `${hours.toFixed(1).replace(".", ",")}h`;
}

function normalizeAvailabilityTime(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const [hours = "00", minutes = "00"] = value.split(":");
  return `${hours}:${minutes}`;
}
