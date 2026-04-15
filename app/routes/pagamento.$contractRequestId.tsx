import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthGuard } from "~/components/auth-guard";
import { PaymentBrick } from "~/modules/payments/components/PaymentBrick";
import { PaymentSummary } from "~/modules/payments/components/PaymentSummary";
import { useInitiatePaymentMutation } from "~/modules/payments/api/payments.queries";
import type { InitiatePaymentResponse } from "~/modules/payments/types/payment.types";

function CheckoutScreen() {
  const { contractRequestId } = useParams<{ contractRequestId: string }>();
  const navigate = useNavigate();
  const initiateMutation = useInitiatePaymentMutation();
  const [paymentData, setPaymentData] = useState<InitiatePaymentResponse | null>(null);

  useEffect(() => {
    if (!contractRequestId) return;
    initiateMutation.mutate(contractRequestId, {
      onSuccess: (data) => setPaymentData(data),
      onError: () => {
        void navigate("/dashboard");
      },
    });
    // Executar apenas uma vez ao montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractRequestId]);

  if (initiateMutation.isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-500">Preparando pagamento...</p>
      </div>
    );
  }

  if (initiateMutation.isError || !paymentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Não foi possível iniciar o pagamento.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <h1 className="text-xl font-semibold text-neutral-900">Pagamento</h1>

      <PaymentSummary
        grossAmountCents={paymentData.grossAmountCents}
        platformFeeCents={paymentData.platformFeeCents}
        creatorBaseAmountCents={paymentData.creatorBaseAmountCents}
        transportFeeCents={paymentData.transportFeeCents}
        creatorNetAmountCents={paymentData.creatorNetAmountCents}
        currency={paymentData.currency}
      />

      <PaymentBrick
        publicKey={paymentData.publicKey}
        preferenceId={paymentData.preferenceId}
        paymentId={paymentData.paymentId}
        grossAmountCents={paymentData.grossAmountCents}
        onPaymentSubmitted={() => {
          void navigate(`/pagamento/aguardando?paymentId=${paymentData.paymentId}`);
        }}
        onError={() => {
          void navigate(`/pagamento/falhou?paymentId=${paymentData.paymentId}`);
        }}
      />
    </div>
  );
}

export default function CheckoutRoute() {
  return (
    <AuthGuard allowedRoles={["business"]}>
      <CheckoutScreen />
    </AuthGuard>
  );
}
