import { Clock, MapPin, Search, ArrowRight } from "lucide-react";
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

function CampaignsIllustration() {
  return (
    <div className="relative flex size-[110px] items-center justify-center">
      {/* Radar rings */}
      <div className="absolute size-12 rounded-full bg-[#895af6]/20" />
      <div className="absolute size-20 rounded-full bg-[#895af6]/10" />

      {/* Container principal */}
      <div className="relative flex size-[110px] items-center justify-center overflow-hidden rounded-[22px] bg-white shadow-[0_12px_24px_-6px_rgba(0,0,0,0.15)]">
        {/* Pin composto */}
        <div className="relative -mt-2 flex flex-col items-center">
          {/* Cabeça do pin */}
          <div className="relative flex size-9 items-center justify-center rounded-full bg-[#895af6] shadow-[0_6px_10px_-2px_rgba(137,90,246,0.4)]">
            <Search className="size-3.5 text-white" aria-hidden="true" />
            <div className="absolute inset-0.5 rounded-full border-2 border-white/20" />
          </div>
          {/* Cauda do pin */}
          <div
            className="h-2.5 w-2.5 bg-[#895af6]"
            style={{ clipPath: "polygon(20% 0%, 80% 0%, 50% 100%)" }}
          />
        </div>

        {/* Badge "0 campanhas" */}
        <div className="absolute bottom-2 flex items-center gap-1 rounded-full border border-slate-100 bg-[#f8fafc] px-1.5 py-0.5">
          <div className="size-1 rounded-full bg-slate-300" />
          <span className="text-[8px] font-bold uppercase tracking-[0.8px] text-slate-400">
            0 campanhas
          </span>
        </div>
      </div>

      {/* Chip flutuante "Buscando..." */}
      <div className="absolute right-0 top-2 flex items-center gap-1 rounded-lg bg-[#895af6] px-1.5 py-0.5 shadow-sm">
        <div className="size-1 rounded-full bg-white/60" />
        <span className="text-[8px] font-black uppercase tracking-[0.5px] text-white">
          Buscando...
        </span>
      </div>
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
        <DashboardCard>
          <MobileEmptyState
            variant="initial"
            className="py-6"
            illustration={<CampaignsIllustration />}
            title="Sem campanhas por perto"
            description="Ainda não há campanhas na sua região. Tente atualizar seu perfil para atrair marcas de qualquer lugar."
            actions={
              <Link
                to="/perfil"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#895af6] px-8 py-4 text-base font-bold text-white shadow-[0_10px_15px_-3px_rgba(137,90,246,0.25)] transition-colors hover:bg-[#7c4aed]"
              >
                Atualizar perfil
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            }
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
