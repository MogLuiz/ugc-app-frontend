import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { EmptyState } from "~/components/ui/empty-state";
import { HttpError } from "~/lib/http/errors";
import { formatCurrency, formatDateShort, formatDuration } from "~/modules/contract-requests/utils";
import { useCancelOpenOfferMutation, useSelectOpenOfferCreatorMutation } from "../mutations";
import { isOpenOfferExpired } from "../helpers";
import { OpenOfferConfirmModal } from "./open-offer-confirm-modal";
import type { OpenOfferDetail } from "../types";

function statusMeta(item: OpenOfferDetail) {
  if (item.status === "CANCELLED") {
    return { label: "Cancelada", className: "bg-rose-100 text-rose-700" };
  }
  if (item.status === "FILLED") {
    return { label: "Preenchida", className: "bg-emerald-100 text-emerald-700" };
  }
  if (item.status === "EXPIRED" || isOpenOfferExpired(item.expiresAt)) {
    return { label: "Expirada", className: "bg-slate-200 text-slate-700" };
  }
  return { label: "Aberta", className: "bg-[#895af6]/10 text-[#6a36d5]" };
}

export function CompanyOpenOfferDetailScreen({ item }: { item: OpenOfferDetail }) {
  const navigate = useNavigate();
  const cancelMutation = useCancelOpenOfferMutation();
  const selectMutation = useSelectOpenOfferCreatorMutation();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const canCancel = item.status === "OPEN" && !isOpenOfferExpired(item.expiresAt);
  const currentStatus = statusMeta(item);
  const selectedApplication = useMemo(
    () => item.applications.find((application) => application.id === selectedApplicationId) ?? null,
    [item.applications, selectedApplicationId]
  );

  async function handleCancel() {
    try {
      await cancelMutation.mutateAsync(item.id);
      toast.success("Oferta cancelada.");
      setCancelModalOpen(false);
      void navigate("/ofertas");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível cancelar a oferta.");
    }
  }

  async function handleSelectCreator() {
    if (!selectedApplication) return;

    try {
      const result = await selectMutation.mutateAsync({
        offerId: item.id,
        applicationId: selectedApplication.id,
      });
      toast.success("Creator selecionado com sucesso.");
      setSelectedApplicationId(null);
      void navigate(`/campanha/${result.contractRequestId}`);
    } catch (error) {
      if (error instanceof HttpError && error.status === 409) {
        toast.error("Creator com agenda ocupada, escolha outro.");
        return;
      }
      toast.error(error instanceof Error ? error.message : "Não foi possível selecionar o creator.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 pb-24 pt-4 lg:p-8">
        <div className="flex min-w-0 flex-1 flex-col gap-6 px-4 lg:px-0">
          <header className="rounded-[32px] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#895af6]/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6a36d5]">
                    Oferta aberta
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] ${currentStatus.className}`}
                  >
                    {currentStatus.label}
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-900">
                  {item.jobType?.name ?? "Oferta"}
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  to="/ofertas"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Voltar
                </Link>
                {canCancel ? (
                  <button
                    type="button"
                    onClick={() => setCancelModalOpen(true)}
                    className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                  >
                    Cancelar oferta
                  </button>
                ) : null}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[24px] bg-[#f6f5f8] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Valor bruto
                </p>
                <p className="mt-2 text-2xl font-black text-[#6a36d5]">
                  {formatCurrency(item.offeredAmount, "BRL")}
                </p>
                <p className="mt-2 text-sm text-slate-500">Transporte calculado apenas na seleção</p>
              </div>
              <div className="rounded-[24px] bg-[#f6f5f8] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Início
                </p>
                <p className="mt-2 text-base font-bold text-slate-900">
                  {formatDateShort(item.startsAt)}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {new Date(item.startsAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="rounded-[24px] bg-[#f6f5f8] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Duração
                </p>
                <p className="mt-2 text-base font-bold text-slate-900">
                  {formatDuration(item.durationMinutes) ?? "Duração a combinar"}
                </p>
                <p className="mt-1 text-sm text-slate-500">{item.jobFormattedAddress ?? "Local a combinar"}</p>
              </div>
              <div className="rounded-[24px] bg-[#f6f5f8] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Expiração
                </p>
                <p className="mt-2 text-base font-bold text-slate-900">
                  {formatDateShort(item.expiresAt)}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {new Date(item.expiresAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </header>

          <section className="rounded-[32px] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#895af6]">
                  Candidaturas
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  Creators interessados
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Selecione um creator para gerar o contrato e seguir para a operação.
                </p>
              </div>
              <div className="text-sm font-semibold text-slate-500">
                {item.applications.length} candidatura{item.applications.length === 1 ? "" : "s"}
              </div>
            </div>

            {item.applications.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="Nenhuma candidatura por enquanto"
                  description="Assim que creators elegíveis se candidatarem, eles aparecerão aqui."
                />
              </div>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {item.applications.map((application) => (
                  <article
                    key={application.id}
                    className="rounded-[28px] border border-slate-200 bg-[#fcfcfd] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {application.creator.avatarUrl ? (
                          <img
                            src={application.creator.avatarUrl}
                            alt={application.creator.name ?? "Creator"}
                            className="size-14 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex size-14 items-center justify-center rounded-2xl bg-[#895af6]/10 text-lg font-black text-[#6a36d5]">
                            {(application.creator.name ?? "C").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-black text-slate-900">
                            {application.creator.name ?? "Creator"}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Rating: {application.creator.rating?.toFixed(1) ?? "Sem avaliação"}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
                        {application.status}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link
                        to={`/criador/${application.creator.id}`}
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Ver perfil
                      </Link>

                      {application.status === "PENDING" && canCancel ? (
                        <button
                          type="button"
                          onClick={() => setSelectedApplicationId(application.id)}
                          className="rounded-full bg-[#895af6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7c4fe6]"
                        >
                          Selecionar creator
                        </button>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <OpenOfferConfirmModal
        open={cancelModalOpen}
        title="Cancelar oferta"
        description="Essa ação encerra a oferta e rejeita candidaturas pendentes. Ela não poderá voltar para a aba de abertas."
        confirmLabel="Confirmar cancelamento"
        tone="danger"
        isSubmitting={cancelMutation.isPending}
        onConfirm={handleCancel}
        onClose={() => setCancelModalOpen(false)}
      />

      <OpenOfferConfirmModal
        open={Boolean(selectedApplication)}
        title="Selecionar creator"
        description={
          selectedApplication
            ? `Você vai gerar o contrato com ${selectedApplication.creator.name ?? "este creator"} e encerrar a oferta aberta.`
            : ""
        }
        confirmLabel="Gerar contrato"
        isSubmitting={selectMutation.isPending}
        onConfirm={handleSelectCreator}
        onClose={() => setSelectedApplicationId(null)}
      />

      <BusinessBottomNav />
    </div>
  );
}
