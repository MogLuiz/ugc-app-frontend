import {
  AlertCircle,
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  MapPin,
  Menu,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { EmptyState } from "~/components/ui/empty-state";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { formatCurrency } from "~/modules/contract-requests/utils";
import type {
  CompanyDashboardCampaignItem,
  CompanyDashboardMetric,
  CompanyDashboardPendingItem,
  CompanyDashboardQuickAction,
  CompanyDashboardRecommendedCreator,
} from "../../types";

function DashboardCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-[rgba(137,90,246,0.08)] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:rounded-2xl lg:p-6",
        className
      )}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  title,
  description,
  ctaLabel,
  ctaTo,
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaTo?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-black tracking-[-0.3px] text-slate-900">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {ctaLabel && ctaTo ? (
        <Link
          to={ctaTo}
          className="shrink-0 text-sm font-semibold text-[#895af6] hover:text-[#7c4aed]"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}

function SectionMessage({
  message,
  tone = "default",
}: {
  message: string;
  tone?: "default" | "error";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm",
        tone === "error"
          ? "border-rose-200 bg-rose-50 text-rose-600"
          : "border-slate-200 bg-slate-50 text-slate-500"
      )}
    >
      {message}
    </div>
  );
}

function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-slate-100 p-4"
        >
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-28 rounded bg-slate-100" />
          <div className="mt-4 h-2 w-full rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function MetricIcon({ metricId }: { metricId: CompanyDashboardMetric["id"] }) {
  if (metricId === "active-campaigns") {
    return <BriefcaseBusiness className="size-5 text-[#895af6]" />;
  }

  if (metricId === "active-creators") {
    return <Users className="size-5 text-sky-600" />;
  }

  if (metricId === "completed-campaigns") {
    return <CheckCircle2 className="size-5 text-emerald-600" />;
  }

  return <Clock3 className="size-5 text-[#895af6]" />;
}

function CampaignStatusBadge({
  label,
  status,
}: {
  label: string;
  status: CompanyDashboardCampaignItem["status"];
}) {
  const className =
    status === "IN_PROGRESS"
      ? "bg-blue-100 text-blue-700"
      : status === "ACCEPTED"
        ? "bg-emerald-100 text-emerald-700"
        : status === "PENDING"
          ? "bg-amber-100 text-amber-700"
          : "bg-slate-100 text-slate-700";

  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-bold", className)}>
      {label}
    </span>
  );
}

export function BusinessDashboardHeader({
  greetingName,
  subtitle,
}: {
  greetingName: string;
  subtitle: string;
}) {
  return (
    <>
      <header className="hidden flex-col gap-5 lg:flex">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-black leading-9 tracking-[-0.75px] text-slate-900">
              Bem-vindo de volta, {greetingName} 👋
            </h1>
            <p className="mt-2 text-base text-slate-500">{subtitle}</p>
          </div>

          <button
            type="button"
            className="relative flex size-11 items-center justify-center rounded-full border border-[rgba(137,90,246,0.08)] bg-white"
            aria-label="Notificações"
          >
            <Bell className="size-5 text-slate-600" />
            <span className="absolute right-3 top-3 size-2 rounded-full bg-[#895af6]" />
          </button>
        </div>

      </header>

      <header className="sticky top-0 z-20 -mx-4 flex flex-col gap-4 border-b border-slate-200 bg-[#f6f5f8] px-4 pb-4 pt-6 lg:hidden">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label="Menu"
          >
            <Menu className="size-5 text-slate-600" />
          </button>

          <button
            type="button"
            className="relative flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label="Notificações"
          >
            <Bell className="size-5 text-slate-600" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[#895af6]" />
          </button>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">Bem-vindo de volta,</p>
          <h1 className="text-[28px] font-black leading-tight text-slate-900">
            {greetingName}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>
      </header>
    </>
  );
}

export function BusinessDashboardStats({
  stats,
}: {
  stats: CompanyDashboardMetric[];
}) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <DashboardCard
          key={stat.id}
          className={cn(
            "p-5 lg:p-6",
            stat.tone === "highlight" &&
              "border-[rgba(137,90,246,0.2)] bg-[linear-gradient(135deg,rgba(137,90,246,0.16),rgba(255,255,255,1))]"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-black tracking-[-0.8px] text-slate-900">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-500">{stat.subtitle}</p>
            </div>

            <div
              className={cn(
                "flex size-11 items-center justify-center rounded-2xl",
                stat.tone === "highlight" ? "bg-[#895af6]/10" : "bg-slate-100"
              )}
            >
              <MetricIcon metricId={stat.id} />
            </div>
          </div>
        </DashboardCard>
      ))}
    </section>
  );
}

