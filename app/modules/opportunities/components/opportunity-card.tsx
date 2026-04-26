import {
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
} from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import type { OpportunityListItem } from "../types";
import {
  formatAmount,
  formatDistance,
  formatDurationMinutes,
  formatShortDate,
  getDeadlineDays,
} from "../helpers";

interface OpportunityCardProps {
  opportunity: OpportunityListItem;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const deadlineDays = getDeadlineDays(opportunity.expiresAt);
  const isDeadlineSoon = deadlineDays <= 3;

  const deadlineLabel = isDeadlineSoon
    ? `Expira em ${deadlineDays} ${deadlineDays === 1 ? "dia" : "dias"}`
    : `Candidaturas até ${new Date(opportunity.expiresAt).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "short",
        },
      )}`;

  return (
    <Link
      to={`/oportunidades/${opportunity.id}`}
      className="block w-full min-w-0 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:p-6"
    >
      {/* Header: título + cache (grid evita sobreposição quando a coluna fica estreita) */}
      <div className="grid items-start gap-3 [grid-template-columns:minmax(0,1fr)_auto]">
        <h3 className="min-w-0 break-words text-lg font-black tracking-[-0.02em] text-[#6a36d5]">
          {opportunity.jobType?.name ?? "Oportunidade"}
        </h3>

        <div className="shrink-0 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Cache
          </p>
          <p className="mt-1 text-2xl font-black text-[#6a36d5]">
            {formatAmount(opportunity.creatorNetServiceAmountCents / 100)}
          </p>
        </div>
      </div>

      {/* Descrição */}
      <div className="mt-2 flex items-start gap-1.5">
        <FileText className="mt-0.5 size-3.5 shrink-0 text-[#895af6]" />
        <p className="line-clamp-2 text-sm text-slate-600">
          {opportunity.description || "Sem descrição"}
        </p>
      </div>

      {/* Metadados */}
      <div className="mt-4 grid min-w-0 gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays className="size-4 shrink-0 text-[#895af6]" />
          <span className="min-w-0">
            {formatShortDate(opportunity.startsAt)}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <Clock3 className="size-4 shrink-0 text-[#895af6]" />
          <span className="min-w-0">
            {formatDurationMinutes(opportunity.durationMinutes)}
          </span>
        </div>
        <div className="flex min-w-0 items-start gap-2 sm:col-span-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-[#895af6]" />
          <span className="min-w-0 flex-1 truncate">
            {opportunity.jobFormattedAddress ?? "Local a combinar"}
            {" · "}
            {formatDistance(opportunity.distanceKm)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-2 border-t border-slate-100 pt-4">
        <div
          className={cn(
            "min-w-0 text-xs font-semibold",
            isDeadlineSoon ? "text-red-500" : "text-slate-400",
          )}
        >
          {deadlineLabel}
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          Ver detalhes
          <ChevronRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
