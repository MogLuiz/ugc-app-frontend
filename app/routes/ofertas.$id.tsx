import { useLocation, useParams } from "react-router";
import { AuthGuard } from "~/components/auth-guard";
import { OfferDetailScreen } from "~/modules/contract-requests/components/offer-detail-screen";
import { useMyCreatorPendingContractRequestsQuery } from "~/modules/contract-requests/queries";
import type { ContractRequestItem } from "~/modules/contract-requests/types";

export default function OfferDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // Item passed via navigation state (from list click) — fast path
  const stateItem = (location.state as { item?: ContractRequestItem } | null)?.item;
  const itemFromState = stateItem?.id === id ? stateItem : null;

  // Fallback: fetch from pending list when navigating directly (e.g. from dashboard)
  const { data: pendingItems, isLoading } = useMyCreatorPendingContractRequestsQuery();
  const itemFromQuery = pendingItems?.find((i) => i.id === id) ?? null;

  const item = itemFromState ?? itemFromQuery;

  if (isLoading && !item) {
    return (
      <AuthGuard allowedRoles={["creator"]}>
        <div className="flex min-h-screen items-center justify-center bg-[#f6f5f8]">
          <div className="size-6 animate-spin rounded-full border-2 border-[#6a36d5] border-t-transparent" />
        </div>
      </AuthGuard>
    );
  }

  if (!item) {
    return (
      <AuthGuard allowedRoles={["creator"]}>
        <div className="flex min-h-screen items-center justify-center bg-[#f6f5f8]">
          <p className="text-sm text-slate-500">Oferta não encontrada.</p>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={["creator"]}>
      <OfferDetailScreen item={item} />
    </AuthGuard>
  );
}
