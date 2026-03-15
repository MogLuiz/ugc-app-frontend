import { CreatorDashboardDesktop } from "./creator-dashboard-desktop";
import { CreatorDashboardMobile } from "./creator-dashboard-mobile";
import {
  MOCK_OFFERS,
  MOCK_OFFERS_MOBILE,
  MOCK_STATS,
  MOCK_STATS_MOBILE
} from "../data/mock-dashboard";

export function CreatorDashboardScreen() {
  return (
    <>
      <div className="hidden min-h-screen lg:block">
        <CreatorDashboardDesktop stats={MOCK_STATS} offers={MOCK_OFFERS} />
      </div>
      <div className="lg:hidden">
        <CreatorDashboardMobile
          stats={MOCK_STATS_MOBILE}
          offers={MOCK_OFFERS_MOBILE}
        />
      </div>
    </>
  );
}
