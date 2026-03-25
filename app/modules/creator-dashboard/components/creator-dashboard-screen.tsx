import { AppSidebar } from "~/components/app-sidebar";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { useCreatorDashboardController } from "../hooks/use-creator-dashboard-controller";
import {
  CreatorDashboardHeader,
  CreatorKPICards,
  CreatorTipsCard,
  NearbyCampaignsSection,
  PendingInvitesSection,
  RecentActivitySection,
  UpcomingCampaignsSection,
} from "./sections";
import { SectionMessage } from "~/modules/business-dashboard/components/sections/section-primitives";

export function CreatorDashboardScreen() {
  const { viewModel } = useCreatorDashboardController();

  return (
    <div className="min-h-screen bg-[#f5f6f7] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 pb-24 pt-4 lg:gap-8 lg:p-8 lg:pt-8">
        <CreatorDashboardHeader creatorName={viewModel.creatorName} />

        {viewModel.kpiErrorMessage ? (
          <SectionMessage message={viewModel.kpiErrorMessage} tone="error" />
        ) : null}

        <CreatorKPICards items={viewModel.kpis} isLoading={viewModel.isKpiLoading} />

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)] lg:gap-8">
          <div className="flex min-w-0 flex-col gap-6 lg:gap-8">
            <NearbyCampaignsSection
              items={viewModel.nearbyCampaigns}
              newCount={viewModel.nearbyNewCount}
            />
            <PendingInvitesSection
              items={viewModel.invites}
              isLoading={viewModel.isInvitesLoading}
              errorMessage={viewModel.invitesErrorMessage}
              isRefreshing={viewModel.isInvitesRefreshing}
            />
            <UpcomingCampaignsSection
              items={viewModel.upcoming}
              isLoading={viewModel.isUpcomingLoading}
              errorMessage={viewModel.upcomingErrorMessage}
              isRefreshing={viewModel.isUpcomingRefreshing}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-6 lg:gap-8">
            <RecentActivitySection
              items={viewModel.activityItems}
              isLoading={viewModel.isActivityLoading}
              errorMessage={viewModel.activityErrorMessage}
              isRefreshing={viewModel.isActivityRefreshing}
            />
            <div className="hidden lg:block">
              <CreatorTipsCard />
            </div>
          </div>
        </div>
      </main>

      <CreatorBottomNav />
    </div>
  );
}
