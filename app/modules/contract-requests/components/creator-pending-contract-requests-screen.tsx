import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { AppSidebar } from "~/components/app-sidebar";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { EmptyState } from "~/components/ui/empty-state";
import {
  useAcceptContractRequestMutation,
  useMyCreatorPendingContractRequestsQuery,
  useRejectContractRequestMutation,
} from "../queries";
import type { ContractRequestItem } from "../types";
import { CompanyProfileModal } from "./company-profile-modal";
import { OfferCard } from "./offer-card";
import { toast } from "~/components/ui/toast";

export function CreatorPendingContractRequestsScreen() {
  const pendingQuery = useMyCreatorPendingContractRequestsQuery();
  const acceptMutation = useAcceptContractRequestMutation();
  const rejectMutation = useRejectContractRequestMutation();
  const [activeMutationId, setActiveMutationId] = useState<string | null>(null);
  const [viewedCompany, setViewedCompany] = useState<ContractRequestItem | null>(null);

  const items = pendingQuery.data ?? [];

  const handleAccept = async (contractRequestId: string) => {
    setActiveMutationId(contractRequestId);
    try {
      await acceptMutation.mutateAsync(contractRequestId);
      toast.success("Solicitação aceita com sucesso.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível aceitar a solicitação."
      );
    } finally {
      setActiveMutationId(null);
    }
  };

  const handleReject = async (contractRequestId: string) => {
    setActiveMutationId(contractRequestId);
    try {
      await rejectMutation.mutateAsync({ contractRequestId });
      toast.success("Solicitação recusada.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível recusar a solicitação."
      );
    } finally {
      setActiveMutationId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 pb-24 pt-6 lg:gap-10 lg:px-12 lg:pt-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 lg:text-[48px] lg:leading-[48px]">
              Ofertas
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Revise as pendências e responda sem sair do seu fluxo.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="hidden items-center gap-2 text-sm font-semibold text-slate-600 lg:inline-flex"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
        </header>

        {pendingQuery.isLoading && items.length === 0 ? (
          <p className="text-sm text-slate-600">Carregando pendências...</p>
        ) : pendingQuery.error ? (
          <div className="rounded-3xl bg-white p-6 text-sm text-slate-600 shadow-sm">
            {pendingQuery.error instanceof Error
              ? pendingQuery.error.message
              : "Não foi possível carregar as pendências."}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="Nenhuma oferta pendente"
            description="Quando empresas enviarem propostas, elas aparecerão aqui. Verifique também suas notificações."
          />
        ) : (
          <section className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {items.map((item) => {
              const isMutating = activeMutationId === item.id;
              return (
                <OfferCard
                  key={item.id}
                  item={item}
                  isMutating={isMutating}
                  acceptLabel={
                    isMutating && acceptMutation.isPending ? "Aceitando..." : "Aceitar"
                  }
                  rejectLabel={
                    isMutating && rejectMutation.isPending ? "Recusando..." : "Recusar"
                  }
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onViewProfile={setViewedCompany}
                />
              );
            })}
          </section>
        )}
      </main>

      <CreatorBottomNav />

      {viewedCompany && (
        <CompanyProfileModal
          item={viewedCompany}
          onClose={() => setViewedCompany(null)}
        />
      )}
    </div>
  );
}
