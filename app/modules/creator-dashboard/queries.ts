import { useQuery } from "@tanstack/react-query";
import { creatorDashboardKeys } from "~/lib/query/query-keys";
import {
  fetchCreatorActivitySource,
  fetchCreatorDashboard,
  fetchCreatorInvites,
  fetchCreatorUpcomingCampaigns,
} from "./service";

export function useCreatorDashboardSummaryQuery() {
  return useQuery({
    queryKey: creatorDashboardKeys.summary(),
    queryFn: () => fetchCreatorDashboard(),
  });
}

export function useCreatorInvitesQuery() {
  return useQuery({
    queryKey: creatorDashboardKeys.invites(),
    queryFn: () => fetchCreatorInvites(),
  });
}

export function useCreatorUpcomingCampaignsQuery() {
  return useQuery({
    queryKey: creatorDashboardKeys.upcoming(),
    queryFn: () => fetchCreatorUpcomingCampaigns(),
  });
}

export function useCreatorActivitySourceQuery() {
  return useQuery({
    queryKey: creatorDashboardKeys.activity(),
    queryFn: () => fetchCreatorActivitySource(),
  });
}
