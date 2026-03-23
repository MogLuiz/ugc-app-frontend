import { memo } from "react";
import { Link } from "react-router";
import { CalendarDays, Clock3, MapPin, MessageCircle, Star } from "lucide-react";
import type { CompanyCampaignStatus, ContractRequestItem } from "../types";
import {
  formatCurrency,
  formatDateShort,
  formatTimeRange,
  getContractRequestStatusMeta,
  getInitials,
} from "../utils";

type CampaignCardProps = {
  item: ContractRequestItem;
};

function resolveStatus(status: ContractRequestItem["status"]): CompanyCampaignStatus {
  if (status === "PENDING" || status === "PENDING_ACCEPTANCE") return "PENDING";
  if (status === "ACCEPTED") return "ACCEPTED";
  if (status === "IN_PROGRESS") return "IN_PROGRESS";
  if (status === "COMPLETED") return "COMPLETED";
  if (status === "REJECTED") return "CANCELLED";
  return "CANCELLED";
}

function CampaignCardComponent({ item }: CampaignCardProps) {
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
    canViewDetails:
      status === "ACCEPTED" || status === "IN_PROGRESS" || status === "COMPLETED",
  };

  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm lg:p-6">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {creatorAvatarUrl ? (
            <img
              src={creatorAvatarUrl}
              alt={creatorName}
              className="size-12 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#895af6]/10 text-sm font-bold text-[#895af6]">
              {getInitials(creatorName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-slate-900">{creatorName}</p>
            {creatorRating != null ? (
              <div className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                <Star className="size-3.5 fill-current" />
                {creatorRating.toFixed(1)}
              </div>
            ) : null}
          </div>
        </div>

        <Link
          to={`/criador/${item.creatorId}`}
          className="rounded-full bg-[#895af6]/10 px-3 py-1.5 text-xs font-semibold text-[#895af6]"
        >
          Ver perfil
        </Link>
      </header>

      <div className="mt-4 rounded-2xl bg-[#f6f5f8] p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</p>
        <p
          className="mt-1 text-sm text-slate-700"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-3">
          <p className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-[#895af6]" />
            {formatDateShort(startsAt)}
          </p>
          <p className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5 text-[#895af6]" />
            {formatTimeRange(startsAt, durationMinutes)}
          </p>
          <p className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 text-[#895af6]" />
            {locationText}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase ${statusMeta.className}`}>
          {statusMeta.label}
        </span>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Total da campanha
          </p>
          <p className="text-3xl font-black leading-none text-[#895af6]">
            {formatCurrency(totalAmount, item.currency)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Base: {formatCurrency(baseAmount, item.currency)}
          </p>
          <p className="text-xs text-slate-500">
            Transporte: {formatCurrency(transportAmount, item.currency)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        {status === "PENDING" && actions.canCancel ? (
          <button
            type="button"
            className="w-full rounded-full border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 sm:w-auto sm:min-w-[190px]"
          >
            Cancelar solicitação
          </button>
        ) : null}

        {status === "ACCEPTED" && actions.canChat ? (
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#895af6] px-4 py-3 text-sm font-semibold text-white sm:w-auto sm:min-w-[190px]"
          >
            <MessageCircle className="size-4" />
            Falar com creator
          </button>
        ) : null}

        {status === "ACCEPTED" && actions.canViewDetails ? (
          <button
            type="button"
            className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 sm:w-auto sm:min-w-[170px]"
          >
            Ver detalhes
          </button>
        ) : null}

        {status === "IN_PROGRESS" && actions.canViewDetails ? (
          <button
            type="button"
            className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 sm:w-auto sm:min-w-[170px]"
          >
            Ver andamento
          </button>
        ) : null}

        {status === "COMPLETED" && actions.canViewDetails ? (
          <button
            type="button"
            className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 sm:w-auto sm:min-w-[170px]"
          >
            Ver resultado
          </button>
        ) : null}
      </div>
    </article>
  );
}

export const CampaignCard = memo(CampaignCardComponent);
