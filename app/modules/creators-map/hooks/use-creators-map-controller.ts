import { useMemo, useState } from "react";
import { useCreatorsMapQuery } from "../queries";
import { useAuthContext } from "~/modules/auth/context";
import type { CreatorCategory, CreatorMapModel } from "../types";

export type SortTab = "relevantes" | "novidades";
export type CategoryFilter = "all" | CreatorCategory;
export type DistanceFilter = "all" | "1km" | "3km" | "5km";

export type MapBounds = { n: number; s: number; e: number; w: number };

const BH_CENTER = { lat: -19.9208, lng: -43.9378 };

const DISTANCE_LIMITS: Record<Exclude<DistanceFilter, "all">, number> = {
  "1km": 1,
  "3km": 3,
  "5km": 5,
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function useCreatorsMapController() {
  const { user } = useAuthContext();
  const [search, setSearch] = useState("");
  const [activeSortTab, setActiveSortTab] = useState<SortTab>("relevantes");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>("all");
  const [boundsFilter, setBoundsFilter] = useState<MapBounds | null>(null);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");

  const { data } = useCreatorsMapQuery();

  const companyLatLng = useMemo<{ lat: number; lng: number }>(() => {
    const profile = user?.profile;
    if (profile?.hasValidCoordinates && profile.latitude != null && profile.longitude != null) {
      return { lat: profile.latitude, lng: profile.longitude };
    }
    return BH_CENTER;
  }, [user?.profile]);

  const creators = useMemo(() => {
    const rawItems = data?.items ?? [];

    const mapped: CreatorMapModel[] = rawItems
      .filter(
        (item) =>
          item.creatorHasValidCoordinates &&
          item.creatorLatitude != null &&
          item.creatorLongitude != null,
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        category: deriveCategory(item.niche, item.tags),
        specialty: item.niche,
        region: item.location,
        rating: item.rating,
        jobs: null,
        distanceKm: haversineKm(
          companyLatLng.lat,
          companyLatLng.lng,
          item.creatorLatitude!,
          item.creatorLongitude!,
        ),
        priceFrom: item.minPrice ?? null,
        latitude: item.creatorLatitude!,
        longitude: item.creatorLongitude!,
        avatarUrl: item.avatarUrl ?? null,
        // availability: not derived — only set when API provides it
      }));

    const normalizedSearch = search.trim().toLowerCase();

    const byCategory = mapped.filter((c) => {
      if (activeCategory === "all") return true;
      return c.category === activeCategory;
    });

    const bySearch = byCategory.filter((c) => {
      if (!normalizedSearch) return true;
      return (
        c.name.toLowerCase().includes(normalizedSearch) ||
        c.specialty.toLowerCase().includes(normalizedSearch) ||
        c.region.toLowerCase().includes(normalizedSearch)
      );
    });

    const byDistance = bySearch.filter((c) => {
      if (distanceFilter === "all") return true;
      if (c.distanceKm == null) return true;
      return c.distanceKm <= DISTANCE_LIMITS[distanceFilter];
    });

    const byBounds = byDistance.filter((c) => {
      if (!boundsFilter) return true;
      return (
        c.latitude <= boundsFilter.n &&
        c.latitude >= boundsFilter.s &&
        c.longitude <= boundsFilter.e &&
        c.longitude >= boundsFilter.w
      );
    });

    return [...byBounds].sort((a, b) => b.rating - a.rating);
  }, [data, activeCategory, activeSortTab, search, distanceFilter, boundsFilter, companyLatLng]);

  const resolvedSelectedId = selectedCreatorId || creators[0]?.id || "";

  const selectedCreator =
    creators.find((c) => c.id === resolvedSelectedId) ?? creators[0] ?? null;

  return {
    actions: {
      setActiveCategory,
      setActiveSortTab,
      setSearch,
      setDistanceFilter,
      setBoundsFilter,
      setSelectedCreatorId,
    },
    viewModel: {
      activeCategory,
      activeSortTab,
      creators,
      search,
      distanceFilter,
      boundsFilter,
      selectedCreator,
      selectedCreatorId: resolvedSelectedId,
      companyLatLng,
    },
  };
}

function deriveCategory(niche: string, tags: string[]): import("../types").CreatorCategory {
  const haystack = [niche, ...tags].join(" ").toLowerCase();
  if (/gastro|culin|food|caf[eé]|restaur|receita/.test(haystack)) return "gastronomia";
  if (/tech|tecnolog|gaming|game|softw|program/.test(haystack)) return "tech";
  if (/fit|saude|sa[úu]de|acad|gym|esport|nutri|yoga/.test(haystack)) return "fitness";
  return "beleza";
}
