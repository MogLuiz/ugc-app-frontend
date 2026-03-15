import { BusinessDashboardScreen } from "~/modules/business-dashboard/components/business-dashboard-screen";
import { CreatorDashboardScreen } from "~/modules/creator-dashboard/components/creator-dashboard-screen";

export default function DashboardRoute() {
  const variant = "business";

  if (variant === "business") {
    return <BusinessDashboardScreen />;
  }

  return <CreatorDashboardScreen />;
}
