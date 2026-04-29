import { BriefcaseBusiness, CalendarDays, Clock3, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import type { CompanyDashboardMetric } from "../../types";

function MetricIcon({ metric }: { metric: CompanyDashboardMetric }) {
  if (metric.id === "active-campaigns") {
    return <BriefcaseBusiness className="size-5 text-[#895af6] sm:text-[#6a36d5]" />;
  }
  if (metric.id === "pending-applications") {
    return <Clock3 className="size-5 text-[#6a36d5]" />;
  }
  if (metric.id === "upcoming-recordings") {
    return <CalendarDays className="size-5 text-sky-600" />;
  }
  return (
    <MessageCircle
      className={cn(
        "size-5",
        metric.tone === "highlight" ? "text-[#895af6] sm:text-[#6a36d5]" : "text-slate-500"
      )}
    />
  );
}

export function BusinessDashboardStats({ stats }: { stats: CompanyDashboardMetric[] }) {
  return (
    <section className="grid w-full grid-cols-2 gap-4 sm:[grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr))] sm:gap-3.5 lg:gap-4">
      {stats.map((stat) => (
        <Link key={stat.id} to={stat.href} className="block h-full">
          <div
            className={cn(
              "flex h-full flex-col gap-[8.5px] cursor-pointer transition-opacity hover:opacity-80",
              // mobile: flat card (same as creator)
              "rounded-3xl border border-[#f8fafc] bg-white p-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
              // desktop: elevated card
              "sm:rounded-[28px] sm:border sm:border-[rgba(106,54,213,0.08)] sm:p-5 sm:shadow-[0px_4px_6px_-1px_rgba(106,54,213,0.04),0px_20px_40px_-1px_rgba(44,47,48,0.08)] lg:rounded-[32px] lg:p-6",
              // highlight only from sm (same as creator "confirmed" card)
              stat.tone === "highlight" &&
                "sm:border-2 sm:border-[rgba(106,54,213,0.2)] sm:bg-[rgba(106,54,213,0.04)]"
            )}
          >
            {/* Label — min-h reserves 2-line height so value stays aligned across all cards */}
            <p
              className={cn(
                "line-clamp-2 min-h-[30px] text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-[#64748b]",
                "sm:line-clamp-none sm:leading-snug sm:tracking-[0.07em]",
                stat.tone === "highlight" && "sm:text-[#6a36d5]"
              )}
            >
              {stat.label}
            </p>

            {/* Value + icon */}
            <div className="flex items-end justify-between gap-1 sm:items-center sm:gap-2 lg:gap-3">
              <p
                className={cn(
                  "min-w-0 truncate font-black tabular-nums text-2xl leading-8",
                  "sm:text-xl sm:font-extrabold sm:leading-none sm:tracking-[-0.35px] lg:text-3xl lg:tracking-[-0.5px]",
                  stat.id === "active-campaigns" || stat.tone === "highlight"
                    ? "text-[#895af6] sm:text-[#6a36d5]"
                    : "text-[#0f172a] sm:text-[#2c2f30]"
                )}
              >
                {stat.value}
              </p>
              <div
                className={cn(
                  "flex shrink-0 items-center justify-center",
                  "sm:size-9 sm:rounded-2xl lg:size-11",
                  stat.tone === "highlight" ? "sm:bg-[#6a36d5]/10" : "sm:bg-slate-100"
                )}
              >
                <MetricIcon metric={stat} />
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-[#64748b] sm:text-sm sm:text-[#595c5d]">
              {stat.subtitle}
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}
