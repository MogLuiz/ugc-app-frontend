import { useLocation, useParams } from "react-router";
import { AuthGuard } from "~/components/auth-guard";
import { useAuth } from "~/hooks/use-auth";
import { OfferDetailScreen } from "~/modules/contract-requests/components/offer-detail-screen";
import {
  useMyCreatorContractRequestsQuery,
  useMyCreatorPendingContractRequestsQuery,
} from "~/modules/contract-requests/queries";
import type { ContractRequestItem } from "~/modules/contract-requests/types";
import { CompanyOpenOfferDetailScreen } from "~/modules/open-offers/components/company-open-offer-detail-screen";
import { useMyCompanyOpenOfferDetailQuery } from "~/modules/open-offers/queries";

export default function OfferDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user } = useAuth();

  const companyOfferQuery = useMyCompanyOpenOfferDetailQuery(user?.role === "business" ? id : undefined);

  // Item passed via navigation state (from list click) — fast path
  const stateItem = (location.state as { item?: ContractRequestItem } | null)?.item;
  const itemFromState = stateItem?.id === id ? stateItem : null;

  // Fallback: busca em todas as queries do creator quando não há state
  const isCreator = user?.role === "creator";
  const { data: pendingItems, isLoading: isPendingLoading } =
    useMyCreatorPendingContractRequestsQuery(isCreator);
  const { data: acceptedItems, isLoading: isAcceptedLoading } =
    useMyCreatorContractRequestsQuery("ACCEPTED", isCreator);
  const { data: completedItems, isLoading: isCompletedLoading } =
    useMyCreatorContractRequestsQuery("COMPLETED", isCreator);
  const { data: rejectedItems, isLoading: isRejectedLoading } =
    useMyCreatorContractRequestsQuery("REJECTED", isCreator);
  const { data: cancelledItems, isLoading: isCancelledLoading } =
    useMyCreatorContractRequestsQuery("CANCELLED", isCreator);

  const itemFromQuery =
    pendingItems?.find((i) => i.id === id) ??
    acceptedItems?.find((i) => i.id === id) ??
    completedItems?.find((i) => i.id === id) ??
    rejectedItems?.find((i) => i.id === id) ??
    cancelledItems?.find((i) => i.id === id) ??
    null;

  const isLoading =
    user?.role === "business"
      ? companyOfferQuery.isLoading
      : isPendingLoading ||
        isAcceptedLoading ||
        isCompletedLoading ||
        isRejectedLoading ||
        isCancelledLoading;
  const item = itemFromState ?? itemFromQuery;

  if (isLoading && !item) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen items-center justify-center bg-[#f6f5f8]">
          <div className="size-6 animate-spin rounded-full border-2 border-[#6a36d5] border-t-transparent" />
        </div>
      </AuthGuard>
    );
  }

  if (user?.role === "business") {
    if (!companyOfferQuery.data) {
      return (
        <AuthGuard allowedRoles={["business"]}>
          <div className="flex min-h-screen items-center justify-center bg-[#f6f5f8]">
            <p className="text-sm text-slate-500">Oferta não encontrada.</p>
          </div>
        </AuthGuard>
      );
    }

    return (
      <AuthGuard allowedRoles={["business"]}>
        <CompanyOpenOfferDetailScreen item={companyOfferQuery.data} />
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
