import { BriefcaseBusiness, CheckCircle2, Clock3, Users } from "lucide-react";
import { cn } from "~/lib/utils";
import type { CompanyDashboardMetric } from "../../types";
import { DashboardCard } from "./section-primitives";

function MetricIcon({ metricId }: { metricId: CompanyDashboardMetric["id"] }) {
  if (metricId === "active-campaigns") {
    return <BriefcaseBusiness className="size-5 text-[#6a36d5]" />;
  }
  if (metricId === "active-creators") {
    return <Users className="size-5 text-sky-600" />;
  }
  if (metricId === "completed-campaigns") {
    return <CheckCircle2 className="size-5 text-emerald-600" />;
  }
  return <Clock3 className="size-5 text-[#6a36d5]" />;
}

export function BusinessDashboardStats({ stats }: { stats: CompanyDashboardMetric[] }) {
  return (
    <section className="flex gap-4 overflow-x-auto pb-1 lg:grid lg:max-w-none lg:grid-cols-4 lg:overflow-visible lg:pb-0">
      {stats.map((stat) => (
        <DashboardCard
          key={stat.id}
          className={cn(
            "min-w-[240px] shrink-0 lg:min-w-0",
            stat.tone === "highlight" &&
              "border-2 border-[rgba(106,54,213,0.2)] bg-[rgba(106,54,213,0.05)] p-[26px] lg:pt-6"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p
                className={cn(
                  "text-[10px] font-bold uppercase leading-[15px] tracking-[0.1em]",
                  stat.tone === "highlight" ? "text-[#6a36d5]" : "text-[#595c5d]"
                )}
              >
                {stat.label}
              </p>
              <p
                className={cn(
                  "mt-3 text-4xl font-extrabold leading-10 tracking-[-0.8px]",
                  stat.id === "active-campaigns" || stat.tone === "highlight"
                    ? "text-[#6a36d5]"
                    : "text-[#2c2f30]"
                )}
              >
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-[#595c5d]">{stat.subtitle}</p>
            </div>
            <div
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                stat.tone === "highlight" ? "bg-[#6a36d5]/10" : "bg-slate-100"
              )}
            >
              <MetricIcon metricId={stat.id} />
            </div>
          </div>
          {stat.tone === "highlight" && stat.value > 0 ? (
            <div className="mt-3 flex items-center gap-2">
              <span className="relative flex size-3 items-center justify-center">
                <span className="absolute size-3 rounded-full bg-[#6a36d5] opacity-75" />
                <span className="size-3 rounded-full bg-[#6a36d5]" />
              </span>
            </div>
          ) : null}
        </DashboardCard>
      ))}
    </section>
  );
}
