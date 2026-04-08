import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { EmptyState } from "~/components/ui/empty-state";
import { useMyCompanyContractRequestsQuery } from "~/modules/contract-requests/queries";
import type { CompanyCampaignsLocationState } from "~/modules/contract-requests/company-campaigns-location-state";
import { useMyCompanyOpenOffersQuery } from "../queries";
import { buildFinalizedSections, buildInProgressItems, buildOpenTabItems } from "../helpers";
import { OpenOfferHubCard } from "./open-offer-hub-card";

type OffersTabId = "OPEN" | "IN_PROGRESS" | "FINALIZED";

const TABS: Array<{ id: OffersTabId; label: string }> = [
  { id: "OPEN", label: "Abertas" },
  { id: "IN_PROGRESS", label: "Em andamento" },
  { id: "FINALIZED", label: "Finalizadas" },
];

function EmptyTabState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-[28px] bg-white p-6 shadow-sm">
      <EmptyState title={title} description={description} />
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
    <div className="flex items-center justify-end gap-2">
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
  const [activeTab, setActiveTab] = useState<OffersTabId>("OPEN");
  const [page, setPage] = useState(1);
  const openOffersQuery = useMyCompanyOpenOffersQuery({ page, limit: 20 });
  const pendingContractsQuery = useMyCompanyContractRequestsQuery("PENDING");
  const contractsQuery = useMyCompanyContractRequestsQuery();

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

  const openedContractInActive = openContractRequestId
    ? [...openItems, ...inProgressItems, ...finalizedSections.contracts].find(
        (item) => item.contractRequestId === openContractRequestId
      )
    : null;

  const resolvedTab = openedContractInActive
    ? finalizedSections.contracts.some((item) => item.contractRequestId === openContractRequestId)
      ? "FINALIZED"
      : inProgressItems.some((item) => item.contractRequestId === openContractRequestId)
        ? "IN_PROGRESS"
        : "OPEN"
    : activeTab;

  useEffect(() => {
    if (!openContractRequestId) return;
    if (openContractRequestIdFromState) {
      navigate(location.pathname, { replace: true, state: {} satisfies CompanyCampaignsLocationState });
      return;
    }

    const next = new URLSearchParams(searchParams);
    next.delete("contractRequestId");
    setSearchParams(next, { replace: true });
  }, [
    location.pathname,
    navigate,
    openContractRequestId,
    openContractRequestIdFromState,
    searchParams,
    setSearchParams,
  ]);

  const content = (() => {
    if (isLoading) {
      return (
        <div className="grid gap-4 lg:grid-cols-2">
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
          <EmptyTabState
            title="Nenhuma oferta aberta no momento"
            description="Publique uma nova oferta ou acompanhe convites diretos aguardando resposta."
          />
        );
      }

      return (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {openItems.map((item) => (
              <OpenOfferHubCard
                key={`${item.kind}:${item.id}`}
                item={item}
                onClick={
                  item.href
                    ? () =>
                        navigate(item.href!, item.contractRequestId ? undefined : { state: { fromHub: true } })
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
        </div>
      );
    }

    if (resolvedTab === "IN_PROGRESS") {
      if (inProgressItems.length === 0) {
        return (
          <EmptyTabState
            title="Nenhum contrato ativo"
            description="Quando uma seleção virar contrato ou um trabalho entrar em andamento, ele aparecerá aqui."
          />
        );
      }

      return (
        <div className="grid gap-4 lg:grid-cols-2">
          {inProgressItems.map((item) => (
            <OpenOfferHubCard key={item.id} item={item} />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Contratos encerrados</h2>
            <p className="mt-1 text-sm text-slate-500">
              Contratos concluídos ou cancelados após a fase de seleção.
            </p>
          </div>
          {finalizedSections.contracts.length === 0 ? (
            <EmptyTabState
              title="Nenhum contrato encerrado"
              description="Contratos concluídos ou cancelados aparecerão nesta seção."
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {finalizedSections.contracts.map((item) => (
                <OpenOfferHubCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Ofertas encerradas sem contratação</h2>
            <p className="mt-1 text-sm text-slate-500">
              Ofertas que expiraram ou foram canceladas antes de gerar contrato.
            </p>
          </div>
          {finalizedSections.offersWithoutHire.length === 0 ? (
            <EmptyTabState
              title="Nenhuma oferta encerrada"
              description="Ofertas canceladas ou expiradas aparecerão nesta seção."
            />
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
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
        <div className="flex min-w-0 flex-1 flex-col gap-6 px-4 lg:px-0">
          <header className="flex flex-col gap-4 rounded-[32px] bg-[radial-gradient(circle_at_top_left,rgba(137,90,246,0.18),transparent_45%),linear-gradient(135deg,#15171a,#23262b)] px-6 py-7 text-white shadow-sm lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <div className="max-w-3xl">
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

          <section className="flex flex-wrap gap-2 rounded-[24px] bg-white p-2 shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  resolvedTab === tab.id
                    ? "bg-[#895af6] text-white shadow-[0_10px_25px_-16px_rgba(137,90,246,0.75)]"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </section>

          {content}
        </div>
      </main>

      <BusinessBottomNav />
    </div>
  );
}
