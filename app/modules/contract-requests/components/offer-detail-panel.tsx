import { MapPin, Star, Clock, Calendar, Layers, Timer, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { ContractRequestItem } from "../types";
import {
  formatCurrency,
  formatDateShort,
  formatDuration,
  formatTimeRange,
  getInitials,
} from "../utils";

type OfferDetailPanelProps = {
  item: ContractRequestItem;
  isMutating: boolean;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
};

function getExpiryLabel(expiresAt?: string): string | null {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) {
    const mins = Math.floor(diff / (1000 * 60));
    return `${mins} min`;
  }
  return `${hours}h`;
}

function InfoCell({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.8px] text-slate-500">
        {label}
      </span>
      <span className="text-sm font-bold leading-snug text-slate-900">
        {value ?? "—"}
      </span>
    </div>
  );
}

export function OfferDetailPanel({
  item,
  isMutating,
  onAccept,
  onReject,
}: OfferDetailPanelProps) {
  const companyName = item.companyName ?? "Empresa";
  const jobTypeName = item.jobTypeName ?? "Serviço";
  const amount = item.totalAmount ?? item.totalPrice;
  const distance = item.creatorDistance?.formatted;
  const isExpired = item.status === "EXPIRED";
  const expiryLabel = getExpiryLabel(item.expiresAt);
  const durationLabel = formatDuration(item.durationMinutes, false);
  const address = item.jobFormattedAddress ?? item.jobAddress;
  const hasTransport = (item.transportFee ?? 0) > 0;

  const initials = getInitials(companyName);

  const mapsUrl = item.jobLatitude && item.jobLongitude
    ? `https://maps.google.com/?q=${item.jobLatitude},${item.jobLongitude}`
    : address
    ? `https://maps.google.com/?q=${encodeURIComponent(address)}`
    : null;

  // Parse description for bullet points (lines starting with "•", "-", "*")
  const descriptionLines = (item.description ?? "").split("\n").filter(Boolean);
  const bulletLines = descriptionLines.filter((l) =>
    /^[\•\-\*]/.test(l.trim())
  );
  const mainDescription = descriptionLines
    .filter((l) => !/^[\•\-\*]/.test(l.trim()))
    .join(" ")
    .trim();

  return (
    <div className="flex flex-col gap-6">
      {/* ── Company header ── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f0ebff] shadow-sm lg:size-20 lg:rounded-3xl">
            {item.companyLogoUrl ? (
              <img
                src={item.companyLogoUrl}
                alt={companyName}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-[#895af6]">{initials}</span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 lg:text-2xl">
              {companyName}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-slate-500">
              {item.companyRating != null && item.companyRating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-700">
                    {item.companyRating.toFixed(1)}
                  </span>
                </span>
              )}
              <span className="font-medium">124 jobs concluídos</span>
            </div>
          </div>
        </div>

        {/* Action buttons (desktop top-right) */}
        <div className="hidden flex-col items-end gap-2 lg:flex">
          <div className="flex gap-2">
            <Button
              variant="purple"
              size="lg"
              className="rounded-full px-8 shadow-[0px_10px_15px_-3px_rgba(137,90,246,0.2)]"
              onClick={() => void onAccept(item.id)}
              disabled={isMutating || isExpired}
            >
              {isMutating ? "Aguarde..." : "Aceitar oferta"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8"
              onClick={() => void onReject(item.id)}
              disabled={isMutating || isExpired}
            >
              Recusar
            </Button>
          </div>
          {expiryLabel && (
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <AlertCircle className="size-3.5 text-amber-500" />
              Expira em {expiryLabel}
            </span>
          )}
        </div>
      </div>

      {/* ── Info grid ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <div
          className={cn(
            "grid divide-x divide-y divide-slate-100",
            "grid-cols-2 lg:grid-cols-3"
          )}
        >
          <div className="p-4">
            <InfoCell label="Tipo" value={jobTypeName} />
          </div>
          <div className="p-4">
            <InfoCell label="Duração" value={durationLabel} />
          </div>
          <div className="p-4">
            <InfoCell
              label="Data"
              value={new Date(item.startsAt).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
              })}
            />
          </div>
          <div className="p-4">
            <InfoCell
              label="Horário"
              value={formatTimeRange(item.startsAt, item.durationMinutes)}
            />
          </div>
          <div className="p-4">
            <InfoCell
              label="Local"
              value={
                item.mode === "REMOTE"
                  ? "Remoto"
                  : item.jobFormattedAddress
                    ? item.jobFormattedAddress.split(",").slice(-2).join(",").trim()
                    : item.jobAddress
              }
            />
          </div>
          <div className="p-4">
            <InfoCell label="Distância" value={distance ?? (item.mode === "REMOTE" ? "Remoto" : "—")} />
          </div>
        </div>
      </div>

      {/* ── Briefing ── */}
      {item.description && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.8px] text-slate-500">
            <span className="size-1.5 rounded-full bg-[#895af6]" />
            Briefing do Projeto
          </h3>
          {mainDescription && (
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              {mainDescription}
            </p>
          )}
          {bulletLines.length > 0 && (
            <ul className="space-y-2">
              {bulletLines.map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#895af6]" />
                  <span>{line.replace(/^[\•\-\*]\s*/, "")}</span>
                </li>
              ))}
            </ul>
          )}
          {!mainDescription && bulletLines.length === 0 && (
            <p className="text-sm italic text-slate-400">Sem descrição informada</p>
          )}
        </div>
      )}

      {/* ── Payment ── */}
      <div className="overflow-hidden rounded-2xl bg-slate-900 p-6 shadow-[0px_20px_25px_-5px_rgba(15,23,42,0.1)]">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.8px] text-slate-400">
              Pagamento Total
            </p>
            <p className="text-3xl font-black tracking-tight text-white">
              {formatCurrency(amount, item.currency)}
            </p>
          </div>
          <span className="rounded-full bg-[rgba(137,90,246,0.2)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.8px] text-[#d0bcff]">
            Garantido
          </span>
        </div>

        {/* Breakdown */}
        <div className="space-y-2 border-t border-white/10 pt-4">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Serviço</span>
            <span className="font-medium text-slate-200">
              {formatCurrency(item.creatorBasePrice, item.currency)}
            </span>
          </div>
          {hasTransport && (
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Transporte</span>
              <span className="font-medium text-slate-200">
                {item.transport?.formatted ??
                  formatCurrency(item.transportFee, item.currency)}
              </span>
            </div>
          )}
        </div>

        <p className="mt-4 text-[10px] text-slate-500">
          Pagamento garantido pela plataforma após a conclusão do serviço.
        </p>
      </div>

      {/* ── Map ── */}
      {address && (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {/* Map placeholder */}
          <div className="relative h-36 bg-slate-100">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
            {/* Grid lines decoration */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            {/* Pin */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-[rgba(137,90,246,0.15)]" />
                <div className="relative flex size-8 items-center justify-center rounded-full border-4 border-white bg-[#895af6] shadow-md">
                  <MapPin className="size-3.5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Address + open maps */}
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.8px] text-slate-400">
                Endereço
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">{address}</p>
            </div>
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(137,90,246,0.1)] transition-colors hover:bg-[rgba(137,90,246,0.2)]"
                aria-label="Abrir no mapa"
              >
                <ExternalLink className="size-4 text-[#895af6]" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile action buttons ── */}
      <div className="flex flex-col gap-3 lg:hidden">
        <div className="flex gap-3">
          <Button
            variant="purple"
            size="lg"
            className="flex-1 rounded-full shadow-[0px_10px_15px_-3px_rgba(137,90,246,0.2)]"
            onClick={() => void onAccept(item.id)}
            disabled={isMutating || isExpired}
          >
            {isMutating ? "Aguarde..." : "Aceitar oferta"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-6"
            onClick={() => void onReject(item.id)}
            disabled={isMutating || isExpired}
          >
            Recusar
          </Button>
        </div>
        {expiryLabel && (
          <p className="text-center text-xs text-slate-500">
            <AlertCircle className="mr-1 inline size-3.5 text-amber-500" />
            Você tem até {expiryLabel} para responder esta oferta.
          </p>
        )}
      </div>
    </div>
  );
}
