import {
  UtensilsCrossed,
  Package,
  Lightbulb,
  Briefcase,
  ExternalLink
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { CreatorDashboardSidebar } from "./creator-dashboard-sidebar";
import type { DashboardStat, JobOffer } from "../types";

type CreatorDashboardDesktopProps = {
  stats: DashboardStat[];
  offers: JobOffer[];
};

export function CreatorDashboardDesktop({
  stats,
  offers
}: CreatorDashboardDesktopProps) {
  return (
    <div className="flex min-h-screen bg-[#f6f5f8]">
      <CreatorDashboardSidebar />

      <main className="flex flex-1 flex-col gap-8 p-8">
        <header className="flex items-end">
          <div className="flex flex-col gap-1">
            <h1 className="text-[30px] font-black leading-9 tracking-[-0.75px] text-slate-900">
              Bem-vindo, Lucas! 👋
            </h1>
            <p className="text-base text-slate-600">
              Aqui está o resumo dos seus trabalhos e ganhos desta semana.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="relative rounded-[48px] border border-slate-200 bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
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
                {stat.id === "ativos" && (
                  <Briefcase className="size-7 text-slate-400" aria-hidden />
                )}
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

        <section className="flex flex-col gap-6 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-5 text-[#895af6]" aria-hidden />
              <h2 className="text-xl font-bold text-slate-900">Ofertas Recentes</h2>
            </div>
            <a href="#" className="text-sm font-bold text-[#895af6] hover:underline">
              Ver todas
            </a>
          </div>

          <div className="flex flex-col gap-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="rounded-[48px] border border-slate-200 bg-white p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-[32px] bg-slate-100">
                      {offer.iconType === "gastronomy" ? (
                        <UtensilsCrossed className="size-5 text-slate-600" />
                      ) : (
                        <Package className="size-5 text-slate-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-2xl bg-[rgba(137,90,246,0.1)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#895af6]">
                          Solicitação Direta
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{offer.title}</h3>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                        <span className="size-2 rounded-full bg-slate-400" aria-hidden />
                        {offer.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end">
                    <p className="text-lg font-black text-[#895af6]">{offer.value}</p>
                    <button
                      type="button"
                      className="mt-1 flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600"
                    >
                      <ExternalLink className="size-3" />
                      Ver Perfil da Empresa
                    </button>
                  </div>
                </div>
                {offer.description && (
                  <p className="mt-4 text-sm leading-5 text-slate-600">
                    {offer.description}
                  </p>
                )}
                <div className="mt-4 flex gap-3 pt-2">
                  <Button variant="purple" className="flex-1 rounded-full">
                    Aceitar Oferta
                  </Button>
                  <Button variant="outline" className="rounded-full px-6">
                    Recusar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
