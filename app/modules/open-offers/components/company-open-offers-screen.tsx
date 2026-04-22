import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { OffersEmptyState } from "~/modules/contract-requests/components/offers-empty-state";
import { cn } from "~/lib/utils";
import { useMyCompanyContractRequestsQuery } from "~/modules/contract-requests/queries";
import type { CompanyCampaignsLocationState } from "~/modules/contract-requests/company-campaigns-location-state";
import { useMyCompanyOpenOffersQuery } from "../queries";
import { buildFinalizedSections, buildInProgressItems, buildOpenTabItems } from "../helpers";
import { OpenOfferHubCard } from "./open-offer-hub-card";

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

function PaginationBar({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-sm font-medium text-slate-500">
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
      >
        Próxima
      </button>
    </div>
  );
}

export function CompanyOpenOffersScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const openOffersQuery = useMyCompanyOpenOffersQuery({ page, limit: 20 });
  const pendingContractsQuery = useMyCompanyContractRequestsQuery("PENDING");
  const contractsQuery = useMyCompanyContractRequestsQuery();
  const activeTab = parseOffersTab(searchParams.get("tab"));

  const openOffers = openOffersQuery.data?.items ?? [];
  const pendingContracts = pendingContractsQuery.data ?? [];
  const contracts = contractsQuery.data ?? [];

  const now = Date.now();

  const openItems = useMemo(
    () => buildOpenTabItems(openOffers, pendingContracts, now),
    [now, openOffers, pendingContracts]
  );
  const inProgressItems = useMemo(() => buildInProgressItems(contracts), [contracts]);
  const finalizedSections = useMemo(
    () => buildFinalizedSections(contracts, openOffers, now),
    [contracts, now, openOffers]
  );

  const tabCounts = useMemo(() => {
    return {
      OPEN: openItems.length,
      IN_PROGRESS: inProgressItems.length,
      FINALIZED:
        finalizedSections.completed.length +
        finalizedSections.cancelled.length +
        finalizedSections.offersWithoutHire.length,
    } satisfies Record<OffersTabId, number>;
  }, [
    openItems.length,
    inProgressItems.length,
    finalizedSections.completed.length,
    finalizedSections.cancelled.length,
    finalizedSections.offersWithoutHire.length,
  ]);

  const isLoading =
    openOffersQuery.isLoading ||
    pendingContractsQuery.isLoading ||
    contractsQuery.isLoading;

  const errorMessage =
    (openOffersQuery.error instanceof Error && openOffersQuery.error.message) ||
    (pendingContractsQuery.error instanceof Error && pendingContractsQuery.error.message) ||
    (contractsQuery.error instanceof Error && contractsQuery.error.message) ||
    null;

  const openContractRequestIdFromState = (
    location.state as CompanyCampaignsLocationState | null
  )?.openContractRequestId;
  const openContractRequestId = openContractRequestIdFromState ?? searchParams.get("contractRequestId") ?? undefined;

  const finalizedContracts = useMemo(
    () => [...finalizedSections.completed, ...finalizedSections.cancelled],
    [finalizedSections.completed, finalizedSections.cancelled]
  );

  const openedContractInActive = openContractRequestId
    ? [...openItems, ...inProgressItems, ...finalizedContracts].find(
        (item) => item.contractRequestId === openContractRequestId
      )
    : null;

  const resolvedTab = openedContractInActive
    ? finalizedContracts.some((item) => item.contractRequestId === openContractRequestId)
      ? "FINALIZED"
      : inProgressItems.some((item) => item.contractRequestId === openContractRequestId)
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
        {
          pathname: location.pathname,
          search: location.search,
        },
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

  const content = (() => {
    if (isLoading) {
      return (
        <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[260px] animate-pulse rounded-[28px] bg-white shadow-sm" />
          ))}
        </div>
      );
    }

    if (errorMessage) {
      return (
        <section className="rounded-[28px] bg-white p-6 text-sm text-rose-600 shadow-sm">
          {errorMessage}
        </section>
      );
    }

    if (resolvedTab === "OPEN") {
      if (openItems.length === 0) {
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

      const openOfferItems = openItems.filter((item) => item.kind === "open_offer");
      const directInviteItems = openItems.filter((item) => item.kind === "direct_invite");

      return (
        <div className="min-w-0 space-y-6">
          {openOfferItems.length > 0 && (
            <section className="min-w-0 space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Ofertas abertas</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Aguardando candidaturas de creators.
                </p>
              </div>
              <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
                {openOfferItems.map((item) => (
                  <OpenOfferHubCard
                    key={`${item.kind}:${item.id}`}
                    item={item}
                    onClick={
                      item.href
                        ? () => navigate(item.href!, { state: { fromHub: true } })
                        : undefined
                    }
                  />
                ))}
              </div>
              <PaginationBar
                page={openOffersQuery.data?.pagination.page ?? page}
                totalPages={openOffersQuery.data?.pagination.totalPages ?? 1}
                onPageChange={setPage}
              />
            </section>
          )}
          {directInviteItems.length > 0 && (
            <section className="min-w-0 space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Convites aguardando resposta</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Convites diretos enviados que ainda não foram respondidos.
                </p>
              </div>
              <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
                {directInviteItems.map((item) => (
                  <OpenOfferHubCard
                    key={`${item.kind}:${item.id}`}
                    item={item}
                    onClick={
                      item.href
                        ? () => navigate(item.href!)
                        : undefined
                    }
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      );
    }

    if (resolvedTab === "IN_PROGRESS") {
      if (inProgressItems.length === 0) {
        return (
          <CompanyOffersEmptySection
            title="Nenhum contrato em andamento"
            description="Quando você selecionar um creator e o contrato avançar, ele aparecerá nesta aba."
          />
        );
      }

      return (
        <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
          {inProgressItems.map((item) => (
            <OpenOfferHubCard key={item.id} item={item} />
          ))}
        </div>
      );
    }

    return (
      <div className="min-w-0 space-y-6">
        <section className="min-w-0 space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Concluídas</h2>
            <p className="mt-1 text-sm text-slate-500">
              Contratos finalizados com sucesso.
            </p>
          </div>
          {finalizedSections.completed.length === 0 ? (
            <CompanyOffersEmptySection
              title="Nenhum contrato concluído"
              description="Contratos finalizados com sucesso aparecerão aqui."
            />
          ) : (
            <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
              {finalizedSections.completed.map((item) => (
                <OpenOfferHubCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <section className="min-w-0 space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Canceladas</h2>
            <p className="mt-1 text-sm text-slate-500">
              Contratos cancelados e ofertas encerradas pela empresa.
            </p>
          </div>
          {finalizedSections.cancelled.length === 0 ? (
            <CompanyOffersEmptySection
              title="Nenhum item cancelado"
              description="Contratos e ofertas cancelados aparecerão aqui."
            />
          ) : (
            <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
              {finalizedSections.cancelled.map((item) => (
                <OpenOfferHubCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <section className="min-w-0 space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Expiradas / sem contratação</h2>
            <p className="mt-1 text-sm text-slate-500">
              Ofertas que expiraram antes de gerar um contrato.
            </p>
          </div>
          {finalizedSections.offersWithoutHire.length === 0 ? (
            <CompanyOffersEmptySection
              title="Nenhuma oferta expirada"
              description="Ofertas que expiraram sem contratação aparecerão aqui."
            />
          ) : (
            <div className="min-w-0 space-y-4">
              <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
                {finalizedSections.offersWithoutHire.map((item) => (
                  <OpenOfferHubCard key={item.id} item={item} />
                ))}
              </div>
              <PaginationBar
                page={openOffersQuery.data?.pagination.page ?? page}
                totalPages={openOffersQuery.data?.pagination.totalPages ?? 1}
                onPageChange={setPage}
              />
            </div>
          )}
        </section>
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
                Publique ofertas abertas, acompanhe convites diretos e faça o handoff para o contrato quando selecionar o creator ideal.
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
