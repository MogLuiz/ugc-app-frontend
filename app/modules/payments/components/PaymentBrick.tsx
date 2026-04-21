import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { useEffect, useRef } from "react";
import { processPayment } from "../api/payments.api";

type PaymentBrickProps = {
  publicKey: string;
  preferenceId: string;
  paymentId: string;
  /** Valor total em centavos — necessário para o Brick calcular parcelamentos */
  grossAmountCents: number;
  onPaymentSubmitted?: () => void;
  onError?: (error: unknown) => void;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Unknown error";
}

/**
 * Wrapper do Mercado Pago Payment Brick.
 *
 * Para pagamentos com cartão: o Brick coleta os dados, onSubmit envia para o
 * backend via POST /payments/:id/process, que cria o pagamento no MP.
 *
 * O status final é sempre determinado pelo webhook (backend), nunca pelo
 * retorno do onSubmit.
 */
export function PaymentBrick({
  publicKey,
  preferenceId,
  paymentId,
  grossAmountCents,
  onPaymentSubmitted,
  onError,
}: PaymentBrickProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    initMercadoPago(publicKey, { locale: "pt-BR" });
  }, [publicKey]);

  return (
    <div className="w-full">
      <Payment
        initialization={{
          amount: grossAmountCents / 100,
          preferenceId,
        }}
        customization={{
          paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            bankTransfer: "all",
          },
          visual: {
            style: {
              theme: "default",
              customVariables: {
                baseColor: "#895af6",
                baseColorFirstVariant: "#7c3aed",
                baseColorSecondVariant: "#6d28d9",
                buttonTextColor: "#ffffff",
                outlinePrimaryColor: "#895af6",
                outlineSecondaryColor: "#d8c7ff",
              },
            },
          },
        }}
        onSubmit={async (submitData) => {
          try {
            const { formData } = submitData as {
              formData: {
                token?: string;
                payment_method_id: string;
                issuer_id?: string;
                installments?: number;
                transaction_amount: number;
                payer: {
                  email: string;
                  identification?: { type: string; number: string };
                };
              };
            };

            await processPayment(paymentId, {
              token: formData.token ?? "",
              paymentMethodId: formData.payment_method_id,
              issuerId: formData.issuer_id ?? null,
              installments: formData.installments ?? 1,
              transactionAmount: formData.transaction_amount,
              payerEmail: formData.payer.email,
              payerDocument: formData.payer.identification
                ? {
                    type: formData.payer.identification.type,
                    number: formData.payer.identification.number,
                  }
                : null,
            });

            onPaymentSubmitted?.();
          } catch (err) {
            console.error("PaymentBrick submit failed", {
              paymentId,
              message: getErrorMessage(err),
            });
            onError?.(err);
          }
        }}
        onError={(error) => {
          console.error("PaymentBrick render error", {
            paymentId,
            message: getErrorMessage(error),
          });
          onError?.(error);
        }}
      />
    </div>
  );
}
