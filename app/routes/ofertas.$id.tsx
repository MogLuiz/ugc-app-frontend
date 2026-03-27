import { useLocation, useParams } from "react-router";
import { AuthGuard } from "~/components/auth-guard";
import { OfferDetailScreen } from "~/modules/contract-requests/components/offer-detail-screen";
import type { ContractRequestItem } from "~/modules/contract-requests/types";

export default function OfferDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // Item passed via navigation state (from list click)
  const item = (location.state as { item?: ContractRequestItem } | null)?.item;

  if (!item || item.id !== id) {
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
