import { useMemo } from "react";
import { MOCK_OFFERS, MOCK_STATS } from "../data/mock-dashboard";

export function useCreatorDashboardController() {
  const highlightedOffers = useMemo(() => MOCK_OFFERS.slice(0, 3), []);

  return {
    viewModel: {
      creatorName: "Lucas",
      offers: highlightedOffers,
      stats: MOCK_STATS,
    },
  };
}
