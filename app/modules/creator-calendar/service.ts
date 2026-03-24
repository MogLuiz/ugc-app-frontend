import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type {
  CreatorAvailabilityResponse,
  CreatorCalendarResponse,
  UpdateCreatorAvailabilityInput,
} from "./types";

export async function getCreatorAvailability(
  token?: string,
): Promise<CreatorAvailabilityResponse> {
  const accessToken = await getAccessToken(token);

  return httpClient<CreatorAvailabilityResponse>("/creator/availability", {
    token: accessToken,
  });
}

export async function replaceCreatorAvailability(
  payload: UpdateCreatorAvailabilityInput,
  token?: string,
): Promise<CreatorAvailabilityResponse> {
  const accessToken = await getAccessToken(token);

  return httpClient<CreatorAvailabilityResponse>("/creator/availability", {
    method: "PUT",
    body: payload,
    token: accessToken,
  });
}

export async function getCreatorCalendar(params: {
  start: string;
  end: string;
  token?: string;
}): Promise<CreatorCalendarResponse> {
  const accessToken = await getAccessToken(params.token);
  const searchParams = new URLSearchParams({
    start: params.start,
    end: params.end,
  });

  return httpClient<CreatorCalendarResponse>(
    `/creator/calendar?${searchParams.toString()}`,
    {
      token: accessToken,
    },
  );
}

export async function acceptCreatorBooking(
  bookingId: string,
  token?: string,
): Promise<void> {
  const accessToken = await getAccessToken(token);

  await httpClient<unknown>(`/bookings/${bookingId}/accept`, {
    method: "POST",
    token: accessToken,
  });
}
