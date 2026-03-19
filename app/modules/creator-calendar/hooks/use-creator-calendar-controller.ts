import { useEffect, useMemo, useState } from "react";
import { toast } from "~/components/ui/toast";
import { HttpError } from "~/lib/http/errors";
import { useCreatorAvailabilityQuery, useCreatorCalendarQuery, useReplaceCreatorAvailabilityMutation } from "../queries";
import {
  calculateTotalWeeklyMinutes,
  getMonthTitle,
  mapAvailabilityDays,
  mapDailyJobs,
  mapDesktopEvents,
  mapDesktopTimeSlots,
  mapNextSession,
  mapUpcomingJobs,
  mapWeekDays,
} from "../lib/calendar-mappers";
import {
  addDays,
  buildHalfHourOptions,
  formatWeekdayLong,
  parseCalendarDate,
  startOfWeek,
  toCalendarRequestRange,
  formatWeeklyHoursLabel,
} from "../lib/calendar-date";
import type { AvailabilityDay, DesktopCalendarView, MobileCalendarView } from "../types";

export function useCreatorCalendarController() {
  const [desktopView, setDesktopView] = useState<DesktopCalendarView>("week");
  const [mobileView, setMobileView] = useState<MobileCalendarView>("weekly");
  const [isDesktopSettingsExpanded, setIsDesktopSettingsExpanded] = useState(false);
  const [isMobileAvailabilityOpen, setIsMobileAvailabilityOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [availabilityDays, setAvailabilityDays] = useState<AvailabilityDay[]>(() =>
    mapAvailabilityDays(undefined)
  );

  const availabilityQuery = useCreatorAvailabilityQuery();
  const serverAvailabilityDays = useMemo(
    () => mapAvailabilityDays(availabilityQuery.data),
    [availabilityQuery.data]
  );
  const calendarRange = useMemo(
    () => toCalendarRequestRange(currentWeekStart),
    [currentWeekStart]
  );
  const calendarQuery = useCreatorCalendarQuery({
    start: calendarRange.startIso,
    end: calendarRange.endIso,
  });
  const replaceAvailabilityMutation = useReplaceCreatorAvailabilityMutation();
  const [isAvailabilityDirty, setIsAvailabilityDirty] = useState(false);

  useEffect(() => {
    if (!availabilityQuery.data || isAvailabilityDirty) return;
    setAvailabilityDays(serverAvailabilityDays);
  }, [availabilityQuery.data, isAvailabilityDirty, serverAvailabilityDays]);

  const calendarBookings = calendarQuery.data?.bookings ?? [];
  const desktopWeekDays = useMemo(
    () => mapWeekDays(currentWeekStart, selectedDate),
    [currentWeekStart, selectedDate]
  );
  const desktopEvents = useMemo(
    () => mapDesktopEvents(calendarBookings, currentWeekStart),
    [calendarBookings, currentWeekStart]
  );
  const desktopTimeSlots = useMemo(
    () => mapDesktopTimeSlots(availabilityDays, calendarBookings),
    [availabilityDays, calendarBookings]
  );
  const upcomingJobs = useMemo(
    () => mapUpcomingJobs(calendarBookings),
    [calendarBookings]
  );
  const dailyJobs = useMemo(
    () => mapDailyJobs(calendarBookings, selectedDate),
    [calendarBookings, selectedDate]
  );
  const nextSession = useMemo(
    () => mapNextSession(calendarBookings),
    [calendarBookings]
  );
  const totalWeeklyHours = useMemo(
    () => formatWeeklyHoursLabel(calculateTotalWeeklyMinutes(availabilityDays)),
    [availabilityDays]
  );
  const errorMessage = getQueryErrorMessage(
    availabilityQuery.error ?? calendarQuery.error ?? null
  );

  function updateAvailabilityDay(
    dayId: string,
    field: "enabled" | "start" | "end",
    value: boolean | string
  ) {
    setIsAvailabilityDirty(true);
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

    setIsAvailabilityDirty(true);
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

  async function saveDesktopSettings() {
    await saveAvailabilitySettings(() => setIsDesktopSettingsExpanded(false));
  }

  async function saveMobileAvailability() {
    await saveAvailabilitySettings(() => setIsMobileAvailabilityOpen(false));
  }

  function openDesktopSettings() {
    setAvailabilityDays(serverAvailabilityDays);
    setIsAvailabilityDirty(false);
    setIsDesktopSettingsExpanded(true);
  }

  function cancelDesktopSettings() {
    resetAvailabilityDraft();
    setIsDesktopSettingsExpanded(false);
  }

  function openMobileAvailability() {
    setAvailabilityDays(serverAvailabilityDays);
    setIsAvailabilityDirty(false);
    setIsMobileAvailabilityOpen(true);
  }

  function cancelMobileAvailability() {
    resetAvailabilityDraft();
    setIsMobileAvailabilityOpen(false);
  }

  function goToPreviousWeek() {
    setCurrentWeekStart((current) => addDays(current, -7));
    setSelectedDate((current) => addDays(current, -7));
  }

  function goToNextWeek() {
    setCurrentWeekStart((current) => addDays(current, 7));
    setSelectedDate((current) => addDays(current, 7));
  }

  function goToToday() {
    const today = new Date();
    setCurrentWeekStart(startOfWeek(today));
    setSelectedDate(today);
  }

  function selectDate(isoDate: string) {
    setSelectedDate(parseCalendarDate(isoDate));
  }

  function openMobileDailyView(isoDate: string) {
    selectDate(isoDate);
    setMobileView("daily");
  }

  async function retry() {
    await Promise.all([availabilityQuery.refetch(), calendarQuery.refetch()]);
  }

  async function saveAvailabilitySettings(onSuccess: () => void) {
    try {
      const response = await replaceAvailabilityMutation.mutateAsync({
        days: availabilityDays.map((day) => ({
          dayOfWeek: day.dayOfWeek,
          isActive: day.enabled,
          startTime: day.enabled ? day.start : null,
          endTime: day.enabled ? day.end : null,
        })),
      });
      setAvailabilityDays(mapAvailabilityDays(response));
      setIsAvailabilityDirty(false);
      toast.success("Disponibilidade atualizada com sucesso.");
      onSuccess();
    } catch (error) {
      toast.error(getMutationErrorMessage(error));
    }
  }

  function resetAvailabilityDraft() {
    setAvailabilityDays(serverAvailabilityDays);
    setIsAvailabilityDirty(false);
  }

  return {
    state: {
      desktopView,
      mobileView,
      isDesktopSettingsExpanded,
      isMobileAvailabilityOpen,
      currentWeekStart,
      selectedDate,
      isLoading: availabilityQuery.isLoading || calendarQuery.isLoading,
      isSavingAvailability: replaceAvailabilityMutation.isPending,
      errorMessage,
    },
    viewModel: {
      desktopEvents,
      desktopTimeSlots,
      desktopWeekDays,
      mobileWeekDays: desktopWeekDays,
      upcomingJobs,
      dailyJobs,
      availabilityDays,
      timeOptions: buildHalfHourOptions(),
      totalWeeklyHours,
      monthTitle: getMonthTitle(currentWeekStart),
      selectedDateLabel: formatWeekdayLong(selectedDate),
      nextSession,
      hasCalendarBookings: calendarBookings.length > 0,
    },
    actions: {
      setDesktopView,
      setMobileView,
      setIsDesktopSettingsExpanded,
      setIsMobileAvailabilityOpen,
      openDesktopSettings,
      cancelDesktopSettings,
      openMobileAvailability,
      cancelMobileAvailability,
      goToPreviousWeek,
      goToNextWeek,
      goToToday,
      selectDate,
      openMobileDailyView,
      updateAvailabilityDay,
      syncWeekdays,
      saveDesktopSettings,
      saveMobileAvailability,
      retry,
    },
  };
}

function getMutationErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel salvar a disponibilidade.";
}

function getQueryErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (error instanceof HttpError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel carregar a agenda.";
}
