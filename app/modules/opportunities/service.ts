import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type {
  OpportunityDetail,
  OpportunityListResponse,
} from "./types";

export async function getOpportunities(params?: {
  page?: number;
  limit?: number;
  token?: string;
}): Promise<OpportunityListResponse> {
  const accessToken = await getAccessToken(params?.token);
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params?.page ?? 1));
  searchParams.set("limit", String(params?.limit ?? 50));

  return httpClient<OpportunityListResponse>(
    `/open-offers/available?${searchParams.toString()}`,
    { token: accessToken }
  );
}

export async function getOpportunityDetail(
  id: string,
  token?: string
): Promise<OpportunityDetail> {
  const accessToken = await getAccessToken(token);
  return httpClient<OpportunityDetail>(`/open-offers/available/${id}`, {
    token: accessToken,
  });
}

export async function applyToOpportunity(
  id: string,
  token?: string
): Promise<void> {
  const accessToken = await getAccessToken(token);
  return httpClient<void>(`/open-offers/available/${id}/apply`, {
    method: "POST",
    token: accessToken,
  });
}
