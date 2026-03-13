import { useState } from "react";
import {
  Bell,
  Briefcase,
  FileText,
  Home,
  MessageCircle,
  Plus,
  User,
  UtensilsCrossed,
  Package,
  DollarSign,
  FolderOpen
} from "lucide-react";
import { Button } from "~/components/ui/button";
import type { JobOffer, ProgressItem } from "../types";

type CreatorDashboardMobileProps = {
  offers: JobOffer[];
  progress: ProgressItem[];
  stats: { ganhos: { value: string; subtitle: string }; ativos: number; solicitacoes: number };
};

const BOTTOM_NAV_ITEMS = [
  { id: "inicio", label: "Início", icon: Home, active: true },
  { id: "trabalhos", label: "Trabalhos", icon: Briefcase },
  { id: "mensagens", label: "Mensagens", icon: MessageCircle },
  { id: "perfil", label: "Perfil", icon: User }
];

export function CreatorDashboardMobile({
  offers,
  progress,
  stats
}: CreatorDashboardMobileProps) {
  return (
    <div className="relative min-h-screen bg-[#f6f5f8] pb-20">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[rgba(137,90,246,0.1)] bg-[rgba(246,245,248,0.8)] px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[rgba(137,90,246,0.2)]">
            <Home className="size-[18px] text-[#895af6]" />
          </div>
          <h1 className="text-lg font-bold tracking-[-0.45px] text-slate-900">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="relative p-2">
            <Bell className="size-5 text-slate-600" />
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-[#f6f5f8] bg-red-500" />
          </button>
          <HeaderAvatar />
        </div>
      </header>

      <main className="px-4 pb-24 pt-6">
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Bem-vindo, Lucas! 👋</h2>
          <p className="mt-1 text-sm text-slate-500">Aqui está o que está acontecendo hoje.</p>
        </section>

        <section className="mb-6 grid grid-cols-2 gap-3">
          <div className="col-span-2 rounded-[48px] bg-[#895af6] p-5">
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium text-white">Ganhos Totais</span>
              <DollarSign className="size-5 text-white" />
            </div>
            <p className="mt-2 text-[30px] font-bold leading-9 text-white">{stats.ganhos.value}</p>
            <p className="mt-1 text-xs text-white">{stats.ganhos.subtitle}</p>
          </div>
          <div className="rounded-[48px] border border-[rgba(137,90,246,0.05)] bg-white p-4 shadow-sm">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Ativos
            </span>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">{stats.ativos}</span>
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-100">
                <FolderOpen className="size-4 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="rounded-[48px] border border-[rgba(137,90,246,0.05)] bg-white p-4 shadow-sm">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Solicitações
            </span>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">{stats.solicitacoes}</span>
              <div className="flex size-8 items-center justify-center rounded-full bg-amber-100">
                <FileText className="size-4 text-amber-600" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Progresso Atual</h3>
            <a href="#" className="text-sm font-semibold text-[#895af6]">
              Ver todos
            </a>
          </div>
          <div className="flex flex-col gap-4 rounded-[48px] border border-[rgba(137,90,246,0.05)] bg-white p-4 shadow-sm">
            {progress.map((item) => (
              <div key={item.id}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">{item.title}</p>
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
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Ofertas Recentes</h3>
            <span className="rounded-full bg-[rgba(137,90,246,0.1)] px-2 py-1 text-xs font-bold text-[#895af6]">
              3 Novas
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="rounded-[48px] border border-[rgba(137,90,246,0.05)] bg-white p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-[32px] bg-slate-100">
                    {offer.iconType === "gastronomy" ? (
                      <UtensilsCrossed className="size-6 text-slate-600" />
                    ) : (
                      <Package className="size-6 text-slate-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{offer.title}</h4>
                      <span className="shrink-0 text-sm font-bold text-[#895af6]">
                        {offer.value}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{offer.location}</p>
                    <div className="mt-3 flex gap-2">
                      <Button variant="purple" size="sm" className="flex-1 rounded-2xl py-2">
                        Aceitar
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 rounded-2xl bg-slate-100 py-2 text-slate-700"
                      >
                        Recusar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[rgba(137,90,246,0.1)] bg-white/90 backdrop-blur-md">
        <div className="relative flex h-20 items-center">
          <div className="flex flex-1 justify-around">
            {BOTTOM_NAV_ITEMS.slice(0, 2).map((item) => {
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
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex -translate-y-1/2 justify-center">
            <button
              type="button"
              className="flex size-14 items-center justify-center rounded-full border-4 border-[#f6f5f8] bg-[#895af6] shadow-lg shadow-[rgba(137,90,246,0.4)]"
            >
              <Plus className="size-5 text-white" />
            </button>
          </div>
          <div className="flex flex-1 justify-around">
            {BOTTOM_NAV_ITEMS.slice(2, 4).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className="flex flex-col items-center gap-1 text-slate-400 transition-colors"
                >
                  <Icon className="size-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
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
