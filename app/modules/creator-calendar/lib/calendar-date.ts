export const SCHEDULING_TIMEZONE = "America/Sao_Paulo";

const SAO_PAULO_UTC_OFFSET = "-03:00";

const MONTH_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  timeZone: SCHEDULING_TIMEZONE,
  month: "long",
  year: "numeric",
});

const WEEKDAY_SHORT_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  timeZone: SCHEDULING_TIMEZONE,
  weekday: "short",
});

const WEEKDAY_LONG_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  timeZone: SCHEDULING_TIMEZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
});

const DATE_KEY_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: SCHEDULING_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  timeZone: SCHEDULING_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function startOfWeek(date: Date): Date {
  const next = startOfDay(date);
  const day = next.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setUTCDate(next.getUTCDate() + diff);

  return next;
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + amount);
  return next;
}

export function startOfDay(date: Date): Date {
  return parseCalendarDate(formatIsoDate(date));
}

export function isSameDay(left: Date, right: Date): boolean {
  return formatIsoDate(left) === formatIsoDate(right);
}

export function formatMonthTitle(date: Date): string {
  return capitalize(MONTH_FORMATTER.format(date));
}

export function formatWeekdayShort(date: Date): string {
  return normalizeWeekdayShort(WEEKDAY_SHORT_FORMATTER.format(date));
}

export function formatWeekdayLong(date: Date): string {
  return capitalize(WEEKDAY_LONG_FORMATTER.format(date));
}

export function formatDayNumber(date: Date): string {
  return String(date.getDate());
}

export function formatIsoDate(date: Date): string {
  return DATE_KEY_FORMATTER.format(date);
}

export function formatTimeLabel(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return TIME_FORMATTER.format(date);
}

export function formatCalendarRangeLabel(startDate: Date, endDate: Date): string {
  return `${formatTimeLabel(startDate)} - ${formatTimeLabel(endDate)}`;
}

export function parseCalendarDate(value: string): Date {
  return new Date(`${value}T12:00:00.000Z`);
}

export function toCalendarRequestRange(weekStart: Date) {
  const startDateKey = formatIsoDate(weekStart);
  const endDateKey = formatIsoDate(addDays(weekStart, 7));
  const start = new Date(`${startDateKey}T00:00:00${SAO_PAULO_UTC_OFFSET}`);
  const end = new Date(`${endDateKey}T00:00:00${SAO_PAULO_UTC_OFFSET}`);

  return {
    start,
    end,
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

export function toRelativeDayLabel(date: Date, now = new Date()): string {
  const today = startOfDay(now).getTime();
  const target = startOfDay(date).getTime();
  const diffDays = Math.round((target - today) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanha";
  if (diffDays > 1) return `Em ${diffDays} dias`;
  return "Encerrado";
}

export function formatWeeklyHoursLabel(totalMinutes: number): string {
  const hours = totalMinutes / 60;
  const hasFraction = totalMinutes % 60 !== 0;

  if (!hasFraction) {
    return String(hours);
  }

  return hours.toFixed(1).replace(".", ",");
}

export function buildHalfHourOptions(): string[] {
  const options: string[] = [];

  for (let hour = 0; hour < 24; hour += 1) {
    for (const minute of [0, 30]) {
      options.push(
        `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      );
    }
  }

  return options;
}

export function getTimeParts(value: string | Date): { hour: number; minute: number } {
  const formatted = formatTimeLabel(value);
  const [hour = "00", minute = "00"] = formatted.split(":");

  return {
    hour: Number(hour),
    minute: Number(minute),
  };
}

export function getMinutesBetween(start: string, end: string): number {
  const [startHour = 0, startMinute = 0] = start.split(":").map(Number);
  const [endHour = 0, endMinute = 0] = end.split(":").map(Number);

  return endHour * 60 + endMinute - (startHour * 60 + startMinute);
}

function normalizeWeekdayShort(value: string): string {
  return value.replace(".", "").slice(0, 3).toUpperCase();
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
