import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  useMarketplaceCreatorsQuery,
  useMarketplaceServiceTypesQuery,
} from "../queries";
import type { MarketplaceCreator } from "../types";

const ITEMS_PER_PAGE = 8;
const SEARCH_DEBOUNCE_MS = 300;

export function useMarketplaceController() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"relevancia" | "preco" | "avaliacao">("relevancia");
  const [minAge, setMinAge] = useState<number | undefined>(undefined);
  const [maxAge, setMaxAge] = useState<number | undefined>(undefined);

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
    minAge,
    maxAge,
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

  const isInitialLoading =
    (creatorsQuery.isLoading && !creatorsQuery.data) ||
    (serviceTypesQuery.isLoading && !serviceTypesQuery.data);
  const isRefreshing =
    creatorsQuery.isFetching || serviceTypesQuery.isFetching;

  const hasActiveFilters = Boolean(debouncedSearch || serviceTypeId || minAge || maxAge);

  const handleSortByChange = (value: "relevancia" | "preco" | "avaliacao") => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleMinAgeChange = (value: number | undefined) => {
    setMinAge(value);
    setCurrentPage(1);
  };

  const handleMaxAgeChange = (value: number | undefined) => {
    setMaxAge(value);
    setCurrentPage(1);
  };

  return {
    viewModel: {
      search,
      serviceTypeId,
      sortBy,
      minAge,
      maxAge,
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
      setMinAge: handleMinAgeChange,
      setMaxAge: handleMaxAgeChange,
      setCurrentPage,
      onHire: (creator: MarketplaceCreator) => {
        void navigate(`/criador/${creator.id}`, {
          state: {
            marketplaceCreator: creator,
            openHirePanel: true,
          },
        });
      },
    },
  };
}
