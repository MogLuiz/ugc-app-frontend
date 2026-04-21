import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MoreVertical, AlertCircle, Clock, AlertOctagon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/toast";
import {
  useAcceptContractRequestMutation,
  useCancelContractRequestMutation,
  useContractReviewsQuery,
  useRejectContractRequestMutation,
} from "../queries";
import type { ContractRequestItem } from "../types";
import { OfferDetailPanel } from "./offer-detail-panel";
import { ConfirmCompletionBanner } from "./ConfirmCompletionBanner";
import { ReviewForm } from "./ReviewForm";

type OfferDetailScreenProps = {
  item: ContractRequestItem;
  /** "COMPANY" ou "CREATOR" — necessário para renderizar as ações corretas. */
  viewerRole?: "COMPANY" | "CREATOR";
};

function getExpiryLabel(expiresAt?: string): string | null {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) {
    const mins = Math.floor(diff / (1000 * 60));
    return `${mins} min`;
  }
  return `${hours}h`;
}

export function OfferDetailScreen({ item, viewerRole = "CREATOR" }: OfferDetailScreenProps) {
  const navigate = useNavigate();
  const acceptMutation = useAcceptContractRequestMutation();
  const rejectMutation = useRejectContractRequestMutation();
  const cancelMutation = useCancelContractRequestMutation();
  const [isMutating, setIsMutating] = useState(false);

  const reviewsQuery = useContractReviewsQuery(
    item.id,
    item.status === "COMPLETED",
  );
  const alreadyReviewed = reviewsQuery.data?.reviews.some(
    (r) => r.reviewerRole === viewerRole,
  ) ?? false;

  const isExpired = item.status === "EXPIRED" ||
    (item.status === "PENDING_ACCEPTANCE" &&
      !!item.expiresAt &&
      new Date(item.expiresAt).getTime() <= Date.now());
  const isAccepted = item.status === "ACCEPTED";
  const isAwaitingConfirmation = item.status === "AWAITING_COMPLETION_CONFIRMATION";
  const isDisputed = item.status === "COMPLETION_DISPUTE";
  const isCompleted = item.status === "COMPLETED";
  const isReadOnly =
    isExpired ||
    isCompleted ||
    isDisputed ||
    isAwaitingConfirmation ||
    item.status === "REJECTED" ||
    item.status === "CANCELLED";
  const expiryLabel = getExpiryLabel(item.expiresAt);

  const handleAccept = async (id: string) => {
    setIsMutating(true);
    try {
      await acceptMutation.mutateAsync(id);
      toast.success("Oferta aceita com sucesso.");
      void navigate("/ofertas");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível aceitar a oferta."
      );
    } finally {
      setIsMutating(false);
    }
  };

  const handleReject = async (id: string) => {
    setIsMutating(true);
    try {
      await rejectMutation.mutateAsync({ contractRequestId: id });
      toast.success("Oferta recusada.");
      void navigate("/ofertas");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível recusar a oferta."
      );
    } finally {
      setIsMutating(false);
    }
  };

  const handleCancel = async (id: string) => {
    setIsMutating(true);
    try {
      await cancelMutation.mutateAsync(id);
      toast.success("Trabalho desmarcado.");
      void navigate("/ofertas?tab=IN_PROGRESS");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível desmarcar o trabalho."
      );
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5f8]">
      {/* ── Focused header ── */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#f1f5f9] bg-white/80 px-4 py-4 backdrop-blur-md">
        <button
          type="button"
          onClick={() => void navigate(-1)}
          className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
          aria-label="Voltar"
        >
          <ArrowLeft className="size-5 text-slate-700" />
        </button>
        <h1 className="text-base font-black tracking-tight text-slate-900">
          Detalhes da Oferta
        </h1>
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
          aria-label="Mais opções"
        >
          <MoreVertical className="size-5 text-slate-600" />
        </button>
      </header>

      {/* ── Scrollable content ── */}
      <main className="flex-1 overflow-y-auto pb-40">
        <div className="bg-white">
          <div className="p-5 space-y-4">
            <OfferDetailPanel
              item={item}
              isMutating={isMutating}
              onAccept={(id) => void handleAccept(id)}
              onReject={(id) => void handleReject(id)}
              onCancel={(id) => void handleCancel(id)}
            />

            {isAwaitingConfirmation && (
              <ConfirmCompletionBanner
                item={item}
                viewerRole={viewerRole}
              />
            )}

            {isDisputed && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Em disputa de conclusão</p>
                  {item.completionDisputeReason && (
                    <p className="mt-1 text-xs text-red-700">{item.completionDisputeReason}</p>
                  )}
                  <p className="mt-1 text-xs text-red-600">
                    Nossa equipe está analisando. Avaliações ficam bloqueadas até a resolução.
                  </p>
                </div>
              </div>
            )}

            {isCompleted && !alreadyReviewed && (
              <ReviewForm contractRequestId={item.id} />
            )}

            {isCompleted && alreadyReviewed && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                Você já avaliou esta contratação.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Fixed footer with actions ── */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#f1f5f9] bg-white px-5 pb-8 pt-4">
        {isReadOnly ? (
          <div className="flex items-center justify-center gap-2 py-1">
            <Clock className="size-4 shrink-0 text-slate-400" />
            <p className="text-sm font-medium text-slate-500">
              {isExpired
                ? "Oferta expirada"
                : isAwaitingConfirmation
                ? "Aguardando confirmação de conclusão"
                : isDisputed
                ? "Contratação em disputa"
                : isCompleted
                ? "Contratação concluída"
                : "Esta oferta foi encerrada"}
            </p>
          </div>
        ) : isAccepted ? (
          <Button
            variant="outline"
            size="lg"
            className="w-full rounded-full border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
            onClick={() => void handleCancel(item.id)}
            disabled={isMutating}
          >
            {isMutating ? "Aguarde..." : "Desmarcar trabalho"}
          </Button>
        ) : (
          <>
            <div className="flex gap-3">
              <Button
                variant="purple"
                size="lg"
                className="flex-1 rounded-full shadow-[0px_10px_15px_-3px_rgba(137,90,246,0.2),0px_4px_6px_-4px_rgba(137,90,246,0.2)]"
                onClick={() => void handleAccept(item.id)}
                disabled={isMutating}
              >
                {isMutating && acceptMutation.isPending ? "Aguarde..." : "Aceitar"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-red-100 bg-red-50 px-6 text-red-500 hover:bg-red-100"
                onClick={() => void handleReject(item.id)}
                disabled={isMutating}
              >
                Recusar
              </Button>
            </div>
            {expiryLabel && (
              <p className="mt-2 text-center text-[10px] text-slate-400">
                <AlertCircle className="mr-1 inline size-3 text-amber-400" />
                Você tem até {expiryLabel} para responder esta proposta.
              </p>
            )}
            {!expiryLabel && (
              <p className="mt-2 text-center text-[10px] text-slate-400">
                Responda no seu tempo. Verifique o prazo na notificação.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
