import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AuthGuard } from "~/components/auth-guard";
import { usePaymentQuery } from "~/modules/payments/api/payments.queries";

function PaymentPendingScreen() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId") ?? "";
  const navigate = useNavigate();
  const { data: payment } = usePaymentQuery(paymentId, !!paymentId);

  // Redireciona automaticamente quando o status mudar para paid ou failed
  useEffect(() => {
    if (!payment) return;
    if (payment.status === "paid" || payment.status === "authorized") {
      void navigate(`/pagamento/sucesso?paymentId=${paymentId}`);
    } else if (payment.status === "failed" || payment.status === "canceled") {
      void navigate(`/pagamento/falhou?paymentId=${paymentId}`);
    }
  }, [payment, paymentId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-6">
      <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900">Aguardando confirmação</h1>
        <p className="text-neutral-500">
          Seu pagamento está sendo processado. Isso pode levar alguns instantes.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          to="/dashboard"
          className="px-6 py-2 rounded-lg border border-neutral-300 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition-colors"
        >
          Ir para o dashboard
        </Link>
      </div>
    </div>
  );
}

export default function PaymentPendingRoute() {
  return (
    <AuthGuard>
      <PaymentPendingScreen />
    </AuthGuard>
  );
}
