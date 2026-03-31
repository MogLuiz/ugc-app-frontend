import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { toast } from "~/components/ui/toast";
import {
  useAcceptContractRequestMutation,
  useCancelContractRequestMutation,
  useMyCreatorContractRequestsQuery,
  useMyCreatorPendingContractRequestsQuery,
  useRejectContractRequestMutation,
} from "../queries";
import type { ContractRequestItem } from "../types";
import { OfferDetailPanel } from "./offer-detail-panel";
import { OfferListCard } from "./offer-list-card";
import { OffersEmptyState } from "./offers-empty-state";

type Tab = "pending" | "confirmed" | "finalized";

const TABS: { id: Tab; label: string }[] = [
  { id: "pending", label: "Pendentes" },
  { id: "confirmed", label: "Confirmadas" },
  { id: "finalized", label: "Finalizadas" },
];

function parseTab(value: string | null): Tab {
  if (value === "confirmed" || value === "finalized") return value;
  return "pending";
}

export function CreatorPendingContractRequestsScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = parseTab(searchParams.get("tab"));
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [activeMutationId, setActiveMutationId] = useState<string | null>(null);

  const navigate = useNavigate();

  function setActiveTab(tab: Tab) {
    setSearchParams(tab === "pending" ? {} : { tab }, { replace: true });
    setSelectedOfferId(null);
  }

  const pendingQuery = useMyCreatorPendingContractRequestsQuery();
  const confirmedQuery = useMyCreatorContractRequestsQuery("ACCEPTED");
  const finalizedQuery = useMyCreatorContractRequestsQuery("COMPLETED");

  const acceptMutation = useAcceptContractRequestMutation();
  const rejectMutation = useRejectContractRequestMutation();
  const cancelMutation = useCancelContractRequestMutation();

  const getItems = (): ContractRequestItem[] => {
    if (activeTab === "pending") return pendingQuery.data ?? [];
    if (activeTab === "confirmed") return confirmedQuery.data ?? [];
    return finalizedQuery.data ?? [];
  };

  const isLoading = (): boolean => {
    if (activeTab === "pending") return pendingQuery.isLoading;
    if (activeTab === "confirmed") return confirmedQuery.isLoading;
    return finalizedQuery.isLoading;
  };

  const items = getItems();
  const loading = isLoading();

  const selectedOffer =
    (selectedOfferId ? items.find((i) => i.id === selectedOfferId) : null) ??
    items[0] ??
    null;

  const handleAccept = async (contractRequestId: string) => {
    setActiveMutationId(contractRequestId);
    try {
      await acceptMutation.mutateAsync(contractRequestId);
      toast.success("Oferta aceita com sucesso.");
      setSelectedOfferId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível aceitar a oferta."
      );
    } finally {
      setActiveMutationId(null);
    }
  };

  const handleReject = async (contractRequestId: string) => {
    setActiveMutationId(contractRequestId);
    try {
      await rejectMutation.mutateAsync({ contractRequestId });
      toast.success("Oferta recusada.");
      setSelectedOfferId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível recusar a oferta."
      );
    } finally {
      setActiveMutationId(null);
    }
  };

  const handleCancel = async (contractRequestId: string) => {
    setActiveMutationId(contractRequestId);
    try {
      await cancelMutation.mutateAsync(contractRequestId);
      toast.success("Trabalho desmarcado.");
      setSelectedOfferId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível desmarcar o trabalho."
      );
    } finally {
      setActiveMutationId(null);
    }
  };

  const handleCardClick = (item: ContractRequestItem) => {
    setSelectedOfferId(item.id);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      void navigate(`/ofertas/${item.id}`, { state: { item } });
    }
  };

  const tabCount = (tab: Tab): number | null => {
    if (tab === "pending") return pendingQuery.data?.length ?? null;
    if (tab === "confirmed") return confirmedQuery.data?.length ?? null;
    return finalizedQuery.data?.length ?? null;
  };

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      {/* Sidebar desktop */}
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      {/* ── Main area ── */}
      <div className="flex min-w-0 flex-1 flex-col lg:h-screen lg:flex-row lg:overflow-hidden">

        {/* ══ LEFT COLUMN — list ══ */}
        <aside className="flex flex-col bg-[#f6f5f8] lg:w-[380px] lg:shrink-0 lg:overflow-hidden lg:bg-white lg:border-r lg:border-[rgba(226,232,240,0.3)]">

          {/* Header */}
          <div className="px-6 pb-0 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  Ofertas
                </h1>
                <p className="mt-0.5 text-sm text-slate-500">
                  Revise e responda no seu tempo.
                </p>
              </div>
              {(pendingQuery.data?.length ?? 0) > 0 && (
                <span className="rounded-md bg-[#f0ebff] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#895af6]">
                  {pendingQuery.data!.length} nova
                  {pendingQuery.data!.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Mobile: segmented pill */}
            <div className="lg:hidden">
              <div className="flex rounded-full bg-[#e7e6e9] p-1">
                {TABS.map((tab) => {
                  const count = tabCount(tab.id);
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={
                        isActive
                          ? "flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white py-2 text-sm font-bold text-slate-900 shadow-sm"
                          : "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-bold text-slate-500"
                      }
                    >
                      {tab.label}
                      {tab.id === "pending" && count != null && count > 0 && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-[#895af6] text-[11px] font-bold text-white">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop: underline tabs */}
            <div className="hidden border-b border-[rgba(226,232,240,0.4)] lg:flex lg:gap-5">
              {TABS.map((tab) => {
                const count = tabCount(tab.id);
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSelectedOfferId(null);
                    }}
                    className={
                      isActive
                        ? "flex items-center gap-1.5 border-b-2 border-[#895af6] pb-3 pt-1 text-sm font-bold text-[#895af6]"
                        : "flex items-center gap-1.5 border-b-2 border-transparent pb-3 pt-1 text-sm font-medium text-slate-500 hover:text-slate-700"
                    }
                  >
                    {tab.label}
                    {count != null && count > 0 && (
                      <span
                        className={
                          isActive
                            ? "rounded-full bg-[#895af6] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white"
                            : "rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold leading-none text-slate-500"
                        }
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto px-4 pb-28 pt-4 lg:px-4 lg:pb-6">
            {loading ? (
              <div className="animate-pulse flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-[88px] rounded-[28px] border border-slate-100 bg-white" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <OffersEmptyState />
            ) : (
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <OfferListCard
                    key={item.id}
                    item={item}
                    isActive={selectedOffer?.id === item.id}
                    onClick={() => handleCardClick(item)}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ══ RIGHT COLUMN — detail (desktop only) ══ */}
        <main className="hidden flex-1 overflow-y-auto bg-[#f6f5f8] p-10 lg:block">
          {selectedOffer ? (
            <div className="mx-auto max-w-2xl">
              <OfferDetailPanel
                item={selectedOffer}
                isMutating={activeMutationId === selectedOffer.id}
                onAccept={(id) => void handleAccept(id)}
                onReject={(id) => void handleReject(id)}
                onCancel={(id) => void handleCancel(id)}
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <span className="text-2xl">📋</span>
                </div>
                <p className="text-sm font-medium text-slate-500">
                  Selecione uma oferta para ver os detalhes
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <CreatorBottomNav />
    </div>
  );
}
