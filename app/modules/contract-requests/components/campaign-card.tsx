import { memo } from "react";
import { Link } from "react-router";
import { CalendarDays, Clock3, MapPin, MessageCircle, Star } from "lucide-react";
import type { CompanyCampaignStatus, ContractRequestItem } from "../types";
import {
  formatCurrency,
  formatDateShort,
  getContractRequestStatusMeta,
  getInitials,
} from "../utils";

type CampaignCardProps = {
  item: ContractRequestItem;
  onCardClick?: (item: ContractRequestItem) => void;
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

function CampaignCardComponent({ item, onCardClick, onChatClick }: CampaignCardProps) {
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
  const actions = item.actions ?? {
    canCancel: status === "PENDING",
    canChat: status === "ACCEPTED",
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onCardClick && !(e.target as HTMLElement).closest("a, button")) {
      onCardClick(item);
    }
  };

  return (
    <article
      className="cursor-pointer rounded-3xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md lg:p-6"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onCardClick) {
          e.preventDefault();
          onCardClick(item);
        }
      }}
    >
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
          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200"
          onClick={(e) => e.stopPropagation()}
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
            Investimento
          </p>
          <p className="mt-1 text-2xl font-black leading-none text-[#895af6]">
            {formatCurrency(totalAmount, item.currency)}
          </p>
        </div>

        <div className="shrink-0">
          {status === "PENDING" && actions.canCancel ? (
            <button
              type="button"
              className="rounded-full border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50"
              onClick={(e) => e.stopPropagation()}
            >
              Cancelar solicitação
            </button>
          ) : null}

          {(status === "ACCEPTED" || status === "IN_PROGRESS") && actions.canChat ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-[#895af6]/10 px-4 py-3 text-sm font-semibold text-[#895af6] hover:bg-[#895af6]/20"
              onClick={(e) => {
                e.stopPropagation();
                onChatClick?.(item);
              }}
            >
              <MessageCircle className="size-4" />
              Falar com creator
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export const CampaignCard = memo(CampaignCardComponent);
