import { Clock, MapPin, Search } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { NearbyCampaignCardVm } from "../../types";
import { formatBrlCompact } from "../../adapters/creator-dashboard-adapters";
import {
  DashboardCard,
  SectionHeader,
} from "~/modules/business-dashboard/components/sections/section-primitives";
import { MobileEmptyState } from "~/components/ui/mobile-empty-state";

function NearbyEmptyIllustration() {
  return (
    <div
      className="relative flex size-8 items-center justify-center rounded-xl bg-[#f0ebff]"
      aria-hidden
    >
      <MapPin className="size-3.5 text-[#6a36d5]" />
      <span className="absolute -bottom-0.5 -right-0.5 flex size-3 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-100/90">
        <Search className="size-2 text-[#6a36d5]" aria-hidden />
      </span>
    </div>
  );
}

export function NearbyCampaignsSection({
  items,
}: {
  items: NearbyCampaignCardVm[];
}) {
  if (items.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <SectionHeader title="Campanhas disponíveis perto de você" />
        <DashboardCard className="p-3 lg:p-3">
          <MobileEmptyState
            density="compact"
            variant="no-data"
            illustration={<NearbyEmptyIllustration />}
            title="Sem campanhas por perto"
            description="Ainda não há campanhas na sua região. Tente atualizar seu perfil para atrair marcas de qualquer lugar."
          />
        </DashboardCard>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Campanhas disponíveis perto de você"
        ctaLabel="Ver todas"
        ctaTo="/campanhas"
      />

      <div className="flex gap-4 overflow-x-auto pb-1 lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0">
        {items.map((item) => (
          <DashboardCard
            key={item.id}
            className={cn(
              "min-w-[280px] shrink-0 overflow-hidden p-0 lg:min-w-0",
            )}
          >
            <div className="h-40 bg-gradient-to-br from-[#6a36d5]/20 via-slate-100 to-slate-50" />
            <div className="space-y-4 p-5">
              <div>
                <h3 className="text-lg font-black text-[#2c2f30]">
                  {item.title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#595c5d]">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5 shrink-0 text-[#6a36d5]" />
                    {item.distanceKm.toFixed(1)} km
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5 shrink-0 text-[#6a36d5]" />
                    {item.durationHours}h gravação
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-[#6a36d5]/25 bg-gradient-to-br from-[#6a36d5]/[0.08] to-white px-4 py-3 text-center shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6a36d5]">
                  Pagamento
                </p>
                <p className="mt-1 text-3xl font-black tracking-tight text-[#6a36d5] lg:text-4xl">
                  💰 {formatBrlCompact(item.payment)}
                </p>
              </div>

              <Button
                asChild
                className="h-11 w-full rounded-full bg-[#6a36d5] font-bold hover:bg-[#5b2fc4]"
              >
                <Link to="/mapa">Ver campanha</Link>
              </Button>
            </div>
          </DashboardCard>
        ))}
      </div>
    </section>
  );
}
