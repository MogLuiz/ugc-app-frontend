import { Link } from "react-router";
import { ArrowRight, Bell, Zap } from "lucide-react";
import type { CreatorActivityItemVm } from "../../types";
import {
  DashboardCard,
  SectionMessage,
  SectionSkeleton,
} from "~/modules/business-dashboard/components/sections/section-primitives";
import { MobileEmptyState } from "~/components/ui/mobile-empty-state";

function ActivityIllustration() {
  return (
    <div className="relative w-[120px]">
      {/* Glow ambiente */}
      <div className="absolute -inset-2 rounded-full bg-[#895af6]/10 blur-[20px]" />

      {/* Card skeleton superior (esmaecido) */}
      <div className="relative flex items-start gap-2 rounded-xl border border-white/80 bg-white/60 p-2 opacity-40 shadow-sm backdrop-blur-sm">
        <div className="size-5 shrink-0 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-1.5 pt-0.5">
          <div className="h-1.5 w-14 rounded-full bg-slate-200" />
          <div className="h-1.5 w-10 rounded-full bg-slate-100" />
        </div>
      </div>

      {/* Card central destacado */}
      <div className="relative z-10 -mx-1.5 my-1 rounded-xl border border-[#895af6]/10 bg-white p-2.5 shadow-[0_8px_16px_-4px_rgba(137,90,246,0.12)]">
        {/* Badge decorativo */}
        <div className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#6366f1] shadow-sm">
          <Zap className="size-2 text-white" aria-hidden="true" />
        </div>
        <div className="flex items-start gap-2">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f0ebff]">
            <Bell className="size-3 text-[#895af6]" aria-hidden="true" />
          </div>
          <div className="flex-1 space-y-1.5 pt-0.5">
            <div className="h-1.5 w-14 rounded-full bg-[#895af6]/20" />
            <div className="h-1.5 w-full rounded-full bg-slate-100" />
            <div className="h-1.5 w-8 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Card skeleton inferior (esmaecido) */}
      <div className="relative flex items-start gap-2 rounded-xl border border-white/80 bg-white/60 p-2 opacity-40 shadow-sm backdrop-blur-sm">
        <div className="size-5 shrink-0 rounded-full bg-slate-200" />
        <div className="flex-1 space-y-1.5 pt-0.5">
          <div className="h-1.5 w-16 rounded-full bg-slate-200" />
          <div className="h-1.5 w-8 rounded-full bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export function RecentActivitySection({
  items,
  isLoading,
  errorMessage,
  isRefreshing,
}: {
  items: CreatorActivityItemVm[];
  isLoading: boolean;
  errorMessage: string | null;
  isRefreshing: boolean;
}) {
  const isEmpty = !isLoading && !errorMessage && items.length === 0;

  return (
    <DashboardCard>
      <div>
        <h2 className="text-lg font-black tracking-[-0.3px] text-[#2c2f30]">
          Atividade recente
        </h2>
        <p className="mt-1 text-sm text-[#595c5d]">
          Últimas movimentações das suas campanhas.
        </p>
      </div>

      <div className="mt-3">
        {isLoading ? <SectionSkeleton rows={3} /> : null}

        {!isLoading && errorMessage ? (
          <SectionMessage message={errorMessage} tone="error" />
        ) : null}

        {isEmpty ? (
          <MobileEmptyState
            variant="initial"
            density="expanded"
            illustration={<ActivityIllustration />}
            title="Sem atividades recentes"
            description="Convites e atualizações de campanhas aparecerão aqui em tempo real."
            actions={
              <div className="flex flex-col gap-1">
                <Link
                  to="/perfil"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#895af6] px-5 py-3 text-base font-bold text-white transition-colors hover:bg-[#7c4aed]"
                >
                  Completar perfil
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
                <Link
                  to="/ofertas"
                  className="inline-flex w-full items-center justify-center rounded-full py-1.5 text-xs font-semibold text-[#895af6]/60 transition-colors hover:text-[#895af6]"
                >
                  Ver minhas campanhas
                </Link>
              </div>
            }
          />
        ) : null}

        {!isLoading && !errorMessage && items.length > 0 ? (
          <ul className="relative space-y-0 pl-1">
            <div
              className="absolute bottom-2 left-[11px] top-2 w-px bg-[rgba(106,54,213,0.2)]"
              aria-hidden="true"
            />
            {items.map((item) => (
              <li key={item.id} className="flex gap-3">
                {item.href ? (
                  <Link
                    to={item.href}
                    className="flex min-w-0 flex-1 gap-3 rounded-xl py-1 transition hover:bg-[#6a36d5]/5"
                  >
                    <TimelineDot />
                    <div className="min-w-0 flex-1 pb-5">
                      <p className="text-sm font-bold text-[#2c2f30]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-[#595c5d]">
                        {item.description}
                      </p>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#595c5d]/70">
                        {item.relativeLabel}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="flex min-w-0 flex-1 gap-3 py-1">
                    <TimelineDot />
                    <div className="min-w-0 flex-1 pb-5">
                      <p className="text-sm font-bold text-[#2c2f30]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-[#595c5d]">
                        {item.description}
                      </p>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#595c5d]/70">
                        {item.relativeLabel}
                      </p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {!isEmpty ? (
        <div className="mt-2 lg:mt-4">
          <Link
            to="/campanhas"
            className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(106,54,213,0.2)] py-2.5 text-sm font-bold text-[#6a36d5] hover:bg-[#6a36d5]/5"
          >
            Ver histórico de campanhas
          </Link>
        </div>
      ) : null}
    </DashboardCard>
  );
}

function TimelineDot() {
  return (
    <div className="relative z-[1] flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[#6a36d5] bg-white">
      <span className="size-2 rounded-full bg-[#6a36d5]" />
    </div>
  );
}
