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
      companyName: "Lumina Studio",
      jobs: MOCK_CAMPAIGN_JOBS,
      planName: "Plano Enterprise",
      recommendedCreators: MOCK_RECOMMENDED_CREATORS,
      search,
      stats: MOCK_BUSINESS_STATS,
    },
  };
}
