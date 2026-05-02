import {
  AlertCircle,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Clock3,
  CreditCard,
  MapPin,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import {
  formatDateShort,
  formatDuration,
} from "~/modules/contract-requests/utils";
import {
  getPaymentResumeState,
  type PaymentResumeState,
} from "~/modules/payments/utils/payment-resume-state";
import { formatOfferMoney } from "../helpers";
import type { CompanyHubItem } from "../types";

function ApplicationsToReviewBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  const label =
    count === 1
      ? "1 candidatura para avaliar"
      : `${count} candidaturas para avaliar`;
  return (
    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 ring-1 ring-inset ring-amber-200">
      <span className="size-2 shrink-0 rounded-full bg-amber-500" aria-hidden />
      <span className="text-[12px] font-bold leading-none text-amber-700">
        {label}
      </span>
    </div>
  );
}

function ReviewStatusBadge({ pending }: { pending: boolean | null }) {
  if (pending === null) return null;
  if (pending) {
    return (
      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 ring-1 ring-inset ring-amber-200">
        <Star className="size-3.5 fill-amber-500 text-amber-500" aria-hidden />
        <span className="text-[12px] font-bold leading-none text-amber-700">
          Avaliar creator
        </span>
      </div>
    );
  }
  return (
    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 ring-1 ring-inset ring-green-200">
      <CheckCircle className="size-3.5 text-green-600" aria-hidden />
      <span className="text-[12px] font-bold leading-none text-green-700">
        Avaliado
      </span>
    </div>
  );
}

function PendingPaymentChip({ state }: { state: PaymentResumeState }) {
  if (state.kind === "none") return null;
  const isDanger = state.severity === "danger";
  return (
    <div
      className={cn(
        "mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 ring-1 ring-inset",
        isDanger
          ? "bg-rose-50 ring-rose-200"
          : "bg-amber-50 ring-amber-200",
      )}
    >
      <CreditCard
        className={cn("size-3.5 shrink-0", isDanger ? "text-rose-500" : "text-amber-500")}
        aria-hidden
      />
      <span
        className={cn(
          "text-[12px] font-bold leading-none",
          isDanger ? "text-rose-700" : "text-amber-700",
        )}
      >
        {state.label}
      </span>
    </div>
  );
}

function resolveHref(item: CompanyHubItem): string {
  if (item.contractRequestId) return `/ofertas/${item.contractRequestId}`;
  if (item.offerId) return `/ofertas/${item.offerId}`;
  return `/ofertas/${item.id}`;
}

