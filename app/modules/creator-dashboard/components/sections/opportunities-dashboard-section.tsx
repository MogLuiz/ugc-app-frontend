import { Compass } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { DashboardCard, SectionHeader } from "~/modules/business-dashboard/components/sections/section-primitives";
import { MobileEmptyState } from "~/components/ui/mobile-empty-state";
import { useOpportunitiesQuery } from "~/modules/opportunities/queries";

function OpportunitiesIllustration() {
  return (
    <div
      className="flex size-8 items-center justify-center rounded-xl bg-[#f0ebff]"
      aria-hidden
    >
      <Compass className="size-3.5 text-[#6a36d5]" />
    </div>
  );
}

export function OpportunitiesDashboardSection() {
  const { data, isLoading } = useOpportunitiesQuery({ limit: 50 });

  const openCount =
    data?.items.filter((i) => i.status === "OPEN").length ?? 0;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Oportunidades"
        ctaLabel="Ver todas"
        ctaTo="/oportunidades"
      />

      {isLoading ? (
        <DashboardCard className="animate-pulse p-5">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-28 rounded bg-slate-100" />
        </DashboardCard>
      ) : openCount === 0 ? (
        <DashboardCard className="p-3 lg:p-3">
          <MobileEmptyState
            density="compact"
            variant="no-data"
            illustration={<OpportunitiesIllustration />}
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
      ) : (
        <DashboardCard className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#f0ebff]">
                <Compass className="size-5 text-[#895af6]" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {openCount}{" "}
                  {openCount === 1 ? "vaga aberta" : "vagas abertas"}
                </p>
                <p className="text-sm text-slate-500">
                  Candidate-se agora
                </p>
              </div>
            </div>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[#895af6] font-semibold hover:bg-[#6a36d5]"
            >
              <Link to="/oportunidades">Ver vagas</Link>
            </Button>
          </div>
        </DashboardCard>
      )}
    </section>
  );
}
