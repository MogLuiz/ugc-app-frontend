import { Link, useSearchParams } from "react-router";
import { AuthGuard } from "~/components/auth-guard";

function PaymentFailedScreen() {
  const [searchParams] = useSearchParams();
  const contractRequestId = searchParams.get("contractRequestId");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-6">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900">Pagamento não realizado</h1>
        <p className="text-neutral-500">
          Ocorreu um problema ao processar o pagamento. Nenhum valor foi cobrado.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {contractRequestId && (
          <Link
            to={`/pagamento/${contractRequestId}`}
            className="px-6 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium text-center hover:bg-neutral-800 transition-colors"
          >
            Tentar novamente
          </Link>
        )}
        <Link
          to="/dashboard"
          className="px-6 py-2 rounded-lg border border-neutral-300 text-neutral-700 text-sm font-medium text-center hover:bg-neutral-50 transition-colors"
        >
          Voltar ao dashboard
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailedRoute() {
  return (
    <AuthGuard>
      <PaymentFailedScreen />
    </AuthGuard>
  );
}
