import { Calendar, CalendarClock, Clock, MapPin } from "lucide-react";
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

  return (
    <Link
      to={`/oportunidades/${opportunity.id}`}
      className="block rounded-[28px] border-2 border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#895af6] hover:shadow-md group sm:p-6"
    >
      {/* Header: tipo + data */}
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {opportunity.jobType ? (
            <span className="inline-flex items-center rounded-full border border-purple-100 bg-purple-50 px-2.5 py-1 text-xs font-medium text-[#895af6]">
              {opportunity.jobType.name}
            </span>
          ) : null}
        </div>
        {isDeadlineSoon ? (
          <span className="inline-flex shrink-0 items-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
            Urgente
          </span>
        ) : null}
      </div>

      {/* Valor */}
      <div className="mb-5">
        <div className="mb-0.5 text-sm text-slate-500">Valor do projeto</div>
        <div className="text-3xl font-bold text-slate-900 transition-colors group-hover:text-[#895af6]">
          {formatAmount(opportunity.offeredAmount)}
        </div>
      </div>

      {/* Grid de metadados */}
      <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 shrink-0 text-slate-400" />
          <div>
            <div className="text-xs text-slate-500">Data</div>
            <div className="text-sm font-medium text-slate-900">
              {formatShortDate(opportunity.startsAt)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="size-4 shrink-0 text-slate-400" />
          <div>
            <div className="text-xs text-slate-500">Duração</div>
            <div className="text-sm font-medium text-slate-900">
              {formatDurationMinutes(opportunity.durationMinutes)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 col-span-2 min-w-0">
          <MapPin className="size-4 shrink-0 text-slate-400" />
          <div className="min-w-0">
            <div className="text-xs text-slate-500">
              Local &bull; {formatDistance(opportunity.distanceKm)}
            </div>
            <div className="text-sm font-medium text-slate-900 truncate">
              {opportunity.jobFormattedAddress ?? "Local a combinar"}
            </div>
          </div>
        </div>
      </div>

      {/* Deadline */}
      <div className="border-t border-slate-100 pt-4">
        <div
          className={cn(
            "flex items-center gap-2 text-sm",
            isDeadlineSoon ? "font-medium text-red-600" : "text-slate-600"
          )}
        >
          <CalendarClock className="size-4 shrink-0" />
          {isDeadlineSoon ? (
            <span>
              Encerra em <strong>{deadlineDays}</strong>{" "}
              {deadlineDays === 1 ? "dia" : "dias"}
            </span>
          ) : (
            <span>
              Candidaturas até{" "}
              {new Date(opportunity.expiresAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
