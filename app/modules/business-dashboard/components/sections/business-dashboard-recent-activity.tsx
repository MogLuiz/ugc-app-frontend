import { Link } from "react-router";
import type { CompanyDashboardActivityItem } from "../../types";
import { DashboardCard, SectionMessage, SectionSkeleton } from "./section-primitives";

export function BusinessDashboardRecentActivity({
  items,
  isLoading,
  errorMessage,
  isRefreshing,
}: {
  items: CompanyDashboardActivityItem[];
  isLoading: boolean;
  errorMessage: string | null;
  isRefreshing: boolean;
}) {
  return (
    <DashboardCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-[-0.3px] text-[#2c2f30]">Atividade recente</h2>
          <p className="mt-1 text-sm text-[#595c5d]">Últimos eventos das campanhas e mensagens.</p>
        </div>
      </div>

      <div className="mt-5">
        {isLoading ? <SectionSkeleton rows={3} /> : null}

        {!isLoading && errorMessage ? (
          <SectionMessage message={errorMessage} tone="error" />
        ) : null}

        {!isLoading && !errorMessage && items.length === 0 ? (
          <SectionMessage message="Nenhuma atividade recente por aqui." tone="default" />
        ) : null}

        {!isLoading && !errorMessage && items.length > 0 ? (
          <ul className="relative space-y-0 pl-2">
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
                    <div className="relative z-[1] flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[#6a36d5] bg-white">
                      <span className="size-2 rounded-full bg-[#6a36d5]" />
                    </div>
                    <div className="min-w-0 flex-1 pb-6">
                      <p className="text-sm font-bold text-[#2c2f30]">{item.title}</p>
                      <p className="mt-1 text-sm leading-snug text-[#595c5d]">{item.description}</p>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#595c5d]/70">
                        {item.relativeLabel}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="flex min-w-0 flex-1 gap-3 py-1">
                    <div className="relative z-[1] flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-[#6a36d5] bg-white">
                      <span className="size-2 rounded-full bg-[#6a36d5]" />
                    </div>
                    <div className="min-w-0 flex-1 pb-6">
                      <p className="text-sm font-bold text-[#2c2f30]">{item.title}</p>
                      <p className="mt-1 text-sm leading-snug text-[#595c5d]">{item.description}</p>
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
    </DashboardCard>
  );
}
