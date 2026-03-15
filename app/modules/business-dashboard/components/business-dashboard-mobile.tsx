import { useState } from "react";
import {
  BarChart3,
  Bell,
  Home,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  Settings,
  Users
} from "lucide-react";
import { Button } from "~/components/ui/button";
import type { RecommendedCreator } from "../types";

type BusinessDashboardMobileProps = {
  companyName?: string;
  investimento: { value: string; subtitle: string };
  jobsPendentes: number;
  campaigns: Array<{
    id: string;
    title: string;
    description: string;
    status: "em_andamento" | "em_revisao";
    imageUrl?: string;
  }>;
  recommendedCreators: (RecommendedCreator & { avatarUrl?: string })[];
};

const BOTTOM_NAV_ITEMS = [
  { id: "inicio", label: "Início", icon: Home, active: true },
  { id: "mensagens", label: "Mensagens", icon: MessageCircle },
  { id: "criadores", label: "Criadores", icon: Users }
];

const QUICK_NAV_ITEMS = [
  { id: "mapa", label: "Mapa", icon: MapPin },
  { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  { id: "perfil", label: "Perfil", icon: Users },
  { id: "ajustes", label: "Ajustes", icon: Settings }
];

export function BusinessDashboardMobile({
  companyName = "Lumina Studio",
  investimento,
  jobsPendentes,
  campaigns,
  recommendedCreators
}: BusinessDashboardMobileProps) {
  const [avatarError, setAvatarError] = useState(false);
  const avatarUrl =
    "https://www.figma.com/api/mcp/asset/14d08172-bda9-4d1e-9bb0-44e550b9edb5";

  return (
    <div className="relative min-h-screen bg-[#f6f5f8] pb-[96px]">
      <header className="sticky top-0 z-20 flex flex-col gap-4 border-b border-slate-200 bg-[#f6f5f8] px-6 pb-4 pt-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label="Menu"
          >
            <Menu className="size-5 text-slate-600" />
          </button>
          <div className="flex size-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#895af6] bg-[rgba(137,90,246,0.2)]">
            {!avatarError ? (
              <img
                src={avatarUrl}
                alt="Logo"
                className="size-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <span className="text-lg font-bold text-[#895af6]">LS</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
              aria-label="Pesquisar"
            >
              <Search className="size-5 text-slate-600" />
            </button>
            <button
              type="button"
              className="relative flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
              aria-label="Notificações"
            >
              <Bell className="size-5 text-slate-600" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-[#895af6]" />
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">
            Bem-vindo de volta,
          </p>
          <h1 className="text-[30px] font-bold leading-tight text-slate-900">
            Olá, {companyName}
          </h1>
        </div>
      </header>

      <main className="px-6 pb-6 pt-4">
        <section className="mb-6 rounded-[48px] bg-[#895af6] p-6 shadow-[0px_10px_15px_-3px_rgba(137,90,246,0.2),0px_4px_6px_-4px_rgba(137,90,246,0.2)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">
                {investimento.subtitle}
              </p>
              <p className="mt-2 text-[30px] font-bold leading-9 text-white">
                {investimento.value}
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-white/20">
              <BarChart3 className="size-5 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                Jobs Pendentes
              </p>
              <p className="text-xl font-bold text-white">{jobsPendentes}</p>
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="size-8 overflow-hidden rounded-full border-2 border-[#895af6] bg-slate-300"
                />
              ))}
              <div className="flex size-8 items-center justify-center rounded-full border-2 border-[#895af6] bg-[#895af6] text-[10px] font-bold text-white">
                +5
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-4 gap-4">
          {QUICK_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className="flex flex-col items-center gap-2"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <Icon className="size-5 text-slate-600" />
                </div>
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  {item.label}
                </span>
              </button>
            );
          })}
        </section>

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-[-0.5px] text-slate-900">
              Campanhas Ativas
            </h2>
            <a href="#" className="text-sm font-semibold text-[#895af6]">
              Ver todos
            </a>
          </div>
          <div className="flex flex-col gap-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-start justify-between gap-4 rounded-[48px] border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${
                        campaign.status === "em_andamento"
                          ? "bg-amber-500"
                          : "bg-[#895af6]"
                      }`}
                    />
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        campaign.status === "em_andamento"
                          ? "text-amber-600"
                          : "text-[#895af6]"
                      }`}
                    >
                      {campaign.status === "em_andamento"
                        ? "Em andamento"
                        : "Em Revisão"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {campaign.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {campaign.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 rounded-full bg-[rgba(137,90,246,0.1)] text-[#895af6] hover:bg-[rgba(137,90,246,0.15)]"
                  >
                    Ver todos
                  </Button>
                </div>
                <div className="size-24 shrink-0 overflow-hidden rounded-[48px] bg-slate-200">
                  {campaign.imageUrl && (
                    <img
                      src={campaign.imageUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold tracking-[-0.5px] text-slate-900">
            Criadores Recomendados
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recommendedCreators.map((creator) => (
              <div
                key={creator.id}
                className="flex min-w-[140px] flex-col items-center gap-3 rounded-[48px] border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="flex size-16 items-center justify-center overflow-hidden rounded-full border-2 border-[#895af6] bg-slate-200">
                  {creator.avatarUrl ? (
                    <img
                      src={creator.avatarUrl}
                      alt={creator.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-slate-600">
                      {creator.name.slice(0, 2)}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900">
                    {creator.name}
                  </p>
                  <p className="text-xs text-slate-500">{creator.category}</p>
                </div>
                <Button
                  variant="purple"
                  size="sm"
                  className="w-full rounded-full"
                >
                  Contratar
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center justify-around gap-4">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={`flex flex-col items-center gap-1 transition-colors ${
                  item.active ? "text-[#895af6]" : "text-slate-400"
                }`}
              >
                <Icon className="size-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
