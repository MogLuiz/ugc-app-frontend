import type { useCreatorCalendarController } from "../../hooks/use-creator-calendar-controller";
import { MobileAvailabilitySection } from "./creator-calendar-mobile-availability";
import {
  MobileDailySection,
  MobileWeeklySection,
} from "./creator-calendar-mobile-main";

type CreatorCalendarMobileSectionProps = {
  controller: ReturnType<typeof useCreatorCalendarController>;
};

export function CreatorCalendarMobileSection({
  controller,
}: CreatorCalendarMobileSectionProps) {
  if (controller.state.isMobileAvailabilityOpen) {
    return <MobileAvailabilitySection controller={controller} />;
  }

  if (controller.state.mobileView === "daily") {
    return <MobileDailySection controller={controller} />;
  }

  return <MobileWeeklySection controller={controller} />;
}
