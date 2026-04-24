import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";

export type CreatorDashboardApi = {
  averageRating: number | null;
};

export type CreatorActivityApi = {
  contracts: Array<{
    contractRequestId: string;
    status: string;
    updatedAt: string;
    createdAt: string;
    companyName: string;
    campaignTitle: string;
    totalPrice: number;
    startsAt: string;
  }>;
};

export async function fetchCreatorDashboard(token?: string): Promise<CreatorDashboardApi> {
  const accessToken = await getAccessToken(token);
  return httpClient<CreatorDashboardApi>("/creator/dashboard", { token: accessToken });
}

export async function fetchCreatorActivitySource(token?: string): Promise<CreatorActivityApi> {
  const accessToken = await getAccessToken(token);
  return httpClient<CreatorActivityApi>("/creator/activity", { token: accessToken });
}
