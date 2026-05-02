import { AlertCircle, CalendarDays, ChevronRight, Clock, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import { formatDateShort } from "../utils";
import type { CreatorHubItem, CreatorHubDisplayStatus, CreatorPerspectiveStatus } from "../creator-hub.types";

function formatOfferMoney(amount: number | null, currency = "BRL"): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(amount);
}

function formatExpiryCountdown(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  if (diffMs <= 0) return "Expirada";
  const totalMinutes = Math.ceil(diffMs / 60_000);
  const totalHours = Math.ceil(diffMs / 3_600_000);
  const totalDays = Math.ceil(diffMs / 86_400_000);
  if (totalMinutes < 60) return `Expira em ${totalMinutes} min`;
  if (totalHours < 24) return `Expira em ${totalHours}h`;
  return `Expira em ${totalDays} dia${totalDays > 1 ? "s" : ""}`;
}

function resolveSubtitle(item: CreatorHubItem): string {
  switch (item.creatorPerspectiveStatus) {
    case "INVITE_PENDING":
      if (item.effectiveExpiresAt) return formatExpiryCountdown(item.effectiveExpiresAt);
      return "Aguardando resposta";
    case "AVAILABLE_OPPORTUNITY":
      return "Candidatura enviada · Aguardando seleção";
    case "UPCOMING_WORK":
      return item.startsAt ? `Trabalho em ${formatDateShort(item.startsAt)}` : "Trabalho aceito";
    case "CREATOR_CONFIRMATION_REQUIRED":
      return "Confirme se o trabalho foi realizado";
    case "AWAITING_COMPANY_CONFIRMATION":
      return "Aguardando confirmação da empresa";
    case "AWAITING_AUTO_COMPLETION":
      return "Conclusão automática em andamento";
    case "COMPLETION_DISPUTE":
      return "Disputa em andamento";
    case "REVIEW_COMPANY_REQUIRED":
      return item.finalizedAt ? `Concluído em ${formatDateShort(item.finalizedAt)}` : "Concluído";
    case "COMPLETED":
      return item.finalizedAt ? `Concluído em ${formatDateShort(item.finalizedAt)}` : "Concluído";
    case "CANCELLED":
      return item.displayStatus === "REJECTED" ? "Proposta recusada" : "Trabalho cancelado";
    case "EXPIRED":
      return item.kind === "open_offer_application" ? "Oportunidade encerrada" :
        item.displayStatus === "APPLICATION_NOT_SELECTED" ? "Não selecionado para esta oportunidade" :
        item.displayStatus === "APPLICATION_WITHDRAWN" ? "Candidatura cancelada" :
        "Convite expirado";
    default:
      return "";
  }
}

function borderClass(perspectiveStatus: CreatorPerspectiveStatus): string {
  if (perspectiveStatus === "CREATOR_CONFIRMATION_REQUIRED") return "border-amber-200";
  if (perspectiveStatus === "AWAITING_COMPANY_CONFIRMATION") return "border-amber-100";
  if (perspectiveStatus === "COMPLETION_DISPUTE") return "border-rose-200";
  return "border-slate-200";
}

function subtitleColorClass(perspectiveStatus: CreatorPerspectiveStatus): string {
  if (
    perspectiveStatus === "CREATOR_CONFIRMATION_REQUIRED" ||
    perspectiveStatus === "AWAITING_COMPANY_CONFIRMATION"
  ) return "text-amber-600";
  if (perspectiveStatus === "COMPLETION_DISPUTE") return "text-rose-600";
  if (
    perspectiveStatus === "EXPIRED" ||
    perspectiveStatus === "CANCELLED"
  ) return "text-slate-400";
  return "text-slate-500";
}

function CompanyRating({ rating, reviewCount }: { rating: number | null; reviewCount: number }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1">
      <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden />
      <span className="text-xs font-semibold text-slate-600">
        {rating.toFixed(1)}
        {reviewCount > 0 && (
          <span className="ml-0.5 font-normal text-slate-400">({reviewCount})</span>
        )}
      </span>
    </div>
  );
}

function ReviewBadge({ pending }: { pending: boolean | null }) {
  if (pending === null) return null;
  if (pending) {
    return (
      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 ring-1 ring-inset ring-amber-200">
        <Star className="size-3.5 fill-amber-500 text-amber-500" aria-hidden />
        <span className="text-[12px] font-bold leading-none text-amber-700">Avaliar empresa</span>
      </div>
    );
  }
  return (
    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 ring-1 ring-inset ring-green-200">
      <span className="text-[12px] font-bold leading-none text-green-700">Avaliado</span>
    </div>
  );
}

function resolveNavigateTo(item: CreatorHubItem): string | null {
  if (item.kind === "open_offer_application") {
    return item.openOfferId ? `/oportunidades/${item.openOfferId}` : null;
  }
  return `/ofertas/${item.id}`;
}

