import { AppSidebar } from "~/components/app-sidebar";
import { AppHeader } from "~/components/layout/app-header";
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
      <div className="flex min-h-0 flex-1 flex-col lg:hidden">
        <CreatorCalendarMobileSection controller={controller} />
      </div>
    </>
  );

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#f6f5f8] lg:min-h-screen lg:flex-row">
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      <main className="flex w-full min-w-0 flex-1 flex-col bg-[#f6f5f8] min-h-[100dvh] lg:min-h-screen lg:p-8">
        <AppHeader />
        {content}
      </main>

      <CreatorBottomNav />
    </div>
  );
}
