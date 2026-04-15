import { Link, useSearchParams } from "react-router";
import { AuthGuard } from "~/components/auth-guard";
import { PaymentStatusBadge } from "~/modules/payments/components/PaymentStatusBadge";
import { usePaymentQuery } from "~/modules/payments/api/payments.queries";

function PaymentSuccessScreen() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId") ?? "";
  const { data: payment, isLoading } = usePaymentQuery(paymentId, !!paymentId);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-6">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900">Pagamento recebido!</h1>
        <p className="text-neutral-500">
          Seu pagamento foi processado. O creator será notificado em breve.
        </p>
      </div>

      {payment && !isLoading && (
        <div className="w-full max-w-sm rounded-lg border border-neutral-200 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Status</span>
            <PaymentStatusBadge status={payment.status} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Valor</span>
            <span className="font-medium">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: payment.currency,
              }).format(payment.grossAmountCents / 100)}
            </span>
          </div>
        </div>
      )}

      <Link
        to="/dashboard"
        className="px-6 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
      >
        Ir para o dashboard
      </Link>
    </div>
  );
}

export default function PaymentSuccessRoute() {
  return (
    <AuthGuard>
      <PaymentSuccessScreen />
    </AuthGuard>
  );
}
