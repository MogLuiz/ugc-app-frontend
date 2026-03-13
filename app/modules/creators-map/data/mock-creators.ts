import type { CreatorMapModel } from "~/modules/creators-map/types";

// Mock temporario para compor o layout ate a integracao do backend.
export const MOCK_CREATORS_BH: CreatorMapModel[] = [
  {
    id: "mariana-silva",
    name: "Mariana Silva",
    category: "gastronomia",
    specialty: "Gastronomia e Lifestyle",
    region: "Savassi",
    rating: 4.9,
    jobs: 120,
    distanceKm: 2.4,
    priceFrom: 150,
    latitude: -19.9377,
    longitude: -43.9345,
    avatarUrl: "https://www.figma.com/api/mcp/asset/97b04b32-8f9a-470e-b76e-19c7fcc1db55"
  },
  {
    id: "lucas-oliveira",
    name: "Lucas Oliveira",
    category: "tech",
    specialty: "Tecnologia e Gaming",
    region: "Buritis",
    rating: 4.8,
    jobs: 85,
    distanceKm: 3.8,
    priceFrom: 220,
    latitude: -19.9819,
    longitude: -43.967,
    avatarUrl: "https://www.figma.com/api/mcp/asset/0b4f7690-5ba0-41b6-a9f5-1072f4b3ab50"
  },
  {
    id: "bia-mendes",
    name: "Beatriz Costa",
    category: "beleza",
    specialty: "Beleza e Skincare",
    region: "Lourdes",
    rating: 5,
    jobs: 42,
    distanceKm: 1.2,
    priceFrom: 180,
    latitude: -19.9266,
    longitude: -43.9409,
    avatarUrl: "https://www.figma.com/api/mcp/asset/cb07a921-056d-477d-a881-07b8210d7e6f"
  },
  {
    id: "ricardo-arantes",
    name: "Ricardo Arantes",
    category: "fitness",
    specialty: "Fitness e Saude",
    region: "Pampulha",
    rating: 4.7,
    jobs: 210,
    distanceKm: 5.1,
    priceFrom: 240,
    latitude: -19.8589,
    longitude: -43.9693,
    avatarUrl: "https://www.figma.com/api/mcp/asset/83b216cd-8784-4d8a-b792-7d5a6e7d95ad"
  },
  {
    id: "amanda-rocha",
    name: "Amanda Rocha",
    category: "beleza",
    specialty: "Beleza e Estilo de Vida",
    region: "Cidade Nova",
    rating: 4.9,
    jobs: 76,
    distanceKm: 2.8,
    priceFrom: 190,
    latitude: -19.8884,
    longitude: -43.9248,
    avatarUrl: "https://www.figma.com/api/mcp/asset/462615e5-139e-4cbd-b357-43b3cda620ba"
  }
];
