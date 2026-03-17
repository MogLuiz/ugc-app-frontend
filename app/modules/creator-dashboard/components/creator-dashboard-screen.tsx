import { AppSidebar } from "~/components/app-sidebar";
import { useCreatorDashboardController } from "../hooks/use-creator-dashboard-controller";
import {
  CreatorDashboardBottomNav,
  CreatorDashboardHeader,
  CreatorDashboardIntro,
  CreatorDashboardOffers,
  CreatorDashboardStats,
} from "./sections/creator-dashboard-sections";

export function CreatorDashboardScreen() {
  const controller = useCreatorDashboardController();

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 pb-24 pt-6 lg:gap-8 lg:p-8">
        <CreatorDashboardHeader creatorName={controller.viewModel.creatorName} />
        <CreatorDashboardIntro creatorName={controller.viewModel.creatorName} />
        <CreatorDashboardStats stats={controller.viewModel.stats} />
        <CreatorDashboardOffers offers={controller.viewModel.offers} />
      </main>

      <CreatorDashboardBottomNav />
    </div>
  );
}
