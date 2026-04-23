import { useEffect, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { OffersEmptyState } from "~/modules/contract-requests/components/offers-empty-state";
import { cn } from "~/lib/utils";
import type { CompanyCampaignsLocationState } from "~/modules/contract-requests/company-campaigns-location-state";
import { useCompanyOffersHubQuery } from "../queries";
import { formatOfferExpiry, getRemainingMs } from "../helpers";
import type { CompanyHubItem } from "../types";
import { CompanyHubCard } from "./company-hub-card";

type OffersTabId = "OPEN" | "IN_PROGRESS" | "FINALIZED";

const TABS: Array<{ id: OffersTabId; label: string }> = [
  { id: "OPEN", label: "Pendentes" },
  { id: "IN_PROGRESS", label: "Em andamento" },
  { id: "FINALIZED", label: "Finalizadas" },
];

function parseOffersTab(value: string | null): OffersTabId {
  if (value === "IN_PROGRESS" || value === "ACCEPTED" || value === "confirmed") {
    return "IN_PROGRESS";
  }
  if (value === "FINALIZED" || value === "finalized") {
    return "FINALIZED";
  }
  return "OPEN";
}

function CompanyOffersStatusFilter({
  resolvedTab,
  onTabChange,
  counts,
}: {
  resolvedTab: OffersTabId;
  onTabChange: (id: OffersTabId) => void;
  counts: Record<OffersTabId, number>;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar ofertas por status"
      className="flex min-w-0 w-full rounded-full bg-[#e7e6e9] p-1 lg:w-fit lg:self-start"
    >
      {TABS.map((tab) => {
        const isActive = resolvedTab === tab.id;
        const count = counts[tab.id];
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden rounded-full px-2 py-2 text-xs transition lg:flex-none lg:gap-1.5 lg:px-4 lg:py-2 lg:text-sm",
              isActive
                ? "bg-white font-bold text-slate-900 shadow-sm"
                : "font-semibold text-slate-600 hover:text-slate-800"
            )}
          >
            <span className="min-w-0 truncate">{tab.label}</span>
            <span
              className={cn(
                "shrink-0 tabular-nums text-[10px] font-bold leading-none lg:text-xs lg:font-semibold",
                isActive ? "text-slate-800" : "text-slate-600"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function CompanyOffersEmptySection({
  title,
  description,
  footer,
}: {
  title: string;
  description: string;
  footer?: ReactNode;
}) {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-sm">
      <OffersEmptyState title={title} description={description} footer={footer} />
    </section>
  );
}

function HubSection({
  title,
  description,
  items,
  getSubtitle,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  description: string;
  items: CompanyHubItem[];
  getSubtitle: (item: CompanyHubItem) => string;
  emptyTitle: string;
  emptyDescription: string;
}) {
  return (
    <section className="min-w-0 space-y-4">
      <div>
        <h2 className="text-lg font-black text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {items.length === 0 ? (
        <CompanyOffersEmptySection title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
          {items.map((item) => (
            <CompanyHubCard key={`${item.kind}:${item.id}`} item={item} subtitle={getSubtitle(item)} />
          ))}
        </div>
      )}
    </section>
  );
}

export function CompanyOpenOffersScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = parseOffersTab(searchParams.get("tab"));

  const hubQuery = useCompanyOffersHubQuery();
  const hub = hubQuery.data;

  const now = Date.now();

  const openContractRequestIdFromState = (
    location.state as CompanyCampaignsLocationState | null
  )?.openContractRequestId;
  const openContractRequestId =
    openContractRequestIdFromState ?? searchParams.get("contractRequestId") ?? undefined;

  const allItems = hub
    ? [
        ...hub.pending.openOffers,
        ...hub.pending.directInvites,
        ...hub.inProgress,
        ...hub.finalized.completed,
        ...hub.finalized.cancelled,
        ...hub.finalized.expiredWithoutHire,
      ]
    : [];

  const finalizedItems = hub
    ? [...hub.finalized.completed, ...hub.finalized.cancelled]
    : [];

  const openedContractInActive = openContractRequestId
    ? allItems.find((item) => item.contractRequestId === openContractRequestId)
    : null;

  const resolvedTab = openedContractInActive
    ? finalizedItems.some((item) => item.contractRequestId === openContractRequestId)
      ? "FINALIZED"
      : hub?.inProgress.some((item) => item.contractRequestId === openContractRequestId)
        ? "IN_PROGRESS"
        : "OPEN"
    : activeTab;

  function handleTabChange(tab: OffersTabId) {
    const next = new URLSearchParams(searchParams);
    if (tab === "OPEN") {
      next.delete("tab");
    } else {
      next.set("tab", tab);
    }
    setSearchParams(next, { replace: true });
  }

  useEffect(() => {
    if (!openContractRequestId) return;
    if (openContractRequestIdFromState) {
      navigate(
        { pathname: location.pathname, search: location.search },
        { replace: true, state: {} satisfies CompanyCampaignsLocationState }
      );
      return;
    }
    const next = new URLSearchParams(searchParams);
    next.delete("contractRequestId");
    setSearchParams(next, { replace: true });
  }, [
    location.pathname,
    location.search,
    navigate,
    openContractRequestId,
    openContractRequestIdFromState,
    searchParams,
    setSearchParams,
  ]);

  const tabCounts: Record<OffersTabId, number> = {
    OPEN: (hub?.pending.openOffers.length ?? 0) + (hub?.pending.directInvites.length ?? 0),
    IN_PROGRESS: hub?.inProgress.length ?? 0,
    FINALIZED:
      (hub?.finalized.completed.length ?? 0) +
      (hub?.finalized.cancelled.length ?? 0) +
      (hub?.finalized.expiredWithoutHire.length ?? 0),
  };

  // ─── Subtitle derivers (presentation — copy belongs in frontend) ──────────

  function pendingOfferSubtitle(item: CompanyHubItem): string {
    return formatOfferExpiry(getRemainingMs(item.expiresAt, now));
  }

  function pendingInviteSubtitle(item: CompanyHubItem): string {
    return formatOfferExpiry(getRemainingMs(item.effectiveExpiresAt, now));
  }

  function inProgressSubtitle(item: CompanyHubItem): string {
    return item.displayStatus === "IN_PROGRESS" ? "Operação em andamento" : "Contrato ativo";
  }

  function cancelledSubtitle(item: CompanyHubItem): string {
    return item.kind === "open_offer" ? "Oferta cancelada" : "Contrato cancelado";
  }

  function expiredSubtitle(item: CompanyHubItem): string {
    return item.kind === "open_offer"
      ? "Oferta encerrada sem contratação"
      : "Convite expirado sem aceite";
  }

  // ─── Content ──────────────────────────────────────────────────────────────

  const content = (() => {
    if (hubQuery.isLoading) {
      return (
        <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[260px] animate-pulse rounded-[28px] bg-white shadow-sm"
            />
          ))}
        </div>
      );
    }

    if (hubQuery.error instanceof Error) {
      return (
        <section className="rounded-[28px] bg-white p-6 text-sm text-rose-600 shadow-sm">
          {hubQuery.error.message}
        </section>
      );
    }

    if (resolvedTab === "OPEN") {
      const openOfferItems = hub?.pending.openOffers ?? [];
      const directInviteItems = hub?.pending.directInvites ?? [];

      if (openOfferItems.length === 0 && directInviteItems.length === 0) {
        return (
          <CompanyOffersEmptySection
            title="Nenhuma oferta pendente no momento"
            description="Publique uma oferta aberta para receber candidaturas ou acompanhe convites diretos aguardando resposta."
            footer={
              <Link
                to="/ofertas/criar"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#895af6] px-6 py-3 text-sm font-bold text-white shadow-[0px_8px_15px_-3px_rgba(137,90,246,0.3)] transition-colors hover:bg-[#7c4aed]"
              >
                Criar oferta
                <ArrowRight className="size-4 shrink-0" aria-hidden />
              </Link>
            }
          />
        );
      }

      return (
        <div className="min-w-0 space-y-6">
          {openOfferItems.length > 0 && (
            <HubSection
              title="Ofertas abertas"
              description="Aguardando candidaturas de creators."
              items={openOfferItems}
              getSubtitle={pendingOfferSubtitle}
              emptyTitle=""
              emptyDescription=""
            />
          )}
          {directInviteItems.length > 0 && (
            <HubSection
              title="Convites aguardando resposta"
              description="Convites diretos enviados que ainda não foram respondidos."
              items={directInviteItems}
              getSubtitle={pendingInviteSubtitle}
              emptyTitle=""
              emptyDescription=""
            />
          )}
        </div>
      );
    }

    if (resolvedTab === "IN_PROGRESS") {
      return (
        <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
          {(hub?.inProgress ?? []).length === 0 ? (
            <CompanyOffersEmptySection
              title="Nenhum contrato em andamento"
              description="Quando você selecionar um creator e o contrato avançar, ele aparecerá nesta aba."
            />
          ) : (
            (hub?.inProgress ?? []).map((item) => (
              <CompanyHubCard
                key={item.id}
                item={item}
                subtitle={inProgressSubtitle(item)}
              />
            ))
          )}
        </div>
      );
    }

    return (
      <div className="min-w-0 space-y-6">
        <HubSection
          title="Concluídas"
          description="Contratos finalizados com sucesso."
          items={hub?.finalized.completed ?? []}
          getSubtitle={() => "Contrato finalizado"}
          emptyTitle="Nenhum contrato concluído"
          emptyDescription="Contratos finalizados com sucesso aparecerão aqui."
        />

        <HubSection
          title="Canceladas"
          description="Contratos cancelados e ofertas encerradas pela empresa."
          items={hub?.finalized.cancelled ?? []}
          getSubtitle={cancelledSubtitle}
          emptyTitle="Nenhum item cancelado"
          emptyDescription="Contratos e ofertas cancelados aparecerão aqui."
        />

        <HubSection
          title="Expiradas"
          description="Ofertas e convites que expiraram antes de gerar um contrato."
          items={hub?.finalized.expiredWithoutHire ?? []}
          getSubtitle={expiredSubtitle}
          emptyTitle="Nenhum item expirado"
          emptyDescription="Ofertas e convites expirados aparecerão aqui."
        />
      </div>
    );
  })();

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 pb-24 pt-4 lg:p-8">
        <div className="flex min-w-0 flex-1 flex-col px-4 lg:px-0">
          <header className="flex min-w-0 flex-col gap-4 rounded-[32px] bg-[radial-gradient(circle_at_top_left,rgba(137,90,246,0.18),transparent_45%),linear-gradient(135deg,#15171a,#23262b)] px-6 py-7 text-white shadow-sm lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <div className="min-w-0 max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">
                Ofertas
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] lg:text-4xl">
                Central de oportunidades da sua empresa
              </h1>
              <p className="mt-3 text-sm leading-6 text-white/75 lg:text-base">
                Publique ofertas abertas, acompanhe convites diretos e faça o handoff para o
                contrato quando selecionar o creator ideal.
              </p>
            </div>

            <Link
              to="/ofertas/criar"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-white/90"
            >
              Criar oferta
            </Link>
          </header>

          <div className="mt-3 min-w-0">
            <CompanyOffersStatusFilter
              resolvedTab={resolvedTab}
              onTabChange={handleTabChange}
              counts={tabCounts}
            />
          </div>

          <div className="mt-4 min-w-0">{content}</div>
        </div>
      </main>

      <BusinessBottomNav />
    </div>
  );
}
