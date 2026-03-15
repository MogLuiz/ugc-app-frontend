import type {
  BusinessCampaignJob,
  BusinessDashboardStat,
  RecommendedCreator
} from "../types";

export const MOCK_BUSINESS_STATS: BusinessDashboardStat[] = [
  {
    id: "investimento",
    label: "Investimento Total",
    value: "R$ 12.540,00",
    change: "+12%",
    changeVariant: "positive",
    subtitle: "Comparado ao mês anterior",
    iconType: "investment"
  },
  {
    id: "jobs-ativos",
    label: "Jobs Ativos",
    value: "24",
    change: "-2",
    changeVariant: "negative",
    subtitle: "Jobs finalizados recentemente",
    iconType: "jobs"
  },
  {
    id: "jobs-pendentes",
    label: "Jobs Pendentes para Aprovação",
    value: "08",
    subtitle: "+6 criadores aguardando feedback",
    iconType: "pending"
  }
];

export const MOCK_BUSINESS_STATS_MOBILE = {
  investimento: { value: "R$ 12.450,00", subtitle: "Investimento Mensal" },
  jobsPendentes: 8
};

export const MOCK_CAMPAIGN_JOBS: BusinessCampaignJob[] = [
  {
    id: "1",
    title: 'Review de Produto - "Smart Gadget"',
    description: "Aguardando aprovação de roteiro",
    value: "R$ 450,00",
    status: "em_producao",
    statusLabel: "Em Produção"
  },
  {
    id: "2",
    title: "Unboxing Coleção Primavera",
    description: "Vídeo enviado para revisão",
    value: "R$ 800,00",
    status: "pendente",
    statusLabel: "Pendente"
  },
  {
    id: "3",
    title: "Depoimento de Cliente Real",
    description: "Finalizado e pronto para anúncio",
    value: "R$ 320,00",
    status: "concluido",
    statusLabel: "Concluído"
  }
];

export const MOCK_CAMPAIGNS_MOBILE = [
  {
    id: "1",
    title: "Fotografia de Produto",
    description: "Sessão em andamento - Estúdio A",
    status: "em_andamento" as const,
    imageUrl: "https://www.figma.com/api/mcp/asset/7b236524-4a46-4b7d-a047-583a8ea2e1fe"
  },
  {
    id: "2",
    title: "Campanha de Verão",
    description: "Fase de edição - 48 clipes",
    status: "em_revisao" as const,
    imageUrl: "https://www.figma.com/api/mcp/asset/768a0250-61d5-4d19-bcde-f196dc76da64"
  }
];

export const MOCK_RECOMMENDED_CREATORS: RecommendedCreator[] = [
  { id: "1", name: "Amanda Silva", category: "BELEZA & ESTILO" },
  { id: "2", name: "Lucas Oliveira", category: "TECNOLOGIA" }
];

export const MOCK_RECOMMENDED_CREATORS_MOBILE: (RecommendedCreator & { avatarUrl?: string })[] = [
  {
    id: "1",
    name: "Sarah J.",
    category: "Fotógrafa",
    avatarUrl: "https://www.figma.com/api/mcp/asset/f43eca46-b73a-40b7-9889-247a4e9fad50"
  },
  {
    id: "2",
    name: "Marcus L.",
    category: "Videomaker",
    avatarUrl: "https://www.figma.com/api/mcp/asset/dd0994a6-6432-45f9-9864-3bf2b0450061"
  },
  {
    id: "3",
    name: "Alex Chen",
    category: "Diretor de Arte",
    avatarUrl: "https://www.figma.com/api/mcp/asset/b497980b-577d-4a9f-90e7-bf3d9c293b7d"
  }
];
