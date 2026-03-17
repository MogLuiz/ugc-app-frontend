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

export const MOCK_RECOMMENDED_CREATORS: RecommendedCreator[] = [
  { id: "1", name: "Amanda Silva", category: "BELEZA & ESTILO" },
  { id: "2", name: "Lucas Oliveira", category: "TECNOLOGIA" }
];
