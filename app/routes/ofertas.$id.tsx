import { Link, useLocation, useParams } from "react-router";
import { AuthGuard } from "~/components/auth-guard";
import { useAuth } from "~/hooks/use-auth";
import { useMyCompanyContractRequestsQuery } from "~/modules/contract-requests/queries";
import { OfferDetailScreen } from "~/modules/contract-requests/components/offer-detail-screen";
import {
  useMyCreatorContractRequestsQuery,
  useMyCreatorPendingContractRequestsQuery,
} from "~/modules/contract-requests/queries";
import type { ContractRequestItem } from "~/modules/contract-requests/types";
import { HttpError } from "~/lib/http/errors";
import { CompanyOpenOfferDetailScreen } from "~/modules/open-offers/components/company-open-offer-detail-screen";
import { CompanyContractRequestDetailScreen } from "~/modules/open-offers/components/company-contract-request-detail-screen";
import { useMyCompanyOpenOfferDetailQuery } from "~/modules/open-offers/queries";

function BusinessDetailState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <AuthGuard allowedRoles={["business"]}>
      <div className="flex min-h-screen items-center justify-center bg-[#f6f5f8] px-4">
        <div className="w-full max-w-lg rounded-[32px] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black tracking-[-0.03em] text-slate-900">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
          <Link
            to="/ofertas"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#895af6] px-5 py-3 text-sm font-semibold text-white hover:bg-[#7c4fe6]"
          >
            Voltar para ofertas
          </Link>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function OfferDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user } = useAuth();
  const isBusiness = user?.role === "business";
  const isCreator = user?.role === "creator";

  const companyOfferQuery = useMyCompanyOpenOfferDetailQuery(isBusiness ? id : undefined);
  const companyOpenOfferNotFound =
    companyOfferQuery.error instanceof HttpError && companyOfferQuery.error.status === 404;
  const companyContractsQuery = useMyCompanyContractRequestsQuery(
    undefined,
    isBusiness && Boolean(id) && companyOpenOfferNotFound
  );

  // Item passed via navigation state (from list click) — fast path
  const stateItem = (location.state as { item?: ContractRequestItem } | null)?.item;
  const itemFromState = stateItem?.id === id ? stateItem : null;

  // Fallback: busca em todas as queries do creator quando não há state
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

  const companyContractItem = isBusiness
    ? companyContractsQuery.data?.find((item) => item.id === id) ?? null
    : null;
  const companyOpenOfferError =
    companyOfferQuery.isError && !companyOpenOfferNotFound ? companyOfferQuery.error : null;
  const companyContractsError =
    companyContractsQuery.isError ? companyContractsQuery.error : null;

  const isLoading =
    isBusiness
      ? companyOfferQuery.isLoading ||
        (companyOpenOfferNotFound && companyContractsQuery.isLoading)
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

  if (isBusiness) {
    // Ambiguidade intencional de go-live: tentamos primeiro `open-offer` e,
    // quando não existe, caímos para `contractRequest` via listagem da empresa.
    if (companyOpenOfferError) {
      const message =
        companyOpenOfferError instanceof Error
          ? companyOpenOfferError.message
          : "Não foi possível carregar este detalhe.";
      return (
        <BusinessDetailState
          title="Erro ao carregar oferta"
          description={message}
        />
      );
    }

    if (companyOfferQuery.data) {
      return (
        <AuthGuard allowedRoles={["business"]}>
          <CompanyOpenOfferDetailScreen item={companyOfferQuery.data} />
        </AuthGuard>
      );
    }

    if (companyContractsError) {
      const message =
        companyContractsError instanceof Error
          ? companyContractsError.message
          : "Não foi possível carregar este detalhe.";
      return (
        <BusinessDetailState
          title="Erro ao carregar contrato"
          description={message}
        />
      );
    }

    if (!companyContractItem) {
      return (
        <BusinessDetailState
          title="Item não encontrado"
          description="A oferta ou contrato solicitado não está disponível para esta empresa."
        />
      );
    }

    return (
      <AuthGuard allowedRoles={["business"]}>
        <CompanyContractRequestDetailScreen item={companyContractItem} />
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
