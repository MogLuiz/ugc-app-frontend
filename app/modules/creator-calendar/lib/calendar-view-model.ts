import { addDays, SCHEDULING_TIMEZONE } from "./calendar-date";
import {
  diffCalendarDays,
  formatDayAndMonthLongInTimeZone,
  formatDayNumberInTimeZone,
  formatIsoDateInTimeZone,
  formatTimeInTimeZone,
  formatWeekRangeLabel,
  formatWeekdayLongInTimeZone,
  formatWeekdayShortInTimeZone,
  getHourMinuteInTimeZone,
} from "./calendar-tz";
import {
  formatCalendarDurationLabel,
  formatDistanceLabel,
  formatJobKindLabel,
} from "./calendar-display";
import type {
  BookingStatus,
  CalendarBooking,
  CalendarItemOrigin,
  CalendarRangePastNotice,
  CalendarTimelineSection,
  CalendarViewModel,
  CalendarWeeklyStats,
  CreatorCalendarResponse,
  JobMode,
  UiCalendarEvent,
  VisualCalendarStatus,
} from "../types";

export const VISUAL_STATUS_BADGE_LABEL: Record<VisualCalendarStatus, string> = {
  confirmed: "CONFIRMADO",
  pending: "PENDENTE",
  completed: "CONCLUIDO",
  cancelled: "CANCELADO",
};

function resolveTimeZone(response: CreatorCalendarResponse | undefined): string {
  return response?.timezone?.trim() || SCHEDULING_TIMEZONE;
}

function calendarItemOrigin(row: CalendarBooking): CalendarItemOrigin {
  if (row.contractRequestId || row.origin === "CONTRACT_REQUEST") {
    return "CONTRACT_REQUEST";
  }

  return "BOOKING";
}

function mapVisualStatus(status: BookingStatus): VisualCalendarStatus {
  switch (status) {
    case "CONFIRMED":
      return "confirmed";
    case "PENDING":
      return "pending";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
    case "REJECTED":
      return "cancelled";
    default:
      return "cancelled";
  }
}

function mapModeLine(mode: JobMode): string {
  if (mode === "REMOTE") return "Remoto";
  if (mode === "HYBRID") return "Hibrido";
  return "Presencial";
}

function isUpcomingSidebarBookingStatus(status: BookingStatus): boolean {
  return status === "PENDING" || status === "CONFIRMED";
}

function mapBookingRowToUiEvent(
  row: CalendarBooking,
  timeZone: string,
  dayIndex: number,
): UiCalendarEvent {
  const startAt = new Date(row.startDateTime);
  const endAt = new Date(row.endDateTime);
  const { hour: startHour, minute: startMinute } = getHourMinuteInTimeZone(
    startAt,
    timeZone,
  );
  const origin = calendarItemOrigin(row);
  const company =
    row.companyName?.trim() ||
    (origin === "CONTRACT_REQUEST" ? "Empresa" : "Cliente");
  const locationLine = row.location?.trim() || null;
  const modeLine = mapModeLine(row.mode);
  const distanceKm =
    row.distanceKm != null && Number.isFinite(Number(row.distanceKm))
      ? Number(row.distanceKm)
      : null;

  return {
    id: row.id,
    origin,
    contractRequestId: row.contractRequestId ?? null,
    bookingStatus: row.status,
    visualStatus: mapVisualStatus(row.status),
    company,
    title: row.title,
    jobTypeName: row.jobType.name,
    mode: row.mode,
    startAt,
    endAt,
    startLabel: formatTimeInTimeZone(startAt, timeZone),
    endLabel: formatTimeInTimeZone(endAt, timeZone),
    locationLine,
    modeLine,
    description: row.description,
    notes: row.notes,
    dayIndex,
    startHour,
    startMinute,
    durationMinutes: row.durationMinutes,
    overlapIndex: 0,
    overlapCount: 1,
    companyUserId: row.companyUserId,
    companyPhotoUrl: row.companyPhotoUrl?.trim() || null,
    companyRating:
      row.companyRating != null && Number.isFinite(Number(row.companyRating))
        ? Number(row.companyRating)
        : null,
    distanceKm,
    durationLabel: formatCalendarDurationLabel(row.durationMinutes),
    jobKindLabel: formatJobKindLabel(row.jobType.name, row.mode),
    distanceLabel: formatDistanceLabel(distanceKm),
  };
}

