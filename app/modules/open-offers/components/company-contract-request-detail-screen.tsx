import { AlertCircle, CalendarDays, CheckCircle, ChevronLeft, CreditCard, MapPin, MessageCircle, Star } from "lucide-react";
import { Link } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import type { ContractRequestItem } from "~/modules/contract-requests/types";
import {
  formatCurrency,
  formatDateShort,
  formatDuration,
  getContractRequestStatusMeta,
  getInitials,
} from "~/modules/contract-requests/utils";
import { ConfirmCompletionBanner } from "~/modules/contract-requests/components/ConfirmCompletionBanner";
import { ReviewForm } from "~/modules/contract-requests/components/ReviewForm";
import { useContractReviewsQuery } from "~/modules/contract-requests/queries";
import { useCompanyOffersHubQuery } from "~/modules/open-offers/queries";
import { getPaymentResumeState, type PaymentResumeState } from "~/modules/payments/utils/payment-resume-state";
import { openOfferKeys } from "~/lib/query/query-keys";
import { cn } from "~/lib/utils";

function PendingPaymentSection({ state }: { state: PaymentResumeState }) {
  if (state.kind === "none" || !state.resumeUrl) return null;
  const isDanger = state.severity === "danger";
  return (
    <section
      className={cn(
        "rounded-[24px] px-5 py-4 ring-1 ring-inset",
        isDanger ? "bg-rose-50 ring-rose-200" : "bg-amber-50 ring-amber-200",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {isDanger ? (
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-rose-600" aria-hidden />
          ) : (
            <CreditCard className="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden />
          )}
          <div className="min-w-0">
            <p className={cn("text-sm font-bold", isDanger ? "text-rose-900" : "text-amber-900")}>
              {state.label}
            </p>
            <p className={cn("mt-0.5 text-sm", isDanger ? "text-rose-700" : "text-amber-700")}>
              {state.kind === "failed"
                ? "Seu pagamento não foi aprovado. Tente novamente para confirmar a contratação."
                : state.kind === "expired"
                  ? "O código PIX expirou. Gere um novo para concluir o pagamento."
                  : "Finalize o pagamento para que o creator receba e possa aceitar sua contratação."}
            </p>
          </div>
        </div>
        <Link
          to={state.resumeUrl}
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold text-white transition-colors",
            isDanger ? "bg-rose-600 hover:bg-rose-700" : "bg-amber-500 hover:bg-amber-600",
          )}
        >
          {state.ctaLabel}
        </Link>
      </div>
    </section>
  );
}

function resolveLocation(item: ContractRequestItem) {
  const city = item.location?.city;
  const state = item.location?.state;
  return (
    (city && state ? `${city}, ${state}` : city || state) ??
    item.jobFormattedAddress ??
    item.jobAddress ??
    "Local a combinar"
  );
}

function resolveDescription(item: ContractRequestItem) {
  return item.job?.description ?? item.description ?? "Sem briefing informado.";
}

