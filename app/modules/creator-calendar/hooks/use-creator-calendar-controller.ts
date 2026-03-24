import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "~/components/ui/toast";
import { HttpError } from "~/lib/http/errors";
import { buildCalendarViewModel } from "../lib/calendar-view-model";
import { addDays, startOfDay, toCalendarRequestRange } from "../lib/calendar-date";
import {
  useAcceptCreatorBookingMutation,
  useCreatorCalendarQuery,
} from "../queries";
import type { UiCalendarEvent } from "../types";
import {
  CALENDAR_VISIBLE_DAYS_DESKTOP,
  CALENDAR_VISIBLE_DAYS_MOBILE,
  useCalendarLayoutIsMobile,
} from "./use-calendar-layout-is-mobile";

export function useCreatorCalendarController() {
  const navigate = useNavigate();
  const isMobileLayout = useCalendarLayoutIsMobile();
  const visiblePeriodDays = isMobileLayout
    ? CALENDAR_VISIBLE_DAYS_MOBILE
    : CALENDAR_VISIBLE_DAYS_DESKTOP;

  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfDay(new Date()),
  );
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isDesktopPanelOpen, setIsDesktopPanelOpen] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const calendarRange = useMemo(
    () =>
      toCalendarRequestRange(currentWeekStart, {
        now: new Date(),
        visiblePeriodDays,
        upcomingHorizonDays: isMobileLayout
          ? CALENDAR_VISIBLE_DAYS_MOBILE
          : 45,
      }),
    [currentWeekStart, isMobileLayout, visiblePeriodDays],
  );

  const calendarQuery = useCreatorCalendarQuery({
    start: calendarRange.startIso,
    end: calendarRange.endIso,
  });

  const acceptMutation = useAcceptCreatorBookingMutation();

  const viewModel = useMemo(
    () =>
      buildCalendarViewModel({
        response: calendarQuery.data,
        weekStart: currentWeekStart,
        selectedDate,
        visiblePeriodDays,
      }),
    [
      calendarQuery.data,
      calendarQuery.dataUpdatedAt,
      currentWeekStart,
      selectedDate,
      visiblePeriodDays,
    ],
  );

  const selectedEvent = useMemo((): UiCalendarEvent | null => {
    if (!selectedEventId || !viewModel) return null;
    return (
      viewModel.events.find((e) => e.id === selectedEventId) ??
      (viewModel.nextUpcomingCommitment?.id === selectedEventId
        ? viewModel.nextUpcomingCommitment
        : null)
    );
  }, [selectedEventId, viewModel]);

  useEffect(() => {
    if (!selectedEventId || !viewModel) return;
    const exists =
      viewModel.events.some((e) => e.id === selectedEventId) ||
      viewModel.nextUpcomingCommitment?.id === selectedEventId;
    if (!exists) {
      toast.info("Evento nao disponivel neste periodo.");
      setSelectedEventId(null);
      setIsDesktopPanelOpen(false);
      setIsMobileSheetOpen(false);
    }
  }, [selectedEventId, viewModel]);

  const errorMessage = getQueryErrorMessage(calendarQuery.error ?? null);

  function goToPreviousWeek() {
    setCurrentWeekStart((current) => addDays(current, -visiblePeriodDays));
    setSelectedDate((current) => addDays(current, -visiblePeriodDays));
  }

  function goToNextWeek() {
    setCurrentWeekStart((current) => addDays(current, visiblePeriodDays));
    setSelectedDate((current) => addDays(current, visiblePeriodDays));
  }

  function goToToday() {
    const today = new Date();
    setCurrentWeekStart(startOfDay(today));
    setSelectedDate(today);
  }

  function selectWeekDay(isoDate: string) {
    setSelectedDate(new Date(`${isoDate}T12:00:00.000Z`));
  }

  function openEventDetails(eventId: string, surface: "desktop" | "mobile") {
    setSelectedEventId(eventId);
    if (surface === "desktop") {
      setIsDesktopPanelOpen(true);
    } else {
      setIsMobileSheetOpen(true);
    }
  }

  function closeEventDetails() {
    setIsDesktopPanelOpen(false);
    setIsMobileSheetOpen(false);
    setSelectedEventId(null);
  }

  async function acceptPendingBooking(bookingId: string) {
    try {
      await acceptMutation.mutateAsync(bookingId);
      toast.success("Compromisso confirmado.");
    } catch (error) {
      toast.error(getMutationErrorMessage(error));
    }
  }

  function openChatForContract(contractRequestId: string) {
    void navigate(`/chat?contractRequestId=${contractRequestId}`);
  }

  async function retry() {
    await calendarQuery.refetch();
  }

  return {
    state: {
      isLoading: calendarQuery.isLoading,
      isFetching: calendarQuery.isFetching,
      errorMessage,
      currentWeekStart,
      selectedDate,
      selectedEventId,
      isDesktopPanelOpen,
      isMobileSheetOpen,
      isAccepting: acceptMutation.isPending,
    },
    viewModel,
    selectedEvent,
    actions: {
      goToPreviousWeek,
      goToNextWeek,
      goToToday,
      selectWeekDay,
      openEventDetails,
      closeEventDetails,
      acceptPendingBooking,
      openChatForContract,
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

  return "Nao foi possivel confirmar o compromisso.";
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
