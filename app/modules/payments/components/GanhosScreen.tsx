import { useState } from "react";
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

function formatCents(cents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(cents / 100);
}

export function GanhosScreen() {
  const { data: payouts, isLoading } = useMyPayoutsQuery();
  const [selectedPayout, setSelectedPayout] = useState<CreatorPayout | null>(null);

  const aReceber = (payouts ?? []).filter((p) => p.status === "pending" || p.status === "scheduled");
  const recebidos = (payouts ?? []).filter((p) => p.status === "paid");
  const currency = payouts?.[0]?.currency ?? "BRL";
  const recebidoTotal = recebidos.reduce((sum, p) => sum + p.amountCents, 0);

  const tabItems = [
    {
      id: "a-receber",
      label: "A receber",
      content: (
        <div className="space-y-3">
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
          ) : aReceber.length === 0 ? (
            <MobileEmptyState
              title="Você ainda não tem valores a receber"
              description="Finalize um serviço para liberar o pagamento."
              density="compact"
            />
          ) : (
            <DashboardCard shadowTone="neutral" className="px-2">
              {aReceber.map((p) => (
                <PayoutListItem key={p.id} payout={p} onTap={setSelectedPayout} />
              ))}
            </DashboardCard>
          )}
        </div>
      ),
    },
    {
      id: "recebido",
      label: "Recebido",
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
          ) : recebidos.length === 0 ? (
            <MobileEmptyState
              title="Nenhum repasse recebido ainda"
              description="Aqui aparecerão todos os repasses que já foram pagos para você."
              density="compact"
            />
          ) : (
            <DashboardCard shadowTone="neutral" className="px-2">
              {recebidos.map((p) => (
                <PayoutListItem key={p.id} payout={p} onTap={setSelectedPayout} />
              ))}
              <div className="border-t border-slate-100 pt-3 flex justify-between items-center px-1">
                <span className="text-xs text-slate-500">Total recebido</span>
                <span className="text-sm font-bold text-green-600">{formatCents(recebidoTotal, currency)}</span>
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
              // Fase 2 — depende de endpoint PUT /creators/me/payout-settings
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
          <div className="max-w-2xl mx-auto px-4 py-6 lg:px-0 lg:py-0 space-y-4">
            <h1 className="hidden lg:block text-2xl font-black text-slate-900">Ganhos</h1>

            {/* KPI cards */}
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="rounded-[28px] border border-slate-100 bg-white p-4 h-24 animate-pulse" />
                ))}
              </div>
            ) : (
              <GanhosSummaryCards payouts={payouts} />
            )}

            {/* Tabs */}
            <Tabs items={tabItems} />
          </div>
        </main>

        <CreatorBottomNav />
      </div>

      <PayoutDetailSheet
        payout={selectedPayout}
        open={!!selectedPayout}
        onClose={() => setSelectedPayout(null)}
      />
    </div>
  );
}
