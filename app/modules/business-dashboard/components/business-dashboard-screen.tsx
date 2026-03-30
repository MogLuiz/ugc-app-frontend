import { AppSidebar } from "~/components/app-sidebar";
import { AppHeader } from "~/components/layout/app-header";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { useBusinessDashboardController } from "../hooks/use-business-dashboard-controller";
import {
  BusinessDashboardCampaignsInProgress,
  BusinessDashboardExploreHero,
  BusinessDashboardHeader,
  BusinessDashboardMapNearby,
  BusinessDashboardPendingRequests,
  BusinessDashboardRecentActivity,
  BusinessDashboardRecommendedCreators,
  BusinessDashboardStats,
} from "./sections";

export function BusinessDashboardScreen() {
  const controller = useBusinessDashboardController();

  return (
    <div className="min-h-screen bg-[#f5f6f7] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden pb-24 lg:gap-10 lg:p-8">
        <AppHeader title="Início" mobileBehavior="inline" />
        <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden px-4 lg:gap-10 lg:px-0">
        <BusinessDashboardHeader
          greetingName={controller.viewModel.greetingName}
          subtitle={controller.viewModel.subtitle}
        />

        <BusinessDashboardStats stats={controller.viewModel.metrics} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)] lg:gap-8">
          <div className="flex min-w-0 flex-col gap-6 lg:gap-8">
            <BusinessDashboardExploreHero />

            <BusinessDashboardPendingRequests
              items={controller.viewModel.pendingRequests}
              isLoading={controller.viewModel.isCampaignsLoading}
              errorMessage={controller.viewModel.campaignsErrorMessage}
              hasCampaignData={controller.viewModel.hasCampaignData}
              isRefreshing={controller.viewModel.isCampaignsRefreshing}
              getCreatorFallbackInitials={
                controller.actions.getCreatorFallbackInitials
              }
            />

            <BusinessDashboardCampaignsInProgress
              items={controller.viewModel.activeCampaigns}
              isLoading={controller.viewModel.isCampaignsLoading}
              errorMessage={controller.viewModel.campaignsErrorMessage}
              hasCampaignData={controller.viewModel.hasCampaignData}
              isRefreshing={controller.viewModel.isCampaignsRefreshing}
              getCreatorFallbackInitials={
                controller.actions.getCreatorFallbackInitials
              }
            />
          </div>

          <div className="flex min-w-0 flex-col gap-6 lg:gap-8">
            <BusinessDashboardMapNearby
              highlights={controller.viewModel.mapHighlights}
            />

            <BusinessDashboardRecommendedCreators
              items={controller.viewModel.recommendedCreators}
              isLoading={controller.viewModel.isRecommendedLoading}
              errorMessage={controller.viewModel.recommendedErrorMessage}
              hasRecommendedCreators={
                controller.viewModel.hasRecommendedCreators
              }
              isRefreshing={controller.viewModel.isRecommendedRefreshing}
              getCreatorFallbackInitials={
                controller.actions.getCreatorFallbackInitials
              }
            />

            <BusinessDashboardRecentActivity
              items={controller.viewModel.recentActivity}
              isLoading={controller.viewModel.isActivityLoading}
              errorMessage={controller.viewModel.activityErrorMessage}
              isRefreshing={controller.viewModel.isActivityRefreshing}
            />
          </div>
        </div>
        </div>
      </main>

      <BusinessBottomNav />
    </div>
  );
}
