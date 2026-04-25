import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  useMarketplaceCreatorsInfiniteQuery,
  useMarketplaceServiceTypesQuery,
} from "../queries";
import type { MarketplaceCreator } from "../types";

const SEARCH_DEBOUNCE_MS = 300;

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
}

export function useMarketplaceController() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [serviceTypeId, setServiceTypeId] = useState("");
  const [sortBy, setSortBy] = useState<"relevancia" | "preco" | "avaliacao">("relevancia");
  const [minAge, setMinAge] = useState<number | undefined>(undefined);
  const [maxAge, setMaxAge] = useState<number | undefined>(undefined);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      // functional update lets us compare prev vs next without a dep on debouncedSearch
      setDebouncedSearch((prev) => {
        const next = search.trim();
        if (prev !== next) scrollToTop();
        return next;
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const creatorsQuery = useMarketplaceCreatorsInfiniteQuery({
    search: debouncedSearch || undefined,
    serviceTypeId: serviceTypeId || undefined,
    sortBy,
    minAge,
    maxAge,
  });
  const serviceTypesQuery = useMarketplaceServiceTypesQuery();

  const creators = useMemo(() => {
    const map = new Map<string, MarketplaceCreator>();
    creatorsQuery.data?.pages.forEach((page) => {
      page.items.forEach((creator) => map.set(creator.id, creator));
    });
    return Array.from(map.values());
  }, [creatorsQuery.data]);

  const totalCreators = creatorsQuery.data?.pages[0]?.pagination.total ?? 0;

  const errorMessage = useMemo(() => {
    const error = creatorsQuery.error ?? serviceTypesQuery.error;
    if (!error) return null;
    if (error instanceof Error) return error.message;
    return "Não foi possível carregar o marketplace.";
  }, [creatorsQuery.error, serviceTypesQuery.error]);

  const isInitialLoading =
    (creatorsQuery.isLoading && !creatorsQuery.data) ||
    (serviceTypesQuery.isLoading && !serviceTypesQuery.data);

  return {
    viewModel: {
      search,
      serviceTypeId,
      sortBy,
      minAge,
      maxAge,
      creators,
      totalCreators,
      serviceTypes: serviceTypesQuery.data ?? [],
      isInitialLoading,
      isFetchingNextPage: creatorsQuery.isFetchingNextPage,
      hasNextPage: creatorsQuery.hasNextPage,
      errorMessage,
    },
    actions: {
      setSearch,
      setServiceTypeId: (value: string) => {
        setServiceTypeId(value);
        scrollToTop();
      },
      setSortBy: (value: "relevancia" | "preco" | "avaliacao") => {
        setSortBy(value);
        scrollToTop();
      },
      setMinAge: (value: number | undefined) => {
        setMinAge(value);
        scrollToTop();
      },
      setMaxAge: (value: number | undefined) => {
        setMaxAge(value);
        scrollToTop();
      },
      fetchNextPage: () => void creatorsQuery.fetchNextPage(),
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
