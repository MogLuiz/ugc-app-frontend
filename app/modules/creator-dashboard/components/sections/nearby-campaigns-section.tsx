import { AlertCircle, Compass } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { MobileEmptyState } from "~/components/ui/mobile-empty-state";
import { OpportunityCard } from "~/modules/opportunities/components/opportunity-card";
import { isOpportunitiesAddressRequiredError } from "~/modules/opportunities/errors";
import { useOpportunitiesQuery } from "~/modules/opportunities/queries";
import {
  DashboardCard,
  SectionHeader,
} from "~/modules/business-dashboard/components/sections/section-primitives";

function EmptyIllustration() {
  return (
    <div
      className="flex size-8 items-center justify-center rounded-xl bg-[#f0ebff]"
      aria-hidden
    >
      <Compass className="size-3.5 text-[#6a36d5]" />
    </div>
  );
}

export function NearbyCampaignsSection() {
  const { data, isLoading, isError, error, refetch } = useOpportunitiesQuery({
    limit: 2,
  });

  const items = data?.items.filter((i) => i.status === "OPEN") ?? [];

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4">
        <SectionHeader title="Oportunidades disponíveis" />
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 1 }).map((_, i) => (
            <DashboardCard key={i} className="animate-pulse p-5">
              <div className="h-4 w-40 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-28 rounded bg-slate-100" />
            </DashboardCard>
          ))}
        </div>
      </section>
    );
  }

  if (isError && isOpportunitiesAddressRequiredError(error)) {
    return (
      <section className="flex flex-col gap-4">
        <SectionHeader title="Oportunidades disponíveis" />
        <DashboardCard className="p-3 lg:p-3">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-xs font-medium text-amber-900">
                  Complete seu endereço
                </p>
                <p className="mb-3 text-xs leading-snug text-amber-700">
                  Você precisa completar seu endereço no perfil para visualizar
                  oportunidades perto de você.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="h-8 w-full bg-[#895af6] text-xs hover:bg-[#6a36d5] sm:w-auto"
                >
                  <Link to="/perfil">Ir para o perfil</Link>
                </Button>
              </div>
            </div>
          </div>
        </DashboardCard>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex flex-col gap-4">
        <SectionHeader title="Oportunidades disponíveis" />
        <DashboardCard className="p-3 lg:p-3">
          <MobileEmptyState
            density="compact"
            variant="no-data"
            illustration={<EmptyIllustration />}
            title="Não foi possível carregar"
            description="Tente novamente em instantes."
            actions={
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-[#6a36d5]/35 px-3.5 text-xs font-semibold text-[#6a36d5] hover:bg-[#6a36d5]/5"
                  onClick={() => void refetch()}
                >
                  Tentar novamente
                </Button>
              </div>
            }
          />
        </DashboardCard>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="flex flex-col gap-4">
        <SectionHeader title="Oportunidades disponíveis" />
        <DashboardCard className="p-3 lg:p-3">
          <MobileEmptyState
            density="compact"
            variant="no-data"
            illustration={<EmptyIllustration />}
            title="Nenhuma vaga no momento"
            description="Quando empresas abrirem vagas você verá aqui."
            actions={
              <div className="flex justify-center">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full border-[#6a36d5]/35 px-3.5 text-xs font-semibold text-[#6a36d5] hover:bg-[#6a36d5]/5"
                >
                  <Link to="/oportunidades">Ver oportunidades</Link>
                </Button>
              </div>
            }
          />
        </DashboardCard>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Oportunidades disponíveis"
        ctaLabel="Ver todas"
        ctaTo="/oportunidades"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>
    </section>
  );
}
