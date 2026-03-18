import { useMemo, useState } from "react";
import { MOCK_MARKETPLACE_CREATORS } from "../data/mock-marketplace-creators";
import type {
  MarketplaceCreator,
  MarketplaceFilterNiche,
  MarketplaceSortBy,
} from "../types";

const ITEMS_PER_PAGE = 8;

export function useMarketplaceController() {
  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState<MarketplaceFilterNiche>("todos");
  const [sortBy, setSortBy] = useState<MarketplaceSortBy>("relevancia");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedCreators = useMemo(() => {
    let result = [...MOCK_MARKETPLACE_CREATORS];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.niche.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (nicheFilter !== "todos") {
      result = result.filter((c) =>
        c.niche.toLowerCase().includes(nicheFilter.toLowerCase())
      );
    }

    if (sortBy === "avaliacao") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "preco") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "proximidade") {
      // Por ora mantém ordem; futuramente ordenar por distância do usuário
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [search, nicheFilter, sortBy]);

  const paginatedCreators = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedCreators.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedCreators, currentPage]);

  const totalPages = Math.ceil(
    filteredAndSortedCreators.length / ITEMS_PER_PAGE
  );

  return {
    viewModel: {
      search,
      nicheFilter,
      sortBy,
      creators: paginatedCreators,
      currentPage,
      totalPages,
      totalCreators: filteredAndSortedCreators.length,
    },
    actions: {
      setSearch,
      setNicheFilter,
      setSortBy,
      setCurrentPage,
      onHire: (_creator: MarketplaceCreator) => {
        // TODO: integrar fluxo de contratação
      },
    },
  };
}
