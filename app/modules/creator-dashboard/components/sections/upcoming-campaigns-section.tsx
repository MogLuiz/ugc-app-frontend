import { ChevronRight, Clock, MapPin } from "lucide-react";
import { cn } from "~/lib/utils";
import type { CreatorUpcomingCampaignVm } from "../../types";
import {
  DashboardCard,
  SectionHeader,
  SectionMessage,
  SectionSkeleton,
} from "~/modules/business-dashboard/components/sections/section-primitives";

export function UpcomingCampaignsSection({
  items,
  isLoading,
  errorMessage,
  isRefreshing,
}: {
  items: CreatorUpcomingCampaignVm[];
  isLoading: boolean;
  errorMessage: string | null;
  isRefreshing: boolean;
}) {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Próximos trabalhos"
        ctaLabel="Ver todos"
        ctaTo="/ofertas?tab=confirmed"
      />

      {isRefreshing && !isLoading ? (
        <p className="text-xs font-medium text-[#595c5d]/80">
          Atualizando agenda…
        </p>
      ) : null}

      {isLoading ? <SectionSkeleton rows={2} /> : null}

      {!isLoading && errorMessage ? (
        <SectionMessage message={errorMessage} tone="error" />
      ) : null}

      {!isLoading && !errorMessage && items.length === 0 ? (
        <SectionMessage
          message="Nenhuma gravação agendada nos próximos dias."
          tone="default"
        />
      ) : null}

      <div className="flex flex-col gap-3">
        {!isLoading &&
          !errorMessage &&
          items.map((row) => (
            <DashboardCard key={row.id} className="p-0">
              <div className="flex items-stretch gap-0">
                <div className="flex w-[76px] shrink-0 flex-col items-center justify-center rounded-l-[28px] bg-[#6a36d5]/10 px-2 py-4 text-center lg:w-[84px]">
                  <span className="text-[10px] font-bold uppercase leading-tight text-[#6a36d5]">
                    {row.dateBadge.split(" ")[0]}
                  </span>
                  <span className="text-xl font-black leading-none text-[#2c2f30]">
                    {row.dateBadge.split(" ").slice(1).join(" ")}
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 border-l border-[rgba(106,54,213,0.12)] px-4 py-4 lg:px-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {row.dayBanner === "HOJE" ? (
                      <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                        🔥 HOJE
                      </span>
                    ) : row.dayBanner === "AMANHÃ" ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-amber-800">
                        AMANHÃ
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        row.statusBadge === "Confirmada" &&
                          "bg-emerald-100 text-emerald-800",
                        row.statusBadge === "Pendente" &&
                          "bg-amber-100 text-amber-800",
                        row.statusBadge === "Concluída" &&
                          "bg-slate-100 text-slate-600",
                      )}
                    >
                      {row.statusBadge}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-[#2c2f30]">
                    {row.campaignName}
                  </h4>
                  <p className="text-xs font-medium text-[#595c5d]">
                    {row.companyName}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#595c5d]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5 text-[#6a36d5]" />
                      {row.timeDisplay}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5 text-[#6a36d5]" />
                      {row.locationDisplay}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      ⏱ {row.durationDisplay}
                    </span>
                  </div>
                </div>

                <div className="hidden items-center pr-3 lg:flex">
                  <ChevronRight
                    className="size-5 text-[#595c5d]/40"
                    aria-hidden
                  />
                </div>
              </div>
            </DashboardCard>
          ))}
      </div>
    </section>
  );
}
