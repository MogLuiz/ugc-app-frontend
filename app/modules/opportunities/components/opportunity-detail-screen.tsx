import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  Star,
} from "lucide-react";
import { Link } from "react-router";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { AppSidebar } from "~/components/app-sidebar";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/hooks/use-auth";
import { useApplyToOpportunityMutation } from "../mutations";
import { useOpportunityDetailQuery } from "../queries";
import {
  formatAmount,
  formatDistance,
  formatDurationMinutes,
  formatFullDate,
  formatShortDate,
  getDeadlineDays,
  hasEligiblePortfolio,
} from "../helpers";
import { OpportunityDeadlineAlert } from "./opportunity-deadline-alert";
import { MobileApplyBar } from "./mobile-apply-bar";

interface OpportunityDetailScreenProps {
  id: string;
}

export function OpportunityDetailScreen({ id }: OpportunityDetailScreenProps) {
  const { user } = useAuth();
  const {
    data: opportunity,
    isLoading,
    isError,
  } = useOpportunityDetailQuery(id);
  const applyMutation = useApplyToOpportunityMutation();

  const hasPortfolio = hasEligiblePortfolio(user?.portfolio);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f5f8] lg:flex">
        <div className="hidden lg:block">
          <AppSidebar variant="creator" />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="size-6 animate-spin rounded-full border-2 border-[#895af6] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (isError || !opportunity) {
    return (
      <div className="min-h-screen bg-[#f6f5f8] lg:flex">
        <div className="hidden lg:block">
          <AppSidebar variant="creator" />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 items-center justify-center p-4">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-slate-900">
                Oportunidade não encontrada
              </h2>
              <p className="mb-6 text-slate-500">
                A oportunidade que você procura não existe ou foi removida.
              </p>
              <Button asChild className="bg-[#895af6] hover:bg-[#6a36d5]">
                <Link to="/oportunidades">
                  <ArrowLeft className="mr-2 size-4" />
                  Voltar para oportunidades
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <CreatorBottomNav />
      </div>
    );
  }

  const deadlineDays = getDeadlineDays(opportunity.expiresAt);
  const isDeadlineSoon = deadlineDays <= 3;
  const isOpen = opportunity.status === "OPEN";
  const hasApplied =
    opportunity.myApplication !== null || applyMutation.isSuccess;
  const canApply = isOpen && hasPortfolio && !hasApplied;

  const handleApply = () => {
    if (canApply) applyMutation.mutate(id);
  };

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Sticky back header */}
        <div className="sticky top-0 z-10">
          <div className="mx-auto max-w-6xl px-4 pb-0 pt-6 sm:px-6 sm:pt-8">
            <Link
              to="/oportunidades"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="size-4 shrink-0" />
              Voltar para oportunidades
            </Link>
          </div>
        </div>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:pb-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 sm:gap-8">
            {/* ── Conteúdo principal ── */}
            <div className="space-y-5 lg:col-span-2">
              {/* Card oferta */}
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8">
                <div className="mb-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-sm font-medium text-[#895af6]">
                    <Compass className="size-3.5" />
                    Oportunidade aberta
                  </span>
                </div>

                {/* Tipo + endereço */}
                <div className="mb-5">
                  {opportunity.jobType ? (
                    <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                      {opportunity.jobType.name}
                    </h1>
                  ) : null}
                  <p className="flex items-center gap-2 text-slate-500">
                    <MapPin className="size-4 shrink-0" />
                    <span className="truncate">
                      {opportunity.jobFormattedAddress ?? "Local a combinar"}{" "}
                      &bull; {formatDistance(opportunity.distanceKm)}
                    </span>
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {opportunity.jobType ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-sm text-slate-700">
                      <Briefcase className="size-3" />
                      {opportunity.jobType.name}
                    </span>
                  ) : null}
                  {isDeadlineSoon ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-sm text-red-700">
                      <AlertCircle className="size-3" />
                      Prazo urgente
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Descrição */}
              <div className="rounded-[28px] border border-slate-200 bg-white p-6">
                <h2 className="mb-3 text-lg font-semibold text-slate-900">
                  Sobre a oportunidade
                </h2>
                <p className="leading-relaxed text-slate-700">
                  {opportunity.description}
                </p>
              </div>

              {/* Alerta de prazo */}
              <OpportunityDeadlineAlert
                deadlineDate={opportunity.expiresAt}
                daysRemaining={deadlineDays}
              />
            </div>

            {/* ── Sidebar ── */}
            <div className="lg:col-span-1">
              <div className="space-y-5 lg:sticky lg:top-24">
                {/* Card principal: valor + CTA */}
                <div className="rounded-[28px] border-2 border-slate-200 bg-white shadow-sm">
                  {/* Valor */}
                  <div className="border-b border-slate-100 p-6">
                    <div className="mb-1 text-sm text-slate-500">
                      Valor do projeto
                    </div>
                    <div className="text-4xl font-bold text-slate-900">
                      {formatAmount(opportunity.offeredAmount)}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="p-6">
                    {hasApplied ? (
                      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
                        <div className="mb-1 flex items-center gap-2 font-semibold text-green-700">
                          <CheckCircle2 className="size-5" />
                          Candidatura enviada
                        </div>
                        <p className="text-sm text-green-600">
                          A empresa está analisando seu perfil e responderá em
                          breve.
                        </p>
                      </div>
                    ) : !isOpen ? (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600">
                        Vagas encerradas
                      </div>
                    ) : !hasPortfolio ? (
                      <>
                        <Button className="mb-4 h-12 w-full" disabled>
                          Candidatar-se agora
                        </Button>
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />
                            <div>
                              <p className="mb-1 text-sm font-medium text-amber-900">
                                Portfólio incompleto
                              </p>
                              <p className="mb-3 text-sm text-amber-700">
                                Adicione fotos ou vídeos ao seu portfólio para
                                se candidatar.
                              </p>
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                              >
                                <Link to="/perfil">Completar portfólio</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Button
                        className="h-12 w-full bg-[#895af6] font-semibold hover:bg-[#6a36d5]"
                        onClick={handleApply}
                        disabled={applyMutation.isPending}
                      >
                        {applyMutation.isPending
                          ? "Enviando candidatura..."
                          : "Candidatar-se agora"}
                      </Button>
                    )}
                  </div>

                  {/* Info key */}
                  <div className="space-y-3.5 px-6 pb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-600">
                        <Calendar className="size-4 text-slate-400" />
                        Data
                      </span>
                      <span className="font-medium text-slate-900">
                        {formatShortDate(opportunity.startsAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-600">
                        <Clock className="size-4 text-slate-400" />
                        Duração
                      </span>
                      <span className="font-medium text-slate-900">
                        {formatDurationMinutes(opportunity.durationMinutes)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-600">
                        <MapPin className="size-4 text-slate-400" />
                        Distância
                      </span>
                      <span className="font-medium text-slate-900">
                        {formatDistance(opportunity.distanceKm)}
                      </span>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isDeadlineSoon ? "text-red-600" : "text-slate-600"
                      }`}
                    >
                      <CalendarClock className="size-4 shrink-0" />
                      <div className="flex-1">
                        {isDeadlineSoon ? (
                          <div>
                            <div className="font-semibold">
                              Encerra em {deadlineDays}{" "}
                              {deadlineDays === 1 ? "dia" : "dias"}
                            </div>
                            <div className="mt-0.5 text-xs text-red-500">
                              Candidaturas até{" "}
                              {new Date(
                                opportunity.expiresAt,
                              ).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium text-slate-900">
                              Candidaturas até{" "}
                              {formatFullDate(opportunity.expiresAt)}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-500">
                              {deadlineDays} dias restantes
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* PortfolioEligibilityCard */}
                {hasPortfolio ? (
                  <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                        <CheckCircle2 className="size-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-sm font-semibold text-slate-900">
                          Portfólio apto para candidatura
                        </h3>
                        <p className="text-xs text-slate-600">
                          Você atende os requisitos mínimos de portfólio.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[28px] border border-amber-200 bg-white p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                        <AlertCircle className="size-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-sm font-semibold text-slate-900">
                          Portfólio necessário
                        </h3>
                        <p className="text-xs text-slate-600">
                          Adicione conteúdo ao seu portfólio para se candidatar
                          a esta vaga.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dica: histórico de aplicações */}
                {hasApplied && opportunity.myApplication ? (
                  <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                    <div className="flex items-center gap-3">
                      <Star className="size-5 text-[#895af6]" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Status da candidatura
                        </p>
                        <p className="mt-0.5 text-xs capitalize text-slate-500">
                          {opportunity.myApplication.status.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileApplyBar
        value={opportunity.offeredAmount}
        hasApplied={hasApplied}
        canApply={canApply}
        hasMinimumPortfolio={hasPortfolio}
        isApplying={applyMutation.isPending}
        onApply={handleApply}
      />

      <CreatorBottomNav />
    </div>
  );
}
