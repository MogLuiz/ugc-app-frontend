import type { CreatorProfile } from "../types";

/** Mock de perfil expandido para desenvolvimento. Substituir por API. */
export const MOCK_CREATOR_PROFILES: Record<string, CreatorProfile> = {
  "mariana-silva": {
    id: "mariana-silva",
    name: "Mariana Silva",
    specialty: "Especialista em Lifestyle & Tech",
    avatarUrl: "https://www.figma.com/api/mcp/asset/67f3370f-60f0-426d-bf59-4fc82cfc00ab",
    isVerified: true,
    isOnline: true,
    rating: 4.9,
    jobsCount: 124,
    responseTime: "Resposta em 2h",
    location: {
      city: "Belo Horizonte",
      state: "MG",
      description: "Atuando em toda a região metropolitana. Disponível para gravações presenciais.",
      distanceKm: 2.5
    },
    portfolio: [
      {
        id: "p1",
        imageUrl: "https://www.figma.com/api/mcp/asset/ad4c73a0-9c42-422c-9d94-2a757a931adc",
        views: "2.4k"
      },
      {
        id: "p2",
        imageUrl: "https://www.figma.com/api/mcp/asset/6963c8e0-bfae-4927-bb13-3af0f20793bd",
        views: "1.8k"
      },
      {
        id: "p3",
        imageUrl: "https://www.figma.com/api/mcp/asset/c1036026-15c8-42e1-8f65-230c1eb17017",
        views: "4.1k"
      }
    ],
    testimonials: [
      {
        id: "t1",
        authorName: "Ricardo Leme",
        authorRole: "CEO na TechFlow",
        authorInitials: "RL",
        rating: 5,
        text: '"A Mariana superou nossas expectativas. O vídeo de unboxing ficou natural, com excelente iluminação e edição dinâmica. Recomendo muito!"'
      },
      {
        id: "t2",
        authorName: "Ana Martins",
        authorRole: "Marketing na GlowCare",
        authorInitials: "AM",
        rating: 5,
        text: '"Muito profissional e pontual na entrega. Seguiu o briefing à risca mas trouxe ideias criativas que elevaram o resultado final."'
      }
    ],
    services: [
      { id: "s1", name: "Vídeo 30s", price: 250 },
      { id: "s2", name: "Vídeo 60s", price: 400 },
      { id: "s3", name: "Unboxing", price: 180 },
      { id: "s4", name: "Presencial", price: 600 }
    ],
    availability: ["16", "17", "19"]
  },
  "lucas-oliveira": {
    id: "lucas-oliveira",
    name: "Lucas Oliveira",
    specialty: "Criador de Conteúdo UGC",
    avatarUrl: "https://www.figma.com/api/mcp/asset/0b4f7690-5ba0-41b6-a9f5-1072f4b3ab50",
    isVerified: false,
    isOnline: true,
    rating: 4.8,
    jobsCount: 85,
    responseTime: "Resposta em 3h",
    location: {
      city: "Belo Horizonte",
      state: "MG",
      description: "Região Buritis e adjacências.",
      distanceKm: 3.8
    },
    portfolio: [
      { id: "p1", imageUrl: "https://www.figma.com/api/mcp/asset/ad4c73a0-9c42-422c-9d94-2a757a931adc", views: "1.2k" },
      { id: "p2", imageUrl: "https://www.figma.com/api/mcp/asset/6963c8e0-bfae-4927-bb13-3af0f20793bd", views: "890" }
    ],
    testimonials: [
      {
        id: "t1",
        authorName: "João Silva",
        authorRole: "Founder",
        authorInitials: "JS",
        rating: 5,
        text: '"Excelente trabalho com vídeos de tech!"'
      }
    ],
    services: [
      { id: "s1", name: "Vídeo 30s", price: 220 },
      { id: "s2", name: "Vídeo 60s", price: 380 }
    ],
    availability: ["18", "20"]
  },
  "bia-mendes": {
    id: "bia-mendes",
    name: "Beatriz Costa",
    specialty: "Criadora de Conteúdo UGC",
    avatarUrl: "https://www.figma.com/api/mcp/asset/cb07a921-056d-477d-a881-07b8210d7e6f",
    isVerified: true,
    isOnline: false,
    rating: 5,
    jobsCount: 42,
    responseTime: "Resposta em 1h",
    location: {
      city: "Belo Horizonte",
      state: "MG",
      description: "Centro e Lourdes.",
      distanceKm: 1.2
    },
    portfolio: [
      { id: "p1", imageUrl: "https://www.figma.com/api/mcp/asset/c1036026-15c8-42e1-8f65-230c1eb17017", views: "3.1k" }
    ],
    testimonials: [],
    services: [
      { id: "s1", name: "Vídeo 30s", price: 180 },
      { id: "s2", name: "Review com fotos", price: 150 }
    ],
    availability: ["15", "16", "17"]
  },
  "ricardo-arantes": {
    id: "ricardo-arantes",
    name: "Ricardo Arantes",
    specialty: "Criador de Conteúdo UGC",
    avatarUrl: "https://www.figma.com/api/mcp/asset/83b216cd-8784-4d8a-b792-7d5a6e7d95ad",
    isVerified: false,
    isOnline: true,
    rating: 4.7,
    jobsCount: 210,
    responseTime: "Resposta em 4h",
    location: {
      city: "Belo Horizonte",
      state: "MG",
      description: "Pampulha e região.",
      distanceKm: 5.1
    },
    portfolio: [],
    testimonials: [],
    services: [
      { id: "s1", name: "Vídeo 30s", price: 240 },
      { id: "s2", name: "Presencial", price: 550 }
    ],
    availability: ["19", "20", "21"]
  },
  "amanda-rocha": {
    id: "amanda-rocha",
    name: "Amanda Rocha",
    specialty: "Criadora de Conteúdo UGC",
    avatarUrl: "https://www.figma.com/api/mcp/asset/462615e5-139e-4cbd-b357-43b3cda620ba",
    isVerified: true,
    isOnline: true,
    rating: 4.9,
    jobsCount: 76,
    responseTime: "Resposta em 2h",
    location: {
      city: "Belo Horizonte",
      state: "MG",
      description: "Cidade Nova e adjacências.",
      distanceKm: 2.8
    },
    portfolio: [
      { id: "p1", imageUrl: "https://www.figma.com/api/mcp/asset/6963c8e0-bfae-4927-bb13-3af0f20793bd", views: "2.1k" },
      { id: "p2", imageUrl: "https://www.figma.com/api/mcp/asset/c1036026-15c8-42e1-8f65-230c1eb17017", views: "1.5k" }
    ],
    testimonials: [],
    services: [
      { id: "s1", name: "Vídeo 30s", price: 190 },
      { id: "s2", name: "Unboxing", price: 160 }
    ],
    availability: ["12"]
  }
};
