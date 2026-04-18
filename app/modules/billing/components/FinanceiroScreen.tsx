import { useState } from "react";
import { Link } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { AppHeader } from "~/components/layout/app-header";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { DashboardCard } from "~/components/ui/dashboard-card";
import { Tabs } from "~/components/ui/tabs";
import { MobileEmptyState } from "~/components/ui/mobile-empty-state";
import { Button } from "~/components/ui/button";
import { useCompanyBalanceQuery, useRefundRequestsQuery } from "../api/billing.queries";
import { useCompanyPaymentsQuery } from "~/modules/payments/api/payments.queries";
import type { Payment } from "~/modules/payments/types/payment.types";
import type { RefundRequest } from "../types/billing.types";
import { FinanceiroSummaryCards } from "./FinanceiroSummaryCards";
import { PaymentListItem } from "./PaymentListItem";
import { PaymentDetailSheet } from "./PaymentDetailSheet";
import { CreditTransactionRow } from "./CreditTransactionRow";
import { RefundListItem } from "./RefundListItem";
import { RefundDetailSheet } from "./RefundDetailSheet";
import { RefundRequestSheet } from "./RefundRequestSheet";

type PaymentFilter = "all" | "paid" | "pending" | "failed" | "canceled" | "refunded";

const FILTER_LABELS: Record<PaymentFilter, string> = {
  all: "Todos",
  paid: "Pagos",
  pending: "Pendentes",
  failed: "Falhou",
  canceled: "Cancelados",
  refunded: "Reembolsados",
};

function matchesFilter(p: Payment, filter: PaymentFilter): boolean {
  if (filter === "all") return true;
  if (filter === "pending") return p.status === "pending" || p.status === "processing" || p.status === "authorized";
  if (filter === "refunded") return p.status === "refunded" || p.status === "partially_refunded";
  return p.status === filter;
}

