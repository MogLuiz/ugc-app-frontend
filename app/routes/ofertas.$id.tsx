import { Link, useLocation, useParams } from "react-router";
import { AuthGuard } from "~/components/auth-guard";
import { useAuth } from "~/hooks/use-auth";
import { useMyCompanyContractRequestsQuery } from "~/modules/contract-requests/queries";
import { OfferDetailScreen } from "~/modules/contract-requests/components/offer-detail-screen";
import { useContractRequestDetailQuery } from "~/modules/contract-requests/queries";
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

  // Item passado pelo state da navegação — usado como fallback inicial enquanto a query carrega.
  // A query fica SEMPRE ativa para que mutações (confirmação, disputa, avaliação) acionem
  // um re-fetch e a tela reflita o novo status sem precisar recarregar.
  const stateItem = (location.state as { item?: ContractRequestItem } | null)?.item;
  const itemFromState = stateItem?.id === id ? stateItem : null;

  const creatorDetailQuery = useContractRequestDetailQuery(
    id,
    isCreator && Boolean(id)
  );

  const companyContractItem = isBusiness
    ? companyContractsQuery.data?.find((item) => item.id === id) ?? null
    : null;
  const companyOpenOfferError =
    companyOfferQuery.isError && !companyOpenOfferNotFound ? companyOfferQuery.error : null;
  const companyContractsError =
    companyContractsQuery.isError ? companyContractsQuery.error : null;
  const creatorDetailError = !isBusiness && isCreator && creatorDetailQuery.isError
    ? creatorDetailQuery.error
    : null;

  const isLoading =
    isBusiness
      ? companyOfferQuery.isLoading ||
        (companyOpenOfferNotFound && companyContractsQuery.isLoading)
      // Para creator: só mostra spinner se não há nenhum dado (nem state nem cache)
      : isCreator && !itemFromState && !creatorDetailQuery.data && creatorDetailQuery.isLoading;
  // Dado fresco da API tem prioridade; itemFromState é fallback enquanto a query ainda não resolveu
  const item = creatorDetailQuery.data ?? itemFromState;

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

  if (creatorDetailError) {
    const message =
      creatorDetailError instanceof Error
        ? creatorDetailError.message
        : "Não foi possível carregar este detalhe.";
    return (
      <AuthGuard allowedRoles={["creator"]}>
        <div className="flex min-h-screen items-center justify-center bg-[#f6f5f8] px-4">
          <div className="w-full max-w-lg rounded-[32px] bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-black tracking-[-0.03em] text-slate-900">
              Erro ao carregar oferta
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              403: o contrato no banco precisa ser do mesmo <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-700">users.id</code> resolvido pelo seu token (Supabase <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-700">sub</code> →
              <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-700">auth_user_id</code>).
              Rode a seed com <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-700">DEMO_CREATOR_AUTH_USER_ID</code> (UUID
              do Auth) ou e-mail alinhado ao <code className="rounded bg-slate-100 px-1 py-0.5 text-slate-700">users.email</code>.
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Na listagem, a aba padrão &quot;Pendentes&quot; fica vazia com a demo; use &quot;Aceitas&quot; ou
              &quot;Finalizadas&quot;.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link
                to="/ofertas?tab=ACCEPTED"
                className="inline-flex items-center justify-center rounded-full bg-[#895af6] px-5 py-3 text-sm font-semibold text-white hover:bg-[#7c4fe6]"
              >
                Abrir aba Aceitas
              </Link>
              <Link
                to="/ofertas?tab=FINALIZED"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Abrir Finalizadas
              </Link>
            </div>
          </div>
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
