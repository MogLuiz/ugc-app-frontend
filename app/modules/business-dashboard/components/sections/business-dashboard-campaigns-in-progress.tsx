import { CalendarDays, Clock3, MapPin, MessageCircle, Timer, Video } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { MobileEmptyState } from "~/components/ui/mobile-empty-state";
import type { CompanyCampaignsLocationState } from "~/modules/contract-requests/company-campaigns-location-state";
import { cn } from "~/lib/utils";
import type { CompanyDashboardCampaignItem, OperationalStatusVariant } from "../../types";
import { DashboardCard, SectionHeader, SectionMessage, SectionSkeleton } from "./section-primitives";

function CampaignsInProgressEmptyIllustration() {
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

function OperationalBadge({
  label,
  variant,
}: {
  label: string;
  variant: OperationalStatusVariant;
}) {
  const cls =
    variant === "confirmed"
      ? "bg-emerald-100 text-emerald-800"
      : variant === "pending_schedule"
        ? "bg-amber-100 text-amber-900"
        : variant === "in_progress"
          ? "bg-sky-100 text-sky-900"
          : variant === "awaiting_confirmation"
            ? "bg-[#6a36d5]/10 text-[#6a36d5]"
            : "bg-slate-100 text-slate-700";

  return (
    <span className={cn("rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide", cls)}>
      {label}
    </span>
  );
}


function UrgencyRibbon({ urgency }: { urgency: "HOJE" | "AMANHÃ" }) {
  const isToday = urgency === "HOJE";
  return (
    <span
      className={cn(
        "absolute -left-2 -top-2 z-10 rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md",
        isToday ? "bg-[#b41340]" : "bg-[#6a36d5]"
      )}
    >
      {urgency}
    </span>
  );
}

export function BusinessDashboardCampaignsInProgress({
  items,
  isLoading,
  errorMessage,
  hasCampaignData,
  isRefreshing,
  getCreatorFallbackInitials,
}: {
  items: CompanyDashboardCampaignItem[];
  isLoading: boolean;
  errorMessage: string | null;
  hasCampaignData: boolean;
  isRefreshing: boolean;
  getCreatorFallbackInitials: (name: string) => string;
}) {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Campanhas em andamento"
        description="Próximas gravações e logística."
        ctaLabel="Ver todas"
        ctaTo="/ofertas?tab=IN_PROGRESS"
      />

      {isLoading ? <SectionSkeleton rows={3} /> : null}

      {!isLoading && errorMessage ? (
        <SectionMessage message={errorMessage} tone="error" />
      ) : null}

      {!isLoading && !errorMessage && items.length === 0 ? (
        <DashboardCard shadowTone="neutral" className="p-3 lg:p-3">
          {hasCampaignData ? (
            <MobileEmptyState
              density="compact"
              variant="no-data"
              illustration={<CampaignsInProgressEmptyIllustration />}
              title="Nenhuma campanha ativa"
              description="Quando uma campanha for aceita ou entrar em andamento, ela aparecerá aqui."
              actions={
                <div className="flex justify-center">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full border-[#6a36d5]/35 px-3.5 text-xs font-semibold text-[#6a36d5] hover:bg-[#6a36d5]/5"
                  >
                    <Link to="/ofertas?tab=IN_PROGRESS">Ver ofertas</Link>
                  </Button>
                </div>
              }
            />
          ) : (
            <MobileEmptyState
              density="compact"
              variant="no-data"
              illustration={<CampaignsInProgressEmptyIllustration />}
              title="Você ainda não possui campanhas"
              description="Use o marketplace para encontrar creators e iniciar novas solicitações."
              actions={
                <div className="flex justify-center">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full border-[#6a36d5]/35 px-3.5 text-xs font-semibold text-[#6a36d5] hover:bg-[#6a36d5]/5"
                  >
                    <Link to="/marketplace">Explorar marketplace</Link>
                  </Button>
                </div>
              }
            />
          )}
        </DashboardCard>
      ) : null}

      {!isLoading && !errorMessage && items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <DashboardCard
              key={item.id}
              shadowTone="neutral"
              className="relative p-4 lg:p-5"
            >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="relative shrink-0">
                      {item.dayUrgency ? <UrgencyRibbon urgency={item.dayUrgency} /> : null}
                      {item.creatorAvatarUrl ? (
                        <img
                          src={item.creatorAvatarUrl}
                          alt=""
                          className={cn(
                            "size-16 rounded-2xl object-cover lg:size-[72px]",
                            item.dayUrgency && "ring-2 ring-offset-2",
                            item.dayUrgency === "HOJE" && "ring-[#b41340]/40",
                            item.dayUrgency === "AMANHÃ" && "ring-[#6a36d5]/40"
                          )}
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex size-16 items-center justify-center rounded-2xl bg-[#6a36d5]/10 text-base font-bold text-[#6a36d5] lg:size-[72px]",
                            item.dayUrgency && "ring-2 ring-offset-2",
                            item.dayUrgency === "HOJE" && "ring-[#b41340]/40",
                            item.dayUrgency === "AMANHÃ" && "ring-[#6a36d5]/40"
                          )}
                        >
                          {getCreatorFallbackInitials(item.creatorName)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-[#2c2f30]">{item.title}</h3>
                        <OperationalBadge
                          label={item.operationalStatusLabel}
                          variant={item.operationalStatusVariant}
                        />
                      </div>
                      <p className="mt-1 text-sm font-medium text-[#6a36d5]">{item.creatorName}</p>

                      {item.progressSummary ? (
                        <p className="mt-1 text-xs text-[#595c5d]/80">{item.progressSummary}</p>
                      ) : null}
                      <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-[#595c5d] sm:grid-cols-2">
                        <li className="flex items-center gap-2">
                          <CalendarDays className="size-4 shrink-0 text-[#6a36d5]" aria-hidden />
                          <span>{item.dateLine}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock3 className="size-4 shrink-0 text-[#6a36d5]" aria-hidden />
                          <span>{item.timeLine}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <MapPin className="size-4 shrink-0 text-[#6a36d5]" aria-hidden />
                          <span className="truncate">{item.locationText}</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Timer className="size-4 shrink-0 text-[#6a36d5]" aria-hidden />
                          <span>{item.durationLine}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center lg:w-fit lg:flex-col lg:items-stretch">
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/ofertas?tab=IN_PROGRESS", {
                          state: { openContractRequestId: item.id } satisfies CompanyCampaignsLocationState,
                        })
                      }
                      className="rounded-[32px] border border-slate-200 bg-slate-50 px-5 py-3 text-center text-xs font-bold text-[#2c2f30] transition hover:bg-slate-100 lg:w-full lg:cursor-pointer"
                    >
                      Ver campanha
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/chat?contractRequestId=${item.id}`)}
                      className="flex items-center justify-center gap-2 rounded-[32px] bg-[#6a36d5] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#5b2fc4] lg:w-full lg:cursor-pointer"
                    >
                      <MessageCircle className="size-4" aria-hidden />
                      Chat
                    </button>
                  </div>
                </div>
            </DashboardCard>
          ))}
        </div>
      ) : null}
    </section>
  );
}
