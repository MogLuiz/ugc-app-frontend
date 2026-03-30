import type { ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";

export { DashboardCard } from "~/components/ui/dashboard-card";

export function SectionHeader({
  title,
  description,
  ctaLabel,
  ctaTo,
  addon,
}: {
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaTo?: string;
  addon?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-black tracking-[-0.3px] text-[#2c2f30] lg:text-xl">{title}</h2>
          {addon}
        </div>
        {description ? <p className="mt-1 text-sm text-[#595c5d]">{description}</p> : null}
      </div>

      {ctaLabel && ctaTo ? (
        <Link
          to={ctaTo}
          className="shrink-0 text-sm font-semibold text-[#6a36d5] hover:text-[#5b2fc4]"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function SectionMessage({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        tone === "error"
          ? "border-rose-200 bg-rose-50 text-rose-600"
          : "border-slate-200 bg-slate-50 text-[#595c5d]"
      )}
    >
      {message}
    </div>
  );
}

export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-slate-100 p-4"
        >
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-28 rounded bg-slate-100" />
          <div className="mt-4 h-2 w-full rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
