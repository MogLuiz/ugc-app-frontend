import {
  BarChart3,
  Bell,
  Camera,
  ChevronRight,
  DollarSign,
  FolderOpen,
  Home,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import type {
  BusinessCampaignJob,
  BusinessDashboardStat,
  RecommendedCreator,
} from "../../types";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const CHART_DATA = [
  { day: "Seg", value: 1200 },
  { day: "Ter", value: 1800 },
  { day: "Qua", value: 1400 },
  { day: "Qui", value: 2200 },
  { day: "Sex", value: 1900 },
  { day: "Sab", value: 2500 },
  { day: "Dom", value: 2100 },
];

const QUICK_NAV_ITEMS = [
  { id: "mapa", label: "Mapa", icon: MapPin },
  { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  { id: "perfil", label: "Perfil", icon: Users },
  { id: "ajustes", label: "Ajustes", icon: Settings },
];

const BOTTOM_NAV_ITEMS = [
  { id: "inicio", label: "Início", icon: Home, active: true },
  { id: "mensagens", label: "Mensagens", icon: MessageCircle },
  { id: "criadores", label: "Criadores", icon: Users },
];

const maxChartValue = Math.max(...CHART_DATA.map((item) => item.value));

export function BusinessDashboardHeader({
  onSearchChange,
  search,
}: {
  onSearchChange: (value: string) => void;
  search: string;
}) {
  return (
    <>
      <header className="hidden items-center justify-between lg:flex">
        <div className="flex w-[384px] items-center gap-4 rounded-2xl border border-[rgba(137,90,246,0.05)] bg-white px-4 py-2">
          <Search className="size-[18px] shrink-0 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Pesquisar criadores, campanhas..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative flex size-10 items-center justify-center rounded-full border border-[rgba(137,90,246,0.05)] bg-white"
            aria-label="Notificações"
          >
            <Bell className="size-5 text-slate-600" />
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-red-500" />
          </button>
        </div>
      </header>

      <header className="sticky top-0 z-20 -mx-4 flex flex-col gap-4 border-b border-slate-200 bg-[#f6f5f8] px-6 pb-4 pt-6 lg:hidden">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label="Menu"
          >
            <Menu className="size-5 text-slate-600" />
          </button>
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
          <p className="text-sm font-medium text-slate-500">Bem-vindo de volta,</p>
          <h1 className="text-[30px] font-bold leading-tight text-slate-900">
            Olá
          </h1>
        </div>
      </header>
    </>
  );
}

export function BusinessDashboardWelcome() {
  return (
    <section className="hidden flex-col gap-2 lg:flex">
      <h1 className="text-[30px] font-black leading-9 tracking-[-0.75px] text-slate-900">
        Bem-vindo de volta, Time! 👋
      </h1>
      <p className="text-base text-slate-500">
        Aqui está um resumo do desempenho da sua marca hoje.
      </p>
    </section>
  );
}

export function BusinessDashboardStats({
  stats,
}: {
  stats: BusinessDashboardStat[];
}) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:pt-2">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={cn(
            "rounded-[32px] border border-[rgba(137,90,246,0.05)] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:rounded-2xl lg:p-6",
            stat.id === "jobs-pendentes" && "sm:col-span-2 lg:col-span-2"
          )}
        >
          <div className="mb-4 flex items-start justify-between">
            <span className="text-sm font-medium uppercase tracking-wider text-slate-500">
              {stat.label}
            </span>
            {stat.iconType === "investment" ? (
              <DollarSign className="size-8 text-emerald-500" />
            ) : null}
            {stat.iconType === "jobs" ? (
              <FolderOpen className="size-9 text-[#895af6]" />
            ) : null}
            {stat.iconType === "pending" ? (
              <Package className="size-8 text-amber-500" />
            ) : null}
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            {stat.change ? (
              <span
                className={cn(
                  "text-xs font-bold",
                  stat.changeVariant === "positive"
                    ? "text-emerald-600"
                    : "text-orange-500"
                )}
              >
                {stat.change}
              </span>
            ) : null}
          </div>
          {stat.subtitle ? (
            <p className="mt-2 text-xs text-slate-400">{stat.subtitle}</p>
          ) : null}
        </div>
      ))}
    </section>
  );
}

export function BusinessDashboardQuickActions() {
  return (
    <section className="grid grid-cols-4 gap-4 lg:hidden">
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
  );
}

