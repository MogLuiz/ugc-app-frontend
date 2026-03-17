import { useState } from "react";
import {
  MOCK_BUSINESS_STATS,
  MOCK_CAMPAIGN_JOBS,
  MOCK_RECOMMENDED_CREATORS,
} from "../data/mock-business-dashboard";

export function useBusinessDashboardController() {
  const [search, setSearch] = useState("");

  return {
    actions: {
      setSearch,
    },
    viewModel: {
      jobs: MOCK_CAMPAIGN_JOBS,
      recommendedCreators: MOCK_RECOMMENDED_CREATORS,
      search,
      stats: MOCK_BUSINESS_STATS,
    },
  };
}
