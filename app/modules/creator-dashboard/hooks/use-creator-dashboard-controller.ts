import { useMemo } from "react";
import { useAuth } from "~/hooks/use-auth";
import {
  adaptCreatorActivity,
  adaptCreatorInvites,
  adaptCreatorKpis,
  adaptCreatorUpcoming,
} from "../adapters/creator-dashboard-adapters";
import {
  useCreatorActivitySourceQuery,
  useCreatorDashboardSummaryQuery,
  useCreatorInvitesQuery,
  useCreatorUpcomingCampaignsQuery,
} from "../queries";
// TODO: substituir por endpoint agregado GET /payouts/summary?month=X quando disponível.
import { useMyPayoutsQuery } from "~/modules/payments/api/payments.queries";

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
  const dashboardQuery = useCreatorDashboardSummaryQuery();
  const invitesQuery = useCreatorInvitesQuery();
  const upcomingQuery = useCreatorUpcomingCampaignsQuery();
  const activityQuery = useCreatorActivitySourceQuery();
  const payoutsQuery = useMyPayoutsQuery();

  // Ganhos do mês: payouts paid com paidAt no mês/ano corrente
  const now = new Date();
  const ganhosDoMesCents: number | null = payoutsQuery.isLoading
    ? null
    : (payoutsQuery.data ?? [])
        .filter((p) => {
          if (p.status !== "paid" || !p.paidAt) return false;
          const d = new Date(p.paidAt);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, p) => sum + p.amountCents, 0);

  const viewModel = useMemo(() => {
    const creatorName = getGreetingName(user?.profile?.name ?? user?.name);

    const kpis = dashboardQuery.data
      ? adaptCreatorKpis(dashboardQuery.data, ganhosDoMesCents)
      : [];
    const invites = invitesQuery.data ? adaptCreatorInvites(invitesQuery.data) : [];
    const upcoming = upcomingQuery.data
      ? adaptCreatorUpcoming(upcomingQuery.data)
      : [];
    const activityItems = activityQuery.data
      ? adaptCreatorActivity(activityQuery.data)
      : [];

    return {
      creatorName,
      kpis,
      invites,
      upcoming,
      activityItems,
      isKpiLoading: dashboardQuery.isLoading && !dashboardQuery.data,
      isKpiRefreshing: dashboardQuery.isFetching,
      kpiErrorMessage: getQueryErrorMessage(
        dashboardQuery.error,
        "Não foi possível carregar o resumo."
      ),
      isInvitesLoading: invitesQuery.isLoading && !invitesQuery.data,
      isInvitesRefreshing: invitesQuery.isFetching,
      invitesErrorMessage: getQueryErrorMessage(
        invitesQuery.error,
        "Não foi possível carregar os convites."
      ),
      isUpcomingLoading: upcomingQuery.isLoading && !upcomingQuery.data,
      isUpcomingRefreshing: upcomingQuery.isFetching,
      upcomingErrorMessage: getQueryErrorMessage(
        upcomingQuery.error,
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
    dashboardQuery.error,
    dashboardQuery.isFetching,
    dashboardQuery.isLoading,
    ganhosDoMesCents,
    invitesQuery.data,
    invitesQuery.error,
    invitesQuery.isFetching,
    invitesQuery.isLoading,
    upcomingQuery.data,
    upcomingQuery.error,
    upcomingQuery.isFetching,
    upcomingQuery.isLoading,
    user?.name,
    user?.profile?.name,
  ]);

  return { viewModel };
}
