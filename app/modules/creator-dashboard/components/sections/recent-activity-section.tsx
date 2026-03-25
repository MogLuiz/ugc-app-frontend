import { Link } from "react-router";
import type { CreatorActivityItemVm } from "../../types";
import {
  DashboardCard,
  SectionMessage,
  SectionSkeleton,
} from "~/modules/business-dashboard/components/sections/section-primitives";

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
  return (
    <DashboardCard>
      <div>
        <h2 className="text-lg font-black tracking-[-0.3px] text-[#2c2f30]">Atividade recente</h2>
        <p className="mt-1 text-sm text-[#595c5d]">Últimas movimentações das suas campanhas.</p>
      </div>

      {isRefreshing && !isLoading ? (
        <p className="mt-4 text-xs font-medium text-[#595c5d]/70">Atualizando…</p>
      ) : null}

      <div className="mt-5">
        {isLoading ? <SectionSkeleton rows={3} /> : null}

        {!isLoading && errorMessage ? (
          <SectionMessage message={errorMessage} tone="error" />
        ) : null}

        {!isLoading && !errorMessage && items.length === 0 ? (
          <SectionMessage message="Nenhuma atividade recente por aqui." tone="default" />
        ) : null}

        {!isLoading && !errorMessage && items.length > 0 ? (
          <ul className="relative space-y-0 pl-1">
            <div
              className="absolute bottom-2 left-[11px] top-2 w-px bg-[rgba(106,54,213,0.2)]"
              aria-hidden
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
                      <p className="text-sm font-bold text-[#2c2f30]">{item.title}</p>
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
                      <p className="text-sm font-bold text-[#2c2f30]">{item.title}</p>
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

      <div className="mt-2 lg:mt-4">
        <Link
          to="/campanhas"
          className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(106,54,213,0.2)] py-2.5 text-sm font-bold text-[#6a36d5] hover:bg-[#6a36d5]/5"
        >
          Ver histórico de campanhas
        </Link>
      </div>
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
