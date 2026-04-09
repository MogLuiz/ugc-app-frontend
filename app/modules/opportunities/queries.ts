import { useQuery } from "@tanstack/react-query";
import { opportunityKeys } from "~/lib/query/query-keys";
import { getOpportunities, getOpportunityDetail } from "./service";

export function useOpportunitiesQuery(params?: {
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: opportunityKeys.list(params),
    queryFn: () => getOpportunities(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useOpportunityDetailQuery(id?: string) {
  return useQuery({
    queryKey: opportunityKeys.detail(id ?? "none"),
    queryFn: () => getOpportunityDetail(id!),
    enabled: Boolean(id),
  });
}
