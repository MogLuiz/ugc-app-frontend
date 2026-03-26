import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type { MarketplaceCreatorsResponse } from "~/modules/marketplace/types";

export async function getMapCreators(): Promise<MarketplaceCreatorsResponse> {
  const accessToken = await getAccessToken();
  return httpClient<MarketplaceCreatorsResponse>(
    `/profiles/creators?page=1&limit=200&sortBy=relevancia`,
    { token: accessToken }
  );
}
