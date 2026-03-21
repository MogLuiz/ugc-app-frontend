import type { CreatorProfile } from "../types";

export type HireDayOption = {
  value: string;
  weekdayLabel: string;
  dayLabel: string;
  fullLabel: string;
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

export function getHireMonthLabel(referenceDate = new Date()) {
  return referenceDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

export function buildHireDayOptions(
  availabilityDays: string[],
  referenceDate = new Date(),
): HireDayOption[] {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  return availabilityDays
    .map((dayValue) => Number.parseInt(dayValue, 10))
    .filter((dayNumber) => Number.isInteger(dayNumber) && dayNumber > 0)
    .map((dayNumber) => {
      const date = new Date(year, month, dayNumber);

      return {
        value: String(dayNumber),
        weekdayLabel: date
          .toLocaleDateString("pt-BR", { weekday: "short" })
          .replace(".", "")
          .slice(0, 3)
          .toUpperCase(),
        dayLabel: String(dayNumber).padStart(2, "0"),
        fullLabel: date.toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "2-digit",
          month: "long",
        }),
      };
    });
}

export function buildHireTimeSlots(
  profile: CreatorProfile,
  selectedAvailableDay: string | null,
) {
  if (!selectedAvailableDay) {
    return [];
  }

  const configuredSlots = profile.availabilitySlotsByDay?.[selectedAvailableDay];
  const sourceSlots =
    configuredSlots && configuredSlots.length > 0
      ? configuredSlots
      : buildDefaultSlots(
          profile.workingHours.start,
          profile.workingHours.end,
          profile.workingHours.slotDurationMinutes,
        );

  return sourceSlots.filter((slot) =>
    isSlotInsideWorkingHours(
      slot,
      profile.workingHours.start,
      profile.workingHours.end,
    ),
  );
}
