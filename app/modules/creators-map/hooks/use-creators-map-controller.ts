import { useMemo, useState } from "react";
import { MOCK_CREATORS_BH } from "../data/mock-creators";
import type { CreatorCategory } from "../types";

export type SortTab = "relevantes" | "novidades";
export type CategoryFilter = "all" | CreatorCategory;

export function useCreatorsMapController() {
  const [search, setSearch] = useState("");
  const [activeSortTab, setActiveSortTab] = useState<SortTab>("relevantes");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>(
    MOCK_CREATORS_BH[0]?.id ?? ""
  );

  const creators = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const byCategory = MOCK_CREATORS_BH.filter((creator) => {
      if (activeCategory === "all") {
        return true;
      }

      return creator.category === activeCategory;
    });

    const bySearch = byCategory.filter((creator) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        creator.name.toLowerCase().includes(normalizedSearch) ||
        creator.specialty.toLowerCase().includes(normalizedSearch) ||
        creator.region.toLowerCase().includes(normalizedSearch)
      );
    });

    return [...bySearch].sort((a, b) =>
      activeSortTab === "relevantes" ? b.rating - a.rating : b.jobs - a.jobs
    );
  }, [activeCategory, activeSortTab, search]);

  const selectedCreator =
    creators.find((creator) => creator.id === selectedCreatorId) ??
    creators[0] ??
    null;

  return {
    actions: {
      setActiveCategory,
      setActiveSortTab,
      setSearch,
      setSelectedCreatorId,
    },
    viewModel: {
      activeCategory,
      activeSortTab,
      creators,
      search,
      selectedCreator,
      selectedCreatorId,
    },
  };
}
