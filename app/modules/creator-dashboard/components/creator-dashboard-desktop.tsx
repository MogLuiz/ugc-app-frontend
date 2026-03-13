import {
  Plus,
  UtensilsCrossed,
  Package,
  Zap,
  TrendingUp,
  Briefcase
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { CreatorDashboardSidebar } from "./creator-dashboard-sidebar";
import type { DashboardStat, JobOffer, ProgressItem } from "../types";

type CreatorDashboardDesktopProps = {
  stats: DashboardStat[];
  offers: JobOffer[];
  progress: ProgressItem[];
};

export function CreatorDashboardDesktop({
  stats,
  offers,
  progress
}: CreatorDashboardDesktopProps) {
  return (
    <div className="flex min-h-screen bg-[#f6f5f8]">
      <CreatorDashboardSidebar />

      <main className="flex flex-1 flex-col gap-8 p-8">
        <header className="flex items-end justify-between">
          <div>
            <h1 className="text-[30px] font-black leading-9 tracking-[-0.75px] text-slate-900">
              Bem-vindo, Lucas! 👋
            </h1>
            <p className="mt-1 text-base text-slate-600">
              Aqui está o resumo dos seus trabalhos e ganhos desta semana.
            </p>
          </div>
          <Button variant="purple" className="gap-2 rounded-full px-6 py-2.5">
            <Plus className="size-5" />
            Novo Portfólio
          </Button>
        </header>

        <section className="grid grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="rounded-[48px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                {stat.badge && (
                  <span
                    className={
                      stat.badge.variant === "success"
                        ? "rounded-2xl bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-600"
                        : stat.badge.variant === "info"
                          ? "rounded-2xl bg-blue-100 px-2 py-1 text-xs font-bold text-blue-600"
                          : "rounded-2xl bg-[rgba(137,90,246,0.1)] px-2 py-1 text-xs font-bold text-[#895af6]"
                    }
                  >
                    {stat.badge.text}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {stat.id === "ativos" && <Briefcase className="size-8 text-slate-400" />}
                <p className="text-[30px] font-black leading-9 tracking-[-1.5px] text-slate-900">
                  {stat.value}
                </p>
              </div>
              {stat.subtitle && (
                <p className="mt-2 text-xs text-slate-400">{stat.subtitle}</p>
              )}
            </div>
          ))}
        </section>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="size-5 text-[#895af6]" />
                <h2 className="text-xl font-bold text-slate-900">Ofertas Recentes</h2>
              </div>
              <a href="#" className="text-sm font-bold text-[#895af6]">
                Ver todas
              </a>
            </div>

            <div className="flex flex-col gap-4">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-[48px] border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="flex size-12 items-center justify-center rounded-[32px] bg-slate-100">
                        {offer.iconType === "gastronomy" ? (
                          <UtensilsCrossed className="size-5 text-slate-600" />
                        ) : (
                          <Package className="size-5 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{offer.title}</h3>
                        <p className="text-sm text-slate-500">{offer.location}</p>
                      </div>
                    </div>
                    <p className="text-lg font-black text-[#895af6]">{offer.value}</p>
                  </div>
                  {offer.description && (
                    <p className="mt-4 text-sm leading-5 text-slate-600">
                      {offer.description}
                    </p>
                  )}
                  <div className="mt-4 flex gap-3 pt-2">
                    <Button variant="purple" className="flex-1 rounded-full">
                      Aceitar
                    </Button>
                    <Button variant="outline" className="rounded-full px-6">
                      Recusar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-5 text-[#895af6]" />
              <h2 className="text-xl font-bold text-slate-900">Progresso Atual</h2>
            </div>

            <div className="rounded-[48px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-6">
                {progress.map((item) => (
                  <div key={item.id}>
                    <div className="mb-2 flex items-end justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">Prazo: {item.deadline}</p>
                      </div>
                      <span className="text-sm font-bold text-[#895af6]">{item.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#895af6]"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <button className="w-full rounded-[48px] bg-slate-50 py-3 text-sm font-bold text-slate-600">
                  Ver todos os projetos
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[48px] bg-[#895af6] p-6">
              <h3 className="text-base font-bold text-white">Dica de Ouro! ✨</h3>
              <p className="mt-2 text-xs leading-5 text-white/80">
                Criadores que respondem solicitações em menos de 2h têm 3x mais chance de
                fechar contratos fixos mensais.
              </p>
              <Button
                variant="secondary"
                className="mt-4 rounded-full bg-white text-[#895af6] hover:bg-white/90"
              >
                Ler mais
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
