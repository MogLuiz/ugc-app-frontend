export type CreatorCategory = "beleza" | "gastronomia" | "tech" | "fitness";

export type CreatorMapModel = {
  id: string;
  name: string;
  category: CreatorCategory;
  specialty: string;
  region: string;
  rating: number;
  jobs: number;
  distanceKm: number;
  priceFrom: number;
  latitude: number;
  longitude: number;
  avatarUrl: string;
};
