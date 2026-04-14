export type CreatorCategory = "beleza" | "gastronomia" | "tech" | "fitness";

export type CreatorAvailability = "available" | "limited" | "busy";

export type CreatorMapModel = {
  id: string;
  name: string;
  category: CreatorCategory;
  specialty: string;
  region: string;
  rating: number;
  jobs: number | null;
  distanceKm: number | null;
  priceFrom: number | null;
  latitude: number;
  longitude: number;
  avatarUrl: string | null;
  /** Only present when the API returns availability data. Never derived from other fields. */
  availability?: CreatorAvailability;
};