export function BusinessDashboardSpendChart() {
  return (
    <div className="rounded-[32px] border border-[rgba(137,90,246,0.05)] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:rounded-2xl lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Análise de Gastos</h3>
          <p className="text-xs text-slate-500">Evolução do investimento semanal</p>
        </div>
        <div className="rounded-[32px] border border-[rgba(137,90,246,0.1)] bg-white px-3 py-2 text-xs text-slate-900">
          Últimos 7 dias
        </div>
      </div>
      <div className="flex h-52 items-end gap-2 lg:h-64">
        {CHART_DATA.map((item) => (
          <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t bg-[#895af6]/20 transition-all"
              style={{ height: `${(item.value / maxChartValue) * 180}px` }}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {item.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getStatusStyles(status: BusinessCampaignJob["status"]) {
  switch (status) {
    case "em_producao":
      return "bg-amber-100 text-amber-700";
    case "pendente":
      return "bg-blue-100 text-blue-700";
    case "concluido":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getJobIcon(status: BusinessCampaignJob["status"]) {
  switch (status) {
    case "em_producao":
      return <Camera className="size-5 text-amber-600" />;
    case "pendente":
      return <Package className="size-5 text-blue-600" />;
    case "concluido":
      return <ShoppingBag className="size-5 text-emerald-600" />;
    default:
      return <Package className="size-5 text-slate-600" />;
  }
}

export function BusinessDashboardJobs({
  jobs,
}: {
  jobs: BusinessCampaignJob[];
}) {
  return (
    <div className="rounded-[32px] border border-[rgba(137,90,246,0.05)] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:rounded-2xl lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">
          Jobs Ativos em Campanha
        </h3>
        <a href="#" className="text-xs font-bold text-[#895af6]">
          Ver todos
        </a>
      </div>
      <div className="flex flex-col gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex flex-col gap-4 rounded-[32px] border border-slate-100 p-4 transition-colors hover:bg-slate-50 lg:flex-row lg:items-center lg:justify-between lg:rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-[48px]",
                  job.status === "em_producao"
                    ? "bg-amber-100"
                    : job.status === "pendente"
                      ? "bg-blue-100"
                      : "bg-emerald-100"
                )}
              >
                {getJobIcon(job.status)}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{job.title}</p>
                <p className="text-xs text-slate-500">{job.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 lg:gap-6">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">{job.value}</p>
                <p className="text-[10px] uppercase text-slate-400">Orçamento</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-bold uppercase",
                  getStatusStyles(job.status)
                )}
              >
                {job.statusLabel}
              </span>
              <ChevronRight className="hidden size-4 text-slate-400 lg:block" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BusinessDashboardRecommended({
  recommendedCreators,
}: {
  recommendedCreators: RecommendedCreator[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[32px] border border-[rgba(137,90,246,0.05)] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:rounded-2xl lg:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Star className="size-6 text-[#895af6]" />
          <h3 className="text-lg font-bold text-slate-900">Recomendados</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
          {recommendedCreators.map((creator) => (
            <div
              key={creator.id}
              className="flex min-w-[220px] items-center justify-between gap-3 rounded-[32px] border border-transparent p-3 transition-colors hover:bg-slate-50 lg:min-w-0 lg:rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 overflow-hidden rounded-full bg-slate-200" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{creator.name}</p>
                  <p className="text-xs text-slate-500">{creator.category}</p>
                </div>
              </div>
              <Button variant="purple" size="sm" className="rounded-full">
                Convidar
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="mt-4 w-full rounded-[48px] border-[rgba(137,90,246,0.1)]"
        >
          Explorar Market-place
        </Button>
      </div>

      <div className="rounded-[32px] bg-[#895af6] p-6 lg:rounded-2xl">
        <div className="flex items-start gap-2">
          <Sparkles className="size-5 shrink-0 text-white" />
          <div>
            <h3 className="text-base font-bold text-white">
              Gere Anúncios que Convertem
            </h3>
            <p className="mt-2 text-xs leading-5 text-white/80">
              O UGC converte até 5x mais que anúncios tradicionais. Comece hoje
              sua primeira campanha focada em performance.
            </p>
            <Button
              variant="secondary"
              className="mt-4 rounded-full bg-white text-[#895af6] hover:bg-white/90"
            >
              Saber mais
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BusinessDashboardBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-around gap-4">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                item.active ? "text-[#895af6]" : "text-slate-400"
              )}
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
  );
}