function pickNextUpcomingCommitment(
  rows: CalendarBooking[],
  timeZone: string,
  now: Date,
): UiCalendarEvent | null {
  const candidates: UiCalendarEvent[] = [];
  for (const row of rows) {
    if (!isUpcomingSidebarBookingStatus(row.status)) continue;
    const endAt = new Date(row.endDateTime);
    if (endAt.getTime() <= now.getTime()) continue;
    candidates.push(mapBookingRowToUiEvent(row, timeZone, -1));
  }
  candidates.sort(
    (a, b) =>
      a.startAt.getTime() - b.startAt.getTime() || a.id.localeCompare(b.id),
  );
  return candidates[0] ?? null;
}

function intervalsOverlapHalfOpen(
  a0: number,
  a1: number,
  b0: number,
  b1: number,
): boolean {
  return a0 < b1 && a1 > b0;
}

/**
 * Por dia civil: agrupa intervalos que se intersectam (cadeia de overlaps);
 * em cada componente, colunas greedy + overlapCount = número de colunas usadas.
 */
function computeOverlapLayout(
  items: Array<{ id: string; startMs: number; endMs: number }>,
): Map<string, { overlapIndex: number; overlapCount: number }> {
  const result = new Map<string, { overlapIndex: number; overlapCount: number }>();
  if (items.length === 0) {
    return result;
  }

  const adj: number[][] = items.map(() => []);

  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      const a = items[i];
      const b = items[j];
      if (!a || !b) continue;
      if (
        a &&
        b &&
        intervalsOverlapHalfOpen(a.startMs, a.endMs, b.startMs, b.endMs)
      ) {
        adj[i]?.push(j);
        adj[j]?.push(i);
      }
    }
  }

  const visited = new Array(items.length).fill(false);

  function dfs(start: number, acc: number[]) {
    visited[start] = true;
    acc.push(start);
    for (const n of adj[start] ?? []) {
      if (!visited[n]) {
        dfs(n, acc);
      }
    }
  }

  for (let i = 0; i < items.length; i += 1) {
    if (visited[i]) continue;
    const compIdx: number[] = [];
    dfs(i, compIdx);
    const comp = compIdx
      .map((ix) => items[ix])
      .filter((item): item is (typeof items)[number] => Boolean(item))
      .sort((a, b) => a.startMs - b.startMs || a.id.localeCompare(b.id));

    const columnEnds: number[] = [];
    const assignment = new Map<string, number>();

    for (const ev of comp) {
      let col = 0;
      while (col < columnEnds.length && (columnEnds[col] ?? 0) > ev.startMs) {
        col += 1;
      }
      if (col === columnEnds.length) {
        columnEnds.push(ev.endMs);
      } else {
        columnEnds[col] = ev.endMs;
      }
      assignment.set(ev.id, col);
    }

    const overlapCount = Math.max(1, columnEnds.length);
    for (const ev of comp) {
      result.set(ev.id, {
        overlapIndex: assignment.get(ev.id) ?? 0,
        overlapCount,
      });
    }
  }

  return result;
}

function isExcludedFromLoadStats(status: BookingStatus): boolean {
  return status === "CANCELLED" || status === "REJECTED";
}

function buildWeeklyStats(
  events: UiCalendarEvent[],
  weeklyEarnings?: number,
): CalendarWeeklyStats {
  const counted = events.filter((e) => !isExcludedFromLoadStats(e.bookingStatus));

  const totalHours =
    Math.round(
      counted.reduce((sum, e) => sum + (e.endAt.getTime() - e.startAt.getTime()) / 3_600_000, 0) *
      100,
    ) / 100;

  const stats: CalendarWeeklyStats = {
    jobCount: counted.length,
    totalHours,
  };

  if (weeklyEarnings !== undefined && Number.isFinite(weeklyEarnings)) {
    stats.weeklyEarnings = weeklyEarnings;
  }

  return stats;
}

