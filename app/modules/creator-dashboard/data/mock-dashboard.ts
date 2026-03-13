import type { DashboardStat, JobOffer, ProgressItem } from "../types";

export const MOCK_STATS: DashboardStat[] = [
  {
    id: "ganhos",
    label: "Ganhos Totais",
    value: "R$ 4.500,00",
    badge: { text: "+15.4%", variant: "success" },
    subtitle: "Expectativa: R$ 5.200,00"
  },
  {
    id: "ativos",
    label: "Trabalhos Ativos",
    value: "12",
    badge: { text: "+2 novos", variant: "info" },
    subtitle: "Em fase de produção ou edição"
  },
  {
    id: "solicitacoes",
    label: "Novas Solicitações",
    value: "05",
    badge: { text: "Urgente", variant: "urgent" },
    subtitle: "Expira em 24 horas"
  }
];

export const MOCK_STATS_MOBILE = {
  ganhos: { value: "R$ 12.500", subtitle: "+12% em relação ao mês passado" },
  ativos: 8,
  solicitacoes: 15
};

export const MOCK_OFFERS: JobOffer[] = [
  {
    id: "1",
    title: 'Review Gastronômico: "Bistrô do Mar"',
    location: "Porto Alegre, RS • Reels + Stories",
    description:
      "Vídeo de 30s mostrando a experiência do jantar e prato principal. Estilo dinâmico e som ambiente.",
    value: "R$ 450,00",
    iconType: "gastronomy"
  },
  {
    id: "2",
    title: 'Unboxing: Suplementos "Iron Fit"',
    location: "Remoto • TikTok Trends",
    description:
      "Unboxing e primeira impressão de novos sabores de whey protein. Foco em benefícios e sabor.",
    value: "R$ 320,00",
    iconType: "unboxing"
  }
];

export const MOCK_OFFERS_MOBILE: JobOffer[] = [
  {
    id: "1",
    title: "Campanha Verão 2024",
    location: "Nike Brasil • 3 vídeos Curtos",
    description: "",
    value: "R$ 2.400",
    iconType: "gastronomy"
  },
  {
    id: "2",
    title: "Review App Mobile",
    location: "SaaS Tech • 1 Artigo + Vídeo",
    description: "",
    value: "R$ 1.150",
    iconType: "unboxing"
  }
];

export const MOCK_PROGRESS: ProgressItem[] = [
  { id: "1", title: "Campanha Verão 2024", deadline: "Amanhã", progress: 75 },
  { id: "2", title: "Hospedagem EcoLodge", deadline: "4 dias", progress: 30 },
  { id: "3", title: "Review Tech XYZ", deadline: "10 dias", progress: 10 }
];

export const MOCK_PROGRESS_MOBILE: ProgressItem[] = [
  { id: "1", title: "Edição de Vídeo - Nike Campaign", deadline: "", progress: 75 },
  { id: "2", title: "Social Media Post - Tech Startup", deadline: "", progress: 40 }
];
