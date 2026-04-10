export type MarketplaceCreator = {
  id: string;
  name: string;
  niche: string;
  location: string;
  rating: number;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  bio?: string | null;
  tags: string[];
  minPrice?: number | null;
  ageYears: number | null;
  creatorLatitude?: number | null;
  creatorLongitude?: number | null;
  creatorHasValidCoordinates?: boolean;
  totalReviews?: number | null;
  videoCount?: number | null;
  distanceKm?: number | null;
};

export type MarketplaceServiceTypeOption = {
  id: string;
  label: string;
};

export type MarketplaceCreatorsResponse = {
  items: MarketplaceCreator[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
