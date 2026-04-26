import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { AuthGuard } from "~/components/auth-guard";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
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
      onSuccess: (data) => {
        if (data.alreadyPaid) {
          // 100% coberto por crédito — pular Brick e ir direto para sucesso
          void navigate(`/pagamento/sucesso?paymentId=${data.paymentId}`);
          return;
        }
        setPaymentData(data);
      },
      onError: () => {
        void navigate("/dashboard");
      },
    });
    // Executar apenas uma vez ao montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractRequestId]);

  if (initiateMutation.isPending) {
    return (
      <div className="min-h-screen bg-[#f6f5f8] lg:flex">
        <div className="hidden lg:block">
          <AppSidebar variant="business" />
        </div>

        <main className="flex min-w-0 flex-1 flex-col items-center justify-center px-4 pb-24 pt-6 lg:px-8 lg:py-8">
          <p className="text-neutral-500">Preparando pagamento...</p>
        </main>

        <BusinessBottomNav />
      </div>
    );
  }

  if (initiateMutation.isError || !paymentData) {
    return (
      <div className="min-h-screen bg-[#f6f5f8] lg:flex">
        <div className="hidden lg:block">
          <AppSidebar variant="business" />
        </div>

        <main className="flex min-w-0 flex-1 flex-col items-center justify-center px-4 pb-24 pt-6 lg:px-8 lg:py-8">
          <p className="text-red-500">Não foi possível iniciar o pagamento.</p>
        </main>

        <BusinessBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden pb-24 pt-4 lg:gap-8 lg:px-8 lg:py-8">
        <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden px-4 lg:gap-8 lg:px-0">
          <h1 className="text-xl font-black tracking-[-0.4px] text-[#2c2f30] lg:hidden">
            Pagamento
          </h1>

          <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
            <div className="hidden lg:block">
              <h1 className="text-2xl font-black tracking-[-0.4px] text-[#2c2f30]">
                Pagamento
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Finalize a cobranca para enviar a contratacao ao creator.
              </p>
            </div>

            <PaymentSummary
              serviceGrossAmountCents={paymentData.serviceGrossAmountCents}
              platformFeeAmountCents={paymentData.platformFeeAmountCents}
              transportFeeAmountCents={paymentData.transportFeeAmountCents}
              creatorPayoutAmountCents={paymentData.creatorPayoutAmountCents}
              companyTotalAmountCents={paymentData.companyTotalAmountCents}
              currency={paymentData.currency}
              creditAppliedCents={paymentData.creditAppliedCents}
              remainderCents={paymentData.remainderCents}
            />

            <PaymentBrick
              publicKey={paymentData.publicKey}
              preferenceId={paymentData.preferenceId}
              paymentId={paymentData.paymentId}
              grossAmountCents={paymentData.remainderCents ?? paymentData.companyTotalAmountCents}
              onPaymentSubmitted={() => {
                void navigate(`/pagamento/aguardando?paymentId=${paymentData.paymentId}`);
              }}
              onError={() => {
                void navigate(`/pagamento/falhou?paymentId=${paymentData.paymentId}`);
              }}
            />
          </div>
        </div>
      </main>

      <BusinessBottomNav />
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
