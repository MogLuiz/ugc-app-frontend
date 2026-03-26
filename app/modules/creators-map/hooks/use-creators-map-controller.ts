import { useMemo, useState } from "react";
import { useCreatorsMapQuery } from "../queries";
import type { CreatorCategory, CreatorMapModel } from "../types";

export type SortTab = "relevantes" | "novidades";
export type CategoryFilter = "all" | CreatorCategory;

export function useCreatorsMapController() {
  const [search, setSearch] = useState("");
  const [activeSortTab, setActiveSortTab] = useState<SortTab>("relevantes");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");

  const { data } = useCreatorsMapQuery();

  const creators = useMemo(() => {
    const rawItems = data?.items ?? [];

    const mapped: CreatorMapModel[] = rawItems
      .filter((item) => item.creatorHasValidCoordinates && item.creatorLatitude != null && item.creatorLongitude != null)
      .map((item) => ({
        id: item.id,
        name: item.name,
        category: deriveCategory(item.niche, item.tags),
        specialty: item.niche,
        region: item.location,
        rating: item.rating,
        jobs: null,
        distanceKm: null,
        priceFrom: item.minPrice ?? null,
        latitude: item.creatorLatitude!,
        longitude: item.creatorLongitude!,
        avatarUrl: item.avatarUrl ?? null,
      }));

    const normalizedSearch = search.trim().toLowerCase();

    const byCategory = mapped.filter((creator) => {
      if (activeCategory === "all") return true;
      return creator.category === activeCategory;
    });

    const bySearch = byCategory.filter((creator) => {
      if (!normalizedSearch) return true;
      return (
        creator.name.toLowerCase().includes(normalizedSearch) ||
        creator.specialty.toLowerCase().includes(normalizedSearch) ||
        creator.region.toLowerCase().includes(normalizedSearch)
      );
    });

    return [...bySearch].sort((a, b) =>
      activeSortTab === "relevantes" ? b.rating - a.rating : b.rating - a.rating
    );
  }, [data, activeCategory, activeSortTab, search]);

  const resolvedSelectedId =
    selectedCreatorId || creators[0]?.id || "";

  const selectedCreator =
    creators.find((creator) => creator.id === resolvedSelectedId) ??
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
      selectedCreatorId: resolvedSelectedId,
    },
  };
}

function deriveCategory(niche: string, tags: string[]): CreatorCategory {
  const haystack = [niche, ...tags].join(" ").toLowerCase();
  if (/gastro|culin|food|caf[eé]|restaur|receita/.test(haystack)) return "gastronomia";
  if (/tech|tecnolog|gaming|game|softw|program/.test(haystack)) return "tech";
  if (/fit|saude|sa[úu]de|acad|gym|esport|nutri|yoga/.test(haystack)) return "fitness";
  return "beleza";
}