export function buildCalendarViewModel(input: {
  response: CreatorCalendarResponse | undefined;
  weekStart: Date;
  selectedDate: Date;
  now?: Date;
  /** Dias civis no período (lista mobile pode usar 15; grade desktop segue 7 colunas). */
  visiblePeriodDays?: number;
}): CalendarViewModel | null {
  const { response, weekStart, selectedDate } = input;
  const now = input.now ?? new Date();
  const visiblePeriodDays = Math.max(1, input.visiblePeriodDays ?? 7);
  const lastDayOffset = visiblePeriodDays - 1;

  if (!response) {
    return null;
  }

  const timeZone = resolveTimeZone(response);
  const rangeStartKey = formatIsoDateInTimeZone(weekStart, timeZone);
  const todayDateKey = formatIsoDateInTimeZone(now, timeZone);
  const selectedDateKey = formatIsoDateInTimeZone(selectedDate, timeZone);
  const rangeEndKey = formatIsoDateInTimeZone(
    addDays(weekStart, lastDayOffset),
    timeZone,
  );

  let rangePastNotice: CalendarRangePastNotice = "none";
  if (rangeEndKey < todayDateKey) {
    rangePastNotice = "full";
  } else if (rangeStartKey < todayDateKey && rangeEndKey >= todayDateKey) {
    rangePastNotice = "partial";
  }

  const rawEvents: UiCalendarEvent[] = [];

  for (const row of response.bookings) {
    const startAt = new Date(row.startDateTime);
    const eventKey = formatIsoDateInTimeZone(startAt, timeZone);
    const dayIndex = diffCalendarDays(rangeStartKey, eventKey);

    if (dayIndex < 0 || dayIndex >= visiblePeriodDays) {
      continue;
    }

    rawEvents.push(mapBookingRowToUiEvent(row, timeZone, dayIndex));
  }

  rawEvents.sort(
    (a, b) =>
      a.startAt.getTime() - b.startAt.getTime() || a.id.localeCompare(b.id),
  );

  const byDay = new Map<number, UiCalendarEvent[]>();
  for (const e of rawEvents) {
    const list = byDay.get(e.dayIndex) ?? [];
    list.push(e);
    byDay.set(e.dayIndex, list);
  }

  const overlapById = new Map<string, { overlapIndex: number; overlapCount: number }>();

  for (let d = 0; d < visiblePeriodDays; d += 1) {
    const dayList = byDay.get(d) ?? [];
    const items = dayList.map((e) => ({
      id: e.id,
      startMs: e.startAt.getTime(),
      endMs: e.endAt.getTime(),
    }));
    const layout = computeOverlapLayout(items);
    for (const [id, v] of layout) {
      overlapById.set(id, v);
    }
  }

  const events = rawEvents.map((e) => {
    const o = overlapById.get(e.id);
    return {
      ...e,
      overlapIndex: o?.overlapIndex ?? 0,
      overlapCount: o?.overlapCount ?? 1,
    };
  });

  let minHour = 8;
  let maxHour = 20;
  for (const e of events) {
    const endH = getHourMinuteInTimeZone(e.endAt, timeZone);
    const endHourCeil = endH.minute > 0 ? endH.hour + 1 : endH.hour;
    minHour = Math.min(minHour, e.startHour);
    maxHour = Math.max(maxHour, endHourCeil);
  }
  minHour = Math.max(0, minHour);
  maxHour = Math.min(23, maxHour);

  const hourSlots: string[] = [];
  for (let h = minHour; h <= maxHour; h += 1) {
    hourSlots.push(`${String(h).padStart(2, "0")}:00`);
  }

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    const isoDate = formatIsoDateInTimeZone(date, timeZone);

    return {
      id: isoDate,
      label: formatWeekdayShortInTimeZone(date, timeZone),
      date: formatDayNumberInTimeZone(date, timeZone),
      highlighted: isoDate === selectedDateKey,
      isToday: isoDate === todayDateKey,
      isoDate,
      fullLabel: formatWeekdayLongInTimeZone(date, timeZone),
    };
  });

  const timelineByDay: CalendarTimelineSection[] = [];

  for (let i = 0; i < visiblePeriodDays; i += 1) {
    const date = addDays(weekStart, i);
    const dateKey = formatIsoDateInTimeZone(date, timeZone);
    const dayEvents = events.filter((e) => e.dayIndex === i);

    let dayPrefix: string;
    if (dateKey === todayDateKey) {
      dayPrefix = "HOJE";
    } else if (diffCalendarDays(todayDateKey, dateKey) === 1) {
      dayPrefix = "AMANHÃ";
    } else {
      dayPrefix = formatWeekdayShortInTimeZone(date, timeZone);
    }

    const dateCaption = formatDayAndMonthLongInTimeZone(date, timeZone);
    const sectionLabel = `${dayPrefix} • ${dateCaption}`;

    timelineByDay.push({
      dateKey,
      sectionLabel,
      events: dayEvents,
    });
  }

  const nextUpcomingCommitment = pickNextUpcomingCommitment(
    response.bookings,
    timeZone,
    now,
  );

  const weeklyEarnings = response.weeklyEarnings;
  const weeklyStats = buildWeeklyStats(events, weeklyEarnings);

  return {
    timeZone,
    weekRangeLabel: formatWeekRangeLabel(weekStart, timeZone, visiblePeriodDays),
    weekDays,
    hourSlots,
    events,
    timelineByDay,
    nextUpcomingCommitment,
    weeklyStats,
    todayDateKey,
    rangePastNotice,
  };
}
