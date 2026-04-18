import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type { CompanyBalance } from "~/modules/payments/types/payment.types";
import type { RefundRequest } from "../types/billing.types";

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

export async function getRefundRequests(token?: string): Promise<RefundRequest[]> {
  const accessToken = await getAccessToken(token);
  return httpClient<RefundRequest[]>("/company-balance/refund-requests", {
    token: accessToken,
  });
}
