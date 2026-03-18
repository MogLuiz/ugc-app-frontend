export type MarketplaceCreator = {
  id: string;
  name: string;
  niche: string;
  location: string;
  rating: number;
  avatarUrl: string;
  coverImageUrl?: string;
  tags: string[];
};

export type MarketplaceFilterNiche =
  | "todos"
  | "beleza"
  | "tecnologia"
  | "lifestyle"
  | "fitness"
  | "gastronomia"
  | "educacao";

export type MarketplaceSortBy =
  | "relevancia"
  | "preco"
  | "avaliacao"
  | "proximidade";