export function FinanceiroScreen() {
  const { data: balance, isLoading: balanceLoading } = useCompanyBalanceQuery();
  const { data: payments, isLoading: paymentsLoading } = useCompanyPaymentsQuery();
  const { data: refundRequests, isLoading: refundsLoading } = useRefundRequestsQuery();

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [refundSheetOpen, setRefundSheetOpen] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");

  const filteredPayments = (payments ?? []).filter((p) => matchesFilter(p, paymentFilter));

  const tabItems = [
    {
      id: "pagamentos",
      label: "Pagamentos",
      content: (
        <div className="space-y-3">
          {/* Filtro */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#895af6]/30 focus:border-[#895af6] cursor-pointer"
          >
            {(Object.entries(FILTER_LABELS) as [PaymentFilter, string][]).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {paymentsLoading ? (
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
          ) : filteredPayments.length === 0 ? (
            paymentFilter === "all" ? (
              <MobileEmptyState
                title="Você ainda não fez nenhum pagamento"
                description="Contrate seu primeiro creator e comece a criar conteúdo."
                density="compact"
                actions={
                  <Link
                    to="/criar"
                    className="inline-flex items-center rounded-full bg-[#895af6] px-4 py-2 text-sm font-medium text-white"
                  >
                    Criar campanha
                  </Link>
                }
              />
            ) : (
              <MobileEmptyState
                title="Nenhum resultado"
                description="Nenhum pagamento com esse filtro."
                density="compact"
              />
            )
          ) : (
            <DashboardCard shadowTone="neutral" className="px-2">
              {filteredPayments.map((payment) => (
                <PaymentListItem
                  key={payment.id}
                  payment={payment}
                  onTap={setSelectedPayment}
                />
              ))}
            </DashboardCard>
          )}
        </div>
      ),
    },
    {
      id: "creditos",
      label: "Créditos",
      content: (
        <div className="space-y-4">
          {/* Card de saldo */}
          <DashboardCard shadowTone={balance && balance.availableCents > 0 ? "brand" : "neutral"} className="space-y-2">
            <p className="text-xs text-slate-500">Saldo disponível</p>
            <p className="text-3xl font-black text-slate-900">
              {balanceLoading ? "—" : balance
                ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: balance.currency }).format(balance.availableCents / 100)
                : "R$ 0,00"}
            </p>
            {balance && (
              <p className="text-xs text-slate-400">
                Limite: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: balance.currency }).format(balance.maxCreditCents / 100)}
              </p>
            )}
            {balance && balance.availableCents > 0 && (
              <Button variant="secondary" className="mt-2" onClick={() => setRefundSheetOpen(true)}>
                Solicitar reembolso
              </Button>
            )}
          </DashboardCard>

          {/* Histórico de movimentações */}
          {balanceLoading ? (
            <DashboardCard shadowTone="neutral" className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between py-2">
                  <div className="h-3 bg-slate-100 rounded w-40" />
                  <div className="h-3 bg-slate-100 rounded w-16" />
                </div>
              ))}
            </DashboardCard>
          ) : !balance || balance.transactions.length === 0 ? (
            <MobileEmptyState
              title="Nenhuma movimentação ainda"
              description="Créditos que você receber (por recusas ou expirações de convite) aparecerão aqui."
              density="compact"
            />
          ) : (
            <DashboardCard shadowTone="neutral" className="px-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-2">Histórico</p>
              {balance.transactions.map((tx) => (
                <CreditTransactionRow key={tx.id} tx={tx} currency={balance.currency} />
              ))}
            </DashboardCard>
          )}
        </div>
      ),
    },
    {
      id: "reembolsos",
      label: "Reembolsos",
      content: (
        <div className="space-y-4">
          {/* CTA de reembolso */}
          {balance && balance.availableCents > 0 && (
            <DashboardCard shadowTone="brand" className="border-l-4 border-l-purple-400 space-y-2">
              <p className="text-sm text-slate-700">
                Você tem{" "}
                <span className="font-semibold text-slate-900">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: balance.currency }).format(balance.availableCents / 100)}
                </span>{" "}
                em créditos disponíveis.
              </p>
              <Button onClick={() => setRefundSheetOpen(true)}>Solicitar reembolso</Button>
            </DashboardCard>
          )}

          {refundsLoading ? (
            <DashboardCard shadowTone="neutral" className="space-y-3 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="flex justify-between py-2">
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-20" />
                    <div className="h-2.5 bg-slate-100 rounded w-36" />
                  </div>
                  <div className="h-3 bg-slate-100 rounded w-16" />
                </div>
              ))}
            </DashboardCard>
          ) : !refundRequests || refundRequests.length === 0 ? (
            <MobileEmptyState
              title="Nenhum reembolso solicitado"
              description={
                balance && balance.availableCents > 0
                  ? "Solicite a devolução do seu saldo para sua conta bancária via PIX."
                  : "Quando você tiver saldo disponível poderá solicitar um reembolso."
              }
              density="compact"
            />
          ) : (
            <DashboardCard shadowTone="neutral" className="px-2">
              {refundRequests.map((r) => (
                <RefundListItem key={r.id} refund={r} onTap={setSelectedRefund} />
              ))}
            </DashboardCard>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader title="Financeiro" mobileBehavior="inline" />

        <main className="flex-1 pb-24 lg:pb-10 lg:px-8 lg:py-6">
          <div className="max-w-2xl mx-auto px-4 py-6 lg:px-0 lg:py-0 space-y-6">
      <h1 className="hidden lg:block text-2xl font-black text-slate-900 mb-6">Financeiro</h1>

      {/* KPI cards */}
      {balanceLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-[28px] border border-slate-100 bg-white p-4 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <FinanceiroSummaryCards
          balance={balance}
          payments={payments}
          refundRequests={refundRequests}
          onRequestRefund={() => setRefundSheetOpen(true)}
        />
      )}

      {/* Tabs */}
      <Tabs items={tabItems} />

      {/* Sheets */}
      <PaymentDetailSheet
        payment={selectedPayment}
        open={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
      <RefundDetailSheet
        refund={selectedRefund}
        open={!!selectedRefund}
        onClose={() => setSelectedRefund(null)}
      />
      <RefundRequestSheet
        maxAmountCents={balance?.availableCents ?? 0}
        currency={balance?.currency ?? "BRL"}
        open={refundSheetOpen}
        onClose={() => setRefundSheetOpen(false)}
      />
          </div>
        </main>

        <BusinessBottomNav />
      </div>
    </div>
  );
}
