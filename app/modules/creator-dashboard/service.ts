import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";

export type CreatorDashboardApi = {
  confirmedCampaigns: number;
  pendingInvites: number;
  monthlyEarnings: number;
  averageRating: number | null;
};

export type CreatorInviteApi = {
  id: string;
  companyName: string;
  campaignTitle: string;
  proposedDate: string;
  payment: number;
  status: "PENDING";
  distanceKm?: number | null;
  expiresAt?: string | null;
};

export type CreatorUpcomingApi = {
  id: string;
  campaignName: string;
  companyName: string;
  date: string;
  time: string;
  location: string;
  duration: number;
  status: "Confirmada" | "Pendente" | "Concluída";
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

export async function fetchCreatorInvites(token?: string): Promise<CreatorInviteApi[]> {
  const accessToken = await getAccessToken(token);
  return httpClient<CreatorInviteApi[]>("/creator/invites", { token: accessToken });
}

export async function fetchCreatorUpcomingCampaigns(
  token?: string
): Promise<CreatorUpcomingApi[]> {
  const accessToken = await getAccessToken(token);
  return httpClient<CreatorUpcomingApi[]>("/creator/upcoming-campaigns", {
    token: accessToken,
  });
}

export async function fetchCreatorActivitySource(token?: string): Promise<CreatorActivityApi> {
  const accessToken = await getAccessToken(token);
  return httpClient<CreatorActivityApi>("/creator/activity", { token: accessToken });
}
