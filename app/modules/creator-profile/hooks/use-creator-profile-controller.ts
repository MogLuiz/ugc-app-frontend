import { useEffect, useMemo, useState } from "react";
import type { CreatorProfile } from "../types";

function toMinutes(hourText: string) {
  const [hour = "0", minute = "0"] = hourText.split(":");
  return Number.parseInt(hour, 10) * 60 + Number.parseInt(minute, 10);
}

function isSlotInsideWorkingHours(
  time: string,
  start: string,
  end: string
) {
  const minutes = toMinutes(time);
  return minutes >= toMinutes(start) && minutes < toMinutes(end);
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

export function useCreatorProfileController(profile: CreatorProfile) {
  const [selectedServiceId, setSelectedServiceId] = useState(
    profile.services[0]?.id ?? ""
  );
  const [selectedAvailableDay, setSelectedAvailableDay] = useState(
    profile.availability[0] ?? null
  );

  useEffect(() => {
    setSelectedAvailableDay(profile.availability[0] ?? null);
  }, [profile.id, profile.availability]);

  const selectedService =
    profile.services.find((service) => service.id === selectedServiceId) ??
    profile.services[0] ??
    null;

  const availabilityTimeSlots = useMemo(() => {
    if (!selectedAvailableDay) {
      return [];
    }

    const workingHours = profile.workingHours;
    const configuredSlots = profile.availabilitySlotsByDay?.[selectedAvailableDay];
    const sourceSlots =
      configuredSlots && configuredSlots.length > 0
        ? configuredSlots
        : buildDefaultSlots(
            workingHours.start,
            workingHours.end,
            workingHours.slotDurationMinutes
          );

    return sourceSlots.filter((slot) =>
      isSlotInsideWorkingHours(slot, workingHours.start, workingHours.end)
    );
  }, [
    profile.availabilitySlotsByDay,
    profile.workingHours,
    selectedAvailableDay,
  ]);

  return {
    availabilityDays: profile.availability,
    availabilityTimeSlots,
    profile,
    selectedService,
    selectedAvailableDay,
    selectedServiceId,
    setSelectedAvailableDay,
    setSelectedServiceId,
    workingHours: profile.workingHours,
  };
}
