import { Briefcase, Mail, Star, Wallet } from "lucide-react";
import { cn } from "~/lib/utils";
import type { CreatorKpiCardVm } from "../../types";
import { DashboardCard } from "~/modules/business-dashboard/components/sections/section-primitives";

function KpiIcon({ id }: { id: string }) {
  if (id === "confirmed") {
    return <Briefcase className="size-5 text-[#6a36d5]" />;
  }
  if (id === "invites") {
    return <Mail className="size-5 text-sky-600" />;
  }
  if (id === "earnings") {
    return <Wallet className="size-5 text-emerald-600" />;
  }
  return <Star className="size-5 text-amber-500" />;
}

/** Largura mínima por card: evita 4 colunas espremidas ao lado da sidebar. */
const KPI_GRID =
  "grid w-full gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr))] sm:gap-3.5 lg:gap-4";

export function CreatorKPICards({
  items,
  isLoading,
}: {
  items: CreatorKpiCardVm[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <section className={KPI_GRID}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="min-w-0 animate-pulse rounded-[28px] border border-slate-100 bg-white p-4 sm:p-5 lg:rounded-[32px] lg:p-6"
          >
            <div className="h-3 max-w-[85%] rounded bg-slate-200" />
            <div className="mt-4 h-8 max-w-[55%] rounded bg-slate-100" />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className={KPI_GRID}>
      {items.map((stat) => (
        <DashboardCard
          key={stat.id}
          className={cn(
            "min-w-0 p-4 sm:p-5 lg:p-6",
            stat.id === "confirmed" &&
              "border-2 border-[rgba(106,54,213,0.2)] bg-[rgba(106,54,213,0.04)]"
          )}
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-[10px] font-bold uppercase leading-snug tracking-[0.07em] sm:text-[10px] sm:leading-[15px] sm:tracking-[0.08em]",
                  stat.id === "confirmed" ? "text-[#6a36d5]" : "text-[#595c5d]"
                )}
              >
                {stat.label}
              </p>
              <p
                className={cn(
                  "mt-1.5 whitespace-nowrap text-xl font-extrabold leading-none tracking-[-0.35px] tabular-nums sm:mt-2 sm:text-2xl sm:tracking-[-0.4px] lg:text-3xl lg:tracking-[-0.5px]",
                  stat.id === "confirmed" || stat.id === "earnings"
                    ? "text-[#6a36d5]"
                    : "text-[#2c2f30]"
                )}
                title={stat.valueDisplay}
              >
                {stat.valueDisplay}
              </p>
            </div>
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-2xl sm:size-10 lg:size-11",
                stat.id === "confirmed" ? "bg-[#6a36d5]/10" : "bg-slate-100"
              )}
            >
              <KpiIcon id={stat.id} />
            </div>
          </div>
        </DashboardCard>
      ))}
    </section>
  );
}
