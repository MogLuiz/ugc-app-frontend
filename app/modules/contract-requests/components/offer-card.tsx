import { Calendar, Clock, MapPin, Star } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { ContractRequestItem } from "../types";
import {
  formatCurrency,
  formatDateShort,
  formatDuration,
  formatTimeRange,
} from "../utils";

type OfferCardProps = {
  item: ContractRequestItem;
  isMutating: boolean;
  acceptLabel: string;
  rejectLabel: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onViewProfile: (item: ContractRequestItem) => void;
};

export function OfferCard({
  item,
  isMutating,
  acceptLabel,
  rejectLabel,
  onAccept,
  onReject,
  onViewProfile,
}: OfferCardProps) {
  const companyName = item.companyName ?? "Empresa";
  const companyLogoUrl = item.companyLogoUrl;
  const hasRating = item.companyRating != null && item.companyRating > 0;
  const jobTypeName = item.jobTypeName ?? "Serviço";
  const durationLabel = formatDuration(item.durationMinutes ?? 0, true);
  const hasValidDuration = durationLabel != null;
  /** Fonte única de valor: totalAmount (contrato); fallback totalPrice para compat */
  const amount = item.totalAmount ?? item.totalPrice;
  const initials =
    companyName.length >= 2
      ? companyName.slice(0, 2).toUpperCase()
      : `${(companyName[0] ?? "?").toUpperCase()}${(companyName[0] ?? "?").toUpperCase()}`;

  return (
    <article className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-sm lg:rounded-[32px] lg:p-6 lg:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      {(item.expiresSoon || item.status === "EXPIRED") && (
        <div
          className={cn(
            "absolute right-0 top-0 rounded-bl-2xl border-b border-l px-4 py-1",
            item.status === "EXPIRED"
              ? "border-slate-300/60 bg-slate-200/80"
              : "border-red-200/70 bg-red-500/10"
          )}
        >
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-wide",
              item.status === "EXPIRED" ? "text-slate-600" : "text-red-500"
            )}
          >
            {item.status === "EXPIRED" ? "Expirada" : "Expira em breve"}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4 lg:gap-6">
        {/* Header: logo, nome, rating, Ver perfil */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f1f0f3] lg:h-14 lg:w-14">
              {companyLogoUrl ? (
                <img
                  src={companyLogoUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-slate-400 lg:text-xl">
                  {initials}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-bold text-slate-900 lg:text-lg">
                {companyName}
              </h3>
              <div className="min-h-[1.25rem]">
                {hasRating && (
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-600 lg:text-sm">
                    <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400 lg:size-4" />
                    <span className="font-semibold">
                      {item.companyRating!.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full border border-[rgba(137,90,246,0.2)] text-xs font-bold text-[#895af6] hover:bg-[rgba(137,90,246,0.05)] lg:px-5"
            onClick={() => onViewProfile(item)}
          >
            Ver perfil
          </Button>
        </div>

        {/* Tags: job type, duration (oculta duração quando 0/inválido) */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f0ebff] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#6d3ad8]">
            {jobTypeName}
          </span>
          {hasValidDuration ? (
            <span className="rounded-full bg-[#e0e7ff] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#3730a3]">
              {durationLabel}
            </span>
          ) : null}
        </div>

        {/* Description */}
        <p
          className={cn(
            "line-clamp-2 text-sm",
            item.description?.trim()
              ? "text-slate-600"
              : "italic text-slate-400"
          )}
        >
          {item.description?.trim() || "Sem descrição informada"}
        </p>

        {/* Quick info: desktop = row, mobile = bento grid (distância + data/hora) */}
        <div className="hidden border-y border-slate-200/30 py-4 lg:flex lg:gap-6">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-600">
              {item.creatorDistance?.formatted ?? "—"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-900">
              {formatDateShort(item.startsAt)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-600">
              {formatTimeRange(item.startsAt, item.durationMinutes)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:hidden">
          <div className="flex gap-2 rounded-2xl bg-[#f6f5f8] p-3">
            <MapPin className="size-4 shrink-0 text-slate-500" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                Local
              </p>
              <p className="truncate text-xs font-semibold text-slate-900">
                {item.creatorDistance?.formatted ?? "—"}
              </p>
            </div>
          </div>
          <div className="flex gap-2 rounded-2xl bg-[#f6f5f8] p-3">
            <Calendar className="size-4 shrink-0 text-slate-500" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">
                Data e Hora
              </p>
              <p className="truncate text-xs font-semibold text-slate-900">
                {new Date(item.startsAt).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                •{" "}
                {new Date(item.startsAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Financial block */}
        <div className="rounded-2xl bg-[#f6f5f8] p-4 lg:p-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Serviço</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(item.creatorBasePrice, item.currency)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Transporte</span>
              <span className="font-medium text-slate-900">
                {item.transport?.formatted ?? formatCurrency(item.transportFee, item.currency)}
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-200/50 pt-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
              Total
            </span>
            <span className="text-xl font-black text-[#895af6] lg:text-3xl">
              {formatCurrency(amount, item.currency)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className={cn(
          "flex gap-3",
          "lg:justify-center"
        )}>
          <Button
            variant="purple"
            className="flex-1 rounded-full lg:flex-none lg:px-8"
            onClick={() => void onAccept(item.id)}
            disabled={isMutating || item.status === "EXPIRED"}
          >
            {acceptLabel}
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-6 lg:px-8"
            onClick={() => void onReject(item.id)}
            disabled={isMutating || item.status === "EXPIRED"}
          >
            {rejectLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}