export function BusinessDashboardQuickActions({
  actions,
}: {
  actions: CompanyDashboardQuickAction[];
}) {
  return (
    <DashboardCard className="order-3 lg:order-none">
      <SectionHeader
        title="Ações rápidas"
        description="Atalhos para os fluxos operacionais mais usados."
      />

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        {actions.map((action) =>
          action.to ? (
            <Link
              key={action.id}
              to={action.to}
              className="rounded-2xl border border-slate-200 p-4 transition-colors hover:border-[#895af6]/30 hover:bg-[#895af6]/5"
            >
              <p className="text-sm font-bold text-slate-900">{action.label}</p>
              <p className="mt-1 text-sm text-slate-500">{action.description}</p>
            </Link>
          ) : (
            <div
              key={action.id}
              className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{action.label}</p>
                  <p className="mt-1 text-sm text-slate-500">{action.description}</p>
                </div>
                <Button variant="outline" size="sm" disabled={action.disabled}>
                  Em breve
                </Button>
              </div>
              {action.todoNote ? (
                <p className="mt-3 text-xs text-slate-400">{action.todoNote}</p>
              ) : null}
            </div>
          )
        )}
      </div>
    </DashboardCard>
  );
}

export function BusinessDashboardPendingRequests({
  items,
  isLoading,
  errorMessage,
  hasCampaignData,
  isRefreshing,
}: {
  items: CompanyDashboardPendingItem[];
  isLoading: boolean;
  errorMessage: string | null;
  hasCampaignData: boolean;
  isRefreshing: boolean;
}) {
  return (
    <DashboardCard className="border-[rgba(137,90,246,0.16)] bg-[linear-gradient(180deg,rgba(137,90,246,0.08),rgba(255,255,255,1))]">
      <SectionHeader
        title="Campanhas aguardando resposta"
        description="Solicitações ainda sem aceite do creator."
        ctaLabel="Ver todas"
        ctaTo="/campanhas"
      />

      {isRefreshing && !isLoading ? (
        <p className="mt-4 text-xs font-medium text-slate-400">Atualizando...</p>
      ) : null}

      <div className="mt-5">
        {isLoading ? <SectionSkeleton rows={2} /> : null}

        {!isLoading && errorMessage ? (
          <SectionMessage message={errorMessage} tone="error" />
        ) : null}

        {!isLoading && !errorMessage && items.length === 0 ? (
          hasCampaignData ? (
            <EmptyState
              title="Nenhuma solicitação pendente"
              description="Tudo que dependia de aceite do creator já foi respondido."
            />
          ) : (
            <EmptyState
              title="Nenhuma campanha encontrada"
              description="Quando houver solicitações criadas, elas aparecerão aqui."
            />
          )
        ) : null}

        {!isLoading && !errorMessage && items.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {items.map((item) => (
              <Link
                key={item.id}
                to="/campanhas"
                className="rounded-2xl border border-[rgba(137,90,246,0.08)] bg-white p-4 transition-colors hover:border-[rgba(137,90,246,0.18)] hover:bg-[#895af6]/[0.03]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Creator: {item.creatorName}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#895af6]/10 px-3 py-1 text-xs font-bold text-[#895af6]">
                    Pendente
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">
                    {item.statusLabel} • {item.waitingLabel}
                  </p>
                  <span className="text-sm font-semibold text-[#895af6]">
                    Analisar campanha
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </DashboardCard>
  );
}

export function BusinessDashboardCampaignList({
  items,
  isLoading,
  errorMessage,
  hasCampaignData,
  isRefreshing,
}: {
  items: CompanyDashboardCampaignItem[];
  isLoading: boolean;
  errorMessage: string | null;
  hasCampaignData: boolean;
  isRefreshing: boolean;
}) {
  return (
    <DashboardCard>
      <SectionHeader
        title="Campanhas ativas"
        description="Somente campanhas aceitas ou em andamento."
        ctaLabel="Ver todas"
        ctaTo="/campanhas"
      />

      {isRefreshing && !isLoading ? (
        <p className="mt-4 text-xs font-medium text-slate-400">Atualizando...</p>
      ) : null}

      <div className="mt-5">
        {isLoading ? <SectionSkeleton rows={3} /> : null}

        {!isLoading && errorMessage ? (
          <SectionMessage message={errorMessage} tone="error" />
        ) : null}

        {!isLoading && !errorMessage && items.length === 0 ? (
          hasCampaignData ? (
            <EmptyState
              title="Nenhuma campanha ativa"
              description="Quando uma campanha for aceita ou entrar em andamento, ela aparecerá aqui."
            />
          ) : (
            <EmptyState
              title="Você ainda não possui campanhas"
              description="Use o marketplace para encontrar creators e iniciar novas solicitações."
            />
          )
        ) : null}

        {!isLoading && !errorMessage && items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <Link
                key={item.id}
                to="/campanhas"
                className="block rounded-2xl border border-slate-100 p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-bold text-slate-900">
                        {item.title}
                      </p>
                      <CampaignStatusBadge
                        label={item.statusLabel}
                        status={item.status}
                      />
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Creator: {item.creatorName}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                      <span>{item.startsAtLabel}</span>
                      <span>{item.locationText}</span>
                      <span>{item.relativeDateLabel}</span>
                    </div>
                  </div>

                  <div className="min-w-[180px]">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Investimento
                    </p>
                    <p className="mt-2 text-xl font-black tracking-[-0.5px] text-[#895af6]">
                      {formatCurrency(item.totalAmount, item.currency)}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Progresso
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                      {item.progressLabel}
                    </p>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        item.status === "IN_PROGRESS"
                          ? "bg-blue-500"
                          : item.status === "ACCEPTED"
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                      )}
                      style={{ width: `${item.progressValue}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </DashboardCard>
  );
}

export function BusinessDashboardRecommendedCreators({
  items,
  isLoading,
  errorMessage,
  hasRecommendedCreators,
  isRefreshing,
  getCreatorFallbackInitials,
}: {
  items: CompanyDashboardRecommendedCreator[];
  isLoading: boolean;
  errorMessage: string | null;
  hasRecommendedCreators: boolean;
  isRefreshing: boolean;
  getCreatorFallbackInitials: (name: string) => string;
}) {
  return (
    <DashboardCard>
      <SectionHeader
        title="Criadores recomendados"
        description="Sugestões puxadas do marketplace atual."
        ctaLabel="Explorar"
        ctaTo="/marketplace"
      />

      {isRefreshing && !isLoading ? (
        <p className="mt-4 text-xs font-medium text-slate-400">Atualizando...</p>
      ) : null}

      <div className="mt-5">
        {isLoading ? <SectionSkeleton rows={3} /> : null}

        {!isLoading && errorMessage ? (
          <SectionMessage message={errorMessage} tone="error" />
        ) : null}

        {!isLoading && !errorMessage && items.length === 0 ? (
          hasRecommendedCreators ? (
            <EmptyState
              title="Nenhum creator para este filtro"
              description="Ajuste a busca do dashboard ou abra o marketplace completo."
            />
          ) : (
            <EmptyState
              title="Sem creators recomendados"
              description="Quando houver creators disponíveis, eles aparecerão aqui."
            />
          )
        ) : null}

        {!isLoading && !errorMessage && items.length > 0 ? (
          <div className="space-y-3">
            {items.map((creator) => (
              <div
                key={creator.id}
                className="rounded-2xl border border-slate-100 p-4"
              >
                <div className="flex items-start gap-3">
                  {creator.avatarUrl ? (
                    <img
                      src={creator.avatarUrl}
                      alt={creator.name}
                      className="size-12 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#895af6]/10 text-sm font-bold text-[#895af6]">
                      {getCreatorFallbackInitials(creator.name)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {creator.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{creator.niche}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>{creator.location}</span>
                      {creator.rating != null ? (
                        <span>{creator.rating.toFixed(1)} de rating</span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/criador/${creator.id}`}
                    state={{ marketplaceCreator: creator }}
                    className="text-sm font-semibold text-[#895af6] hover:text-[#7c4aed]"
                  >
                    Ver perfil
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </DashboardCard>
  );
}

export function BusinessDashboardMapCard({
  highlights,
}: {
  highlights: string[];
}) {
  return (
    <DashboardCard className="bg-[radial-gradient(circle_at_top_left,rgba(137,90,246,0.12),rgba(255,255,255,1)_62%)]">
      <div className="flex items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#895af6]/10">
          <MapPin className="size-5 text-[#895af6]" />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-[-0.3px] text-slate-900">
            Mapa de creators
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            O mapa segue como módulo próprio. Use-o para expandir a busca geográfica sem pins simulados no dashboard.
          </p>
        </div>
      </div>

      {highlights.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {highlights.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 rounded-2xl border border-dashed border-[rgba(137,90,246,0.2)] bg-white/80 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-[#895af6]" />
          <p className="text-sm text-slate-600">
            Enquanto o contrato de mapa não expõe proximidade real aqui no dashboard, o CTA abaixo leva para a busca completa já existente.
          </p>
        </div>
      </div>

      <Link
        to="/mapa"
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#895af6] hover:text-[#7c4aed]"
      >
        Abrir mapa de creators
      </Link>
    </DashboardCard>
  );
}
