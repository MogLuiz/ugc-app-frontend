import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { marketplaceKeys } from "~/lib/query/query-keys";
import { getMarketplaceCreators, getMarketplaceServiceTypes } from "./service";

const INFINITE_LIMIT = 16;

type CreatorsFilters = {
  search?: string;
  serviceTypeId?: string;
  minAge?: number;
  maxAge?: number;
  sortBy?: "relevancia" | "preco" | "avaliacao";
};

export function useMarketplaceCreatorsInfiniteQuery(filters: CreatorsFilters) {
  return useInfiniteQuery({
    queryKey: marketplaceKeys.creatorsInfinite(filters),
    queryFn: ({ pageParam }) =>
      getMarketplaceCreators({ page: pageParam, limit: INFINITE_LIMIT, ...filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}

export function useMarketplaceCreatorsQuery(params: {
  page: number;
  limit: number;
  search?: string;
  serviceTypeId?: string;
  minAge?: number;
  maxAge?: number;
  sortBy?: "relevancia" | "preco" | "avaliacao";
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
