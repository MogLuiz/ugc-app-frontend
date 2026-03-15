import { useState } from "react";
import {
  Bell,
  Camera,
  ChevronRight,
  DollarSign,
  FolderOpen,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  Star
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { BusinessDashboardSidebar } from "./business-dashboard-sidebar";
import type {
  BusinessCampaignJob,
  BusinessDashboardStat,
  RecommendedCreator
} from "../types";

type BusinessDashboardDesktopProps = {
  stats: BusinessDashboardStat[];
  jobs: BusinessCampaignJob[];
  recommendedCreators: RecommendedCreator[];
  companyName?: string;
  planName?: string;
};

const CHART_DATA = [
  { day: "Seg", value: 1200 },
  { day: "Ter", value: 1800 },
  { day: "Qua", value: 1400 },
  { day: "Qui", value: 2200 },
  { day: "Sex", value: 1900 },
  { day: "Sab", value: 2500 },
  { day: "Dom", value: 2100 }
];

const maxChartValue = Math.max(...CHART_DATA.map((d) => d.value));

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

export function BusinessDashboardDesktop({
  stats,
  jobs,
  recommendedCreators,
  companyName = "Empresa Exemplo",
  planName = "Plano Enterprise"
}: BusinessDashboardDesktopProps) {
  const [avatarError, setAvatarError] = useState(false);
  const avatarUrl =
    "https://www.figma.com/api/mcp/asset/4136090e-0ea3-4b5e-93ca-1a47bc822621";

  return (
    <div className="flex min-h-screen bg-[#f6f5f8]">
      <BusinessDashboardSidebar />

      <main className="flex flex-1 flex-col gap-8 overflow-hidden p-8">
        <header className="flex items-center justify-between">
          <div className="flex w-[384px] items-center gap-4 rounded-2xl border border-[rgba(137,90,246,0.05)] bg-white px-4 py-2">
            <Search className="size-[18px] shrink-0 text-slate-400" />
            <input
              type="search"
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
            <div className="flex items-center gap-3 border-l border-[rgba(137,90,246,0.1)] pl-4">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{companyName}</p>
                <p className="text-xs text-slate-500">{planName}</p>
              </div>
              <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#895af6] bg-[rgba(137,90,246,0.2)]">
                {!avatarError ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="size-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="text-xs font-bold text-slate-600">
                    {companyName.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <section className="flex flex-col gap-2">
          <h1 className="text-[30px] font-black leading-9 tracking-[-0.75px] text-slate-900">
            Bem-vindo de volta, Time! 👋
          </h1>
          <p className="text-base text-slate-500">
            Aqui está um resumo do desempenho da sua marca hoje.
          </p>
        </section>

        <section className="grid grid-cols-4 gap-6 pt-2">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={`rounded-2xl border border-[rgba(137,90,246,0.05)] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] ${
                stat.id === "jobs-pendentes" ? "col-span-2" : ""
              }`}
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="text-sm font-medium uppercase tracking-wider text-slate-500">
                  {stat.label}
                </span>
                {stat.iconType === "investment" && (
                  <DollarSign className="size-8 text-emerald-500" />
                )}
                {stat.iconType === "jobs" && (
                  <FolderOpen className="size-9 text-[#895af6]" />
                )}
                {stat.iconType === "pending" && (
                  <Package className="size-8 text-amber-500" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                {stat.change && (
                  <span
                    className={`text-xs font-bold ${
                      stat.changeVariant === "positive"
                        ? "text-emerald-600"
                        : "text-orange-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                )}
              </div>
              {stat.subtitle && (
                <p className="mt-2 text-xs text-slate-400">{stat.subtitle}</p>
              )}
              {stat.id === "jobs-pendentes" && (
                <div className="mt-4 flex items-center gap-2 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="size-8 overflow-hidden rounded-full border-2 border-white bg-slate-200"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    +6 criadores aguardando feedback
                  </p>
                </div>
              )}
            </div>
          ))}
        </section>

        <div className="grid grid-cols-3 gap-8 pt-2">
          <div className="col-span-2 flex flex-col gap-8">
            <div className="rounded-2xl border border-[rgba(137,90,246,0.05)] bg-white p-8 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Análise de Gastos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Evolução do investimento semanal
                  </p>
                </div>
                <div className="rounded-[32px] border border-[rgba(137,90,246,0.1)] bg-white px-3 py-2 text-xs text-slate-900">
                  Últimos 7 dias
                </div>
              </div>
              <div className="flex h-64 items-end gap-2">
                {CHART_DATA.map((d) => (
                  <div
                    key={d.day}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div
                      className="w-full rounded-t bg-[#895af6]/20 transition-all"
                      style={{
                        height: `${(d.value / maxChartValue) * 180}px`
                      }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(137,90,246,0.05)] bg-white p-8 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
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
                    className="flex items-center justify-between rounded-2xl border border-transparent p-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex size-12 items-center justify-center rounded-[48px] ${
                          job.status === "em_producao"
                            ? "bg-amber-100"
                            : job.status === "pendente"
                              ? "bg-blue-100"
                              : "bg-emerald-100"
                        }`}
                      >
                        {getJobIcon(job.status)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {job.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {job.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">
                          {job.value}
                        </p>
                        <p className="text-[10px] uppercase text-slate-400">
                          Orçamento
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${getStatusStyles(job.status)}`}
                      >
                        {job.statusLabel}
                      </span>
                      <ChevronRight className="size-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="rounded-2xl border border-[rgba(137,90,246,0.05)] bg-white p-8 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <div className="mb-6 flex items-center gap-2">
                <Star className="size-6 text-[#895af6]" />
                <h3 className="text-lg font-bold text-slate-900">Recomendados</h3>
              </div>
              <div className="flex flex-col gap-4">
                {recommendedCreators.map((creator) => (
                  <div
                    key={creator.id}
                    className="flex items-center justify-between rounded-2xl border border-transparent p-3 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 overflow-hidden rounded-full bg-slate-200" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {creator.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {creator.category}
                        </p>
                      </div>
                    </div>
                    <Button variant="purple" size="sm" className="rounded-full">
                      Convidar para Job
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

            <div className="rounded-2xl bg-[#895af6] p-6">
              <div className="flex items-start gap-2">
                <Sparkles className="size-5 shrink-0 text-white" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Gere Anúncios que Convertem
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-white/80">
                    O UGC converte até 5x mais que anúncios tradicionais. Comece
                    hoje sua primeira campanha focada em performance.
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
        </div>
      </main>
    </div>
  );
}
