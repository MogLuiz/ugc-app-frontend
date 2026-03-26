import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type {
  MarketplaceCreatorsResponse,
  MarketplaceServiceTypeOption,
} from "./types";

type JobTypeResponse = {
  id: string;
  name: string;
};

export async function getMarketplaceCreators(params: {
  page: number;
  limit: number;
  search?: string;
  serviceTypeId?: string;
  minAge?: number;
  maxAge?: number;
  token?: string;
}): Promise<MarketplaceCreatorsResponse> {
  const accessToken = await getAccessToken(params.token);
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    sortBy: "relevancia",
  });

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.serviceTypeId) {
    searchParams.set("serviceTypeId", params.serviceTypeId);
  }

  if (params.minAge != null) {
    searchParams.set("minAge", String(params.minAge));
  }

  if (params.maxAge != null) {
    searchParams.set("maxAge", String(params.maxAge));
  }

  return httpClient<MarketplaceCreatorsResponse>(
    `/profiles/creators?${searchParams.toString()}`,
    {
      token: accessToken,
    }
  );
}

export async function getMarketplaceServiceTypes(
  token?: string
): Promise<MarketplaceServiceTypeOption[]> {
  const accessToken = await getAccessToken(token);
  const response = await httpClient<JobTypeResponse[]>("/job-types", {
    token: accessToken,
  });

  return response.map((item) => ({
    id: item.id,
    label: item.name,
  }));
}
