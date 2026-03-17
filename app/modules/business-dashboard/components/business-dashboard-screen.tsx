import { AppSidebar } from "~/components/app-sidebar";
import { useBusinessDashboardController } from "../hooks/use-business-dashboard-controller";
import {
  BusinessDashboardBottomNav,
  BusinessDashboardHeader,
  BusinessDashboardJobs,
  BusinessDashboardQuickActions,
  BusinessDashboardRecommended,
  BusinessDashboardSpendChart,
  BusinessDashboardStats,
  BusinessDashboardWelcome,
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
          search={controller.viewModel.search}
          onSearchChange={controller.actions.setSearch}
        />
        <BusinessDashboardWelcome />
        <BusinessDashboardStats stats={controller.viewModel.stats} />
        <BusinessDashboardQuickActions />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-2 lg:gap-8">
            <BusinessDashboardSpendChart />
            <BusinessDashboardJobs jobs={controller.viewModel.jobs} />
          </div>

          <BusinessDashboardRecommended
            recommendedCreators={controller.viewModel.recommendedCreators}
          />
        </div>
      </main>

      <BusinessDashboardBottomNav />
    </div>
  );
}
