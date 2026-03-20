import { useQuery } from "@tanstack/react-query";
import { marketplaceKeys } from "~/lib/query/query-keys";
import { getMarketplaceCreators, getMarketplaceServiceTypes } from "./service";
import type { MarketplaceSortBy } from "./types";

export function useMarketplaceCreatorsQuery(params: {
  page: number;
  limit: number;
  search?: string;
  serviceTypeId?: string;
  sortBy: MarketplaceSortBy;
}) {
  return useQuery({
    queryKey: marketplaceKeys.creators(params),
    queryFn: () => getMarketplaceCreators(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useMarketplaceServiceTypesQuery() {
  return useQuery({
    queryKey: marketplaceKeys.serviceTypes(),
    queryFn: () => getMarketplaceServiceTypes(),
  });
}
