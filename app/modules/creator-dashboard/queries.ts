import { useQuery } from "@tanstack/react-query";
import { creatorDashboardKeys } from "~/lib/query/query-keys";
import { fetchCreatorActivitySource, fetchCreatorDashboard } from "./service";

export function useCreatorDashboardSummaryQuery() {
  return useQuery({
    queryKey: creatorDashboardKeys.summary(),
    queryFn: () => fetchCreatorDashboard(),
  });
}

export function useCreatorActivitySourceQuery() {
  return useQuery({
    queryKey: creatorDashboardKeys.activity(),
    queryFn: () => fetchCreatorActivitySource(),
  });
}
