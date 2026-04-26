import { Calendar, Clock, MapPin } from "lucide-react";
import { cn } from "~/lib/utils";
import type { ContractRequestItem } from "../types";
import { formatCurrency } from "../utils";

type OfferListCardProps = {
  item: ContractRequestItem;
  isActive?: boolean;
  onClick: () => void;
};

function formatDayMonth(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OfferListCard({ item, isActive = false, onClick }: OfferListCardProps) {
  const companyName = item.companyName ?? "Empresa";
  const jobTypeName = item.jobTypeName ?? "Serviço";
  const amount = item.creatorPayoutAmountCents / 100;
  const distance = item.creatorDistance?.formatted;

  const initials = companyName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");

  const isExpired = item.status === "EXPIRED";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left transition-all bg-white",
        // Mobile: rounded-2xl, no border — just shadow on bg-[#f6f5f8]
        // Desktop: rounded-xl with border + optional active state
        "rounded-2xl lg:rounded-xl",
        "shadow-sm",
        isActive
          ? "lg:border-2 lg:border-[#895af6] lg:bg-[rgba(240,235,255,0.4)] lg:shadow-[0_0_0_4px_rgba(137,90,246,0.05)]"
          : "lg:border lg:border-[rgba(226,232,240,0.4)] lg:hover:border-[rgba(137,90,246,0.3)] lg:hover:bg-slate-50/60",
        isExpired && "opacity-60"
      )}
    >
      <div className="p-5">
        {/* Value — first, most prominent */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <span
            className={cn(
              "text-2xl font-black tracking-tight text-slate-900",
              isActive && "lg:text-[#895af6]"
            )}
          >
            {formatCurrency(amount, item.currency)}
          </span>
          {isExpired && (
            <span className="shrink-0 rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              Expirada
            </span>
          )}
          {!isExpired && item.expiresSoon && (
            <span className="shrink-0 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-500">
              Expira em breve
            </span>
          )}
        </div>

        {/* Company + job type */}
        <div className="mb-4">
          {item.companyLogoUrl ? (
            <div className="mb-2 flex items-center gap-2">
              <img
                src={item.companyLogoUrl}
                alt=""
                className="size-6 rounded-lg object-cover"
              />
              <span className="text-sm font-bold text-slate-900">{companyName}</span>
            </div>
          ) : (
            <p className="mb-0.5 text-sm font-bold text-slate-900">{companyName}</p>
          )}
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#895af6]">
            {jobTypeName}
          </p>
        </div>

        {/* Date / time / distance */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-slate-100 pt-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Calendar className="size-3.5 shrink-0 text-slate-400" />
            {formatDayMonth(item.startsAt)}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Clock className="size-3.5 shrink-0 text-slate-400" />
            {formatTime(item.startsAt)}
          </span>
          {distance && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <MapPin className="size-3.5 shrink-0 text-slate-400" />
              {distance}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
