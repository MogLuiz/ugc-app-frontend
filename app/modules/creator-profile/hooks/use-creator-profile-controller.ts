import { useMemo, useState } from "react";
import type { CreatorProfile } from "../types";

const WEEK_DAYS = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];
const WEEK_DATES = ["15", "16", "17", "18", "19", "20", "21"];

export function useCreatorProfileController(profile: CreatorProfile) {
  const [selectedServiceId, setSelectedServiceId] = useState(
    profile.services[0]?.id ?? ""
  );

  const selectedService =
    profile.services.find((service) => service.id === selectedServiceId) ??
    profile.services[0] ??
    null;

  const availability = useMemo(
    () =>
      WEEK_DAYS.map((day, index) => ({
        day,
        date: WEEK_DATES[index] ?? "",
        available: profile.availability.includes(WEEK_DATES[index] ?? ""),
      })),
    [profile.availability]
  );

  return {
    availability,
    profile,
    selectedService,
    selectedServiceId,
    setSelectedServiceId,
  };
}
