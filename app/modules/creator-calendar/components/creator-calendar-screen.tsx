import { AppSidebar } from "~/components/app-sidebar";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { ErrorState } from "~/components/ui/error-state";
import { LoadingState } from "~/components/ui/loading-state";
import { useCreatorCalendarController } from "../hooks/use-creator-calendar-controller";
import { CreatorCalendarDesktopSection } from "./sections/creator-calendar-desktop";
import { CreatorCalendarMobileSection } from "./sections/creator-calendar-mobile";

export function CreatorCalendarScreen() {
  const controller = useCreatorCalendarController();

  const content = controller.state.isLoading ? (
    <LoadingState message="Carregando agenda..." />
  ) : controller.state.errorMessage ? (
    <div className="space-y-4">
      <ErrorState description={controller.state.errorMessage} />
      <button
        type="button"
        onClick={() => void controller.actions.retry()}
        className="rounded-full bg-[#895af6] px-5 py-2 text-sm font-semibold text-white"
      >
        Tentar novamente
      </button>
    </div>
  ) : (
    <>
      <div className="hidden lg:block">
        <CreatorCalendarDesktopSection controller={controller} />
      </div>
      <div className="lg:hidden">
        <CreatorCalendarMobileSection controller={controller} />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      <main className="min-w-0 flex-1 lg:p-8">
        {content}
      </main>

      <CreatorBottomNav />
    </div>
  );
}
