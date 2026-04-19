import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { cn } from "~/lib/utils";
import { OpenOfferHubCard } from "~/modules/open-offers/components/open-offer-hub-card";
import { mapCreatorContractToListItem, sortByStartsAtDesc } from "../helpers";
import {
  useMyCreatorContractRequestsQuery,
  useMyCreatorPendingContractRequestsQuery,
} from "../queries";
import type { ContractRequestItem } from "../types";
import { CreatorOffersEmptyState, OffersEmptyState } from "./offers-empty-state";

type Tab = "PENDING" | "ACCEPTED" | "FINALIZED";

const TABS: { id: Tab; label: string }[] = [
  { id: "PENDING", label: "Pendentes" },
  { id: "ACCEPTED", label: "Aceitas" },
  { id: "FINALIZED", label: "Finalizadas" },
];

function parseTab(value: string | null): Tab {
  if (value === "ACCEPTED" || value === "confirmed") return "ACCEPTED";
  if (value === "FINALIZED" || value === "finalized") return "FINALIZED";
  return "PENDING";
}

function CreatorOffersStatusFilter({
  activeTab,
  onTabChange,
  counts,
}: {
  activeTab: Tab;
  onTabChange: (id: Tab) => void;
  counts: Record<Tab, number | null>;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar ofertas por status"
      className="flex min-w-0 w-full rounded-full bg-[#e7e6e9] p-1 lg:w-fit lg:self-start"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
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
            {count != null && (
              <span
                className={cn(
                  "shrink-0 tabular-nums text-[10px] font-bold leading-none lg:text-xs lg:font-semibold",
                  isActive ? "text-slate-800" : "text-slate-600"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function CreatorPendingContractRequestsScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = parseTab(searchParams.get("tab"));

  const now = Date.now();

  const pendingQuery = useMyCreatorPendingContractRequestsQuery();
  const acceptedQuery = useMyCreatorContractRequestsQuery("ACCEPTED");
  const completedQuery = useMyCreatorContractRequestsQuery("COMPLETED");
  const rejectedQuery = useMyCreatorContractRequestsQuery("REJECTED");
  const cancelledQuery = useMyCreatorContractRequestsQuery("CANCELLED");

  function setActiveTab(tab: Tab) {
    setSearchParams(tab === "PENDING" ? {} : { tab }, { replace: true });
  }

  const pendingItems = useMemo(
    () => (pendingQuery.data ?? []).map((item) => mapCreatorContractToListItem(item, now)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pendingQuery.data]
  );

  const acceptedItems = useMemo(
    () => (acceptedQuery.data ?? []).map((item) => mapCreatorContractToListItem(item, now)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [acceptedQuery.data]
  );

  const finalizedItems = useMemo(() => {
    const completed = (completedQuery.data ?? []).map((item) =>
      mapCreatorContractToListItem(item, now)
    );
    const rejected = (rejectedQuery.data ?? []).map((item) =>
      mapCreatorContractToListItem(item, now)
    );
    const cancelled = (cancelledQuery.data ?? []).map((item) =>
      mapCreatorContractToListItem(item, now)
    );
    return [...completed, ...rejected, ...cancelled].sort(sortByStartsAtDesc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedQuery.data, rejectedQuery.data, cancelledQuery.data]);

  const tabCounts: Record<Tab, number | null> = {
    PENDING: pendingQuery.data?.length ?? null,
    ACCEPTED: acceptedQuery.data?.length ?? null,
    FINALIZED:
      completedQuery.data != null ||
      rejectedQuery.data != null ||
      cancelledQuery.data != null
        ? finalizedItems.length
        : null,
  };

  const isLoading = (() => {
    if (activeTab === "PENDING") return pendingQuery.isLoading;
    if (activeTab === "ACCEPTED") return acceptedQuery.isLoading;
    return completedQuery.isLoading || rejectedQuery.isLoading || cancelledQuery.isLoading;
  })();

  const activeItems = (() => {
    if (activeTab === "PENDING") return pendingItems;
    if (activeTab === "ACCEPTED") return acceptedItems;
    return finalizedItems;
  })();

  const rawItems: ContractRequestItem[] = (() => {
    if (activeTab === "PENDING") return pendingQuery.data ?? [];
    if (activeTab === "ACCEPTED") return acceptedQuery.data ?? [];
    return [
      ...(completedQuery.data ?? []),
      ...(rejectedQuery.data ?? []),
      ...(cancelledQuery.data ?? []),
    ];
  })();

  const handleCardClick = (id: string) => {
    const raw = rawItems.find((i) => i.id === id);
    void navigate(`/ofertas/${id}`, {
      state: raw ? { item: raw } : undefined,
    });
  };

  const content = (() => {
    if (isLoading) {
      return (
        <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[260px] animate-pulse rounded-[28px] bg-white shadow-sm"
            />
          ))}
        </div>
      );
    }

    if (activeItems.length === 0) {
      const emptyContent = (() => {
        if (activeTab === "PENDING") return <CreatorOffersEmptyState />;
        if (activeTab === "ACCEPTED") {
          return (
            <OffersEmptyState
              title="Nenhum trabalho aceito"
              description="Quando uma proposta for aceita, ela aparecerá aqui."
            />
          );
        }
        return (
          <OffersEmptyState
            title="Nenhuma oferta finalizada"
            description="Propostas concluídas, recusadas ou canceladas aparecerão aqui."
          />
        );
      })();

      return (
        <section className="rounded-[28px] bg-white p-6 shadow-sm">{emptyContent}</section>
      );
    }

    return (
      <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
        {activeItems.map((item) => (
          <OpenOfferHubCard
            key={item.id}
            item={item}
            onClick={() => handleCardClick(item.id)}
          />
        ))}
      </div>
    );
  })();

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 pb-24 pt-4 lg:p-8">
        <div className="flex min-w-0 flex-1 flex-col px-4 lg:px-0">
          <header className="flex min-w-0 flex-col rounded-[32px] bg-[radial-gradient(circle_at_top_left,rgba(137,90,246,0.18),transparent_45%),linear-gradient(135deg,#15171a,#23262b)] px-6 py-5 text-white shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">
              Ofertas
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] lg:text-4xl">
              Suas propostas de trabalho
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Revise e responda no seu tempo.
            </p>
          </header>

          <div className="mt-3 min-w-0">
            <CreatorOffersStatusFilter
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={tabCounts}
            />
          </div>

          <div className="mt-4 min-w-0">{content}</div>
        </div>
      </main>

      <CreatorBottomNav />
    </div>
  );
}
