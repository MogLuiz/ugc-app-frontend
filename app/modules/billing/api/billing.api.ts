import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type { CompanyBalance } from "~/modules/payments/types/payment.types";

export async function getCompanyBalance(token?: string): Promise<CompanyBalance> {
  const accessToken = await getAccessToken(token);
  return httpClient<CompanyBalance>("/company-balance", {
    token: accessToken,
  });
}

export type RequestRefundInput = {
  amountCents: number;
  reason?: string;
};

export async function requestRefund(
  data: RequestRefundInput,
  token?: string
): Promise<void> {
  const accessToken = await getAccessToken(token);
  await httpClient("/company-balance/refund-request", {
    method: "POST",
    body: data,
    token: accessToken,
  });
}
