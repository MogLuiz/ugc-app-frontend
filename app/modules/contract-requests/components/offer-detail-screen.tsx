import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MoreVertical, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/toast";
import {
  useAcceptContractRequestMutation,
  useCancelContractRequestMutation,
  useRejectContractRequestMutation,
} from "../queries";
import type { ContractRequestItem } from "../types";
import { OfferDetailPanel } from "./offer-detail-panel";

type OfferDetailScreenProps = {
  item: ContractRequestItem;
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

export function OfferDetailScreen({ item }: OfferDetailScreenProps) {
  const navigate = useNavigate();
  const acceptMutation = useAcceptContractRequestMutation();
  const rejectMutation = useRejectContractRequestMutation();
  const cancelMutation = useCancelContractRequestMutation();
  const [isMutating, setIsMutating] = useState(false);

  const isExpired = item.status === "EXPIRED";
  const isAccepted = item.status === "ACCEPTED";
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
      void navigate("/ofertas?tab=confirmed");
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
          <div className="p-5">
            <OfferDetailPanel
              item={item}
              isMutating={isMutating}
              onAccept={(id) => void handleAccept(id)}
              onReject={(id) => void handleReject(id)}
              onCancel={(id) => void handleCancel(id)}
            />
          </div>
        </div>
      </main>

      {/* ── Fixed footer with actions ── */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#f1f5f9] bg-white px-5 pb-8 pt-4">
        {isAccepted ? (
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
                disabled={isMutating || isExpired}
              >
                {isMutating && acceptMutation.isPending ? "Aguarde..." : "Aceitar"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-red-100 bg-red-50 px-6 text-red-500 hover:bg-red-100"
                onClick={() => void handleReject(item.id)}
                disabled={isMutating || isExpired}
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
