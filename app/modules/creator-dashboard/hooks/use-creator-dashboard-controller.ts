import { useMemo } from "react";
import { useAuth } from "~/hooks/use-auth";
import {
  adaptCreatorActivity,
  adaptCreatorKpis,
  adaptHubInvites,
  adaptHubUpcoming,
} from "../adapters/creator-dashboard-adapters";
import {
  useCreatorActivitySourceQuery,
  useCreatorDashboardSummaryQuery,
} from "../queries";
// TODO: substituir por endpoint agregado GET /payouts/summary?month=X quando disponível.
import { useMyPayoutsQuery } from "~/modules/payments/api/payments.queries";
import { useCreatorOffersHubQuery } from "~/modules/contract-requests/queries";
import type { CreatorHubItem } from "~/modules/contract-requests/creator-hub.types";

export type CreatorDashboardPendingReviewItem = {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl: string | null;
  completedLabel: string;
};

function adaptPendingReview(item: CreatorHubItem): CreatorDashboardPendingReviewItem {
  const d = item.finalizedAt ? new Date(item.finalizedAt) : null;
  return {
    id: item.id,
    title: item.title,
    companyName: item.company.name,
    companyLogoUrl: item.company.logoUrl,
    completedLabel: d
      ? `Concluído em ${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}`
      : "Trabalho concluído",
  };
}

function getQueryErrorMessage(error: unknown, fallback: string) {
  if (!error) return null;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function getGreetingName(name?: string | null) {
  if (!name) return "Creator";
  const firstName = name.trim().split(/\s+/)[0];
  return firstName || "Creator";
}

export function useCreatorDashboardController() {
  const { user } = useAuth();
  const dashboardQuery = useCreatorDashboardSummaryQuery(); // only for averageRating
  const hubQuery = useCreatorOffersHubQuery();
  const activityQuery = useCreatorActivitySourceQuery();
  const payoutsQuery = useMyPayoutsQuery();

  const hub = hubQuery.data;

  // Ganhos do mês: payouts paid com paidAt no mês/ano corrente
  const ganhosDoMesCents: number | null = payoutsQuery.isLoading
    ? null
    : (() => {
        const now = new Date();
        return (payoutsQuery.data ?? [])
          .filter((p) => {
            if (p.status !== "paid" || !p.paidAt) return false;
            const d = new Date(p.paidAt);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          })
          .reduce((sum, p) => sum + p.amountCents, 0);
      })();

  const viewModel = useMemo(() => {
    const now = new Date();
    const creatorName = getGreetingName(user?.profile?.name ?? user?.name);

    const kpis = hub
      ? adaptCreatorKpis(
          dashboardQuery.data?.averageRating ?? null,
          hub.summary.inProgressCount,
          hub.summary.pendingInvitesCount,
          ganhosDoMesCents,
        )
      : [];
    const invites = hub ? adaptHubInvites(hub.pending.invites) : [];
    const upcoming = hub ? adaptHubUpcoming(hub.inProgress, now) : [];
    const allPendingReviews = hub
      ? hub.finalized.completed.filter((c) => c.myReviewPending === true).map(adaptPendingReview)
      : [];
    const pendingReviews = allPendingReviews.slice(0, 3);
    const hasPendingReviewsOverflow = allPendingReviews.length > 3;
    const activityItems = activityQuery.data
      ? adaptCreatorActivity(activityQuery.data)
      : [];

    return {
      creatorName,
      kpis,
      invites,
      upcoming,
      pendingReviews,
      hasPendingReviewsOverflow,
      activityItems,
      isKpiLoading: (hubQuery.isLoading && !hub) || (payoutsQuery.isLoading && !payoutsQuery.data),
      isKpiRefreshing: hubQuery.isFetching,
      kpiErrorMessage: getQueryErrorMessage(
        hubQuery.error,
        "Não foi possível carregar o resumo."
      ),
      isInvitesLoading: hubQuery.isLoading && !hub,
      isInvitesRefreshing: hubQuery.isFetching,
      invitesErrorMessage: getQueryErrorMessage(
        hubQuery.error,
        "Não foi possível carregar os convites."
      ),
      isUpcomingLoading: hubQuery.isLoading && !hub,
      isUpcomingRefreshing: hubQuery.isFetching,
      upcomingErrorMessage: getQueryErrorMessage(
        hubQuery.error,
        "Não foi possível carregar os próximos trabalhos."
      ),
      isActivityLoading: activityQuery.isLoading && !activityQuery.data,
      isActivityRefreshing: activityQuery.isFetching,
      activityErrorMessage: getQueryErrorMessage(
        activityQuery.error,
        "Não foi possível carregar a atividade."
      ),
    };
  }, [
    activityQuery.data,
    activityQuery.error,
    activityQuery.isFetching,
    activityQuery.isLoading,
    dashboardQuery.data,
    ganhosDoMesCents,
    hub,
    hubQuery.error,
    hubQuery.isFetching,
    hubQuery.isLoading,
    payoutsQuery.data,
    payoutsQuery.isLoading,
    user?.name,
    user?.profile?.name,
  ]);

  return { viewModel };
}
