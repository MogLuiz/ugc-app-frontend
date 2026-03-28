import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type {
  ActivatePartnerResponse,
  CommissionsListResponse,
  PartnerProfileResponse,
  ReferralsDashboardResponse,
  ReferralsListResponse,
} from "./types";

export const LIST_LIMIT = 10;

export async function fetchPartnerProfile(
  token?: string
): Promise<PartnerProfileResponse> {
  const accessToken = await getAccessToken(token);
  return httpClient<PartnerProfileResponse>("/partners/me", {
    token: accessToken,
  });
}

export async function activatePartner(
  token?: string
): Promise<ActivatePartnerResponse> {
  const accessToken = await getAccessToken(token);
  return httpClient<ActivatePartnerResponse>("/partners/me/activate", {
    method: "POST",
    token: accessToken,
  });
}

export async function fetchReferralsDashboard(
  token?: string
): Promise<ReferralsDashboardResponse> {
  const accessToken = await getAccessToken(token);
  return httpClient<ReferralsDashboardResponse>("/partners/me/dashboard", {
    token: accessToken,
  });
}

export async function fetchReferralsList(
  token?: string,
  page = 1
): Promise<ReferralsListResponse> {
  const accessToken = await getAccessToken(token);
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(LIST_LIMIT),
  });
  return httpClient<ReferralsListResponse>(`/partners/me/referrals?${qs}`, {
    token: accessToken,
  });
}

export async function fetchCommissionsList(
  token?: string,
  page = 1
): Promise<CommissionsListResponse> {
  const accessToken = await getAccessToken(token);
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(LIST_LIMIT),
  });
  return httpClient<CommissionsListResponse>(
    `/partners/me/commissions?${qs}`,
    { token: accessToken }
  );
}
