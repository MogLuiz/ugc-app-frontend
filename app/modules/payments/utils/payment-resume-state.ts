export type PaymentResumeKind = "not_started" | "pending" | "expired" | "failed" | "none";

export interface PaymentResumeState {
  kind: PaymentResumeKind;
  label: string;
  ctaLabel: string;
  resumeUrl: string | null;
  severity: "warning" | "danger" | "neutral";
}

const NONE: PaymentResumeState = {
  kind: "none",
  label: "",
  ctaLabel: "",
  resumeUrl: null,
  severity: "neutral",
};

/**
 * Deriva o estado visual de retomada de pagamento a partir de um item do hub.
 * Retorna kind='none' para qualquer item cujo contrato não esteja em PENDING_PAYMENT.
 *
 * Regras de prioridade (ordem importa):
 *   1. legacyStatus !== PENDING_PAYMENT → none
 *   2. Sem Payment criado → not_started
 *   3. PIX PROCESSING + expirado → expired (sobrepõe pending)
 *   4. pending | processing | authorized → pending
 *   5. failed | canceled → failed
 *   6. qualquer outro → none
 */
export function getPaymentResumeState(item: {
  legacyStatus: string;
  contractRequestId: string | null;
  paymentId?: string | null;
  paymentStatus?: string | null;
  pixExpiresAt?: string | null;
}): PaymentResumeState {
  if (item.legacyStatus !== "PENDING_PAYMENT" || !item.contractRequestId) {
    return NONE;
  }

  const resumeUrl = `/pagamento/${item.contractRequestId}`;

  if (!item.paymentId || !item.paymentStatus) {
    return {
      kind: "not_started",
      label: "Pagamento não iniciado",
      ctaLabel: "Iniciar pagamento",
      resumeUrl,
      severity: "warning",
    };
  }

  if (
    item.paymentStatus === "processing" &&
    item.pixExpiresAt &&
    new Date(item.pixExpiresAt) < new Date()
  ) {
    return {
      kind: "expired",
      label: "PIX expirado",
      ctaLabel: "Tentar novamente",
      resumeUrl,
      severity: "danger",
    };
  }

  if (
    item.paymentStatus === "pending" ||
    item.paymentStatus === "processing" ||
    item.paymentStatus === "authorized"
  ) {
    return {
      kind: "pending",
      label: "Pagamento pendente",
      ctaLabel: "Continuar pagamento",
      resumeUrl,
      severity: "warning",
    };
  }

  if (item.paymentStatus === "failed" || item.paymentStatus === "canceled") {
    return {
      kind: "failed",
      label: "Pagamento falhou",
      ctaLabel: "Tentar novamente",
      resumeUrl,
      severity: "danger",
    };
  }

  return NONE;
}
