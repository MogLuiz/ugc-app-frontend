import { Briefcase, Mail, Star, Wallet } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import type { CreatorKpiCardVm } from "../../types";

function KpiIcon({ id }: { id: string }) {
  if (id === "confirmed") {
    return <Briefcase className="size-5 text-[#895af6] sm:text-[#6a36d5]" />;
  }
  if (id === "invites") {
    return <Mail className="size-5 text-amber-500 sm:text-sky-600" />;
  }
  if (id === "earnings") {
    return <Wallet className="size-5 text-slate-500 sm:text-emerald-600" />;
  }
  return <Star className="size-5 text-amber-500" />;
}

/** Mobile: 2 colunas fixas (Figma). Desktop: auto-fit com mínimo 14 rem. */
const KPI_GRID =
  "grid w-full grid-cols-2 gap-4 sm:[grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr))] sm:gap-3.5 lg:gap-4";

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
            className={cn(
              "animate-pulse",
              "rounded-3xl border border-[#f8fafc] bg-white p-[21px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
              "sm:min-w-0 sm:rounded-[28px] sm:border-[rgba(106,54,213,0.08)] sm:p-5 sm:shadow-[0px_4px_6px_-1px_rgba(106,54,213,0.04),0px_20px_40px_-1px_rgba(44,47,48,0.08)] lg:rounded-[32px] lg:p-6",
            )}
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
      {items.map((stat) => {
        const cardClass = cn(
          "flex flex-col gap-[8.5px]",
          "rounded-3xl border border-[#f8fafc] bg-white p-[21px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
          "sm:min-w-0 sm:rounded-[28px] sm:border sm:border-[rgba(106,54,213,0.08)] sm:p-5 sm:shadow-[0px_4px_6px_-1px_rgba(106,54,213,0.04),0px_20px_40px_-1px_rgba(44,47,48,0.08)] lg:rounded-[32px] lg:p-6",
          stat.id === "confirmed" &&
            "sm:border-2 sm:border-[rgba(106,54,213,0.2)] sm:bg-[rgba(106,54,213,0.04)]",
          stat.href &&
            "cursor-pointer hover:brightness-[0.98] active:brightness-95 transition-[filter]",
        );

        const inner = (
          <>
            <p
              className={cn(
                "line-clamp-2 text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-[#64748b]",
                "sm:line-clamp-none sm:leading-snug sm:tracking-[0.07em]",
                stat.id === "confirmed" && "sm:text-[#6a36d5]",
              )}
            >
              {stat.label}
            </p>
            {stat.subtitle && (
              <p className="text-[10px] text-slate-400 leading-tight -mt-1 mb-0.5">
                {stat.subtitle}
              </p>
            )}
            <div className="flex items-end justify-between gap-1 sm:items-center sm:gap-2 lg:gap-3">
              <p
                className={cn(
                  "min-w-0 truncate font-black tabular-nums",
                  stat.id === "earnings" ? "text-lg leading-7" : "text-2xl leading-8",
                  stat.id === "confirmed" && "text-[#895af6]",
                  stat.id === "invites" && "text-amber-500",
                  (stat.id === "earnings" || stat.id === "rating") && "text-[#0f172a]",
                  "sm:text-xl sm:font-extrabold sm:leading-none sm:tracking-[-0.35px] lg:text-3xl lg:tracking-[-0.5px]",
                  (stat.id === "confirmed" || stat.id === "earnings")
                    ? "sm:text-[#6a36d5]"
                    : "sm:text-[#2c2f30]",
                )}
                title={stat.valueDisplay}
              >
                {stat.valueDisplay}
              </p>
              <div
                className={cn(
                  "flex shrink-0 items-center justify-center",
                  "sm:size-9 sm:rounded-2xl lg:size-11",
                  stat.id === "confirmed" ? "sm:bg-[#6a36d5]/10" : "sm:bg-slate-100",
                )}
              >
                <KpiIcon id={stat.id} />
              </div>
            </div>
          </>
        );

        return stat.href ? (
          <Link key={stat.id} to={stat.href} className={cardClass}>
            {inner}
          </Link>
        ) : (
          <div key={stat.id} className={cardClass}>
            {inner}
          </div>
        );
      })}
    </section>
  );
}
