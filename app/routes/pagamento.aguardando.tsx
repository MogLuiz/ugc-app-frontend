import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { AuthGuard } from "~/components/auth-guard";
import { PixQrPanel } from "~/modules/payments/components/PixQrPanel";
import { usePaymentQuery } from "~/modules/payments/api/payments.queries";

/** Timeout de fallback quando o Payment não tem pixExpiresAt (30 min). */
const FALLBACK_TIMEOUT_MS = 30 * 60 * 1000;

function PaymentPendingScreen() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId") ?? "";
  const navigate = useNavigate();
  const { data: payment, isFetching } = usePaymentQuery(paymentId, !!paymentId);
  const [timedOut, setTimedOut] = useState(false);

  // KAN-74: timeout de segurança para pagamentos aguardando.
  // Para PIX, usa pixExpiresAt. Para cartão/outros, usa fallback de 30 min.
  useEffect(() => {
    if (!payment) return;

    const referenceTime = payment.pixExpiresAt
      ? new Date(payment.pixExpiresAt).getTime()
      : new Date(payment.createdAt).getTime() + FALLBACK_TIMEOUT_MS;

    const msUntilTimeout = referenceTime - Date.now();

    if (msUntilTimeout <= 0) {
      setTimedOut(true);
      return;
    }

    const id = setTimeout(() => setTimedOut(true), msUntilTimeout);
    return () => clearTimeout(id);
  }, [payment?.pixExpiresAt, payment?.createdAt]);

  // Redireciona apenas com dado fresco (isFetching=false) para evitar
  // redirecionamentos baseados em cache stale de tentativas anteriores.
  useEffect(() => {
    if (!payment || isFetching) return;
    if (payment.status === "paid" || payment.status === "authorized") {
      void navigate(`/pagamento/sucesso?paymentId=${paymentId}`);
    } else if (payment.status === "failed" || payment.status === "canceled") {
      void navigate(`/pagamento/falhou?paymentId=${paymentId}`);
    }
  }, [payment?.status, isFetching, paymentId, navigate]);

  const isPix = payment?.paymentType === "pix" || !!payment?.pixCopyPaste;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-6 max-w-sm mx-auto">
      <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-yellow-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Aguardando confirmação
        </h1>
        <p className="text-neutral-500">
          {isPix
            ? "Pague o PIX abaixo e aguarde a confirmação automática."
            : "Seu pagamento está sendo processado. Isso pode levar alguns instantes."}
        </p>
      </div>

      {/* PIX: exibe QR code e copia-e-cola se disponíveis no payment */}
      {isPix && payment?.pixCopyPaste && (
        <div className="w-full rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <PixQrPanel
            contractRequestId={payment.contractRequestId}
            pixCopyPaste={payment.pixCopyPaste}
            pixQrCodeBase64={payment.pixQrCodeBase64 ?? null}
            pixExpiresAt={payment.pixExpiresAt ?? null}
          />
        </div>
      )}

      {/* KAN-74: timeout atingido sem PIX data (cartão ou PIX sem pixCopyPaste) */}
      {timedOut && !isPix && (
        <div className="w-full space-y-3">
          <p className="text-sm text-center text-neutral-500">
            O pagamento demorou mais do que o esperado.
          </p>
          {payment?.contractRequestId && (
            <Link
              to={`/pagamento/${payment.contractRequestId}`}
              className="block w-full px-6 py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-medium text-center hover:bg-neutral-800 transition-colors"
            >
              Tentar novamente
            </Link>
          )}
        </div>
      )}

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
