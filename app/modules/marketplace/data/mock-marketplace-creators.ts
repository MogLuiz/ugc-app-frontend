import type { MarketplaceCreator } from "../types";

/**
 * Pool de imagens de perfil realistas (fotos) para manter consistência visual.
 * Reutilizadas entre criadores até integração com backend.
 */
const CREATOR_PHOTOS = [
  "https://www.figma.com/api/mcp/asset/06afc4cb-b5d5-4d6a-b5cd-cb7f2360dcea",
  "https://www.figma.com/api/mcp/asset/0c101091-8d75-4ff7-9fb0-3422c5bed2e8",
  "https://www.figma.com/api/mcp/asset/55472a47-c471-4bd5-b739-4cdd3bdf8df3",
  "https://www.figma.com/api/mcp/asset/e7ba08dd-eeb9-4077-bcbb-f482feb62844",
  "https://www.figma.com/api/mcp/asset/444bd767-9e8f-4dc8-a297-82bcb64772ab",
  "https://www.figma.com/api/mcp/asset/250f5def-9dfa-4283-8cb6-02da1f6c5770",
  "https://www.figma.com/api/mcp/asset/3cd41252-817a-41b7-aa18-d822032357ae",
  "https://www.figma.com/api/mcp/asset/ac6e5075-a416-4a18-90d8-50b79d5f65a7",
] as const;

function getCreatorPhoto(index: number): string {
  return CREATOR_PHOTOS[index % CREATOR_PHOTOS.length]!;
}

/** Mock de criadores para o marketplace até integração com backend */
export const MOCK_MARKETPLACE_CREATORS: MarketplaceCreator[] = [
  {
    id: "ana-silva",
    name: "Ana Silva",
    niche: "Moda & Lifestyle",
    location: "Savassi, Belo Horizonte",
    rating: 4.9,
    avatarUrl: getCreatorPhoto(0),
    coverImageUrl: getCreatorPhoto(1),
    tags: ["Vídeo Presencial", "Unboxing", "TikTok Ads", "Reviews"],
  },
  {
    id: "lucas-oliveira",
    name: "Lucas Oliveira",
    niche: "Tech & Gadgets",
    location: "Pinheiros, São Paulo",
    rating: 4.8,
    avatarUrl: getCreatorPhoto(2),
    coverImageUrl: getCreatorPhoto(3),
    tags: ["Review Tech", "Tutorial"],
  },
  {
    id: "ricardo-rocha",
    name: "Ricardo Rocha",
    niche: "Fitness & Saúde",
    location: "Copacabana, Rio de Janeiro",
    rating: 5.0,
    avatarUrl: getCreatorPhoto(4),
    coverImageUrl: getCreatorPhoto(5),
    tags: ["Demo Exercício", "Dieta"],
  },
  {
    id: "mariana-costa",
    name: "Mariana Costa",
    niche: "Beleza & Skincare",
    location: "Moinhos de Vento, Porto Alegre",
    rating: 4.7,
    avatarUrl: getCreatorPhoto(6),
    coverImageUrl: getCreatorPhoto(6),
    tags: ["Get Ready With Me", "Review"],
  },
  {
    id: "beatriz-santos",
    name: "Beatriz Santos",
    niche: "Lifestyle & Viagens",
    location: "Asa Sul, Brasília",
    rating: 5.0,
    avatarUrl: getCreatorPhoto(7),
    coverImageUrl: getCreatorPhoto(7),
    tags: ["Vlog", "Hotel Review"],
  },
  {
    id: "carlos-lima",
    name: "Carlos Lima",
    niche: "Educação & Carreira",
    location: "Batel, Curitiba",
    rating: 4.6,
    avatarUrl: getCreatorPhoto(0),
    coverImageUrl: getCreatorPhoto(0),
    tags: ["Talking Head", "Dicas"],
  },
  {
    id: "juliana-alves",
    name: "Juliana Alves",
    niche: "Gastronomia",
    location: "Itaigara, Salvador",
    rating: 4.9,
    avatarUrl: getCreatorPhoto(1),
    coverImageUrl: getCreatorPhoto(1),
    tags: ["Receitas", "Review Restaurante"],
  },
  {
    id: "felipe-mendes",
    name: "Felipe Mendes",
    niche: "Esportes & Ação",
    location: "Meireles, Fortaleza",
    rating: 4.8,
    avatarUrl: getCreatorPhoto(2),
    coverImageUrl: getCreatorPhoto(2),
    tags: ["GoPro Footage", "Outdoor"],
  },
  {
    id: "mariana-silva",
    name: "Mariana Silva",
    niche: "Beleza & Skincare",
    location: "Lourdes, Belo Horizonte",
    rating: 4.9,
    avatarUrl: getCreatorPhoto(3),
    coverImageUrl: getCreatorPhoto(3),
    tags: ["Unboxing", "Reviews", "TikTok Ads"],
  },
  {
    id: "ana-beatriz",
    name: "Ana Beatriz",
    niche: "Lifestyle & Home",
    location: "Ipanema, Rio de Janeiro",
    rating: 5.0,
    avatarUrl: getCreatorPhoto(4),
    coverImageUrl: getCreatorPhoto(4),
    tags: ["Vlogs", "ASMR"],
  },
];
