import { addDays } from "./calendar-date";

/** Data civil YYYY-MM-DD no fuso IANA informado (alinhado ao backend de agendamento). */
export function formatIsoDateInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function formatTimeInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function getHourMinuteInTimeZone(
  date: Date,
  timeZone: string,
): { hour: number; minute: number } {
  const formatted = formatTimeInTimeZone(date, timeZone);
  const [hour = 0, minute = 0] = formatted.split(":").map((x) => Number(x));

  return { hour, minute };
}

export function formatDayNumberInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    day: "numeric",
  }).format(date);
}

function normalizeWeekdayShort(value: string): string {
  return value.replace(".", "").slice(0, 3).toUpperCase();
}

export function formatWeekdayShortInTimeZone(date: Date, timeZone: string): string {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    weekday: "short",
  }).format(date);

  return normalizeWeekdayShort(formatted);
}

export function formatWeekdayLongInTimeZone(date: Date, timeZone: string): string {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);

  if (!formatted) return formatted;
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/** Ex.: "31 de Março" (dia + mês por extenso no fuso da agenda). */
export function formatDayAndMonthLongInTimeZone(date: Date, timeZone: string): string {
  const raw = new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    day: "numeric",
    month: "long",
  }).format(date);
  const sep = " de ";
  const idx = raw.indexOf(sep);
  if (idx === -1) return raw;
  const dayPart = raw.slice(0, idx);
  const monthPart = raw.slice(idx + sep.length);
  if (!monthPart) return raw;
  return `${dayPart} de ${monthPart.charAt(0).toUpperCase()}${monthPart.slice(1)}`;
}

function dateKeyToUtcNoon(dateKey: string): number {
  const [y = 1970, m = 1, d = 1] = dateKey.split("-").map(Number);
  return Date.UTC(y, m - 1, d, 12, 0, 0, 0);
}

/** Dias entre duas chaves YYYY-MM-DD (ordem civil). */
export function diffCalendarDays(fromKey: string, toKey: string): number {
  return Math.round(
    (dateKeyToUtcNoon(toKey) - dateKeyToUtcNoon(fromKey)) / (24 * 60 * 60 * 1000),
  );
}

export function formatWeekRangeLabel(weekStart: Date, timeZone: string): string {
  const endDay = addDays(weekStart, 6);
  const startDay = Number(formatDayNumberInTimeZone(weekStart, timeZone));
  const endDayNum = Number(formatDayNumberInTimeZone(endDay, timeZone));
  const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    month: "long",
    year: "numeric",
  });

  const startMonth = monthFormatter.format(weekStart);
  const endMonth = monthFormatter.format(endDay);

  if (startMonth === endMonth) {
    return `${startDay}–${endDayNum} de ${startMonth}`;
  }

  return `${startDay} de ${startMonth} – ${endDayNum} de ${endMonth}`;
}
