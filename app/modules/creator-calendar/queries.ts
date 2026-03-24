import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { creatorCalendarKeys } from "~/lib/query/query-keys";
import {
  acceptCreatorBooking,
  getCreatorAvailability,
  getCreatorCalendar,
  replaceCreatorAvailability,
} from "./service";
import type { UpdateCreatorAvailabilityInput } from "./types";

export function useCreatorAvailabilityQuery() {
  return useQuery({
    queryKey: creatorCalendarKeys.availability(),
    queryFn: () => getCreatorAvailability(),
  });
}

export function useCreatorCalendarQuery(params: { start: string; end: string }) {
  return useQuery({
    queryKey: creatorCalendarKeys.calendar(params.start, params.end),
    queryFn: () => getCreatorCalendar(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useAcceptCreatorBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => acceptCreatorBooking(bookingId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: creatorCalendarKeys.all });
    },
  });
}

export function useReplaceCreatorAvailabilityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCreatorAvailabilityInput) =>
      replaceCreatorAvailability(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: creatorCalendarKeys.availability(),
      });
    },
  });
}
