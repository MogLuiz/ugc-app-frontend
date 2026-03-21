import { useState } from "react";
import {
  Bell,
  Briefcase,
  ExternalLink,
  FileText,
  FolderOpen,
  Home,
  Lightbulb,
  Menu,
  MessageCircle,
  Package,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { DashboardStat, JobOffer } from "../../types";

const BOTTOM_NAV_ITEMS = [
  { id: "inicio", label: "Início", icon: Home, active: true },
  { id: "mensagens", label: "Mensagens", icon: MessageCircle },
  { id: "perfil", label: "Perfil", icon: User },
];

function getBadgeClass(variant: "success" | "info" | "urgent") {
  switch (variant) {
    case "success":
      return "rounded-2xl bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-600";
    case "info":
      return "rounded-2xl bg-blue-100 px-2 py-1 text-xs font-bold text-blue-600";
    default:
      return "rounded-2xl bg-[rgba(137,90,246,0.1)] px-2 py-1 text-xs font-bold text-[#895af6]";
  }
}

export function CreatorDashboardHeader({
  creatorName,
}: {
  creatorName: string;
}) {
  return (
    <>
      <header className="sticky top-0 z-20 -mx-4 flex items-center justify-between border-b border-[rgba(137,90,246,0.1)] bg-[rgba(246,245,248,0.8)] px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-[rgba(137,90,246,0.2)]"
            aria-label="Menu"
          >
            <Menu className="size-5 text-[#895af6]" />
          </button>
          <h1 className="text-lg font-bold tracking-[-0.45px] text-slate-900">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="relative p-2" aria-label="Notificações">
            <Bell className="size-5 text-slate-600" />
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-[#f6f5f8] bg-red-500" />
          </button>
          <HeaderAvatar />
        </div>
      </header>

      <header className="hidden items-end lg:flex">
        <div className="flex flex-col gap-1">
          <h1 className="text-[30px] font-black leading-9 tracking-[-0.75px] text-slate-900">
            Bem-vindo, {creatorName}! 👋
          </h1>
          <p className="text-base text-slate-600">
            Aqui está o resumo dos seus trabalhos e ganhos desta semana.
          </p>
        </div>
      </header>
    </>
  );
}

export function CreatorDashboardIntro({
  creatorName,
}: {
  creatorName: string;
}) {
  return (
    <section className="lg:hidden">
      <h2 className="text-2xl font-bold text-slate-900">
        Bem-vindo, {creatorName}! 👋
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Aqui está o que está acontecendo hoje.
      </p>
    </section>
  );
}

export function CreatorDashboardStats({
  stats,
}: {
  stats: DashboardStat[];
}) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.id}
          className={cn(
            "rounded-[32px] border border-[rgba(137,90,246,0.05)] bg-white p-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:rounded-[48px] lg:p-6",
            index === 0 && "sm:col-span-2 lg:col-span-1",
            index === 0 && "bg-[#895af6] lg:bg-white"
          )}
        >
          <div className="mb-4 flex items-start justify-between">
            <span
              className={cn(
                "text-sm font-medium",
                index === 0
                  ? "text-white lg:text-slate-500"
                  : "uppercase tracking-wider text-slate-500"
              )}
            >
              {stat.label}
            </span>
            {stat.badge ? (
              <span
                className={cn(
                  getBadgeClass(stat.badge.variant),
                  index === 0 && "bg-white/20 text-white lg:bg-emerald-100 lg:text-emerald-600"
                )}
              >
                {stat.badge.text}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {stat.id === "ativos" ? (
              <Briefcase className="size-7 text-slate-400" aria-hidden />
            ) : null}
            {stat.id === "solicitacoes" ? (
              <FileText className="size-7 text-slate-400" aria-hidden />
            ) : null}
            {stat.id === "ganhos" ? (
              <FolderOpen className="size-7 text-white lg:hidden" aria-hidden />
            ) : null}
            <p
              className={cn(
                "text-[30px] font-black leading-9 tracking-[-1.5px]",
                index === 0 ? "text-white lg:text-slate-900" : "text-slate-900"
              )}
            >
              {stat.value}
            </p>
          </div>
          {stat.subtitle ? (
            <p
              className={cn(
                "mt-2 text-xs",
                index === 0 ? "text-white/90 lg:text-slate-400" : "text-slate-400"
              )}
            >
              {stat.subtitle}
            </p>
          ) : null}
        </div>
      ))}
    </section>
  );
}

export function CreatorDashboardOffers({
  offers,
}: {
  offers: JobOffer[];
}) {
  return (
    <section className="flex flex-col gap-6 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-5 text-[#895af6]" aria-hidden />
          <h2 className="text-lg font-bold text-slate-900 lg:text-xl">
            Ofertas Recentes
          </h2>
        </div>
        <Link to="/ofertas" className="text-sm font-bold text-[#895af6] hover:underline">
          Ver todas
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="overflow-hidden rounded-[32px] border border-[rgba(137,90,246,0.05)] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:rounded-[48px]"
          >
            <div className="flex flex-col gap-4 p-4 lg:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-[32px] bg-slate-100 lg:size-12">
                    {offer.iconType === "gastronomy" ? (
                      <UtensilsCrossed className="size-5 text-slate-600 lg:size-6" />
                    ) : (
                      <Package className="size-5 text-slate-600 lg:size-6" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-2xl bg-[rgba(137,90,246,0.1)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#895af6]">
                        Solicitação Direta
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {offer.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{offer.location}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-black text-[#895af6]">{offer.value}</p>
                  <button
                    type="button"
                    className="mt-1 hidden items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 lg:flex"
                  >
                    <ExternalLink className="size-3" />
                    Ver Perfil da Empresa
                  </button>
                </div>
              </div>

              {offer.description ? (
                <p className="text-sm leading-5 text-slate-600">
                  {offer.description}
                </p>
              ) : null}

              <div className="flex gap-2 lg:gap-3">
                <Button variant="purple" className="flex-1 rounded-full">
                  Aceitar Oferta
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-6 lg:px-8"
                >
                  Recusar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CreatorDashboardBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[rgba(137,90,246,0.1)] bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
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
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function HeaderAvatar() {
  const [error, setError] = useState(false);
  const src =
    "https://www.figma.com/api/mcp/asset/0f9405cf-b2e2-4227-af33-30d805c7727f";

  return (
    <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#895af6] bg-slate-200">
      {!error ? (
        <img
          src={src}
          alt="Perfil"
          className="size-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-xs font-bold text-slate-600">LM</span>
      )}
    </div>
  );
}
