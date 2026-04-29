import { CalendarDays, ChevronRight, Clock, MapPin, Video } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { DashboardCard } from "~/components/ui/dashboard-card";
import { MobileEmptyState } from "~/components/ui/mobile-empty-state";
import { cn } from "~/lib/utils";
import type { CreatorUpcomingCampaignVm } from "../../types";
import {
  SectionHeader,
  SectionMessage,
  SectionSkeleton,
} from "~/modules/business-dashboard/components/sections/section-primitives";

function UpcomingEmptyIllustration() {
  return (
    <div
      className="relative flex size-8 items-center justify-center rounded-xl bg-[#f0ebff]"
      aria-hidden
    >
      <CalendarDays className="size-3.5 text-[#6a36d5]" />
      <span className="absolute -bottom-0.5 -right-0.5 flex size-3 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100/90">
        <Video className="size-2 text-[#6a36d5]" aria-hidden />
      </span>
    </div>
  );
}

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
  const hideSectionHeaderCta =
    !isLoading && !errorMessage && items.length === 0;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Próximos trabalhos"
        ctaLabel={hideSectionHeaderCta ? undefined : "Ver todos"}
        ctaTo={hideSectionHeaderCta ? undefined : "/ofertas?tab=confirmed"}
      />

      {isLoading ? <SectionSkeleton rows={2} /> : null}

      {!isLoading && errorMessage ? (
        <SectionMessage message={errorMessage} tone="error" />
      ) : null}

      {!isLoading && !errorMessage && items.length === 0 ? (
        <DashboardCard className="p-3 lg:p-3">
          <MobileEmptyState
            density="compact"
            variant="no-data"
            illustration={<UpcomingEmptyIllustration />}
            title="Nenhuma gravação agendada"
            description="Campanhas aceitas e confirmadas aparecerão aqui."
            actions={
              <div className="flex justify-center">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-[#6a36d5]/35 px-3.5 text-xs font-semibold text-[#6a36d5] hover:bg-[#6a36d5]/5"
                >
                  <Link to="/dashboard">Explorar campanhas</Link>
                </Button>
              </div>
            }
          />
        </DashboardCard>
      ) : null}

      <div className="flex flex-col gap-3">
        {!isLoading &&
          !errorMessage &&
          items.map((row) => (
            <div key={row.id} className="overflow-hidden rounded-[32px]">
              <Link to={row.href} className="block">
                <div className="flex items-stretch gap-0">
                  <div className="flex w-[76px] shrink-0 flex-col items-center justify-center rounded-l-[28px] bg-[#6a36d5]/10 px-2 py-4 text-center lg:w-[84px]">
                    <span className="text-[10px] font-bold uppercase leading-tight text-[#6a36d5]">
                      {row.dateBadge.split(" ")[0]}
                    </span>
                    <span className="text-xl font-black leading-none text-[#2c2f30]">
                      {row.dateBadge.split(" ").slice(1).join(" ")}
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 border-l border-[rgba(106,54,213,0.12)] bg-white px-4 py-4 lg:px-5">
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
                          row.statusBadge === "Confirmada" && "bg-emerald-100 text-emerald-800",
                          row.statusBadge === "Pendente" && "bg-amber-100 text-amber-800",
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
                      {row.locationDisplay ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3.5 text-[#6a36d5]" />
                          {row.locationDisplay}
                        </span>
                      ) : null}
                      {row.durationDisplay ? (
                        <span className="inline-flex items-center gap-1">
                          ⏱ {row.durationDisplay}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center bg-white pr-3">
                    <ChevronRight className="size-5 text-[#595c5d]/40" aria-hidden />
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </section>
  );
}
