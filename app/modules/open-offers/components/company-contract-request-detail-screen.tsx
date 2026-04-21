import { CalendarDays, ChevronLeft, MapPin, MessageCircle, Star } from "lucide-react";
import { Link } from "react-router";
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

export function CompanyContractRequestDetailScreen({ item }: { item: ContractRequestItem }) {
  const creatorName = item.creator?.name ?? item.creatorNameSnapshot ?? "Creator";
  const creatorAvatarUrl = item.creator?.avatarUrl ?? item.creatorAvatarUrlSnapshot;
  const creatorRating = item.creator?.rating ?? null;
  const title = item.job?.title ?? item.jobTypeName ?? "Campanha";
  const description = resolveDescription(item);
  const startsAt = item.schedule?.startTime ?? item.startsAt;
  const durationMinutes = item.job?.durationMinutes ?? item.durationMinutes;
  const durationLabel = formatDuration(durationMinutes) ?? "Duração a combinar";
  const locationLabel = resolveLocation(item);
  const amount = item.pricing?.totalAmount ?? item.totalAmount ?? item.totalPrice;
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
                {item.status === "PENDING_PAYMENT" ? (
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
                      {formatCurrency(item.creatorBasePrice, item.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Transporte</span>
                    <span className="font-semibold text-slate-100">
                      {item.transport?.formatted ??
                        formatCurrency(item.transportFee, item.currency)}
                    </span>
                  </div>
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
