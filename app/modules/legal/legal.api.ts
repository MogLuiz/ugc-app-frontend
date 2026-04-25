import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type { LegalAcceptanceStatus, LegalTermType } from "./legal.types";

export async function getLegalAcceptanceStatus(
  termType: LegalTermType,
  token?: string
): Promise<LegalAcceptanceStatus> {
  const accessToken = await getAccessToken(token);
  const searchParams = new URLSearchParams({ termType });

  return httpClient<LegalAcceptanceStatus>(
    `/legal/acceptances/status?${searchParams.toString()}`,
    { token: accessToken }
  );
}
