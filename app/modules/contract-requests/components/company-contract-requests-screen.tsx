import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { EmptyState } from "~/components/ui/empty-state";
import { useMyCompanyContractRequestsQuery } from "../queries";
import type { CompanyCampaignStatus, ContractRequestItem } from "../types";
import { CampaignCard } from "./campaign-card";

type TabId = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "FINALIZED";
type SortBy = "CREATED_AT_DESC" | "TOTAL_DESC" | "DATE_ASC";

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "PENDING", label: "Pendentes" },
  { id: "ACCEPTED", label: "Aceitas" },
  { id: "IN_PROGRESS", label: "Em andamento" },
  { id: "FINALIZED", label: "Finalizadas" },
];

const TAB_STATUS_MAP: Record<TabId, CompanyCampaignStatus[]> = {
  PENDING: ["PENDING"],
  ACCEPTED: ["ACCEPTED"],
  IN_PROGRESS: ["IN_PROGRESS"],
  FINALIZED: ["COMPLETED", "CANCELLED"],
};

function getCampaignStatus(item: ContractRequestItem): CompanyCampaignStatus | null {
  if (item.status === "PENDING" || item.status === "PENDING_ACCEPTANCE") return "PENDING";
  if (item.status === "ACCEPTED") return "ACCEPTED";
  if (item.status === "IN_PROGRESS") return "IN_PROGRESS";
  if (item.status === "COMPLETED") return "COMPLETED";
  if (item.status === "CANCELLED" || item.status === "REJECTED") return "CANCELLED";
  return null;
}

export function CompanyContractRequestsScreen() {
  const [activeTab, setActiveTab] = useState<TabId>("PENDING");
  const [sortBy] = useState<SortBy>("CREATED_AT_DESC");
  const contractRequestsQuery = useMyCompanyContractRequestsQuery();
  const items = contractRequestsQuery.data ?? [];
  const filteredItems = useMemo(() => {
    const allowedStatuses = TAB_STATUS_MAP[activeTab];
    const tabItems = items.filter((item) => {
      const status = getCampaignStatus(item);
      return status ? allowedStatuses.includes(status) : false;
    });
    const sorted = [...tabItems];
    sorted.sort((a, b) => {
      if (sortBy === "TOTAL_DESC") {
        const totalA = a.pricing?.totalAmount ?? a.totalAmount ?? a.totalPrice;
        const totalB = b.pricing?.totalAmount ?? b.totalAmount ?? b.totalPrice;
        return totalB - totalA;
      }

      if (sortBy === "DATE_ASC") {
        const dateA = new Date(a.schedule?.date ?? a.startsAt).getTime();
        const dateB = new Date(b.schedule?.date ?? b.startsAt).getTime();
        return dateA - dateB;
      }

      const createdAtA = new Date(a.metadata?.createdAt ?? a.createdAt ?? 0).getTime();
      const createdAtB = new Date(b.metadata?.createdAt ?? b.createdAt ?? 0).getTime();
      return createdAtB - createdAtA;
    });
    return sorted;
  }, [activeTab, items, sortBy]);

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 pb-24 pt-6 lg:p-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#895af6]">
              Visão geral
            </p>
            <h1 className="text-2xl font-black text-slate-900 lg:text-4xl">Campanhas Ativas</h1>
            <p className="mt-1 text-sm text-slate-500">
              Acompanhe e gerencie suas campanhas em um só lugar.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="hidden items-center gap-2 text-sm font-medium text-slate-600 lg:inline-flex"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </header>

        <section className="overflow-x-auto pb-1">
          <div className="inline-flex min-w-full gap-2 rounded-2xl bg-white p-1 shadow-sm lg:min-w-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[#895af6] text-white shadow-[0_10px_20px_-10px_rgba(137,90,246,0.6)]"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {contractRequestsQuery.isLoading && items.length === 0 ? (
          <p className="text-sm text-slate-600">Carregando campanhas...</p>
        ) : contractRequestsQuery.error ? (
          <div className="rounded-[32px] bg-white p-6 text-sm text-slate-600 shadow-sm">
            {contractRequestsQuery.error instanceof Error
              ? contractRequestsQuery.error.message
              : "Não foi possível carregar as campanhas."}
          </div>
        ) : filteredItems.length === 0 ? (
          <section className="space-y-4 rounded-[32px] bg-white p-6 shadow-sm">
            <EmptyState
              title="Nenhuma campanha ativa"
              description="Crie campanhas para contratar creators e acompanhar seus projetos."
            />
            <Link
              to="/marketplace"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#895af6] px-5 py-3 text-sm font-semibold text-white lg:w-auto"
            >
              Criar campanha
            </Link>
          </section>
        ) : (
          <section className="grid gap-4 lg:grid-cols-2 lg:gap-6">
            {filteredItems.map((item) => (
              <CampaignCard key={item.id} item={item} />
            ))}
          </section>
        )}
      </main>

      <BusinessBottomNav />
    </div>
  );
}
