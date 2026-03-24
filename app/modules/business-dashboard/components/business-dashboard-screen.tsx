import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { useBusinessDashboardController } from "../hooks/use-business-dashboard-controller";
import {
  BusinessDashboardCampaignList,
  BusinessDashboardHeader,
  BusinessDashboardMapCard,
  BusinessDashboardPendingRequests,
  BusinessDashboardQuickActions,
  BusinessDashboardRecommendedCreators,
  BusinessDashboardStats,
} from "./sections/business-dashboard-sections";

export function BusinessDashboardScreen() {
  const controller = useBusinessDashboardController();

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden px-4 pb-24 lg:gap-8 lg:p-8">
        <BusinessDashboardHeader
          greetingName={controller.viewModel.greetingName}
          subtitle={controller.viewModel.subtitle}
          search={controller.viewModel.search}
          onSearchChange={controller.actions.setSearch}
        />

        <BusinessDashboardStats stats={controller.viewModel.metrics} />

        <div className="order-2 lg:order-none">
          <BusinessDashboardPendingRequests
            items={controller.viewModel.pendingRequests}
            isLoading={controller.viewModel.isCampaignsLoading}
            errorMessage={controller.viewModel.campaignsErrorMessage}
            hasCampaignData={controller.viewModel.hasCampaignData}
            isRefreshing={controller.viewModel.isCampaignsRefreshing}
          />
        </div>

        <BusinessDashboardQuickActions
          actions={controller.viewModel.quickActions}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)] lg:gap-8">
          <div className="flex min-w-0 flex-col gap-6 lg:gap-8">
            <BusinessDashboardCampaignList
              items={controller.viewModel.activeCampaigns}
              isLoading={controller.viewModel.isCampaignsLoading}
              errorMessage={controller.viewModel.campaignsErrorMessage}
              hasCampaignData={controller.viewModel.hasCampaignData}
              isRefreshing={controller.viewModel.isCampaignsRefreshing}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <BusinessDashboardRecommendedCreators
              items={controller.viewModel.recommendedCreators}
              isLoading={controller.viewModel.isRecommendedLoading}
              errorMessage={controller.viewModel.recommendedErrorMessage}
              hasRecommendedCreators={controller.viewModel.hasRecommendedCreators}
              isRefreshing={controller.viewModel.isRecommendedRefreshing}
              getCreatorFallbackInitials={controller.actions.getCreatorFallbackInitials}
            />

            <BusinessDashboardMapCard
              highlights={controller.viewModel.mapHighlights}
            />
          </div>
        </div>
      </main>

      <BusinessBottomNav />
    </div>
  );
}
