import { AppSidebar } from "~/components/app-sidebar";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { useCreatorCalendarController } from "../hooks/use-creator-calendar-controller";
import { CreatorCalendarDesktopSection } from "./sections/creator-calendar-desktop";
import { CreatorCalendarMobileSection } from "./sections/creator-calendar-mobile";

export function CreatorCalendarScreen() {
  const controller = useCreatorCalendarController();

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      <main className="min-w-0 flex-1 lg:p-8">
        <div className="hidden lg:block">
          <CreatorCalendarDesktopSection controller={controller} />
        </div>
        <div className="lg:hidden">
          <CreatorCalendarMobileSection controller={controller} />
        </div>
      </main>

      <CreatorBottomNav />
    </div>
  );
}
