import { useState } from "react";
import { Link } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { AppHeader } from "~/components/layout/app-header";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { DashboardCard } from "~/components/ui/dashboard-card";
import { Tabs } from "~/components/ui/tabs";
import { MobileEmptyState } from "~/components/ui/mobile-empty-state";
import { useMyPayoutsQuery } from "../api/payments.queries";
import type { CreatorPayout } from "../types/payment.types";
import { GanhosSummaryCards } from "./GanhosSummaryCards";
import { PayoutListItem } from "./PayoutListItem";
import { PayoutDetailSheet } from "./PayoutDetailSheet";
import { PixDataBlock } from "./PixDataBlock";

type PendingFilter = "all" | "scheduled" | "waiting";

function matchesPendingFilter(p: CreatorPayout, filter: PendingFilter): boolean {
  if (filter === "all") return p.status === "not_due" || p.status === "pending" || p.status === "scheduled";
  if (filter === "scheduled") return p.status === "scheduled";
  if (filter === "waiting") return p.status === "not_due" || p.status === "pending";
  return false;
}

export function GanhosScreen() {
  const { data: payouts, isLoading } = useMyPayoutsQuery();

  const [selectedPayout, setSelectedPayout] = useState<CreatorPayout | null>(null);
  const [pendingFilter, setPendingFilter] = useState<PendingFilter>("all");

  const pendingPayouts = (payouts ?? []).filter((p) =>
    matchesPendingFilter(p, pendingFilter)
  );

  const allPending = (payouts ?? []).filter(
    (p) => p.status === "not_due" || p.status === "pending" || p.status === "scheduled"
  );

  const paidPayouts = (payouts ?? []).filter((p) => p.status === "paid");

  const paidTotal = paidPayouts.reduce((sum, p) => sum + p.amountCents, 0);
  const currency = payouts?.[0]?.currency ?? "BRL";

  function formatCents(cents: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100);
  }

  const tabItems = [
    {
      id: "pendentes",
      label: allPending.length > 0 ? `Pendentes (${allPending.length})` : "Pendentes",
      content: (
        <div className="space-y-3">
          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(["all", "scheduled", "waiting"] as PendingFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setPendingFilter(f)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  pendingFilter === f
                    ? "bg-[#895af6] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f === "all" ? "Todos" : f === "scheduled" ? "Agendados" : "Aguardando"}
              </button>
            ))}
          </div>

          {isLoading ? (
            <DashboardCard shadowTone="neutral" className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between py-2">
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-24" />
                    <div className="h-2.5 bg-slate-100 rounded w-32" />
                  </div>
                  <div className="h-3 bg-slate-100 rounded w-16" />
                </div>
              ))}
            </DashboardCard>
          ) : pendingPayouts.length === 0 ? (
            <MobileEmptyState
              title="Nada pendente no momento"
              description="Quando uma empresa confirmar seu serviço, o repasse aparecerá aqui."
              density="compact"
              actions={
                <Link
                  to="/ofertas"
                  className="inline-flex items-center rounded-full bg-[#895af6] px-4 py-2 text-sm font-medium text-white"
                >
                  Ver campanhas
                </Link>
              }
            />
          ) : (
            <DashboardCard shadowTone="neutral" className="px-2">
              {pendingPayouts.map((p) => (
                <PayoutListItem key={p.id} payout={p} onTap={setSelectedPayout} />
              ))}
            </DashboardCard>
          )}
        </div>
      ),
    },
    {
      id: "recebidos",
      label: "Recebidos",
      content: (
        <div className="space-y-3">
          {isLoading ? (
            <DashboardCard shadowTone="neutral" className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between py-2">
                  <div className="h-3 bg-slate-100 rounded w-40" />
                  <div className="h-3 bg-slate-100 rounded w-16" />
                </div>
              ))}
            </DashboardCard>
          ) : paidPayouts.length === 0 ? (
            <MobileEmptyState
              title="Nenhum repasse recebido ainda"
              description="Aqui aparecerão todos os repasses que já foram pagos para você."
              density="compact"
            />
          ) : (
            <DashboardCard shadowTone="neutral" className="px-2">
              {paidPayouts.map((p) => (
                <PayoutListItem key={p.id} payout={p} onTap={setSelectedPayout} />
              ))}
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center px-1">
                <span className="text-xs text-slate-500">Total recebido</span>
                <span className="text-sm font-bold text-green-600">{formatCents(paidTotal)}</span>
              </div>
            </DashboardCard>
          )}
        </div>
      ),
    },
    {
      id: "dados-pix",
      label: "Dados PIX",
      content: (
        <div className="space-y-4">
          <PixDataBlock
            settings={null}
            onEdit={() => {
              // EditPixSheet — Fase 2 (depende de endpoint PUT /creators/me/payout-settings)
            }}
          />
          <p className="text-xs text-slate-400 text-center px-4">
            A edição de dados PIX estará disponível em breve.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader title="Ganhos" mobileBehavior="inline" />

        <main className="flex-1 pb-24 lg:pb-10 lg:px-8 lg:py-6">
          <div className="max-w-2xl mx-auto px-4 py-6 lg:px-0 lg:py-0 space-y-6">
            <h1 className="hidden lg:block text-2xl font-black text-slate-900 mb-6">Ganhos</h1>

            {/* KPI cards */}
            {isLoading ? (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="shrink-0 w-[72vw] max-w-[280px] rounded-[28px] border border-slate-100 bg-white p-5 h-28 animate-pulse" />
                ))}
              </div>
            ) : (
              <GanhosSummaryCards payouts={payouts} />
            )}

            {/* Tabs */}
            <Tabs items={tabItems} scrollable />
          </div>
        </main>

        <CreatorBottomNav />
      </div>

      {/* Sheet */}
      <PayoutDetailSheet
        payout={selectedPayout}
        open={!!selectedPayout}
        onClose={() => setSelectedPayout(null)}
      />
    </div>
  );
}
