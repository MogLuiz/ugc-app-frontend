import { MapPin, Star } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import type { CreatorMapModel } from "../types";

type CreatorMapCardProps = {
  creator: CreatorMapModel;
  isActive: boolean;
  onSelect: () => void;
};

const AVAILABILITY_CONFIG = {
  available: { symbol: "✓", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  limited: { symbol: "!", className: "bg-amber-50 text-amber-700 border-amber-200" },
  busy: { symbol: "×", className: "bg-slate-100 text-slate-500 border-slate-200" },
} as const;

export function CreatorMapCard({ creator, isActive, onSelect }: CreatorMapCardProps) {
  const availability = creator.availability ? AVAILABILITY_CONFIG[creator.availability] : null;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className={cn(
        "cursor-pointer rounded-xl border transition-all select-none",
        isActive
          ? "border-purple-300 bg-white shadow-md shadow-purple-100/50"
          : "border-slate-200 bg-slate-50/50 hover:border-purple-200 hover:bg-white",
      )}
    >
      {/* Top row: photo + info + price */}
      <div className="flex items-center gap-3 p-3.5">
        {/* Photo with availability badge */}
        <div className="relative flex-shrink-0">
          {creator.avatarUrl ? (
            <img
              src={creator.avatarUrl}
              alt={creator.name}
              className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-100"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 ring-1 ring-slate-100">
              <span className="text-lg font-bold text-purple-600">
                {creator.name[0]?.toUpperCase() ?? "?"}
              </span>
            </div>
          )}
          {availability && (
            <div
              className={cn(
                "absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-md border text-[9px] font-bold",
                availability.className,
              )}
            >
              {availability.symbol}
            </div>
          )}
        </div>

        {/* Main info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{creator.name}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            {creator.distanceKm != null && (
              <span className="flex items-center gap-0.5 rounded bg-purple-50 px-1.5 py-0.5 text-[11px] font-semibold text-purple-700">
                <MapPin size={10} />
                {creator.distanceKm.toFixed(1)}km
              </span>
            )}
            <span className="truncate text-xs text-slate-500">{creator.region}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-slate-800">{creator.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex-shrink-0 text-right">
          <p className="text-[10px] text-slate-400">a partir de</p>
          <p className="text-base font-bold text-slate-900">
            {creator.priceFrom != null ? `R$ ${creator.priceFrom}` : "—"}
          </p>
        </div>
      </div>

      {/* Niche + type tags */}
      <div className="flex gap-2 px-3.5 pb-3 text-xs">
        <span className="flex-1 truncate rounded-lg bg-slate-50 px-2 py-1.5 text-slate-700">
          <span className="text-slate-400">Nicho: </span>
          <span className="font-medium">{creator.specialty}</span>
        </span>
        <span className="flex-1 truncate rounded-lg bg-slate-50 px-2 py-1.5 text-slate-700">
          <span className="text-slate-400">Tipo: </span>
          <span className="font-medium">UGC</span>
        </span>
      </div>

      {/* CTA */}
      <div className="px-3.5 pb-3.5">
        <Link
          to={`/criador/${creator.id}`}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "block w-full rounded-lg py-2 text-center text-sm font-medium transition-colors",
            isActive
              ? "bg-[#895af6] text-white hover:bg-[#7c4ee0]"
              : "bg-purple-50 text-purple-700 hover:bg-purple-100",
          )}
        >
          {isActive ? "Ver perfil completo" : "Ver detalhes"}
        </Link>
      </div>
    </article>
  );
}
