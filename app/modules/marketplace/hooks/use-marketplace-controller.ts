import { useEffect, useMemo, useState } from "react";
import {
  useMarketplaceCreatorsQuery,
  useMarketplaceServiceTypesQuery,
} from "../queries";
import type { MarketplaceCreator, MarketplaceSortBy } from "../types";

const ITEMS_PER_PAGE = 8;
const SEARCH_DEBOUNCE_MS = 300;

export function useMarketplaceController() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [sortBy, setSortBy] = useState<MarketplaceSortBy>("relevancia");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const creatorsQuery = useMarketplaceCreatorsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch || undefined,
    serviceTypeId: serviceTypeId || undefined,
    sortBy,
  });
  const serviceTypesQuery = useMarketplaceServiceTypesQuery();

  const creators = creatorsQuery.data?.items ?? [];
  const pagination = creatorsQuery.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const totalCreators = pagination?.total ?? 0;

  const errorMessage = useMemo(() => {
    const error = creatorsQuery.error ?? serviceTypesQuery.error;
    if (!error) return null;
    if (error instanceof Error) return error.message;
    return "Nao foi possivel carregar o marketplace.";
  }, [creatorsQuery.error, serviceTypesQuery.error]);

  const handleServiceTypeChange = (value: string) => {
    setServiceTypeId(value);
    setCurrentPage(1);
  };

  const handleSortByChange = (value: MarketplaceSortBy) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const isInitialLoading =
    (creatorsQuery.isLoading && !creatorsQuery.data) ||
    (serviceTypesQuery.isLoading && !serviceTypesQuery.data);
  const isRefreshing =
    creatorsQuery.isFetching || serviceTypesQuery.isFetching;

  const hasActiveFilters = Boolean(
    debouncedSearch || serviceTypeId || sortBy !== "relevancia"
  );

  return {
    viewModel: {
      search,
      serviceTypeId,
      sortBy,
      creators,
      currentPage,
      totalPages,
      totalCreators,
      serviceTypes: serviceTypesQuery.data ?? [],
      isInitialLoading,
      isRefreshing,
      hasActiveFilters,
      errorMessage,
    },
    actions: {
      setSearch,
      setServiceTypeId: handleServiceTypeChange,
      setSortBy: handleSortByChange,
      setCurrentPage,
      onHire: (_creator: MarketplaceCreator) => {
        // TODO: integrar fluxo de contratação
      },
    },
  };
}