export function CompanyContractRequestDetailScreen({
  item,
  onUpdate,
}: {
  item: ContractRequestItem;
  onUpdate?: () => void;
}) {
  const queryClient = useQueryClient();
  const isCompleted = item.status === "COMPLETED" || item.legacyStatus === "COMPLETED";

  const { data: hub } = useCompanyOffersHubQuery();
  const hubPaymentItem = hub?.pending.awaitingPayment?.find(
    (h) => h.contractRequestId === item.id,
  ) ?? null;
  const paymentState = getPaymentResumeState(
    hubPaymentItem ?? { legacyStatus: item.status, contractRequestId: item.id },
  );

  const reviewsQuery = useContractReviewsQuery(item.id, isCompleted);
  const alreadyReviewed =
    reviewsQuery.data?.reviews.some((r) => r.reviewerRole === "COMPANY") ?? false;

  function handleReviewSuccess() {
    void queryClient.invalidateQueries({ queryKey: openOfferKeys.companyHub() });
  }

  const creatorName = item.creator?.name ?? item.creatorNameSnapshot ?? "Creator";
  const creatorAvatarUrl = item.creator?.avatarUrl ?? item.creatorAvatarUrlSnapshot;
  const creatorRating = item.creator?.rating ?? null;
  const title = item.job?.title ?? item.jobTypeName ?? "Campanha";
  const description = resolveDescription(item);
  const startsAt = item.schedule?.startTime ?? item.startsAt;
  const durationMinutes = item.job?.durationMinutes ?? item.durationMinutes;
  const durationLabel = formatDuration(durationMinutes) ?? "Duração a combinar";
  const locationLabel = resolveLocation(item);
  const amount = item.companyTotalAmountCents / 100;
  const statusMeta = getContractRequestStatusMeta(item.status);
  const canChat =
    (item.status === "ACCEPTED" || item.status === "IN_PROGRESS") &&
    Boolean(item.actions?.canChat);

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 pb-24 pt-4 lg:p-8">
        <div className="flex min-w-0 flex-1 flex-col gap-6 px-4 lg:px-0">
          <header className="rounded-[32px] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <Link
                  to="/ofertas"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
                >
                  <ChevronLeft className="size-4" />
                  Voltar para ofertas
                </Link>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#895af6]/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6a36d5]">
                    {item.openOfferId ? "Oferta aberta" : "Convite direto"}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] ${statusMeta.className}`}
                  >
                    {statusMeta.label}
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-900">
                  {title}
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {item.status === "ACCEPTED" && item.paymentStatus === "PENDING" ? (
                  <Link
                    to={`/pagamento/${item.id}`}
                    className="inline-flex items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                  >
                    Ir para pagamento
                  </Link>
                ) : null}
                {canChat ? (
                  <Link
                    to={`/chat?contractRequestId=${item.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#895af6]/20 px-4 py-2 text-sm font-semibold text-[#895af6] hover:bg-[#895af6]/10"
                  >
                    <MessageCircle className="size-4" />
                    Falar com creator
                  </Link>
                ) : null}
                <Link
                  to={`/criador/${item.creatorId}`}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Ver perfil
                </Link>
              </div>
            </div>
          </header>

          <PendingPaymentSection state={paymentState} />

          {item.legacyStatus === "AWAITING_COMPLETION_CONFIRMATION" && (
            <ConfirmCompletionBanner item={item} viewerRole="COMPANY" onUpdate={onUpdate} />
          )}

          {isCompleted && (
            <section className="rounded-[32px] bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#895af6]">
                Avalie o creator
              </p>
              {reviewsQuery.isLoading ? (
                <div className="mt-4 h-20 animate-pulse rounded-2xl bg-slate-100" />
              ) : alreadyReviewed ? (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 p-4">
                  <CheckCircle className="size-4 shrink-0 text-green-600" />
                  <p className="text-sm font-medium text-green-800">
                    Você já avaliou este creator. Obrigado pelo feedback!
                  </p>
                </div>
              ) : (
                <>
                  <p className="mt-2 text-sm text-slate-500">
                    Compartilhe sua experiência para ajudar outras empresas a encontrar o creator certo.
                  </p>
                  <div className="mt-4">
                    <ReviewForm contractRequestId={item.id} onSuccess={handleReviewSuccess} />
                  </div>
                </>
              )}
            </section>
          )}

          <section className="grid gap-6 xl:grid-cols-[1.4fr_minmax(320px,0.9fr)]">
            <div className="rounded-[32px] bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#895af6]">
                Creator
              </p>
              <div className="mt-4 flex items-start gap-4">
                {creatorAvatarUrl ? (
                  <img
                    src={creatorAvatarUrl}
                    alt={creatorName}
                    className="size-16 rounded-3xl object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-3xl bg-[#895af6]/10 text-lg font-black text-[#6a36d5]">
                    {getInitials(creatorName)}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-900">
                    {creatorName}
                  </h2>
                  {creatorRating != null ? (
                    <div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                      <Star className="size-4 fill-current" />
                      {creatorRating.toFixed(1)}
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-slate-500">Sem avaliação pública.</p>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-[24px] bg-[#f6f5f8] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Briefing
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-700">{description}</p>
              </div>
            </div>

            <div className="space-y-6">
              <section className="rounded-[32px] bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#895af6]">
                  Agenda e local
                </p>
                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-[#895af6]" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Data e hora
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatDateShort(startsAt)}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(startsAt).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        · {durationLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-[#895af6]" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Local
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">{locationLabel}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[32px] bg-slate-900 p-6 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Investimento
                </p>
                <p className="mt-3 text-3xl font-black tracking-tight text-white">
                  {formatCurrency(amount, item.currency)}
                </p>
                <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Serviço</span>
                    <span className="font-semibold text-slate-100">
                      {formatCurrency(item.serviceGrossAmountCents / 100, item.currency)}
                    </span>
                  </div>
                  {(item.transportFeeAmountCents ?? 0) > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Transporte</span>
                      <span className="font-semibold text-slate-100">
                        {item.transport?.formatted ??
                          formatCurrency(item.transportFeeAmountCents / 100, item.currency)}
                      </span>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>

      <BusinessBottomNav />
    </div>
  );
}