export function CreatorHubCard({
  item,
  onAccept,
  onReject,
}: {
  item: CreatorHubItem;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}) {
  const navigate = useNavigate();
  const href = resolveNavigateTo(item);
  const subtitle = resolveSubtitle(item);
  const isConfirmationRequired = item.creatorPerspectiveStatus === "CREATOR_CONFIRMATION_REQUIRED";
  const isAwaitingCompany = item.creatorPerspectiveStatus === "AWAITING_COMPANY_CONFIRMATION";
  const isDispute = item.creatorPerspectiveStatus === "COMPLETION_DISPUTE";
  const showAddress =
    (item.creatorPerspectiveStatus === "INVITE_PENDING" ||
      item.creatorPerspectiveStatus === "AVAILABLE_OPPORTUNITY" ||
      item.creatorPerspectiveStatus === "UPCOMING_WORK") &&
    item.address &&
    item.address !== "Local a combinar";

  function handleCardClick() {
    if (href) navigate(href, { state: { fromHub: true } });
  }

  return (
    <article
      className={cn(
        "w-full min-w-0 max-w-full rounded-[28px] border bg-white p-5 shadow-sm transition lg:p-6",
        href ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : "cursor-default",
        borderClass(item.creatorPerspectiveStatus)
      )}
      onClick={handleCardClick}
    >
      {/* Top row: company + amount */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Company name */}
          <h3 className="text-lg font-black tracking-[-0.02em] text-slate-900">
            {item.company.name}
          </h3>

          {/* Job type + rating */}
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">{item.jobTypeName}</span>
            <CompanyRating rating={item.company.rating} reviewCount={item.company.reviewCount} />
          </div>

          <ReviewBadge pending={item.myReviewPending} />
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Valor
          </p>
          <p className="mt-1 text-2xl font-black text-[#6a36d5]">
            {formatOfferMoney(item.totalAmount != null ? item.totalAmount / 100 : null, item.currency)}
          </p>
        </div>
      </div>

      {/* Date */}
      {item.startsAt && (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <CalendarDays className="size-4 shrink-0 text-[#895af6]" />
          <span>
            {formatDateShort(item.startsAt)} ·{" "}
            {new Date(item.startsAt).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}

      {/* Address */}
      {showAddress && (
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="size-4 shrink-0 text-[#895af6]" />
          <span className="truncate">{item.address}</span>
        </div>
      )}

      {/* Expiry warning */}
      {item.expiresSoon && item.effectiveExpiresAt && (
        <div className="mt-3 flex items-center gap-2 rounded-[14px] bg-amber-50 px-3 py-2 ring-1 ring-inset ring-amber-200">
          <Clock className="size-3.5 shrink-0 text-amber-600" aria-hidden />
          <span className="text-xs font-semibold text-amber-700">
            {formatExpiryCountdown(item.effectiveExpiresAt)}
          </span>
        </div>
      )}

      {/* Confirmation required notice */}
      {isConfirmationRequired && (
        <div className="mt-3 rounded-[14px] bg-amber-50 px-3 py-2 ring-1 ring-inset ring-amber-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-3.5 shrink-0 text-amber-600" aria-hidden />
            <span className="text-xs font-semibold text-amber-700">
              Confirme se o trabalho foi realizado
            </span>
          </div>
        </div>
      )}

      {/* Awaiting company notice */}
      {isAwaitingCompany && (
        <div className="mt-3 rounded-[14px] bg-amber-50 px-3 py-2 ring-1 ring-inset ring-amber-100">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-3.5 shrink-0 text-amber-500" aria-hidden />
            <span className="text-xs font-semibold text-amber-600">
              Aguardando confirmação da empresa
            </span>
          </div>
        </div>
      )}

      {/* Dispute notice */}
      {isDispute && (
        <div className="mt-3 rounded-[14px] bg-rose-50 px-3 py-2 ring-1 ring-inset ring-rose-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-3.5 shrink-0 text-rose-600" aria-hidden />
            <span className="text-xs font-semibold text-rose-700">
              Disputa em andamento — aguardando resolução
            </span>
          </div>
        </div>
      )}

      {/* Footer: subtitle + CTAs */}
      <div className="mt-5 flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-3 border-t border-slate-100 pt-4">
        <span
          className={cn(
            "min-w-0 text-xs font-semibold uppercase tracking-[0.16em]",
            subtitleColorClass(item.creatorPerspectiveStatus)
          )}
        >
          {subtitle}
        </span>

        <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {item.availableActions.includes("reject_invite") && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => onReject?.(item.id)}
            >
              Recusar
            </button>
          )}

          {item.availableActions.includes("accept_invite") && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#895af6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7a4de0]"
              onClick={() => onAccept?.(item.id)}
            >
              Aceitar
              <ChevronRight className="size-4" />
            </button>
          )}

          {item.availableActions.includes("confirm_completion") && href && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
              onClick={() => navigate(href, { state: { fromHub: true } })}
            >
              Confirmar serviço
              <ChevronRight className="size-4" />
            </button>
          )}

          {item.availableActions.includes("review_company") && href && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              onClick={() => navigate(href, { state: { fromHub: true } })}
            >
              Avaliar empresa
              <ChevronRight className="size-4" />
            </button>
          )}

          {item.primaryAction === "view_details" && href && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              onClick={() => navigate(href, { state: { fromHub: true } })}
            >
              Ver detalhes
              <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
