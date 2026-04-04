import { MapPin, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import type { CreatorMapModel } from "../types";

type CreatorMapCardProps = {
  creator: CreatorMapModel;
  isActive: boolean;
  onSelect: () => void;
  variant?: "desktop" | "mobile";
};

const AVAILABILITY_CONFIG = {
  available: { symbol: "✓", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  limited: { symbol: "!", className: "bg-amber-50 text-amber-700 border-amber-200" },
  busy: { symbol: "×", className: "bg-slate-100 text-slate-500 border-slate-200" },
} as const;

function CreatorAvatar({
  avatarUrl,
  name,
  className,
}: {
  avatarUrl: string | null;
  name: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const initial = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  if (!avatarUrl || broken) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-purple-100",
          className,
        )}
      >
        <span className="font-bold leading-none text-purple-600">{initial}</span>
      </div>
    );
  }

  return (
    <img
      src={avatarUrl}
      alt={name}
      className={cn("rounded-lg object-cover ring-1 ring-slate-100", className)}
      onError={() => setBroken(true)}
    />
  );
}

export function CreatorMapCard({
  creator,
  isActive,
  onSelect,
  variant = "desktop",
}: CreatorMapCardProps) {
  const availability = creator.availability ? AVAILABILITY_CONFIG[creator.availability] : null;
  const hasRating = creator.rating > 0;
  const hasRegion = Boolean(creator.region);
  const hasSpecialty = Boolean(creator.specialty);
  const hasPrice = creator.priceFrom != null;
  const hasDistance = creator.distanceKm != null;
  const mobileTypeLabel = "UGC";

  if (variant === "mobile") {
    return (
      <article
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => e.key === "Enter" && onSelect()}
        className={cn(
          "cursor-pointer select-none rounded-2xl border bg-white transition-all duration-150",
          isActive
            ? "border-purple-300 shadow-[0_10px_28px_rgba(137,90,246,0.18)] ring-1 ring-purple-200"
            : "border-slate-200/90 shadow-[0_6px_20px_rgba(15,23,42,0.06)]",
        )}
      >
        <div className="p-3.5">
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <CreatorAvatar
                avatarUrl={creator.avatarUrl}
                name={creator.name}
                className="h-12 w-12 text-lg"
              />
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

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {creator.name}
                  </p>

                  {(hasDistance || hasRegion) && (
                    <div className="mt-1 flex items-center gap-1.5">
                      {hasDistance && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-700">
                          <MapPin size={10} />
                          {creator.distanceKm!.toFixed(1)} km
                        </span>
                      )}
                      {hasRegion && (
                        <span className="truncate text-xs text-slate-500">
                          {creator.region}
                        </span>
                      )}
                    </div>
                  )}

                  {hasRating && (
                    <div className="mt-1 flex items-center gap-1">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-slate-800">
                        {creator.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {hasPrice && (
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] uppercase tracking-[0.08em] text-slate-400">
                      A partir de
                    </p>
                    <p className="text-[1.05rem] font-bold leading-tight text-slate-900">
                      R$ {creator.priceFrom}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2 text-[11px]">
            {hasSpecialty && (
              <span className="flex-1 rounded-xl bg-slate-50 px-2.5 py-2 text-slate-700">
                <span className="text-slate-400">Nicho: </span>
                <span className="font-medium">{creator.specialty}</span>
              </span>
            )}
            <span className="flex-1 rounded-xl bg-slate-50 px-2.5 py-2 text-slate-700">
              <span className="text-slate-400">Tipo: </span>
              <span className="font-medium">{mobileTypeLabel}</span>
            </span>
          </div>

          <div className="mt-3">
            <Link
              to={`/criador/${creator.id}`}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-colors",
                isActive
                  ? "bg-[#895af6] text-white hover:bg-[#7c4ee0]"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100",
              )}
            >
              {isActive ? "Ver perfil completo" : "Ver detalhes"}
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className={cn(
        "cursor-pointer rounded-xl border transition-all duration-150 select-none",
        isActive
          ? "border-purple-300 bg-white shadow-md shadow-purple-100/60 ring-1 ring-purple-200"
          : "border-slate-200 bg-slate-50/50 hover:border-purple-200 hover:bg-white hover:shadow-sm",
      )}
    >
      {/* Top row: photo + info + price */}
      <div className="flex items-start gap-3 p-3.5">
        {/* Photo with availability badge */}
        <div className="relative flex-shrink-0">
          <CreatorAvatar
            avatarUrl={creator.avatarUrl}
            name={creator.name}
            className="h-12 w-12 text-lg"
          />
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
          {(creator.distanceKm != null || hasRegion) && (
            <div className="mt-0.5 flex items-center gap-1.5">
              {creator.distanceKm != null && (
                <span className="flex items-center gap-0.5 rounded bg-purple-50 px-1.5 py-0.5 text-[11px] font-semibold text-purple-700">
                  <MapPin size={10} />
                  {creator.distanceKm.toFixed(1)}km
                </span>
              )}
              {hasRegion && (
                <span className="truncate text-xs text-slate-500">{creator.region}</span>
              )}
            </div>
          )}
          {hasRating && (
            <div className="mt-0.5 flex items-center gap-1">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-slate-800">
                {creator.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        {hasPrice && (
          <div className="flex-shrink-0 self-start text-right">
            <p className="text-[10px] text-slate-400">a partir de</p>
            <p className="text-base font-bold text-slate-900">R$ {creator.priceFrom}</p>
          </div>
        )}
      </div>

      {/* Niche + type tags — always rendered for height consistency */}
      <div className="flex gap-2 px-3.5 pb-3 text-xs">
        {hasSpecialty && (
          <span className="flex-1 truncate rounded-lg bg-slate-50 px-2 py-1.5 text-slate-700">
            <span className="text-slate-400">Nicho: </span>
            <span className="font-medium">{creator.specialty}</span>
          </span>
        )}
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
