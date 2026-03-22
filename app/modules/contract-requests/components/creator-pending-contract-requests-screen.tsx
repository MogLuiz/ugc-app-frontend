import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { AppSidebar } from "~/components/app-sidebar";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/toast";
import {
  useAcceptContractRequestMutation,
  useMyCreatorPendingContractRequestsQuery,
  useRejectContractRequestMutation,
} from "../queries";
import { formatCurrency, formatDateTime } from "../utils";

export function CreatorPendingContractRequestsScreen() {
  const pendingQuery = useMyCreatorPendingContractRequestsQuery();
  const acceptMutation = useAcceptContractRequestMutation();
  const rejectMutation = useRejectContractRequestMutation();
  const [activeMutationId, setActiveMutationId] = useState<string | null>(null);

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

      <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 pb-24 pt-6 lg:p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Ofertas</h1>
            <p className="mt-1 text-sm text-slate-500">
              Revise as pendências e responda sem sair do seu fluxo.
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

        {pendingQuery.isLoading && items.length === 0 ? (
          <p className="text-sm text-slate-600">Carregando pendências...</p>
        ) : pendingQuery.error ? (
          <div className="rounded-[32px] bg-white p-6 text-sm text-slate-600 shadow-sm">
            {pendingQuery.error instanceof Error
              ? pendingQuery.error.message
              : "Não foi possível carregar as pendências."}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600 shadow-sm">
            Nenhuma solicitação pendente no momento.
          </div>
        ) : (
          <section className="flex flex-col gap-4">
            {items.map((item) => {
              const isMutating = activeMutationId === item.id;
              return (
                <article
                  key={item.id}
                  className="rounded-[32px] bg-white p-5 shadow-sm lg:rounded-[48px] lg:p-6"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <h2 className="text-lg font-bold text-slate-900">Solicitação direta</h2>
                        <p className="text-sm text-slate-600">{item.description}</p>
                        <p className="text-sm text-slate-500">
                          {formatDateTime(item.startsAt)} • {item.durationMinutes} min
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.jobFormattedAddress ?? item.jobAddress}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs uppercase text-slate-400">Valor total</p>
                        <p className="mt-1 text-xl font-bold text-[#895af6]">
                          {formatCurrency(item.totalPrice, item.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="purple"
                        className="rounded-full"
                        onClick={() => void handleAccept(item.id)}
                        disabled={isMutating}
                      >
                        {isMutating && acceptMutation.isPending
                          ? "Aceitando..."
                          : "Aceitar"}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => void handleReject(item.id)}
                        disabled={isMutating}
                      >
                        {isMutating && rejectMutation.isPending
                          ? "Recusando..."
                          : "Recusar"}
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>

      <CreatorBottomNav />
    </div>
  );
}
