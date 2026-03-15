import { BusinessDashboardDesktop } from "./business-dashboard-desktop";
import { BusinessDashboardMobile } from "./business-dashboard-mobile";
import {
  MOCK_BUSINESS_STATS,
  MOCK_BUSINESS_STATS_MOBILE,
  MOCK_CAMPAIGN_JOBS,
  MOCK_CAMPAIGNS_MOBILE,
  MOCK_RECOMMENDED_CREATORS,
  MOCK_RECOMMENDED_CREATORS_MOBILE
} from "../data/mock-business-dashboard";

export function BusinessDashboardScreen() {
  return (
    <>
      <div className="hidden min-h-screen lg:block">
        <BusinessDashboardDesktop
          stats={MOCK_BUSINESS_STATS}
          jobs={MOCK_CAMPAIGN_JOBS}
          recommendedCreators={MOCK_RECOMMENDED_CREATORS}
        />
      </div>
      <div className="lg:hidden">
        <BusinessDashboardMobile
          companyName="Lumina Studio"
          investimento={MOCK_BUSINESS_STATS_MOBILE.investimento}
          jobsPendentes={MOCK_BUSINESS_STATS_MOBILE.jobsPendentes}
          campaigns={MOCK_CAMPAIGNS_MOBILE}
          recommendedCreators={MOCK_RECOMMENDED_CREATORS_MOBILE}
        />
      </div>
    </>
  );
}
