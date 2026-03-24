import { CalendarDays, MapPin, MessageCircle, Star, X } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import type { CompanyCampaignStatus, ContractRequestItem } from "../types";
import {
  formatCurrency,
  formatDateShort,
  getContractRequestStatusMeta,
  getInitials,
} from "../utils";

type CampaignDetailsModalProps = {
  item: ContractRequestItem | null;
  onClose: () => void;
  onChatClick?: (item: ContractRequestItem) => void;
};

function resolveStatus(status: ContractRequestItem["status"]): CompanyCampaignStatus {
  if (status === "PENDING" || status === "PENDING_ACCEPTANCE") return "PENDING";
  if (status === "ACCEPTED") return "ACCEPTED";
  if (status === "IN_PROGRESS") return "IN_PROGRESS";
  if (status === "COMPLETED") return "COMPLETED";
  if (status === "REJECTED") return "CANCELLED";
  return "CANCELLED";
}

export function CampaignDetailsModal({ item, onClose, onChatClick }: CampaignDetailsModalProps) {
  if (!item) return null;

  const status = resolveStatus(item.status);
  const statusMeta = getContractRequestStatusMeta(status);
  const creatorName = item.creator?.name ?? item.creatorNameSnapshot ?? "Creator";
  const creatorAvatarUrl = item.creator?.avatarUrl ?? item.creatorAvatarUrlSnapshot;
  const creatorRating = item.creator?.rating ?? null;
  const title = item.job?.title ?? item.jobTypeName ?? "Campanha";
  const description = item.job?.description ?? item.description;
  const durationMinutes = item.job?.durationMinutes ?? item.durationMinutes;
  const startsAt = item.schedule?.startTime ?? item.startsAt;
  const city = item.location?.city;
  const state = item.location?.state;
  const locationText =
    city && state
      ? `${city}, ${state}`
      : city || state || item.jobFormattedAddress || item.jobAddress || "Local a combinar";
  const totalAmount = item.pricing?.totalAmount ?? item.totalAmount ?? item.totalPrice;
  const baseAmount = item.pricing?.baseAmount ?? item.creatorBasePrice;
  const transportAmount = item.pricing?.transportAmount ?? item.transportFee;
  const actions = item.actions ?? {
    canCancel: status === "PENDING",
    canChat: status === "ACCEPTED",
    canViewDetails: true,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl",
          "animate-in fade-in zoom-in-95 duration-200"
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-details-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {creatorAvatarUrl ? (
              <img
                src={creatorAvatarUrl}
                alt={creatorName}
                className="size-14 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#895af6]/10 text-base font-bold text-[#895af6]">
                {getInitials(creatorName)}
              </div>
            )}
            <div className="min-w-0">
              <h2 id="campaign-details-title" className="text-lg font-bold text-slate-900">
                {creatorName}
              </h2>
              {creatorRating != null ? (
                <div className="mt-0.5 inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                  <Star className="size-4 fill-current" />
                  {creatorRating.toFixed(1)}
                </div>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-m-2 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-[#f6f5f8] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-sm text-slate-700">{description}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-xs">
          <div className="inline-flex items-center gap-2">
            <CalendarDays className="size-3.5 shrink-0 text-[#895af6]" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                Data/Hora
              </p>
              <p className="font-bold text-slate-900">
                {formatDateShort(startsAt)},{" "}
                {new Date(startsAt).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2">
            <MapPin className="size-3.5 shrink-0 text-[#895af6]" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                Local
              </p>
              <p className="font-bold text-slate-900">{locationText}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <span
            className={`inline-block rounded-full px-4 py-2 text-xs font-extrabold uppercase ${statusMeta.className}`}
          >
            {statusMeta.label}
          </span>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Investimento
          </p>
          <p className="mt-1 text-2xl font-black text-[#895af6]">
            {formatCurrency(totalAmount, item.currency)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Base: {formatCurrency(baseAmount, item.currency)}
          </p>
          <p className="text-sm text-slate-600">
            Transporte: {formatCurrency(transportAmount, item.currency)}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          {(status === "ACCEPTED" || status === "IN_PROGRESS") && actions.canChat ? (
            <button
              type="button"
              onClick={() => onChatClick?.(item)}
              className="inline-flex items-center gap-2 rounded-full border border-[#895af6]/20 px-4 py-2 text-sm font-semibold text-[#895af6] hover:bg-[#895af6]/10"
            >
              <MessageCircle className="size-4" />
              Falar com creator
            </button>
          ) : null}
          <Link
            to={`/criador/${item.creatorId}`}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Ver perfil
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#895af6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7c4fe6]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
