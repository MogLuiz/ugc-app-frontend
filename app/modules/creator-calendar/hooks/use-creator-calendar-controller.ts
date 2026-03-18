import { useMemo, useState } from "react";
import {
  DAILY_JOBS,
  DEFAULT_AVAILABILITY_DAYS,
  DESKTOP_EVENTS,
  DESKTOP_TIME_SLOTS,
  DESKTOP_WEEK_DAYS,
  MOBILE_UPCOMING_JOBS,
  MOBILE_WEEK_DAYS,
  TIME_OPTIONS,
} from "../data/calendar-content";
import type { DesktopCalendarView, MobileCalendarView } from "../types";

export function useCreatorCalendarController() {
  const [desktopView, setDesktopView] = useState<DesktopCalendarView>("week");
  const [mobileView, setMobileView] = useState<MobileCalendarView>("weekly");
  const [isDesktopSettingsExpanded, setIsDesktopSettingsExpanded] = useState(false);
  const [isMobileAvailabilityOpen, setIsMobileAvailabilityOpen] = useState(false);
  const [availabilityDays, setAvailabilityDays] = useState(DEFAULT_AVAILABILITY_DAYS);

  const totalWeeklyHours = useMemo(
    () =>
      availabilityDays.reduce((total, day) => {
        if (!day.enabled) return total;

        const startHour = Number(day.start.split(":")[0] ?? 0);
        const endHour = Number(day.end.split(":")[0] ?? 0);
        return total + Math.max(endHour - startHour, 0);
      }, 0),
    [availabilityDays]
  );

  function updateAvailabilityDay(
    dayId: string,
    field: "enabled" | "start" | "end",
    value: boolean | string
  ) {
    setAvailabilityDays((current) =>
      current.map((day) =>
        day.id === dayId
          ? {
              ...day,
              [field]: value,
            }
          : day
      )
    );
  }

  function syncWeekdays() {
    const sourceDay = availabilityDays.find((day) => day.enabled) ?? availabilityDays[0];
    if (!sourceDay) return;

    setAvailabilityDays((current) =>
      current.map((day) =>
        day.enabled
          ? {
              ...day,
              start: sourceDay.start,
              end: sourceDay.end,
            }
          : day
      )
    );
  }

  function saveDesktopSettings() {
    setIsDesktopSettingsExpanded(false);
  }

  function saveMobileAvailability() {
    setIsMobileAvailabilityOpen(false);
  }

  return {
    state: {
      desktopView,
      mobileView,
      isDesktopSettingsExpanded,
      isMobileAvailabilityOpen,
    },
    viewModel: {
      desktopEvents: DESKTOP_EVENTS,
      desktopTimeSlots: DESKTOP_TIME_SLOTS,
      desktopWeekDays: DESKTOP_WEEK_DAYS,
      mobileWeekDays: MOBILE_WEEK_DAYS,
      upcomingJobs: MOBILE_UPCOMING_JOBS,
      dailyJobs: DAILY_JOBS,
      availabilityDays,
      timeOptions: TIME_OPTIONS,
      totalWeeklyHours,
    },
    actions: {
      setDesktopView,
      setMobileView,
      setIsDesktopSettingsExpanded,
      setIsMobileAvailabilityOpen,
      updateAvailabilityDay,
      syncWeekdays,
      saveDesktopSettings,
      saveMobileAvailability,
    },
  };
}
