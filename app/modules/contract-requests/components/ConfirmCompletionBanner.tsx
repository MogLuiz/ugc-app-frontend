import { useState } from "react";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/toast";
import {
  useConfirmCompletionMutation,
  useDisputeCompletionMutation,
} from "../queries";
import type { ContractRequestItem } from "../types";

type Props = {
  item: ContractRequestItem;
  /** "COMPANY" se o usuário logado é empresa; "CREATOR" se é creator. */
  viewerRole: "COMPANY" | "CREATOR";
  onUpdate?: () => void;
};

export function ConfirmCompletionBanner({ item, viewerRole, onUpdate }: Props) {
  const [disputeReason, setDisputeReason] = useState("");
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  const confirmMutation = useConfirmCompletionMutation();
  const disputeMutation = useDisputeCompletionMutation();

  const viewerConfirmed =
    viewerRole === "CREATOR"
      ? item.creatorConfirmedCompletedAt !== null
      : item.companyConfirmedCompletedAt !== null;

  const otherSideConfirmed =
    viewerRole === "CREATOR"
      ? item.companyConfirmedCompletedAt !== null
      : item.creatorConfirmedCompletedAt !== null;

  const otherSideLabel = viewerRole === "CREATOR" ? "empresa" : "creator";

  async function handleConfirm() {
    try {
      await confirmMutation.mutateAsync(item.id);
      toast.success("Conclusão confirmada com sucesso.");
      onUpdate?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Não foi possível confirmar a conclusão."
      );
    }
  }

  async function handleDispute() {
    if (!disputeReason.trim()) {
      toast.error("Informe o motivo da disputa.");
      return;
    }
    try {
      await disputeMutation.mutateAsync({ contractRequestId: item.id, reason: disputeReason });
      toast.success("Disputa aberta. Nossa equipe entrará em contato.");
      setShowDisputeForm(false);
      onUpdate?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Não foi possível abrir a disputa."
      );
    }
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-amber-800">
            Aguardando confirmação de conclusão
          </p>
          <p className="text-xs text-amber-700">
            Confirme se o serviço foi realizado conforme combinado.
          </p>
        </div>
      </div>

      {otherSideConfirmed && (
        <div className="flex items-center gap-2 text-xs text-green-700">
          <CheckCircle className="h-4 w-4" />
          <span>A {otherSideLabel} já confirmou a conclusão.</span>
        </div>
      )}

      {!viewerConfirmed && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={confirmMutation.isPending}
          >
            {confirmMutation.isPending ? "Confirmando..." : "Confirmar serviço realizado"}
          </Button>

          {!showDisputeForm && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => setShowDisputeForm(true)}
            >
              Reportar problema
            </Button>
          )}
        </div>
      )}

      {viewerConfirmed && !otherSideConfirmed && item.contestDeadlineAt && (
        <p className="text-xs text-amber-700">
          Se a {otherSideLabel} não confirmar até{" "}
          <span className="font-medium">
            {new Date(item.contestDeadlineAt).toLocaleString("pt-BR")}
          </span>
          , o contrato será concluído automaticamente.
        </p>
      )}

      {showDisputeForm && (
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-medium text-gray-700">
            Descreva o problema
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            rows={3}
            maxLength={2000}
            placeholder="Informe o que aconteceu..."
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDispute}
              disabled={disputeMutation.isPending}
            >
              {disputeMutation.isPending ? "Enviando..." : "Abrir disputa"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDisputeForm(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
