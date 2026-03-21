import type { CreatorProfile } from "../types";
import type { AvailabilityDayOfWeek } from "../types";

export type HireCalendarDay = {
  isoDate: string;
  dayLabel: string;
  isCurrentMonth: boolean;
  isAvailable: boolean;
  isPast: boolean;
  isSelected: boolean;
};

function toMinutes(timeText: string) {
  const [hour = "0", minute = "0"] = timeText.split(":");
  return Number.parseInt(hour, 10) * 60 + Number.parseInt(minute, 10);
}

function buildDefaultSlots(start: string, end: string, slotDurationMinutes: number) {
  const slots: string[] = [];
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  const duration = Math.max(slotDurationMinutes, 15);

  for (let current = startMinutes; current < endMinutes; current += duration) {
    const hour = String(Math.floor(current / 60)).padStart(2, "0");
    const minute = String(current % 60).padStart(2, "0");
    slots.push(`${hour}:${minute}`);
  }

  return slots;
}

function isSlotInsideWorkingHours(time: string, start: string, end: string) {
  const minutes = toMinutes(time);
  return minutes >= toMinutes(start) && minutes < toMinutes(end);
}

const WEEK_DAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

const JS_DAY_TO_AVAILABILITY: Record<number, AvailabilityDayOfWeek> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

function getMonthStart(referenceDate: Date) {
  return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
}

function formatIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseIsoDate(isoDate: string) {
  const [year = "0", month = "1", day = "1"] = isoDate.split("-");
  return new Date(
    Number.parseInt(year, 10),
    Number.parseInt(month, 10) - 1,
    Number.parseInt(day, 10),
  );
}

function isBeforeToday(date: Date) {
  const today = new Date();
  const normalizedToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return date.getTime() < normalizedToday.getTime();
}

function getAvailabilityRule(profile: CreatorProfile, date: Date) {
  const dayOfWeek = JS_DAY_TO_AVAILABILITY[date.getDay()];
  return (
    profile.availabilityRules.find((rule) => rule.dayOfWeek === dayOfWeek) ?? null
  );
}

export function getHireMonthLabel(referenceDate = new Date()) {
  return getMonthStart(referenceDate).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

export function addMonths(referenceDate: Date, amount: number) {
  return new Date(referenceDate.getFullYear(), referenceDate.getMonth() + amount, 1);
}

export function canNavigateToPreviousMonth(referenceDate: Date) {
  const currentMonthStart = getMonthStart(new Date());
  return getMonthStart(referenceDate).getTime() > currentMonthStart.getTime();
}

export function getCalendarWeekDayLabels() {
  return WEEK_DAY_LABELS;
}

export function buildHireMonthDays(
  profile: CreatorProfile,
  referenceDate: Date,
  selectedIsoDate: string | null,
) {
  const monthStart = getMonthStart(referenceDate);
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstWeekDay = monthStart.getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const days: HireCalendarDay[] = [];

  for (let offset = firstWeekDay; offset > 0; offset -= 1) {
    const date = new Date(year, month, 1 - offset);
    days.push({
      isoDate: formatIsoDate(date),
      dayLabel: String(date.getDate()),
      isCurrentMonth: false,
      isAvailable: false,
      isPast: true,
      isSelected: false,
    });
  }

  for (let day = 1; day <= totalDaysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const isoDate = formatIsoDate(date);
    const isPast = isBeforeToday(date);
    const hasRule = Boolean(getAvailabilityRule(profile, date));

    days.push({
      isoDate,
      dayLabel: String(day),
      isCurrentMonth: true,
      isAvailable: hasRule && !isPast,
      isPast,
      isSelected: selectedIsoDate === isoDate,
    });
  }

  while (days.length % 7 !== 0) {
    const trailingOffset = days.length - (firstWeekDay + totalDaysInMonth) + 1;
    const date = new Date(year, month + 1, trailingOffset);
    days.push({
      isoDate: formatIsoDate(date),
      dayLabel: String(date.getDate()),
      isCurrentMonth: false,
      isAvailable: false,
      isPast: false,
      isSelected: false,
    });
  }

  return days;
}

export function getFirstAvailableDateIso(
  profile: CreatorProfile,
  referenceDate: Date,
) {
  const monthDays = buildHireMonthDays(profile, referenceDate, null);
  return monthDays.find((day) => day.isCurrentMonth && day.isAvailable)?.isoDate ?? null;
}

export function buildHireTimeSlots(
  profile: CreatorProfile,
  selectedAvailableDate: string | null,
) {
  if (!selectedAvailableDate) {
    return [];
  }

  const selectedDate = parseIsoDate(selectedAvailableDate);
  const rule = getAvailabilityRule(profile, selectedDate);
  if (!rule || isBeforeToday(selectedDate)) {
    return [];
  }

  const sourceSlots = buildDefaultSlots(
    rule.startTime,
    rule.endTime,
    profile.workingHours.slotDurationMinutes,
  );

  return sourceSlots.filter((slot) =>
    isSlotInsideWorkingHours(
      slot,
      rule.startTime,
      rule.endTime,
    ),
  );
}