function formatDeadline(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isDeadlineUrgent(iso: string): boolean {
  return new Date(iso).getTime() - Date.now() < 6 * 60 * 60 * 1000;
}

export function CompanyHubCard({
  item,
  subtitle,
}: {
  item: CompanyHubItem;
  subtitle: string;
}) {
  const navigate = useNavigate();
  const href = resolveHref(item);

  const paymentState = getPaymentResumeState(item);
  const hasPendingPayment = paymentState.kind !== "none";

  const isAwaiting = item.companyPerspectiveStatus === "COMPANY_CONFIRMATION_REQUIRED";
  const isDispute = item.companyPerspectiveStatus === "COMPLETION_DISPUTE";

  const dateLabel = item.startsAt
    ? formatDateShort(item.startsAt)
    : "Data a combinar";
  const timeLabel = item.startsAt
    ? new Date(item.startsAt).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Horário a combinar";
  const durationLabel = item.durationMinutes
    ? formatDuration(item.durationMinutes)
    : null;

  const ctaLabel = hasPendingPayment
    ? paymentState.ctaLabel
    : item.primaryAction === "review_applications"
      ? "Avaliar candidaturas"
      : item.primaryAction === "confirm_completion"
        ? "Confirmar serviço"
        : "Ver detalhes";

  const ctaHref = hasPendingPayment && paymentState.resumeUrl
    ? paymentState.resumeUrl
    : href;

  const subtitleColorClass = hasPendingPayment
    ? paymentState.severity === "danger"
      ? "text-rose-600"
      : "text-amber-600"
    : isAwaiting
      ? "text-amber-600"
      : isDispute
        ? "text-rose-600"
        : "text-slate-400";

  return (
    <article
      className={cn(
        "w-full min-w-0 max-w-full cursor-pointer rounded-[28px] border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:p-6",
        hasPendingPayment && paymentState.severity === "danger"
          ? "border-rose-200"
          : hasPendingPayment
            ? "border-amber-200"
            : isAwaiting
              ? "border-amber-200"
              : isDispute
                ? "border-rose-200"
                : "border-slate-200",
      )}
      onClick={() => navigate(href, { state: { fromHub: true } })}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black tracking-[-0.02em] text-slate-900">
            {item.title}
          </h3>
          <PendingPaymentChip state={paymentState} />
          <ApplicationsToReviewBadge count={item.applicationsToReviewCount} />
          <ReviewStatusBadge pending={item.myReviewPending} />
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Valor
          </p>
          <p className="mt-2 text-2xl font-black text-[#6a36d5]">
            {item.amount != null ? formatOfferMoney(item.amount) : "—"}
          </p>
        </div>
      </div>

      {item.description && (
        <div className="mt-4 rounded-[22px] bg-[#f6f5f8] p-4">
          <p className="break-words text-sm leading-6 text-slate-700">
            {item.description}
          </p>
        </div>
      )}

      <div className="mt-4 grid min-w-0 gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div className="flex min-w-0 items-center gap-2">
          <CalendarDays className="size-4 shrink-0 text-[#895af6]" />
          <span className="min-w-0">
            {dateLabel} · {timeLabel}
          </span>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <Clock3 className="size-4 shrink-0 text-[#895af6]" />
          <span className="min-w-0">
            {durationLabel ?? "Duração a combinar"}
          </span>
        </div>
        <div className="flex min-w-0 items-start gap-2 sm:col-span-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-[#895af6]" />
          <span className="min-w-0 flex-1 leading-snug line-clamp-2">
            {item.address}
          </span>
        </div>
      </div>

      {isAwaiting && item.completionConfirmation?.contestDeadlineAt && (
        <div className="mt-4 rounded-[16px] bg-amber-50 px-4 py-3 ring-1 ring-inset ring-amber-200">
          <div className="flex items-start gap-2">
            <AlertCircle
              className={cn(
                "mt-0.5 size-4 shrink-0",
                isDeadlineUrgent(item.completionConfirmation.contestDeadlineAt)
                  ? "text-rose-500"
                  : "text-amber-500",
              )}
              aria-hidden
            />
            <div className="min-w-0 space-y-0.5">
              <p
                className={cn(
                  "text-xs font-semibold",
                  isDeadlineUrgent(item.completionConfirmation.contestDeadlineAt)
                    ? "text-rose-700"
                    : "text-amber-700",
                )}
              >
                Prazo: {formatDeadline(item.completionConfirmation.contestDeadlineAt)}
              </p>
              <p className="text-xs text-amber-600">
                Se não houver contestação até o prazo, o serviço será concluído
                automaticamente.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-2 border-t border-slate-100 pt-4">
        <div
          className={cn(
            "min-w-0 text-xs font-semibold uppercase tracking-[0.16em]",
            subtitleColorClass,
          )}
        >
          {subtitle}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {(isAwaiting || hasPendingPayment) && (
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={(e) => {
                e.stopPropagation();
                navigate(href, { state: { fromHub: true } });
              }}
            >
              Ver detalhes
            </button>
          )}
          <button
            type="button"
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white",
              hasPendingPayment && paymentState.severity === "danger"
                ? "bg-rose-600 hover:bg-rose-700"
                : hasPendingPayment
                  ? "bg-amber-500 hover:bg-amber-600"
                  : isAwaiting
                    ? "bg-amber-500 hover:bg-amber-600"
                    : isDispute
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-slate-900 hover:bg-slate-800",
            )}
            onClick={(e) => {
              e.stopPropagation();
              navigate(ctaHref, { state: { fromHub: true } });
            }}
          >
            {ctaLabel}
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
